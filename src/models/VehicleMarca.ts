import { Model, DataTypes } from 'sequelize';
import sequelize from '../database/sequelize';

class VehicleMarca extends Model {
    public id!: number;
    public nome!: string;
}

VehicleMarca.init(
    {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },
        nome: {
            type: new DataTypes.STRING(100),
            allowNull: false,
        },
    },
    {
        tableName: 'vehicle_marca',
        sequelize,
        timestamps: true,
        underscored: true,
    }
);

export default VehicleMarca;