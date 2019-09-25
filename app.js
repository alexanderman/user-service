/**
 * https://github.com/sahat/hackathon-starter/blob/master/app.js
 */
const express = require('express');
const compression = require('compression');
const bodyParser = require('body-parser');
const logger = require('morgan');   // TODO: setup logs, https://medium.com/@tobydigz/logging-in-a-node-express-app-with-morgan-and-bunyan-30d9bf2c07a
const errorHandler = require('errorhandler');
const dotenv = require('dotenv'); // loads configuration from .env into process.env
const path = require('path');
const mongoose = require('mongoose');
const passport = require('passport');
const multer = require('multer');   // TODO: multipart/form-data for files uploads
const cors = require('cors');

const upload = multer({ dest: path.join(__dirname, 'uploads') });

/**
 * Load environment variables from .env file, where API keys and passwords are configured.
 */
dotenv.config({ path: '.env' });

const passportConfig = require('./config/passport');

/**
 * Create Express server.
 */
const app = express();
/** https://expressjs.com/en/resources/middleware/cors.html */
app.use(cors());

/**
 * Connect to MongoDB.
 */
/** see deprecations https://mongoosejs.com/docs/deprecations.html */
mongoose.connect(process.env.MONGODB_URI, {
    useFindAndModify: false,
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true 
});
mongoose.connection.on('error', (err) => {
  console.error(err);
  console.log('MongoDB connection error');
  process.exit();
});
mongoose.connection.on('connected', () => {
    console.log('mongoose connected');
});

/**
 * Express configuration.
 */
// app.set('host', process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0');
app.set('port', process.env.PORT || 8080);

app.use(compression());

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(passport.initialize());
app.use(passport.session());

app.disable('x-powered-by');

/**
 * Error Handler.
 */
if (process.env.NODE_ENV === 'development') {
  // only use in development
  app.use(errorHandler());
} else {
  app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).send('Server Error');
  });
}

/**
 * Start Express server.
 */
app.listen(app.get('port'), () => {
    console.log(`app started at ${app.get('port')}, ${app.get('env')}`);
});

module.exports = app;
