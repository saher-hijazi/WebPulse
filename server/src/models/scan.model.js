import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database.js';
import Website from './website.model.js';

class Scan extends Model {}

Scan.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    websiteId: {
      type: DataTypes.UUID,
      references: {
        model: Website,
        key: 'id',
      },
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('pending', 'running', 'completed', 'failed'),
      defaultValue: 'pending',
    },
    startTime: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    endTime: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    // Lighthouse scores
    performanceScore: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    accessibilityScore: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    bestPracticesScore: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    seoScore: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    pwaScore: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    // Web Vitals metrics
    firstContentfulPaint: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    largestContentfulPaint: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    cumulativeLayoutShift: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    totalBlockingTime: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    timeToInteractive: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    speedIndex: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    // Full report storage
    reportPath: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    // Error information
    errorMessage: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'Scan',
    tableName: 'scans',
    timestamps: true,
  }
);

// Define associations
Scan.belongsTo(Website, { foreignKey: 'websiteId', as: 'website' });
Website.hasMany(Scan, { foreignKey: 'websiteId', as: 'scans' });

export default Scan;
