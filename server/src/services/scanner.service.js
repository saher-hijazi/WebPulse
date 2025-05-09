import lighthouse from 'lighthouse';
import puppeteer from 'puppeteer';
import { Scan, Website, Recommendation } from '../models/index.js';
import { Op } from 'sequelize';
import logger from '../utils/logger.js';
import { sendEmailNotification } from './notification.service.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import cron from 'node-cron';

// Get directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create reports directory if it doesn't exist
const reportsDir = path.join(__dirname, '../../reports');
if (!fs.existsSync(reportsDir)) {
  fs.mkdirSync(reportsDir, { recursive: true });
}

/**
 * Queue a new scan for a website
 * @param {string} websiteId - The ID of the website to scan
 * @returns {Promise<Scan>} The created scan
 */
export const queueScan = async (websiteId) => {
  try {
    // Find website
    const website = await Website.findByPk(websiteId);
    if (!website) {
      throw new Error(`Website with ID ${websiteId} not found`);
    }

    // Create scan record
    const scan = await Scan.create({
      websiteId: website.id,
      status: 'pending',
    });

    logger.info(`Scan queued for website: ${website.url}`, { scanId: scan.id, websiteId });

    // Update website status
    await website.update({
      status: 'active',
    });

    return scan;
  } catch (error) {
    logger.error(`Error queueing scan: ${error.message}`, { websiteId, error });
    throw error;
  }
};

/**
 * Run a Lighthouse scan for a website
 * @param {string} scanId - The ID of the scan to run
 * @returns {Promise<void>}
 */
export const runScan = async (scanId) => {
  let browser = null;
  let scan = null;

  try {
    // Find scan
    scan = await Scan.findByPk(scanId);
    if (!scan) {
      throw new Error(`Scan with ID ${scanId} not found`);
    }

    // Find website
    const website = await Website.findByPk(scan.websiteId);
    if (!website) {
      throw new Error(`Website with ID ${scan.websiteId} not found`);
    }

    // Update scan status
    await scan.update({
      status: 'running',
      startTime: new Date(),
    });

    logger.info(`Starting scan for website: ${website.url}`, { scanId, websiteId: website.id });

    // Launch browser
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
      executablePath: process.env.LIGHTHOUSE_CHROME_PATH || undefined,
    });

    // Run Lighthouse
    const { lhr } = await lighthouse(website.url, {
      port: (new URL(browser.wsEndpoint())).port,
      output: 'json',
      logLevel: 'info',
      throttling: process.env.LIGHTHOUSE_DEFAULT_THROTTLING === 'true',
    });

    // Save report to file
    const reportPath = path.join(reportsDir, `${scan.id}.json`);
    fs.writeFileSync(reportPath, JSON.stringify(lhr));

    // Extract scores and metrics
    const performanceScore = lhr.categories.performance.score;
    const accessibilityScore = lhr.categories.accessibility.score;
    const bestPracticesScore = lhr.categories['best-practices'].score;
    const seoScore = lhr.categories.seo.score;
    const pwaScore = lhr.categories.pwa ? lhr.categories.pwa.score : null;

    // Extract Web Vitals
    const firstContentfulPaint = lhr.audits['first-contentful-paint'].numericValue / 1000;
    const largestContentfulPaint = lhr.audits['largest-contentful-paint'].numericValue / 1000;
    const cumulativeLayoutShift = lhr.audits['cumulative-layout-shift'].numericValue;
    const totalBlockingTime = lhr.audits['total-blocking-time'].numericValue;
    const timeToInteractive = lhr.audits.interactive.numericValue / 1000;
    const speedIndex = lhr.audits['speed-index'].numericValue / 1000;

    // Update scan with results
    await scan.update({
      status: 'completed',
      endTime: new Date(),
      performanceScore,
      accessibilityScore,
      bestPracticesScore,
      seoScore,
      pwaScore,
      firstContentfulPaint,
      largestContentfulPaint,
      cumulativeLayoutShift,
      totalBlockingTime,
      timeToInteractive,
      speedIndex,
      reportPath: `reports/${scan.id}.json`,
    });

    // Update website with last scan time and next scan time
    await website.update({
      lastScanAt: new Date(),
      nextScanAt: calculateNextScanTime(website.scanFrequency),
    });

    // Extract and save recommendations
    await saveRecommendations(scan.id, lhr);

    logger.info(`Scan completed for website: ${website.url}`, { scanId, websiteId: website.id });

    // Check if performance dropped and send notification
    await checkPerformanceAndNotify(scan, website);

  } catch (error) {
    logger.error(`Error running scan: ${error.message}`, { scanId, error });

    // Update scan status to failed
    if (scan) {
      await scan.update({
        status: 'failed',
        endTime: new Date(),
        errorMessage: error.message,
      });
    }
  } finally {
    // Close browser
    if (browser) {
      await browser.close();
    }
  }
};

/**
 * Save recommendations from Lighthouse report
 * @param {string} scanId - The ID of the scan
 * @param {object} lhr - The Lighthouse report
 * @returns {Promise<void>}
 */
