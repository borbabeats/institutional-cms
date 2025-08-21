import { Model, DataTypes } from 'sequelize';
import sequelize from '../database/sequelize';

class VehicleImage extends Model {
    public id!: number;
    public vehicle_id!: number;
    public url!: string;
    public ordem!: number;

    // Timestamps are managed by Sequelize
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

VehicleImage.init(
    {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },
        vehicle_id: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
        },
        url: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        ordem: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1,
        },
    },
    {
        tableName: 'vehicle_images',
        sequelize,
        timestamps: true,
        underscored: true,
    }
);

export default VehicleImage;
