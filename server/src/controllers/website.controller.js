import { Website, Scan } from '../models/index.js';
import { Op } from 'sequelize';
import logger from '../utils/logger.js';
import { queueScan } from '../services/scanner.service.js';

/**
 * Get all websites for the authenticated user
 * @route GET /api/websites
 * @access Private
 */
export const getWebsites = async (req, res, next) => {
  try {
    const websites = await Website.findAll({
      where: { userId: req.user.id },
      order: [['createdAt', 'DESC']],
    });

    res.status(200).json({
      success: true,
      count: websites.length,
      data: websites,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get a single website by ID
 * @route GET /api/websites/:id
 * @access Private
 */
export const getWebsite = async (req, res, next) => {
  try {
    const website = await Website.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id,
      },
    });

    if (!website) {
      return res.status(404).json({
        success: false,
        error: 'Website not found',
      });
    }

    res.status(200).json({
      success: true,
      data: website,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create a new website
 * @route POST /api/websites
 * @access Private
 */
export const createWebsite = async (req, res, next) => {
  try {
    // Add user ID to request body
    req.body.userId = req.user.id;

    // Create website
    const website = await Website.create(req.body);

    // Queue initial scan
    await queueScan(website.id);

    res.status(201).json({
      success: true,
      data: website,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update a website
 * @route PUT /api/websites/:id
 * @access Private
 */
export const updateWebsite = async (req, res, next) => {
  try {
    let website = await Website.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id,
      },
    });

    if (!website) {
      return res.status(404).json({
        success: false,
        error: 'Website not found',
      });
    }

    // Update website
    website = await website.update(req.body);

    res.status(200).json({
      success: true,
      data: website,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete a website
 * @route DELETE /api/websites/:id
 * @access Private
 */
export const deleteWebsite = async (req, res, next) => {
  try {
    const website = await Website.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id,
      },
    });

    if (!website) {
      return res.status(404).json({
        success: false,
        error: 'Website not found',
      });
    }

    // Delete website
    await website.destroy();

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Run a scan for a website
 * @route POST /api/websites/:id/scan
 * @access Private
 */
export const runScan = async (req, res, next) => {
  try {
    const website = await Website.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id,
      },
    });

    if (!website) {
      return res.status(404).json({
        success: false,
        error: 'Website not found',
      });
    }

    // Queue scan
    const scan = await queueScan(website.id);

    res.status(200).json({
      success: true,
      data: {
        scanId: scan.id,
        message: 'Scan queued successfully',
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get performance history for a website
 * @route GET /api/websites/:id/performance
 * @access Private
 */
export const getPerformanceHistory = async (req, res, next) => {
  try {
    const website = await Website.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id,
      },
    });

    if (!website) {
      return res.status(404).json({
        success: false,
        error: 'Website not found',
      });
    }

    // Get scans for the website
    const scans = await Scan.findAll({
      where: {
        websiteId: website.id,
        status: 'completed',
      },
      order: [['createdAt', 'ASC']],
      attributes: [
        'id',
        'createdAt',
        'performanceScore',
        'accessibilityScore',
        'bestPracticesScore',
        'seoScore',
        'pwaScore',
        'firstContentfulPaint',
        'largestContentfulPaint',
        'cumulativeLayoutShift',
        'totalBlockingTime',
        'timeToInteractive',
        'speedIndex',
      ],
    });

    res.status(200).json({
      success: true,
      count: scans.length,
      data: scans,
    });
  } catch (error) {
    next(error);
  }
};
