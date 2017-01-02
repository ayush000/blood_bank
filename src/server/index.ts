// tslint:disable:no-require-imports
import * as express from 'express';
import * as path from 'path';
import * as logger from 'morgan';
import * as bodyParser from 'body-parser';
import expressValidator = require('express-validator');
import * as mongoose from 'mongoose';
import * as socket_io from 'socket.io';
import * as util from 'util';
import * as config from 'config';

import { writeLog } from '../shared/commonfunction';
import donorModel from './donorModel';

const MONGODB_URL: string = process.env.MONGODB_URI || config.get('MONGODB_URL') as string;
require('mongoose').Promise = global.Promise;


const app = express();
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());
app.use(expressValidator());

mongoose.connect(MONGODB_URL, (err) => {
  if (err) {
    throw err;
  }
  writeLog('Connected to Mongo!');
});
if (process.env.NODE_ENV !== 'test') {
  app.use(logger('dev'));
  mongoose.set('debug', true);
}


const listener = app.listen(3000, () => {
  writeLog(`Listening on port ${listener.address().port}`);
});
const io = socket_io(listener);

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, '../../views'));
app.use(express.static(path.join(__dirname, '../../dist')));

app.get('/robot', (req, res) => {

  res.send('Hi');
});

app.get('/donor/edit/:uni_key', (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.uni_key)) {
    return res.status(404).send({ error: 'Point not found' });
  }
  donorModel.findById(req.params.uni_key).
    then(donor => {
      if (typeof donor === 'undefined') {
        return res.status(404).send({ error: 'Point not found' });
      }
      let result = { ...donor.toObject(), uni_key: req.params.uni_key };

      res.render('update', result);
    }).catch(err => { res.status(500).send(err); });
});

app.post('/donor/update', (req, res) => {

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
      writeLog('There have been validation errors: ' + util.inspect(valid_result.array()));
      res.status(400).send(valid_result.array());
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
      .catch(err => { res.status(400).send(err); });
  });
});

io.on('connection', function (socket) {
  writeLog('A user just connected');
  loadPins(socket);
});

function loadPins(socket) {
  donorModel.find({}).then(donors => {
    socket.emit('allpins', donors);
  }).catch(err => { throw err; });
}

export default app;
