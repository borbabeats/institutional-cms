import { DataTypes, Model } from 'sequelize';
import sequelize from '../database/sequelize';

class VehicleOptional extends Model {
  public id!: number;
  public name!: string;

  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

VehicleOptional.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: new DataTypes.STRING(128),
      allowNull: false,
    },
  },
  {
    tableName: 'vehicle_optionals',
    sequelize,
    timestamps: true,
    underscored: true,
  }
);

export default VehicleOptional;
