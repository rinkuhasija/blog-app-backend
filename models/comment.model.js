const { Sequelize, DataTypes } = require("sequelize")
const User = require("./user.model")
const Post = require("./post.model")

const sequelize = new Sequelize("hello_world_db", "root", "Rinku@7882", {
    dialect: "mysql",
    host: "localhost",
});

const Comment = sequelize.define("Comment", {
    commentContent: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    commentDate: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    commentTime: {
        type: DataTypes.TIME,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },

});

sequelize.sync().then(() => {
    console.log('COMMENT table created successfully!');
}).catch((error) => {
    console.error('Unable to create table : ', error);
});


Comment.belongsTo(User, { foreignKey: 'userId' });
Comment.belongsTo(Post, { foreignKey: 'postId' });

module.exports = Comment;

