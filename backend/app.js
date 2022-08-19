const express = require('express');
const cors = require('cors');
const path = require('path');
const morgan = require('morgan');
const pino = require('pino-http')();
const logger = require('pino')();

const db = require('./config/db.config');
require('dotenv').config();

// routes
const messageRoutes = require('./routes/message');
const userRoutes = require('./routes/user');
const swaggerRoutes = require('./routes/apiDocs');
const adminRoutes = require('./routes/adminRoutes');

class App {
  app = null;

  entries = [];

  middlewares() {
    const corsOptions = {
      origin: 'http://localhost:3000',
      credentials: true, // access-control-allow-credentials:true
      optionSuccessStatus: 200,
    };
    this.app.use(cors(corsOptions));
    this.app.use(pino);
    this.app.use(morgan('dev'));
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(express.json());
    this.app.use((req, res, next) => {
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader(
        'Access-Control-Allow-Methods',
        'GET',
        'POST',
        'PUT',
        'DELETE'
      );
      next();
    });
  }

  routes() {
    this.app.use('/messages', messageRoutes);
    this.app.use('/users', userRoutes);
    this.app.use('/apiDocs', swaggerRoutes);
    this.app.use('/admin', adminRoutes);

    this.app.use((request, response) => {
      response.status(404).render('404');
    });
  }

  async config() {
    this.app.set('views', path.resolve(__dirname, 'views'));
    this.app.set('view engine', 'ejs');

    await db.sync();
  }

  constructor() {
    this.app = express();
    this.config();
    this.middlewares();
    this.routes();
  }
}

const { app } = new App();
app.listen(5005, () => logger.info('Ouvindo na porta 5005'));
