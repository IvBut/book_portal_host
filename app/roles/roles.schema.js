module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    'roles',
    {
      id: {
        type: DataTypes.UUID,
        allowNull: false,
        defaultValue: sequelize.fn('uuid_generate_v4'),
        primaryKey: true
      },
      roleName: {
        field: 'role_name',
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      createdAt: {
        field: 'created_at',
        type: DataTypes.DATE,
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
        allowNull: false
      },
      updatedAt: {
        field: 'updated_at',
        type: DataTypes.DATE,
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
        allowNull: false
      }
    },
    {
      freezeTableName: true
    }
  );
};
