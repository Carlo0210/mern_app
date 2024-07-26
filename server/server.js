// server.js

const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const userRoutes = require('./routes/userRoutes');
const providerServiceRoutes = require('./routes/providerServiceRoutes');
const providerDetailsRoutes = require('./routes/providerDetailsRoutes');
const combinedProviderRoutes = require('./routes/combinedProviderRoutes');
const providerInformationRoutes = require('./routes/providerInformationRoutes');
const path = require('path');

const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT= process.env.PORT || 4501;
// const allowedOrigins = ['http://localhost:3000']; //'https://altrustservices.netlify.app'];

// const corsOptions = {
//   origin: function (origin, callback) {
//     if (allowedOrigins.indexOf(origin) !== -1 || !origin) { // Allow requests with no origin (like Postman)
//       callback(null, true);
//     } else {
//       callback(new Error('Not allowed by CORS'));
//     }
//   },
//   optionsSuccessStatus: 200
// };

app.use(cors());
require('./connection')

// Increase the body size limit
app.use(bodyParser.json({ limit: '1024mb' }));
app.use(bodyParser.urlencoded({ limit: '1024mb', extended: true }));


app.use('/api/users', userRoutes);
app.use('/api', providerServiceRoutes);
app.use('/api', providerDetailsRoutes);
app.use('/api', providerInformationRoutes);
app.use('/combined-provider', combinedProviderRoutes);


// // Serve static files from the frontend build directory
// app.use(express.static(path.join(__dirname, '..','client', 'build')));

// // Handle all other routes by sending the index.html file
// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, '..', 'client', 'build', 'index.html'));
// });

app.listen(PORT, async () => {
    console.log(`Server is running on ${PORT}`);
});

module.exports = app;