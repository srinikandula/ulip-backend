const path = require('path');
const express = require('express');
const httpError = require('http-errors');
const logger = require('morgan');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const compress = require('compression');
const methodOverride = require('method-override');
const cors = require('cors');
const helmet = require('helmet');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
const config = require('./config');
const passport = require('./passport');
const routes = require('../routes/index.route');
const session = require('express-session');


const app = express();

if (config.NODE_ENV === 'development') {
  app.use(logger('dev'));
}

// Choose what fronten framework to serve the dist from
var distDir = '../../dist/';

//
app.use(express.static(path.join(__dirname, distDir)));
// app.use(/^((?!(api)).)*/, (req, res) => {
//     res.status(200).json('This is Logione Backend');
//     // res.sendFile(path.join(__dirname, distDir + '/index.html'));
//     // res.status(404).json({ error: 'Sorry, the requested resource was not found.' });
// });

app.get('/', (req, res) => {
    res.status(200).json('LOGIONE Application server running successfully on PORT ' + config.PORT);
})

app.use(session({
    secret: config.jwtSecret,
    resave: false,
    saveUninitialized: true,
    cookie: { httpOnly: true } // Set HttpOnly attribute for the session cookie
}));

//React server
app.use(
  express.static(
    path.join(__dirname, '../../node_modules/material-dashboard-react/dist')
  )
);
// app.use(/^((?!(api)).)*/, (req, res) => {
//   res.sendFile(path.join(__dirname, '../../dist/index.html'));
// });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cookieParser());
app.use(compress());
app.use(methodOverride());

// secure apps by setting various HTTP headers
app.use(helmet());

// enable CORS - Cross Origin Resource Sharing
app.use(cors({
      origin: [
          'http://localhost:4200',
          'https://logione.whizzard.in',
          'http://20.219.251.153:7443/',
          'http://20.219.251.153:7443',
          'https://logione.mllqa.com',
          'https://logione.mlldev.com',
          'https://logione.mahindralogistics.com'
      ],
      exposedHeaders: ['X-Auth-Token', 'X-Refresh-Token'],
      methods: ['GET', 'POST', 'PUT', 'DELETE']
    }
));

// Middleware for Authentication
app.use(passport.initialize());
app.use(passport.session());

// Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// API router
app.use('/api/', routes);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new httpError(404);
  return next(err);
});

// error handler, send stacktrace only during development
app.use((err, req, res, next) => {
  // customize Joi validation errors
  if (err.isJoi) {
    err.message = err.details.map(e => e.message).join('; ');
    err.status = 400;
  }

  res.status(err.status || 500).json({
    message: err.message,
  });
  next(err);
});

module.exports = app;
