const { DataTypes } = require('sequelize');
// const sequelize = require('../server')
const { Sequelize } = require('sequelize');
require('dotenv').config()

const sequelize = new Sequelize("hello_world_db", "root", process.env.DB_PWD, {
    dialect: "mysql",
    host: "localhost",
});

const User = sequelize.define("users", {
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true,
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    userCreatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
    role: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "user",
    }
});

sequelize.sync().then(() => {
    console.log('USER table created successfully!');
}).catch((error) => {
    console.error('Unable to create table : ', error);
});

module.exports = User;
