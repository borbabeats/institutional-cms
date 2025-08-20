import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../database/sequelize';

export interface VehiclesAttributes {
    id: number;
    modelo: string;
    preco: number;
    descricao: string;
    quilometragem: number;
    tipo_combustivel: string;
    transmissao: string;
    imagem_url: string;
    disponivel: boolean;
    marca_id: number;
    ano_id: number;
    cor_id: number;
    categoria_id: number;
}

export interface VehiclesCreationAttributes extends Optional<VehiclesAttributes, 'id' | 'descricao' | 'disponivel' | 'imagem_url'> {}

class Vehicles extends Model<VehiclesAttributes, VehiclesCreationAttributes> implements VehiclesAttributes {
    public id!: number;
    public modelo!: string;
    public preco!: number;
    public descricao!: string;
    public quilometragem!: number;
    public tipo_combustivel!: string;
    public transmissao!: string;
    public imagem_url!: string;
    public disponivel!: boolean;
    public marca_id!: number;
    public ano_id!: number;
    public cor_id!: number;
    public categoria_id!: number;

    // Timestamps are managed by Sequelize
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

Vehicles.init(
    {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },
        modelo: {
            type: new DataTypes.STRING(100),
            allowNull: false,
        },
        preco: {
            type: new DataTypes.DECIMAL(10, 2),
            allowNull: false,
        },
        descricao: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        quilometragem: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
        },
        tipo_combustivel: {
            type: new DataTypes.STRING(50),
            allowNull: false,
        },
        transmissao: {
            type: new DataTypes.STRING(50),
            allowNull: false,
        },
        imagem_url: {
            type: new DataTypes.TEXT,
            allowNull: true,
        },
        disponivel: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
        marca_id: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
        },
        ano_id: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
        },
        cor_id: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
        },
        categoria_id: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
        },
    },
    {
        tableName: 'vehicles',
        sequelize,
        timestamps: true,
        underscored: true,
    }
);

export default Vehicles;