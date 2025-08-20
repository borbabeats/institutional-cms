import { Model, DataTypes } from 'sequelize';
import sequelize from '../database/sequelize';

class VehicleCor extends Model {
    public id!: number;
    public nome!: string;

    // Timestamps (`createdAt` and `updatedAt`) are managed by Sequelize automatically
}

VehicleCor.init(
    {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },
        nome: {
            type: new DataTypes.STRING(50),
            allowNull: false,
        },
    },
    {
        tableName: 'vehicle_cor',
        sequelize,
        timestamps: true,
        underscored: true,
    }
);

export default VehicleCor;