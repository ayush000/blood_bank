import * as mongoose from 'mongoose';
const donorSchema = new mongoose.Schema({
    name: {
        first: { type: String, required: true, trim: true },
        last: { type: String, required: true, trim: true },
    },
    contact: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },
    bloodgroup: { type: String, required: true },
    location: {
        type: { type: String, default: 'Point' },
        coordinates: { type: [Number], required: true },
    },
    ip: { type: String, required: false },
    address: { type: String, required: false },
});

donorSchema.index({
    location: '2dsphere',
});

export default mongoose.model('donor', donorSchema);
