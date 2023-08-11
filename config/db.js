const { Sequelize } = require('sequelize');
require('dotenv').config(); //  .env file

//creating a database in mysql
const sequelize = new Sequelize("hello_world_db", "root", process.env.DB_PWD, {
    dialect: "mysql",
    host: "localhost",
});

sequelize.authenticate().then(() => {
    console.log('Connection has been established successfully.');
}).catch((error) => {
    console.error('Unable to connect to the database: ', error);
});


module.exports = sequelize;