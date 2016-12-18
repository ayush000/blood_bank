// tslint:disable:no-require-imports
import * as React from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import { view } from './Map';
import { DONOR_LABEL_ADD, LABEL_CANCEL } from './constants';
import { DonorDialog } from './DonorForm';
// import update from 'immutability-helper';
// import Popup = require('esri/widgets/Popup');


interface MyProps { }
interface MyState {
    isDonor?: boolean;
    donorButtonLabel?: string;
    dialogBoxOpen: boolean;
    latitude: number;
    longitude: number;
}

class Button extends React.Component<MyProps, MyState> {

    constructor() {
        super();
        this.state = {
            isDonor: false,
            donorButtonLabel: DONOR_LABEL_ADD,
            dialogBoxOpen: false,
            latitude: 0,
            longitude: 0,
        };
    }

    // addDonorHandler(event) {
    //     if (this.state.isDonor) {
    //         view.popup.open({
    //             title: `[${Math.round(event.mapPoint.latitude * 1000) / 1000},
    //   ${Math.round(event.mapPoint.longitude * 1000) / 1000}] Add donor`,
    //             location: event.mapPoint,
    //             content: '<form action="/my-handling-form-page" method="post">' +
    //             '<div>' +
    //             '<label for="name">Name:</label>' +
    //             '<input type="text" id="name" name="user_name" />' +
    //             '</div>' +
    //             '<div>' +
    //             '<label for="mail">E-mail:</label>' +
    //             '<input type="email" id="mail" name="user_mail" />' +
    //             '</div>' +
    //             '<div>' +
    //             '<label for="msg">Message:</label>' +
    //             '<textarea id="msg" name="user_message"></textarea>' +
    //             '</div>' +
    //             '</form>',
    //         });
    //     }
    // }

    addDonorHandler = (event) => {
        if (this.state.isDonor) {
            this.setState({
                dialogBoxOpen: true,
                latitude: Math.round(event.mapPoint.latitude * 1000) / 1000,
                longitude: Math.round(event.mapPoint.longitude * 1000) / 1000,
            } as MyState);
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
                    latitude={this.state.latitude}
                    longitude={this.state.longitude} />
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
