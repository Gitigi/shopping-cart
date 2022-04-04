'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Categories', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: 'uniqueCategory'
      },
      parent_id: {
        type: Sequelize.UUID,
        onDelete: "CASCADE",
        references: {
          model: 'Categories',
          key: 'id'
        },
      },
      parent_non_null_id: {
        type: 'varchar(200) GENERATED ALWAYS AS  (COALESCE(parent_id, name))',
        unique: 'uniqueCategory'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    },
    {
      uniqueKeys: {
        uniqueCategory: {
          customIndex: true,
          fields: ["name", "parent_non_null_id"]
        }
      }
    }
    );
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Categories');
  }
};