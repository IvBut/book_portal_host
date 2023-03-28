module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    'tokens',
    {
      id: {
        type: DataTypes.UUID,
        allowNull: false,
        defaultValue: sequelize.fn('uuid_generate_v4'),
        primaryKey: true
      },
      userId: {
        field: 'user_id',
        type: DataTypes.UUID,
        allowNull: false
      },
      token: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      createdAt: {
        field: 'created_at',
        type: DataTypes.DATE,
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
        allowNull: false
      },
    },
    {
      freezeTableName: true
    }
  );
};
