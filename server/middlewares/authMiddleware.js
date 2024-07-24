require('dotenv').config();

const API_KEY = process.env.API_KEY;

const authenticateAPIKey = (req, res, next) => {
    const apiKey = req.headers['x-api-key'];

    if (apiKey && apiKey === API_KEY) {
        next();  // API key is valid, proceed to the next middleware or route handler
    } else {
        res.status(401).json({ message: 'Unauthorized' });  // API key is invalid
    }
};

module.exports = authenticateAPIKey;
