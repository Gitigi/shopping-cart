'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Category extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Category.belongsTo(models.Category, {
        foreignKey: 'parent_id'
      })

      Category.hasMany(models.Category, {
        foreignKey: 'parent_id'
      })
    }
  }
  Category.init({
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
    },
    name: DataTypes.STRING,
    parent_id: {
      type: DataTypes.UUID,
      references: {
        model: 'Category',
        key: 'id',
      },
    }
  }, {
    sequelize,
    modelName: 'Category',
  });
  return Category;
};