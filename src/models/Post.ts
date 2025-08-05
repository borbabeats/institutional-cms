import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../database/sequelize';
import Author from './Author';

export interface PostAttributes {
  id: number;
  author_id: number;
  title: string;
  slug: string;
  content: string;
  status: 'draft' | 'published' | 'archived';
  created_at?: Date;
  updated_at?: Date;
}

export interface PostCreationAttributes extends Optional<PostAttributes, 'id' | 'status' | 'created_at' | 'updated_at'> {}

class Post extends Model<PostAttributes, PostCreationAttributes> implements PostAttributes {
  public id!: number;
  public author_id!: number;
  public title!: string;
  public slug!: string;
  public content!: string;
  public status!: 'draft' | 'published' | 'archived';
  public readonly created_at!: Date;
  public readonly updated_at!: Date;

  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Associations
  public readonly author?: Author;
}

Post.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    author_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: 'authors',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    title: {
      type: new DataTypes.STRING(255),
      allowNull: false,
    },
    slug: {
      type: new DataTypes.STRING(255),
      allowNull: false,
      unique: true,
    },
    content: {
      type: DataTypes.TEXT('medium'),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('draft', 'published', 'archived'),
      allowNull: false,
      defaultValue: 'draft',
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: 'posts',
    sequelize,
    timestamps: true,
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
);

// Define associations
Post.belongsTo(Author, {
  foreignKey: 'author_id',
  as: 'author',
});

Author.hasMany(Post, {
  foreignKey: 'author_id',
  as: 'posts',
});

export default Post;
