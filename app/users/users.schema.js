module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    'users',
    {
      id: {
        type: DataTypes.UUID,
        allowNull: false,
        defaultValue: sequelize.fn('uuid_generate_v4'),
        primaryKey: true
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      password: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      createdAt: {
        field: 'created_at',
        type: DataTypes.DATE,
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
        allowNull: false,
      },
      updatedAt: {
        field: 'updated_at',
        type: DataTypes.DATE,
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
        allowNull: false,
      }
    },
    {
      freezeTableName: true,
    }
  );
};
