'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Product.belongsTo(models.Category, {
        foreignKey: 'category_id'
      })
    }
  }
  Product.init({
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
    },
    name: {
      type: DataTypes.STRING,
      unique: true
    },
    sku: {
      type: DataTypes.STRING,
      unique: true
    },
    price: DataTypes.FLOAT,
    stock: DataTypes.INTEGER,
    experiation: DataTypes.DATE,
    description: DataTypes.STRING,
    category_id: {
      type: DataTypes.UUID,
      references: {
        model: 'Category',
        key: 'id',
      },
    }
  }, {
    sequelize,
    modelName: 'Product',
  });
  return Product;
};