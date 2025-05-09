import cron from 'node-cron';
import logger from '../utils/logger.js';
import { Website } from '../models/index.js';
import { processPendingScans, scheduleNewScans, queueScan } from './scanner.service.js';

/**
 * Scan all registered websites
 * This function will be called by the scheduler to scan all active websites
 * @returns {Promise<void>}
 */
export const performScanForAllWebsites = async () => {
  try {
    logger.info('Starting scan for all registered websites');
    
    // Find all active websites
    const websites = await Website.findAll({
      where: {
        status: 'active',
      },
    });
    
    logger.info(`Found ${websites.length} active websites to scan`);
    
    // Queue scans for all websites
    for (const website of websites) {
      await queueScan(website.id);
    }
    
    // Process the pending scans
    await processPendingScans();
    
    logger.info('Completed scan job for all websites');
  } catch (error) {
    logger.error(`Error performing scan for all websites: ${error.message}`, { error });
  }
};

/**
 * Initialize the scheduler
 * Sets up cron jobs for regular scanning and maintenance
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
  
  // Scan all websites every hour
  cron.schedule('0 * * * *', async () => {
    logger.info('Running scheduled task: Scan all websites');
    await performScanForAllWebsites();
  });

  logger.info('Scheduler initialized with the following jobs:');
  logger.info('- Process pending scans: every 5 minutes');
  logger.info('- Schedule new scans: every hour');
  logger.info('- Scan all websites: every hour');
};

export default {
  initScheduler,
  performScanForAllWebsites,
};
