const credentials = require('./credentials');
const { Sequelize } = require('sequelize');

const { DB_NAME, DB_USER, DB_PASSWORD, DB_HOST, DB_PORT } = credentials

const sequelize = new Sequelize(DB_NAME,DB_USER, DB_PASSWORD, {
  host: DB_HOST,
  port: DB_PORT,
  dialect: 'postgres',
  logging: true,
  dialectOptions: {
    multipleStatements: true
  },
  timezone: '+00:00',
  define: {
    timestamps: false
  }
});


module.exports = sequelize;
