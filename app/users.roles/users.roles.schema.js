module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    'users_roles',
    {
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        field: 'user_id'
      },
      roleId: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        field: 'role_id'
      }
    },
    {
      freezeTableName: true
    }
  );
};
