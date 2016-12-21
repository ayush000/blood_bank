// tslint:disable:no-require-imports
import * as React from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import { view } from './Map';
import { DONOR_LABEL_ADD, LABEL_CANCEL } from './constants';
import { DonorDialog } from './DonorForm';
import Locator = require('esri/tasks/Locator');

// require('./Pins');
// const socket = require('socket.io-client')('http://localhost:3000');

interface MyProps { }
interface MyState {
    isDonor: boolean;
    donorButtonLabel: string;
    dialogBoxOpen: boolean;
    latitude: number;
    longitude: number;
    address: string;
}

class Button extends React.Component<MyProps, MyState> {

    constructor() {
        super();
        this.state = {
            isDonor: false,
            donorButtonLabel: DONOR_LABEL_ADD,
            dialogBoxOpen: false,
            address: '',
            latitude: 0,
            longitude: 0,
        };
    }

    addDonorHandler = (event) => {
        if (this.state.isDonor) {

            this.setState({
                dialogBoxOpen: true,
                address: '',
                latitude: event.mapPoint.latitude,
                longitude: event.mapPoint.longitude,
            } as MyState);

            // Set up a locator task using the world geocoding service
            const locatorTask = new Locator({
                url: 'https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer',
            });
            locatorTask.locationToAddress(event.mapPoint)
                .then((response) => {
                    // If an address is successfully found, print it to the popup's content
                    this.setState({ address: response.address.Match_addr } as MyState);
                }).otherwise((err) => {
                    // If the promise fails and no result is found, print a generic message
                    // to the popup's content
                    console.log(err);
                });
        }
    }

    closeDialogHandler = () => {
        this.setState({ dialogBoxOpen: false } as MyState);
    }

    componentWillMount() {

        view.on('click', (event) => {
            this.addDonorHandler(event);
        });
    }

    componentWillUpdate(nextProps, nextState) {
        if (!nextState.isDonor) {
            view.popup.visible = false;
        }
    }

    disableAddDonor = () => {
        this.setState({
            isDonor: false,
            donorButtonLabel: DONOR_LABEL_ADD,
        } as MyState);
    }

    enableAddDonor = () => {
        this.setState({
            isDonor: true,
            donorButtonLabel: LABEL_CANCEL,
        } as MyState);
    }

    render() {
        return (
            <div>
                <DonorDialog dialogBoxOpen={this.state.dialogBoxOpen}
                    closeDialogHandler={this.closeDialogHandler}
                    address={this.state.address}
                    latitude={this.state.latitude}
                    longitude={this.state.longitude}
                    disableAddDonor={this.disableAddDonor} />
                <RaisedButton label={this.state.donorButtonLabel} onTouchTap={() => {
                    this.state.isDonor ? this.disableAddDonor() : this.enableAddDonor();
                } } />
            </div>
        );
    }
}

export default Button;
