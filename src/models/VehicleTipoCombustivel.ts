import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../database/sequelize';

export interface TipoCombustivelAttributes {
    id: number;
    nome: string;
}

export interface TipoCombustivelCreationAttributes extends Optional<TipoCombustivelAttributes, 'id'> {}

class TipoCombustivel extends Model<TipoCombustivelAttributes, TipoCombustivelCreationAttributes> 
    implements TipoCombustivelAttributes {
    public id!: number;
    public nome!: string;

    // Timestamps
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

TipoCombustivel.init(
    {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },
        nome: {
            type: new DataTypes.STRING(50),
            allowNull: false,
            unique: true,
        },
    },
    {
        tableName: 'tipos_combustivel',
        sequelize,
    }
);

export default TipoCombustivel;
