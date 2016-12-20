import * as React from 'react';
import * as Formsy from 'formsy-react';
import Dialog from 'material-ui/Dialog';
import FormsyText from 'formsy-material-ui/lib/FormsyText';
import RaisedButton from 'material-ui/RaisedButton';
import FormsySelect from 'formsy-material-ui/lib/FormsySelect';
import MenuItem from 'material-ui/MenuItem';
// import * as url from 'url';

import { checkStatus, parseJSON } from '../shared/commonfunction';
import { errorMessages } from './constants';

// const baseUrl: string = 'http://localhost:3000/';
interface MyProps {
    address: string;
    latitude: number;
    longitude: number;
    closeDialogHandler: Function;
    disableAddDonor: Function;
}
interface MyState { canSubmit: boolean; }
class DonorForm extends React.Component<MyProps, MyState> {
    constructor() {
        super();
        this.state = { canSubmit: false };
    }

    enableButton = () => {
        this.setState({
            canSubmit: true,
        });
    }
    disableButton = () => {
        this.setState({
            canSubmit: false,
        });
    }

    submitForm = (data) => {
        this.props.closeDialogHandler();
        // Create new donor from data entered in form
        const storeFormData = (formData, ip) => {
            const options = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...formData,
                    latitude: this.props.latitude,
                    longitude: this.props.longitude,
                    address: this.props.address,
                    ip: ip,
                }),
            };
            fetch('/donor/new', options)
                .then(checkStatus)
                .then(parseJSON)
                .then(urlresponse => {
                    this.props.disableAddDonor();
                    alert(`Donor successfully added with following properties\n
                    ${JSON.stringify(urlresponse, null, 4)}`);
                }).catch(err => {
                    console.log(err);
                })
                ;
        };
        // Get user's IP address
        fetch('http://freegeoip.net/json/')
            .then(checkStatus)
            .then(parseJSON)
            .then(ipResponse => {
                storeFormData(data, ipResponse.ip);
            }).catch(err => {
                console.log(err);
                storeFormData(data, null);
            });

    }
    notifyFormError(data) {
        console.error('Form error:', data);
    }
    render() {
        return (
            <Formsy.Form
                onValid={this.enableButton}
                onInvalid={this.disableButton}
                onValidSubmit={this.submitForm}
                onInvalidSubmit={this.notifyFormError}>
                <FormsyText
                    name="fname"
                    validations="isAlpha"
                    validationError={errorMessages.wordsError}
                    required
                    hintText="What is your first name?"
                    floatingLabelText="First name"
                    />
                <FormsyText
                    name="lname"
                    validations="isAlpha"
                    validationError={errorMessages.wordsError}
                    required
                    hintText="What is your last name?"
                    floatingLabelText="Last name"
                    />
                <FormsyText
                    name="contact"
                    validations={{
                        minLength: 7,
                        maxLength: 20,
                        matchRegexp: /(\+|00)(\d {0,1})+\d/,
                    }}
                    validationError={errorMessages.phoneError}
                    required
                    hintText="What is your contact number?"
                    floatingLabelText="Contact number"
                    />
                <FormsyText
                    name="email"
                    validations="isEmail"
                    validationError={errorMessages.emailError}
                    required
                    hintText="What is your email address?"
                    floatingLabelText="Email"
                    />
                <FormsySelect
                    name="bloodgroup"
                    required
                    floatingLabelText="Blood group">
                    <MenuItem value="A+" primaryText="A+" />
                    <MenuItem value="A-" primaryText="A-" />
                    <MenuItem value="B+" primaryText="B+" />
                    <MenuItem value="B-" primaryText="B-" />
                    <MenuItem value="O+" primaryText="O+" />
                    <MenuItem value="O-" primaryText="O-" />
                    <MenuItem value="AB+" primaryText="AB+" />
                    <MenuItem value="AB-" primaryText="AB-" />
                </FormsySelect>
                <RaisedButton
                    type="submit"
                    label="Submit"
                    disabled={!this.state.canSubmit}
                    />
            </Formsy.Form>
        );
    }
}

interface DialogProps {
    dialogBoxOpen: boolean;
    closeDialogHandler: Function;
    address: string;
    latitude: number;
    longitude: number;
    disableAddDonor: Function;
}
interface DialogState { }
class DonorDialog extends React.Component<DialogProps, DialogState> {
    render() {
        return (
            <Dialog
                contentStyle={{ width: '100%', maxWidth: '470px' }}
                autoScrollBodyContent={true}
                title={`Add as donor (${this.props.address || 'Address loading...'})`}
                modal={false}
                open={this.props.dialogBoxOpen}
                onRequestClose={() => {
                    this.props.closeDialogHandler();
                } }>
                <DonorForm address={this.props.address}
                    disableAddDonor={this.props.disableAddDonor}
                    closeDialogHandler={this.props.closeDialogHandler}
                    latitude={this.props.latitude}
                    longitude={this.props.longitude}
                    />
            </Dialog>
        );
    }
}

export { DonorForm, DonorDialog };
