const { Sequelize } = require('sequelize');

//creating a database in sqlite
const sequelize = new Sequelize("hello_world_db", "root", "Rinku@7882", {
    dialect: "mysql",
    host: "localhost",
});

sequelize.authenticate().then(() => {
    console.log('Connection has been established successfully.');
}).catch((error) => {
    console.error('Unable to connect to the database: ', error);
});


module.exports = sequelize;