const saveRecommendations = async (scanId, lhr) => {
  try {
    const recommendations = [];

    // Process performance opportunities
    for (const audit of Object.values(lhr.audits)) {
      if (audit.details && audit.details.type === 'opportunity' && audit.score < 1) {
        recommendations.push({
          scanId,
          category: 'Performance',
          title: audit.title,
          description: audit.description,
          impact: getImpactLevel(audit.score),
          score: audit.score,
          details: audit.details,
        });
      }
    }

    // Process accessibility issues
    for (const audit of Object.values(lhr.audits)) {
      if (audit.details && audit.details.items && audit.details.items.length > 0 && 
          lhr.categories.accessibility.auditRefs.some(ref => ref.id === audit.id) && 
          audit.score < 1) {
        recommendations.push({
          scanId,
          category: 'Accessibility',
          title: audit.title,
          description: audit.description,
          impact: getImpactLevel(audit.score),
          score: audit.score,
          details: audit.details,
        });
      }
    }

    // Process best practices issues
    for (const audit of Object.values(lhr.audits)) {
      if (lhr.categories['best-practices'].auditRefs.some(ref => ref.id === audit.id) && 
          audit.score < 1) {
        recommendations.push({
          scanId,
          category: 'Best Practices',
          title: audit.title,
          description: audit.description,
          impact: getImpactLevel(audit.score),
          score: audit.score,
          details: audit.details,
        });
      }
    }

    // Process SEO issues
    for (const audit of Object.values(lhr.audits)) {
      if (lhr.categories.seo.auditRefs.some(ref => ref.id === audit.id) && 
          audit.score < 1) {
        recommendations.push({
          scanId,
          category: 'SEO',
          title: audit.title,
          description: audit.description,
          impact: getImpactLevel(audit.score),
          score: audit.score,
          details: audit.details,
        });
      }
    }

    // Save recommendations to database
    if (recommendations.length > 0) {
      await Recommendation.bulkCreate(recommendations);
    }
  } catch (error) {
    logger.error(`Error saving recommendations: ${error.message}`, { scanId, error });
  }
};

/**
 * Get impact level based on score
 * @param {number} score - The audit score
 * @returns {string} The impact level (high, medium, low)
 */
const getImpactLevel = (score) => {
  if (score === null || score === undefined) return 'medium';
  if (score < 0.5) return 'high';
  if (score < 0.9) return 'medium';
  return 'low';
};

/**
 * Calculate next scan time based on frequency
 * @param {string} frequency - The scan frequency (hourly, daily, weekly, monthly)
 * @returns {Date} The next scan time
 */
const calculateNextScanTime = (frequency) => {
  const now = new Date();
  
  switch (frequency) {
    case 'hourly':
      return new Date(now.setHours(now.getHours() + 1));
    case 'daily':
      return new Date(now.setDate(now.getDate() + 1));
    case 'weekly':
      return new Date(now.setDate(now.getDate() + 7));
    case 'monthly':
      return new Date(now.setMonth(now.getMonth() + 1));
    default:
      return new Date(now.setDate(now.getDate() + 1));
  }
};

/**
 * Check if performance dropped and send notification
 * @param {Scan} currentScan - The current scan
 * @param {Website} website - The website
 * @returns {Promise<void>}
 */
const checkPerformanceAndNotify = async (currentScan, website) => {
  try {
    // Get previous completed scan
    const previousScan = await Scan.findOne({
      where: {
        websiteId: website.id,
        status: 'completed',
        id: { [Op.ne]: currentScan.id },
      },
      order: [['createdAt', 'DESC']],
    });

    // If no previous scan, return
    if (!previousScan) {
      return;
    }

    // Check if performance dropped by more than 5%
    const performanceDrop = previousScan.performanceScore - currentScan.performanceScore;
    if (performanceDrop >= 0.05 && website.emailNotifications) {
      // Send email notification
      await sendEmailNotification({
        to: website.user ? website.user.email : null,
        subject: `Performance Alert: ${website.name || website.url}`,
        message: `
          <h2>Performance Alert</h2>
          <p>The performance of your website <strong>${website.name || website.url}</strong> has dropped by ${(performanceDrop * 100).toFixed(1)}%.</p>
          <p>Previous score: ${(previousScan.performanceScore * 100).toFixed(1)}%</p>
          <p>Current score: ${(currentScan.performanceScore * 100).toFixed(1)}%</p>
          <p>View the full report in your WebPulse dashboard.</p>
        `,
      });

      logger.info(`Performance notification sent for website: ${website.url}`, {
        websiteId: website.id,
        performanceDrop: performanceDrop * 100,
      });
    }
  } catch (error) {
    logger.error(`Error checking performance and sending notification: ${error.message}`, {
      scanId: currentScan.id,
      websiteId: website.id,
      error,
    });
  }
};

/**
 * Process pending scans
 * @returns {Promise<void>}
 */
export const processPendingScans = async () => {
  try {
    // Find pending scans
    const pendingScans = await Scan.findAll({
      where: { status: 'pending' },
      order: [['createdAt', 'ASC']],
      limit: 5, // Process 5 scans at a time
    });

    logger.info(`Found ${pendingScans.length} pending scans`);

    // Run scans
    for (const scan of pendingScans) {
      await runScan(scan.id);
    }
  } catch (error) {
    logger.error(`Error processing pending scans: ${error.message}`, { error });
  }
};

/**
 * Schedule new scans for websites that are due
 * @returns {Promise<void>}
 */
export const scheduleNewScans = async () => {
  try {
    // Find websites that are due for a scan
    const websites = await Website.findAll({
      where: {
        status: 'active',
        nextScanAt: { [Op.lte]: new Date() },
      },
    });

    logger.info(`Found ${websites.length} websites due for scanning`);

    // Queue scans
    for (const website of websites) {
      await queueScan(website.id);
    }
  } catch (error) {
    logger.error(`Error scheduling new scans: ${error.message}`, { error });
  }
};

/**
 * Initialize the scheduler
 */
export const initScheduler = () => {
  // Process pending scans every 5 minutes
  cron.schedule('*/5 * * * *', async () => {
    logger.info('Running scheduled task: Process pending scans');
    await processPendingScans();
  });

  // Schedule new scans every hour
  cron.schedule('0 * * * *', async () => {
    logger.info('Running scheduled task: Schedule new scans');
    await scheduleNewScans();
  });

  logger.info('Scheduler initialized');
};
