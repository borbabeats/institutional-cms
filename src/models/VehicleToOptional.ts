import { DataTypes, Model } from 'sequelize';
import sequelize from '../database/sequelize';
import Vehicles from './Vehicles';
import VehicleOptional from './VehicleOptional';

class VehicleToOptional extends Model {
  public vehicle_id!: number;
  public optional_id!: number;
}

VehicleToOptional.init(
  {
    vehicle_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      references: {
        model: Vehicles,
        key: 'id',
      },
    },
    optional_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      references: {
        model: VehicleOptional,
        key: 'id',
      },
    },
  },
  {
    tableName: 'vehicle_to_optionals',
    sequelize,
    timestamps: false, // Join tables usually don't need timestamps
  }
);

export default VehicleToOptional;
