const express = require('express');
const rateLimit = require('express-rate-limit');
const { events_fetching } = require('./api/main');
const cors = require('cors');
const helmet = require('helmet');
const app = express();

app.use(express.json());
app.use(cors());

const limiter = rateLimit({
    windowMs: 1000,
    max: 5,
    message: 'Too many requests from this IP, please try again later.'
});

app.use(limiter);

app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'"],
            styleSrc: ["'self'"],
            imgSrc: ["'self'", 'data:']
        }
    }
}));

app.get('/api/events', async (req, res) => {
    try {
        const events_results = await events_fetching();
        res.status(200).json({
            success: true,
            data: events_results,
        });
    } catch (error) {
        console.log('Backend error:', error);
        res.status(500).json({
            success: false,
            message: 'Error while fetching events',
            error: error.message
        });
    }
});

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
