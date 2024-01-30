const config = require('./config');
var Sequelize = require('sequelize');


const opts = {
  define: {
    // prevent sequelize from pluralizing table names
    freezeTableName: true,
    timestamps: false
  },
  timezone: "+05:30",
  connectionLimit: 100
  //logging:false
}
const sequelize = new Sequelize(`mysql://${config.mysqlTesting.DB_USER}:${config.mysqlTesting.DB_PASS}@${config.mysqlTesting.DB_HOST}:${config.mysqlTesting.DB_PORT}/${config.mysqlTesting.DB_NAME}`, opts)

sequelize
  .authenticate()
  .then(() => {
    console.log('LogiOne database Connection has been established successfully.')
  })
  .catch(err => {
    console.error('Unable to connect to LogiOne database:', err)
  })

const db = {}

db.sequelize = sequelize
db.Sequelize = Sequelize

// Models/tables

db.userModel = require('../models/user.model')(sequelize, Sequelize);
db.userAuthModel = require('../models/userAuthentication.model')(sequelize, Sequelize);

module.exports = db
