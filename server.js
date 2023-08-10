const express = require('express');
const bodyParser = require('body-parser')
const sequelize = require('./config/db')
const User = require('./models/user.model')
require('dotenv').config(); //  .env file
const cors = require('cors');

const app = express();

// import routes
const authRoutes = require('./routes/auth')

//middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

let PORT = process.env.PORT || 3000;

// Login and Register routes
app.use('/api/v1/auth', authRoutes);

app.get("/", (req, res) => {
    res.send("Hello World");
})

// Error handler middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Internal Server Error' });
});

app.listen(PORT, () => {
    console.log(`APP is running at ${PORT}`);
})

