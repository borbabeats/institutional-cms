import { Model, DataTypes } from 'sequelize';
import sequelize from '../database/sequelize';

export interface CategoryAttributes {
  id: number;
  name: string;
  slug: string;
  description?: string | null;
  created_at?: Date;
  updated_at?: Date;
}

class Category extends Model<CategoryAttributes> implements CategoryAttributes {
  public id!: number;
  public name!: string;
  public slug!: string;
  public description?: string | null;
  public readonly created_at!: Date;
  public readonly updated_at!: Date;

  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Associations will be set up in associations.ts
  public readonly posts?: any[];
}

Category.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    slug: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: 'categories',
    sequelize,
    timestamps: true,
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
);

export default Category;
