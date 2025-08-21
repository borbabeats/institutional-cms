import Post from './Post';
import Category from './Category';
import Author from './Author';
import Vehicles from './Vehicles';
import VehicleMarca from './VehicleMarca';
import VehicleAno from './VehicleAno';
import VehicleCor from './VehicleCor';
import VehicleCategories from './VehicleCategories';
import VehicleImage from './VehicleImage';
import VehicleOptional from './VehicleOptional';
import VehicleToOptional from './VehicleToOptional';

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

  // Vehicle-Image associations
  Vehicles.hasMany(VehicleImage, { foreignKey: 'vehicle_id', as: 'images' });
  VehicleImage.belongsTo(Vehicles, { foreignKey: 'vehicle_id', as: 'vehicle' });

  // Vehicle-Optional (Many-to-Many)
  Vehicles.belongsToMany(VehicleOptional, {
    through: VehicleToOptional,
    foreignKey: 'vehicle_id',
    otherKey: 'optional_id',
    as: 'optionals',
  });

  VehicleOptional.belongsToMany(Vehicles, {
    through: VehicleToOptional,
    foreignKey: 'optional_id',
    otherKey: 'vehicle_id',
    as: 'vehicles',
  });
};

export default setupAssociations;
