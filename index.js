const credentials = require('./config/credentials');
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const jwt = require('./utils/jwt');
const router = require('./routes/router');
const ApiError = require('./utils/apiErrors');
const errorHandler = require('./middlewares/apiError.middleware');
const db = require('./app/index');
const path = require('path');

const app = express();

const { API_PORT, CLIENT_HOST } = credentials;

app.use(
  cors({
    credentials: true,
    origin: CLIENT_HOST
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use('/api', router);
app.all('*', (req, res, next) => {
  next(ApiError.NotFoundError());
});

app.use(errorHandler);

const start = async () => {
  try {
    await db.openConnection();
    app.listen(API_PORT, () => {
      console.log(`Start on ${API_PORT}`);
    });
  } catch (e) {
    console.error(e);
  }
};

start();
