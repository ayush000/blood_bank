// tslint:disable:no-require-imports
import * as express from 'express';
import * as path from 'path';
import * as logger from 'morgan';
import * as bodyParser from 'body-parser';
import expressValidator = require('express-validator');
import * as mongoose from 'mongoose';
import * as socket_io from 'socket.io';
import * as util from 'util';

import donorModel from './donorModel';
import { MONGODB_URL } from './constants';
require('mongoose').Promise = global.Promise;


const app = express();
app.use(logger('dev'));
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());
app.use(expressValidator());

mongoose.connect(MONGODB_URL, (err) => {
  if (err) {
    throw err;
  }
  console.log('Connected to Mongo!');
});
mongoose.set('debug', true);


const listener = app.listen(3000, () => {
  console.log(`Listening on port ${listener.address().port}`);
});
const io = socket_io(listener);


app.set('view options', { layout: false });
app.use(express.static(path.join(__dirname, '../../dist')));

app.get('/robot', (req, res) => {
  console.log(req.db);
  console.log(req.date);
  res.send(req.db);
});

app.post('/donor/new', (req, res) => {

  req.checkBody('fname', 'Invalid first name.').notEmpty().isAlpha();
  req.checkBody('lname', 'Invalid last name.').notEmpty().isAlpha();
  req.checkBody('contact', 'Invalid contact number.').notEmpty();
  req.checkBody('email', 'Invalid email address.').notEmpty().isEmail();
  req.checkBody('bloodgroup', 'Invalid blood group.').notEmpty();
  req.checkBody('latitude', 'Invalid latitude.').notEmpty().isFloat();
  req.checkBody('longitude', 'Invalid longitude.').notEmpty().isFloat();
  const obj: {
    fname: string,
    lname: string,
    contact: string,
    email: string,
    bloodgroup: string,
    latitude: number,
    longitude: number,
    address: string,
    ip?: string,
  } = req.body;
  req.getValidationResult().then(function (valid_result) {
    if (!valid_result.isEmpty()) {
      console.log('There have been validation errors: ' + util.inspect(valid_result.array()));
      res.status(400).send(valid_result);
      return;
    }
    const donorObj = {
      name: {
        first: obj.fname,
        last: obj.lname,
      },
      contact: obj.contact,
      email: obj.email,
      bloodgroup: obj.bloodgroup,
      location: {
        type: 'Point',
        coordinates: [obj.longitude, obj.latitude],
      },
      ip: obj.ip,
      address: obj.address,
    };
    const donor = new donorModel(donorObj);
    donor.save().then((save_result) => {
      console.log('save_result');
      console.log(save_result);
      return res.send(donorObj);
    }).catch(err => { throw err; });
  });
});

io.on('connection', function (socket) {
  console.log('A user just connected');
  loadPins();
});

function loadPins() {
  donorModel.find({}, (err, donors) => {
    if (err) throw err;
    io.emit('allpins', donors);
  });
}
