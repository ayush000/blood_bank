import * as express from 'express';

import * as util from 'util';
import donorModel from './donorModel';

const router = express.Router();

router.post('/new', (req, res) => {
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
    req.getValidationResult().then(function (result) {
        if (!result.isEmpty()) {
            console.log('There have been validation errors: ' + util.inspect(result.array()));
            res.status(400).send('There have been validation errors: ' + util.inspect(result.array()));
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
        donor.save().then(() => {
            return res.send(donorObj);
        }).catch(err => { throw err; });
    });

});
export default router;
