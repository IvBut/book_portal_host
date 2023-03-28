const { Sequelize, DataTypes } = require('sequelize');
const dbConnection = require('../config/database');

const db = {};
db.Sequelize = Sequelize;
db.sequelize = dbConnection;
db.openConnection = async () => {
  return dbConnection.authenticate();
};
db.closeConnection = async () => {
  return dbConnection.close();
};

db.users = require('./users/users.schema')(dbConnection, DataTypes);
db.roles = require('./roles/roles.schema')(dbConnection, DataTypes);
db.tokens = require('./tokens/tokens.schema')(dbConnection, DataTypes);
db.usersRoles = require('./users.roles/users.roles.schema')(dbConnection, DataTypes);

db.users.belongsToMany(db.roles, {
  through: {
    model: db.usersRoles,
    unique: false
  },
  foreignKey: 'userId',
  as: 'roles',
  onDelete: 'CASCADE',
  onUpdate: 'NO ACTION'
});
db.roles.belongsToMany(db.users, {
  through: {
    model: db.usersRoles,
    unique: false
  },
  foreignKey: 'roleId',
  as: 'users',
  onDelete: 'CASCADE',
  onUpdate: 'NO ACTION'
});
db.users.hasMany(db.tokens, {
  foreignKey: 'userId',
  as: 'tokens',
  sourceKey: 'id',
  onDelete: 'CASCADE',
  onUpdate: 'NO ACTION'
});
db.tokens.belongsTo(db.users, {
  foreignKey: 'userId',
  as: 'user',
  onDelete: 'CASCADE',
  onUpdate: 'NO ACTION'
});

module.exports = db;

