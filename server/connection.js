// connection.js

const mongoose = require('mongoose');
require('dotenv').config();

const dbUrl = process.env.MONGODB_URL || 'mongodb://localhost:27017/cmsDB';

mongoose.connect(dbUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
})
.then(() => console.log('MongoDB connected'))
.catch((err) => console.log('MongoDB connection error: ', err));
