import { Model, DataTypes } from 'sequelize';
import sequelize from '../database/sequelize';

class VehicleCategories extends Model {
    public id!: number;
    public nome!: string;
    public descricao!: string;
}

VehicleCategories.init(
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
        descricao: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
    },
    {
        tableName: 'vehicle_categories',
        sequelize,
        timestamps: true,
        underscored: true,
    }
);

export default VehicleCategories;