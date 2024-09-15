const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('chatApp', 'root', 'Anandur@2002', {
  host: 'localhost',
  dialect: 'mysql'
});




module.exports = { sequelize };
