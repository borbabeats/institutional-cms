import Post from './Post';
import Category from './Category';
import Author from './Author';
import Vehicles from './Vehicles';
import VehicleMarca from './VehicleMarca';
import VehicleAno from './VehicleAno';
import VehicleCor from './VehicleCor';
import VehicleCategories from './VehicleCategories';

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

  // Vehicle associations
  Vehicles.belongsTo(VehicleMarca, { foreignKey: 'marca_id', as: 'marca' });
  VehicleMarca.hasMany(Vehicles, { foreignKey: 'marca_id', as: 'vehicles' });

  Vehicles.belongsTo(VehicleAno, { foreignKey: 'ano_id', as: 'ano' });
  VehicleAno.hasMany(Vehicles, { foreignKey: 'ano_id', as: 'vehicles' });

  Vehicles.belongsTo(VehicleCor, { foreignKey: 'cor_id', as: 'cor' });
  VehicleCor.hasMany(Vehicles, { foreignKey: 'cor_id', as: 'vehicles' });

  Vehicles.belongsTo(VehicleCategories, { foreignKey: 'categoria_id', as: 'categoria' });
  VehicleCategories.hasMany(Vehicles, { foreignKey: 'categoria_id', as: 'vehicles' });
};

export default setupAssociations;
