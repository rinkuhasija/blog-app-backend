const express = require('express');
const bodyParser = require('body-parser')
const sequelize = require('./config/db')
// const User = require('./models/user.model')
const Post = require('./models/post.model')
const postRoutes = require("./routes/posts")
const commentRoutes = require("./routes/comment")
const Comment = require("./models/comment.model")

//for github webhook
const crypto = require('crypto');
const { exec } = require('child_process');

require('dotenv').config(); //  .env file
const cors = require('cors');

const app = express();

const webhookSecret = process.env.GITHUB_SECRET;

// import routes
const authRoutes = require('./routes/auth')

//middlewares
app.use(express.json()) ;
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

let PORT = process.env.PORT || 3000;

// Login and Register routes
app.use('/api/v1/auth', authRoutes);

//posts routes
app.use('/api/v1/posts', postRoutes)

//comments routes
app.use('/api/v1/comments', commentRoutes);

//github webhook post
app.post('/github-webhook', (req, res) => {
    const payload = JSON.stringify(req.body);
    const signature = req.get('X-Hub-Signature-256');

    if (!verifySignature(payload, signature, webhookSecret)) {
        console.error('Invalid signature. Webhook not verified.');
        return res.status(401).send('Unauthorized');
    }

    // Execute a pull or update process
    exec('git pull origin main', (error, stdout, stderr) => {
        if (error) {
            console.error(`Error: ${error}`);
            res.status(500).send('Internal Server Error');
        }
        // console.log(`stdout: ${stdout}`);
        // console.error(`stderr: ${stderr}`);

        // Restart Node.js application using PM2
    });

    exec('pm2 restart all', (pm2Error, pm2Stdout, pm2Stderr) => {
        if (pm2Error) {
            console.error(`Error during PM2 restart: ${pm2Error}`);
            res.status(500).send('Internal Server Error');
        }

        console.log(`PM2 restart stdout: ${pm2Stdout}`);
        console.error(`PM2 restart stderr: ${pm2Stderr}`);
        return res.status(200).send('Webhook Received and Processed');
    });
});

function verifySignature(payload, signature, secret) {
    const hmac = crypto.createHmac('sha256', secret);
    const calculatedSignature = 'sha256=' + hmac.update(payload).digest('hex');
    return crypto.timingSafeEqual(
        Buffer.from(calculatedSignature, 'utf8'),
        Buffer.from(signature, 'utf8')
    );
}

app.get("/", (req, res) => {
    res.send("Hello World");
})

// Error handler middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Internal Server Error' });
});

app.listen(PORT, () => {
    console.log(`APP is running at ${PORT} `);
})

