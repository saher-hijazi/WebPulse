import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database.js';
import User from './user.model.js';

class Website extends Model {}

Website.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    url: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isUrl: {
          msg: 'Please provide a valid URL',
        },
        notEmpty: {
          msg: 'URL is required',
        },
      },
    },
    name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    scanFrequency: {
      type: DataTypes.ENUM('hourly', 'daily', 'weekly', 'monthly'),
      defaultValue: 'daily',
    },
    lastScanAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    nextScanAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM('pending', 'active', 'error'),
      defaultValue: 'pending',
    },
    emailNotifications: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    telegramNotifications: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    userId: {
      type: DataTypes.UUID,
      references: {
        model: User,
        key: 'id',
      },
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'Website',
    tableName: 'websites',
    timestamps: true,
    hooks: {
      // Set next scan time based on frequency
      beforeCreate: (website) => {
        website.nextScanAt = calculateNextScanTime(website.scanFrequency);
      },
      beforeUpdate: (website) => {
        if (website.changed('scanFrequency')) {
          website.nextScanAt = calculateNextScanTime(website.scanFrequency);
        }
      },
    },
  }
);

// Calculate next scan time based on frequency
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

// Define associations
Website.belongsTo(User, { foreignKey: 'userId', as: 'user' });
User.hasMany(Website, { foreignKey: 'userId', as: 'websites' });

export default Website;
