// tslint:disable:no-require-imports
import { socket } from './Interaction';
// import { map } from './Map';
import SimpleMarkerSymbol = require('esri/symbols/SimpleMarkerSymbol');

socket.on('connect', () => {
    console.log('Client connected');
    const donorSym = new SimpleMarkerSymbol({
        size: 10,
        color: '#FF4000',
        outline: {
            color: [255, 64, 0, 0.4],
            width: 7,
        },
    });
    socket.on('allpins', (pins) => {
        console.log('Chalal');
        console.log(pins);
        console.log(donorSym);
    });

});

