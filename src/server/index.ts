// tslint:disable:no-require-imports
import * as express from 'express';
import * as path from 'path';
import * as logger from 'morgan';
import * as bodyParser from 'body-parser';
import expressValidator = require('express-validator');
import * as mongoose from 'mongoose';

import router from './router';
import donorRouter from './donorRouter';
import { MONGODB_URL } from './constants';

const app = express();
app.use(logger('dev'));
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());
app.use(expressValidator());

require('mongoose').Promise = global.Promise;
mongoose.connect(MONGODB_URL, (err) => {
  if (err) {
    throw err;
  }
  console.log('Connected to Mongo!');
});

const listener = app.listen(3000, () => {
  console.log(`Listening on port ${listener.address().port}`);
});

app.set('view options', { layout: false });
app.use(express.static(path.join(__dirname, '../../dist')));
app.use('/', router);
app.use('/donor', donorRouter);



