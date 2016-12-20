// tslint:disable:no-require-imports
import { socket } from './Interaction';
import { map } from './Map';
import SimpleMarkerSymbol = require('esri/symbols/SimpleMarkerSymbol');
import Point = require('esri/geometry/Point');
import SimpleRenderer = require('esri/renderers/SimpleRenderer');
import FeatureLayer = require('esri/layers/FeatureLayer');

socket.once('connect', () => {
    console.log('Client connected');
    // Define the specification for each field to create
    //  in the layer
    const fields = [{ name: 'bloodgroup', alias: 'bloodgroup', type: 'string' },
        // { name: 'title', alias: 'title', type: 'string' },
        { name: 'contact', alias: 'contact', type: 'string' },
        { name: 'email', alias: 'email', type: 'string' },
        // { name: 'fname', alias: 'fname', type: 'string' },
        // { name: 'lname', alias: 'lname', type: 'string' },
        { name: 'address', alias: 'address', type: 'string' },
    ];
    // Define popup template
    const pTemplate = {
        title: '[{bloodgroup}] {fname} {lname}',
        content: [{
            type: 'fields',
            fieldInfos: [{ fieldName: 'bloodgroup', label: 'Blood Group', visible: true },
                { fieldName: 'contact', label: 'Contact', visible: true },
                { fieldName: 'email', label: 'Email', visible: true },
                // { fieldName: 'ip', label: 'IP', visible: true },
                // { name: 'fname', label: 'First name', visible: true },
                // { name: 'lname', label: 'Last name', visible: true },
                { fieldName: 'address', label: 'Address', visible: true },
            ],
        }],
        fieldInfos: [{
            fieldName: 'bloodgroup',
            label: 'Blood Group',
            visible: true,
        },
        {
            fieldName: 'fname',
            label: 'First Name',
            visible: true,
        },
        {
            fieldName: 'lname',
            label: 'Last Name',
            visible: true,
        }],
    };
    const donorSym = new SimpleMarkerSymbol({
        size: 10,
        color: '#FF4000',
        outline: {
            color: [255, 64, 0, 0.4],
            width: 7,
        },
    });
    const donorRenderer = new SimpleRenderer({ symbol: donorSym });
    socket.on('allpins', (pins: {
        bloodgroup: string,
        contact: string,
        email: string,
        location: {
            type: string,
            coordinates: number[],
        },
        name: {
            first: string,
            last: string,
        },
        address?: string,
    }[]) => {
        const graphics = pins.map(pin => {
            return {
                geometry: new Point({
                    longitude: pin.location.coordinates[0],
                    latitude: pin.location.coordinates[1],
                }),
                attributes: {
                    bloodgroup: pin.bloodgroup,
                    contact: pin.contact,
                    email: pin.email,
                    fname: pin.name.first,
                    lname: pin.name.last,
                    address: pin.address,
                },
            };
        });
        console.log(graphics);
        console.log(typeof graphics);

        const lyr = new FeatureLayer({
            source: graphics, // autocast as an array of esri/Graphic
            // create an instance of esri/layers/support/Field for each field object
            fields: fields, // This is required when creating a layer from Graphics
            objectIdField: 'email', // This must be defined when creating a layer from Graphics
            renderer: donorRenderer, // set the visualization on the layer
            spatialReference: {
                wkid: 4326,
            },
            geometryType: 'point', // Must be set when creating a layer from Graphics
            popupTemplate: pTemplate,
        });
        map.layers.removeAll();
        map.add(lyr);
        console.log('Chalal');
        console.log(pins);
        console.log(donorSym);
        // if (typeof map !== 'undefined')
        //     map.layers.removeAll();
    });

});

