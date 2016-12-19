// tslint:disable:no-require-imports
import * as React from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import { view } from './Map';
import { DONOR_LABEL_ADD, LABEL_CANCEL } from './constants';
import { DonorDialog } from './DonorForm';
import Locator = require('esri/tasks/Locator');

interface MyProps { }
interface MyState {
    isDonor: boolean;
    donorButtonLabel: string;
    dialogBoxOpen: boolean;
    // latitude: number;
    // longitude: number;
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
            // latitude: 0,
            // longitude: 0,
        };
    }

    addDonorHandler = (event) => {
        if (this.state.isDonor) {

            this.setState({
                dialogBoxOpen: true,
                address: '',
                // latitude: Math.round(event.mapPoint.latitude * 1000) / 1000,
                // longitude: Math.round(event.mapPoint.longitude * 1000) / 1000,
            } as MyState);

            // Set up a locator task using the world geocoding service
            const locatorTask = new Locator({
                url: 'https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer',
            });
            locatorTask.locationToAddress(event.mapPoint)
                .then((response) => {
                    // If an address is successfully found, print it to the popup's content
                    this.setState({ address: `(${response.address.Match_addr})`} as MyState);
                    console.log(response);
                }).otherwise((err) => {
                    // If the promise fails and no result is found, print a generic message
                    // to the popup's content
                   this.setState({ address: ''} as MyState);
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

    render() {
        return (
            <div>
                <DonorDialog dialogBoxOpen={this.state.dialogBoxOpen}
                    closeDialogHandler={this.closeDialogHandler}
                    address={this.state.address} />
                <RaisedButton label={this.state.donorButtonLabel} onTouchTap={() => {
                    this.setState({
                        isDonor: !this.state.isDonor,
                        donorButtonLabel: this.state.isDonor ? DONOR_LABEL_ADD : LABEL_CANCEL,
                    } as MyState);
                } } />
            </div>
        );
    }
}

export default Button;
