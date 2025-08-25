import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../database/sequelize';

export interface TransmissaoAttributes {
    id: number;
    tipo: string;
}

export interface TransmissaoCreationAttributes extends Optional<TransmissaoAttributes, 'id'> {}

class Transmissao extends Model<TransmissaoAttributes, TransmissaoCreationAttributes> 
    implements TransmissaoAttributes {
    public id!: number;
    public tipo!: string;

    // Timestamps
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

Transmissao.init(
    {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },
        tipo: {
            type: new DataTypes.STRING(50),
            allowNull: false,
            unique: true,
        },
    },
    {
        tableName: 'transmissoes',
        sequelize,
    }
);

export default Transmissao;
