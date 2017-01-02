process.env.NODE_ENV = 'test';

import test from 'ava';
import app from '../../server/index';
import * as request from 'supertest-as-promised';
import donorModel from '../../server/donorModel';

test('my passing test', t => {
    t.pass();
});

test('robot', async t => {
    const res = await request(app)
        .get('/robot');
    t.is(res.text, 'Hi');
});
test.before('Delete all donors in DB', async t => {
    await donorModel.remove({});
});
test.after('Delete all donors in DB', async t => {
    await donorModel.remove({});
});
test('Donor without blood group should not be added', async t => {
    const res = await request(app)
        .post('/donor/new')
        .send({
            fname: 'Ayush',
            lname: 'Sachdeva',
            email: 'ayush0000@gmail.com',
            contact: '+918699061924',
            latitude: 30.71671268875832,
            longitude: 76.7530743253815,
        });
    t.is(res.body.length, 1);
    t.is(res.body[0].msg, 'Invalid blood group.');
    t.is(res.status, 400);
});

test('Donor with all params should be added correctly', async t => {
    const res = await request(app)
        .post('/donor/new')
        .send({
            fname: 'Ayush',
            lname: 'Sachdeva',
            email: 'ayush0000@gmail.com',
            contact: '+918699061924',
            latitude: 30.71671268875832,
            longitude: 76.7530743253815,
            bloodgroup: 'AB-',
        });
    t.is(res.body.email, 'ayush0000@gmail.com');
    t.is(res.status, 200);
});

test('Donors with same email should not add', async t => {
    const r1 = request(app)
        .post('/donor/new')
        .send({
            fname: 'Piyush',
            lname: 'Gachdeva',
            email: 'samarzxcv@gmail.com',
            contact: '+918600001924',
            latitude: 30.7167126887832,
            longitude: 76.753074323815,
            bloodgroup: 'A+',
        });
    const r2 = request(app)
        .post('/donor/new')
        .send({
            fname: 'Siyush',
            lname: 'Dachdeva',
            email: 'samarzxcv@gmail.com',
            contact: '+918600111124',
            latitude: 30.716712688732,
            longitude: 76.75307323815,
            bloodgroup: 'A-',
        });
    const res = await Promise.all([r1, r2]);
    t.is(res[1].status, 400);
});

test('Deleting a donor removes it from db', async t => {
    // Seed with a donor
    const res = await request(app)
        .post('/donor/new')
        .send({
            fname: 'Karnayush',
            lname: 'Ghachdeva',
            email: 'ayush000121@gmail.com',
            contact: '+918699161924',
            latitude: 30.7167126887832,
            longitude: 76.730743253815,
            bloodgroup: 'B+',
        });
    const donor = res.body;
    // Check if donor object is created
    t.not(await donorModel.findById(donor._id), null);

    const res2 = await request(app)
        .post('/donor/delete')
        .send({ id: donor._id });
    t.is(res2.status, 200);
    t.is(res2.text, 'removed');
    // Check if donor object is removed
    t.is(await donorModel.findById(donor._id), null);
    // t.throws(donorModel.findById(donor._id));
});

test('Can edit a donor by ID', async t => {
    // Seed with a donor
    const donor = (await request(app)
        .post('/donor/new')
        .send({
            fname: 'Kumayush',
            lname: 'Ghachdeva',
            email: 'ayush000122@gmail.com',
            contact: '+918699161925',
            latitude: 30.7167126887833,
            longitude: 76.730743253816,
            bloodgroup: 'B+',
        })).body;
    // Check if the name is the one stored in db
    t.is(((await donorModel.findById(donor._id)).toObject() as any).name.first, 'Kumayush');
    const res = await request(app)
        .post('/donor/update')
        .send({
            id: donor._id,
            firstname: 'Umayush',
            lastname: donor.lname,
            email: donor.email,
            bloodgroup: donor.bloodgroup,
            contact: donor.contact,
        });
    t.is(res.text, 'updated...');
    t.is(res.status, 200);
    // Check if the name got updated
    t.is(((await donorModel.findById(donor._id)).toObject() as any).name.first, 'Umayush');
});

test('Can fetch edit page for a donor', async t => {
    // Seed with a donor
    const donorId = (await request(app)
        .post('/donor/new')
        .send({
            fname: 'GGayush',
            lname: 'GGsachdeva',
            email: 'ggayush000122@gmail.com',
            contact: '+888699161925',
            latitude: 30.167126887833,
            longitude: 76.30743253816,
            bloodgroup: 'B-',
        })).body._id;
    // Check if edit page is rendered for the specified ID
    const res = await request(app)
        .get(`/donor/edit/${donorId}`);
    t.is(res.status, 200);
});

test('Edit page give 404 for a non existant ID', async t => {

    const res = await request(app)
        .get(`/donor/edit/991`);
    t.is(res.status, 404);
});
