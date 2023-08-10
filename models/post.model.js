const { DataTypes } = require('sequelize');

const User = require('./user.model');
const { Sequelize } = require('sequelize');


const sequelize = new Sequelize("hello_world_db", "root", "Rinku@7882", {
    dialect: "mysql",
    host: "localhost",
});

const Post = sequelize.define('Post', {
    title: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            len: [3, 100],
        }
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
            len: [3, 1000],
        }
    },
});

// Define associations
Post.belongsTo(User, { foreignKey: 'userId' });

sequelize.sync().then(() => {
    console.log('POST table created successfully!');
}).catch((error) => {
    console.error('Unable to create table : ', error);
});


module.exports = Post;
