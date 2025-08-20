import { Model, DataTypes } from 'sequelize';
import sequelize from '../database/sequelize';

class VehicleAno extends Model {
    public id!: number;
    public ano!: number;
}

VehicleAno.init(
    {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },
        ano: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
        },
    },
    {
        tableName: 'vehicle_ano',
        sequelize,
        timestamps: true,
        underscored: true,
    }
);

export default VehicleAno;