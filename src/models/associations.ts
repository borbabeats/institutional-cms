import Post from './Post';
import Category from './Category';
import Author from './Author';

const setupAssociations = () => {
  // Post belongs to Category
  Post.belongsTo(Category, {
    foreignKey: 'category_id',
    as: 'category',
  });

  // Category has many Posts
  Category.hasMany(Post, {
    foreignKey: 'category_id',
    as: 'posts',
  });

  // Post belongs to Author
  Post.belongsTo(Author, {
    foreignKey: 'author_id',
    as: 'author',
  });

  // Author has many Posts
  Author.hasMany(Post, {
    foreignKey: 'author_id',
    as: 'posts',
  });
};

export default setupAssociations;
