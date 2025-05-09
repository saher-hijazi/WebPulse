import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database.js';
import Scan from './scan.model.js';

class Recommendation extends Model {}

Recommendation.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    scanId: {
      type: DataTypes.UUID,
      references: {
        model: Scan,
        key: 'id',
      },
      allowNull: false,
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    impact: {
      type: DataTypes.ENUM('high', 'medium', 'low'),
      allowNull: false,
    },
    score: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    details: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'Recommendation',
    tableName: 'recommendations',
    timestamps: true,
  }
);

// Define associations
Recommendation.belongsTo(Scan, { foreignKey: 'scanId', as: 'scan' });
Scan.hasMany(Recommendation, { foreignKey: 'scanId', as: 'recommendations' });

export default Recommendation;
