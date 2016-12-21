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

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, '../../views'));
app.use(express.static(path.join(__dirname, '../../dist')));

app.get('/robot', (req, res) => {
  console.log('qprs');
  res.send('Hi');
});

app.get('/donor/edit/:uni_key', (req, res) => {
  donorModel.findOne({ _id: req.params.uni_key }).
    then(donor => {
      if (typeof donor !== 'object' || Object.keys(donor).length === 0) {
        return res.status(404).send({error: 'Point not found'});
      }
      let result = { ...donor.toObject(), uni_key: req.params.uni_key };
      console.log(result);
      res.render('update', result);
    }).catch(err => { res.status(500).send(err); });
});

app.post('/donor/update', (req, res) => {
  console.log(req.body);
  donorModel.update({ _id: req.body.id }, {
    name:
    {
      first: req.body.firstname,
      last: req.body.lastname,
    },
    bloodgroup: req.body.bloodgroup,
    contact: req.body.contact,
    email: req.body.email,
  }).then(() => {
    loadPins(io);
    res.send('updated...');
  });
});

app.post('/donor/delete', (req, res) => {
  donorModel.find({ _id: req.body.id }).remove()
    .then(() => {
      loadPins(io);
      res.send('removed');
    });
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
      res.send(save_result);
      return io;
    }).then(loadPins)
      .catch(err => { throw err; });
  });
});

io.on('connection', function (socket) {
  console.log('A user just connected');
  loadPins(socket);
});

function loadPins(socket) {
  donorModel.find({}).then(donors => {
    socket.emit('allpins', donors);
  }).catch(err => { throw err; });
}
