const express = require('express');
const bodyParser = require('body-parser')
const sequelize = require('./config/db')
// const User = require('./models/user.model')
const Post = require('./models/post.model')
const postRoutes = require("./routes/posts")

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
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

let PORT = process.env.PORT || 3000;

// Login and Register routes
app.use('/api/v1/auth', authRoutes);

//posts routes
app.use('/api/v1/posts', postRoutes)

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
            return res.status(500).send('Internal Server Error');
        }
        console.log(`stdout: ${stdout}`);
        console.error(`stderr: ${stderr}`);
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

app.get("/test-api", (req, res) => {
    res.send("Hello test");
})

// Error handler middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Internal Server Error' });
});

app.listen(PORT, () => {
    console.log(`APP is running at ${PORT} `);
})

