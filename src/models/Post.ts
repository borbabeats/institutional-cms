import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../database/sequelize';
import Author from './Author';
import Category from './Category';

export interface PostAttributes {
  id: number;
  author_id: number;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  category_id: number;
  status: 'draft' | 'published' | 'archived';
  image_url?: string | null;
  created_at?: Date;
  updated_at?: Date;
  // Virtual property for category
  category?: any; // Temporarily using 'any' to avoid circular dependencies
}

export interface PostCreationAttributes extends Optional<PostAttributes, 'id' | 'status' | 'created_at' | 'updated_at' | 'excerpt' | 'image_url'> {}

class Post extends Model<PostAttributes, PostCreationAttributes> implements PostAttributes {
  public id!: number;
  public author_id!: number;
  public title!: string;
  public slug!: string;
  public content!: string;
  public excerpt!: string;
  public category_id!: number;
  public status!: 'draft' | 'published' | 'archived';
  public readonly created_at!: Date;
  public readonly updated_at!: Date;

  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Associations will be set up in associations.ts
  public readonly author?: Author;
  public readonly category?: Category;
  
  // Image URL for the post
  public image_url?: string;
}

// Função para gerar excerpt a partir do conteúdo
const generateExcerpt = (content: string, maxLength: number = 200): string => {
  // Remove tags HTML e espaços em branco extras
  const plainText = content
    .replace(/<[^>]*>/g, '') // Remove tags HTML
    .replace(/\s+/g, ' ')     // Substitui múltiplos espaços por um único
    .trim();
  
  // Retorna as primeiras palavras até o limite de caracteres
  return plainText.length > maxLength 
    ? plainText.substring(0, maxLength).trim() + '...' 
    : plainText;
};

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
    excerpt: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: '',
    },
    image_url: {
      type: DataTypes.STRING(500),
      allowNull: true,
      defaultValue: null,
      comment: 'URL da imagem principal do post',
      field: 'image_url', // Garante que o nome da coluna está correto
      validate: {
        isUrl: true,
        len: [0, 500]
      }
    },
    category_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: 'categories',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    },
    content: {
      type: DataTypes.TEXT,
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
    // Garante que os campos não definidos não sejam removidos
    omitNull: false
  }
);

// Associations are now defined in src/models/associations.ts

// Associations are now defined in src/models/associations.ts

// Hook para garantir que o image_url seja salvo corretamente
Post.addHook('beforeCreate', 'ensureImageUrl', (post: any) => {
  console.log('Before create - image_url:', post.image_url);
  // Garante que image_url seja null se for undefined
  if (post.image_url === undefined) {
    post.image_url = null;
  }
  return post;
});

// Hook para garantir que o image_url seja mantido durante o salvamento
Post.addHook('beforeSave', 'preserveImageUrl', (post: any) => {
  if (post.changed('image_url')) {
    console.log('Before save - image_url changed:', post.image_url);
    // Força o valor a ser mantido
    post.setDataValue('image_url', post.image_url);
  }
  return post;
});

// Hooks para gerar excerpt automaticamente
Post.addHook('beforeSave', 'generateExcerpt', (post: Post) => {
  // Garante que o post seja uma instância de Post
  if (!(post instanceof Post)) return;
  
  // Gera o excerpt a partir do conteúdo se não foi fornecido
  if ((post.changed('content') || !post.excerpt) && post.content) {
    post.excerpt = generateExcerpt(post.content);
  }
  
  // Se ainda não tiver um excerpt, define um valor vazio
  if (!post.excerpt) {
    post.excerpt = '';
  }
  
  // Garante que o excerpt não seja muito longo
  if (post.excerpt.length > 255) {
    post.excerpt = post.excerpt.substring(0, 252) + '...';
  }
});

// Adiciona método toJSON personalizado para garantir que a categoria e image_url sejam incluídos
Post.prototype.toJSON = function() {
  const values = this.get({ plain: true });
  
  // Inclui a categoria se existir
  if (this.category) {
    values.category = this.category;
  }
  
  // Garante que o image_url seja sempre incluído, mesmo que seja null/undefined
  values.image_url = this.image_url || null;
  
  return values;
};

export default Post;
