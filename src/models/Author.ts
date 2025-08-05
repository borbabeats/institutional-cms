import { Model, DataTypes } from 'sequelize';
import sequelize from '../database/sequelize';

class Author extends Model {
  public id!: number;
  public name!: string;
  public email!: string | null;
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

Author.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: new DataTypes.STRING(100),
      allowNull: false,
    },
    email: {
      type: new DataTypes.STRING(255),
      allowNull: true,
      unique: true,
    },
  },
  {
    tableName: 'authors',
    sequelize,
    timestamps: true,
    underscored: true,
  }
);

export default Author;
