import { Scan, Website, Recommendation } from '../models/index.js';
import logger from '../utils/logger.js';

/**
 * Get all scans for a website
 * @route GET /api/scans/website/:websiteId
 * @access Private
 */
export const getScansForWebsite = async (req, res, next) => {
  try {
    // Check if website exists and belongs to user
    const website = await Website.findOne({
      where: {
        id: req.params.websiteId,
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
      where: { websiteId: website.id },
      order: [['createdAt', 'DESC']],
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

/**
 * Get a single scan by ID
 * @route GET /api/scans/:id
 * @access Private
 */
export const getScan = async (req, res, next) => {
  try {
    const scan = await Scan.findByPk(req.params.id, {
      include: [
        {
          model: Website,
          as: 'website',
          attributes: ['id', 'url', 'name'],
          where: { userId: req.user.id },
        },
      ],
    });

    if (!scan) {
      return res.status(404).json({
        success: false,
        error: 'Scan not found or you do not have permission to access it',
      });
    }

    res.status(200).json({
      success: true,
      data: scan,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get recommendations for a scan
 * @route GET /api/scans/:id/recommendations
 * @access Private
 */
export const getScanRecommendations = async (req, res, next) => {
  try {
    // Check if scan exists and belongs to user's website
    const scan = await Scan.findByPk(req.params.id, {
      include: [
        {
          model: Website,
          as: 'website',
          attributes: ['id', 'userId'],
          where: { userId: req.user.id },
        },
      ],
    });

    if (!scan) {
      return res.status(404).json({
        success: false,
        error: 'Scan not found or you do not have permission to access it',
      });
    }

    // Get recommendations for the scan
    const recommendations = await Recommendation.findAll({
      where: { scanId: scan.id },
      order: [
        ['impact', 'ASC'],
        ['category', 'ASC'],
      ],
    });

    res.status(200).json({
      success: true,
      count: recommendations.length,
      data: recommendations,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get latest scan for a website
 * @route GET /api/scans/website/:websiteId/latest
 * @access Private
 */
export const getLatestScan = async (req, res, next) => {
  try {
    // Check if website exists and belongs to user
    const website = await Website.findOne({
      where: {
        id: req.params.websiteId,
        userId: req.user.id,
      },
    });

    if (!website) {
      return res.status(404).json({
        success: false,
        error: 'Website not found',
      });
    }

    // Get latest completed scan for the website
    const scan = await Scan.findOne({
      where: {
        websiteId: website.id,
        status: 'completed',
      },
      order: [['createdAt', 'DESC']],
    });

    if (!scan) {
      return res.status(404).json({
        success: false,
        error: 'No completed scans found for this website',
      });
    }

    res.status(200).json({
      success: true,
      data: scan,
    });
  } catch (error) {
    next(error);
  }
};
