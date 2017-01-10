import * as React from 'react';
import * as Formsy from 'formsy-react';
import Dialog from 'material-ui/Dialog';
import FormsyText from 'formsy-material-ui/lib/FormsyText';
import RaisedButton from 'material-ui/RaisedButton';
import FormsySelect from 'formsy-material-ui/lib/FormsySelect';
import MenuItem from 'material-ui/MenuItem';
import { Table, TableBody, TableRow, TableRowColumn } from 'material-ui/Table';

import { checkStatus, parseJSON } from '../shared/commonfunction';
import { baseURL, errorMessages, bloodGroups } from './constants';

interface MyProps {
    address: string;
    latitude: number;
    longitude: number;
    closeDialogHandler: Function;
    disableAddDonor: Function;
    openSuccessDialogBox: Function;
    submitForm: Function;
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


    notifyFormError(data) {
        console.log('Form error:', data);
    }
    render() {
        return (
            <Formsy.Form
                onValid={this.enableButton}
                onInvalid={this.disableButton}
                onValidSubmit={(data) => { this.props.submitForm(data); }}
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
                    value=""
                    required
                    floatingLabelText="Blood group">
                    {Object.keys(bloodGroups).map((bg) => {
                        return (<MenuItem value={bg} primaryText={bg} key={bg} />);
                    })}
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
interface DialogState {
    successDialogBoxOpen: boolean;
    name: string;
    bloodgroup: string;
    email: string;
    contact: string;
    address: string;
    ip: string;
    id: string;

}
class DonorDialog extends React.Component<DialogProps, DialogState> {
    constructor() {
        super();
        this.state = {
            successDialogBoxOpen: false,
            name: '',
            bloodgroup: '',
            email: '',
            contact: '',
            address: '',
            ip: '',
            id: '',
        };
    }
    closeSuccessDialogBox = () => {
        this.setState({ successDialogBoxOpen: false } as DialogState);
    }
    openSuccessDialogBox = () => {
        this.setState({ successDialogBoxOpen: true } as DialogState);
    }

    submitForm = async (data) => {
        this.props.closeDialogHandler();
        let ip: string | null;
        try {
            ip = (await parseJSON(checkStatus(await fetch('http://freegeoip.net/json/')))).ip;
        } catch (err) {
            console.log(err);
            ip = null;
        }
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                ...data,
                latitude: this.props.latitude,
                longitude: this.props.longitude,
                address: this.props.address,
                ip: ip,
            }),
        };
        try {
            const urlresponse: any = await parseJSON(checkStatus(await fetch('/donor/new', options)));
            this.setState({
                name: `${urlresponse.name.first} ${urlresponse.name.last}`,
                bloodgroup: urlresponse.bloodgroup,
                email: urlresponse.email,
                contact: urlresponse.contact,
                address: urlresponse.address,
                ip: urlresponse.ip,
                id: urlresponse._id,
            } as DialogState);
            this.props.disableAddDonor();
        } catch (err) {
            // TODO: Show error dialog
            console.log(err);
        }
    }
    render() {
        return (
            <div>
                <Dialog
                    contentStyle={{ width: '100%', maxWidth: '470px' }}
                    autoScrollBodyContent={true}
                    title={`Add as donor (${this.props.address || 'Address loading...'})`}
                    modal={false}
                    open={this.props.dialogBoxOpen}
                    onRequestClose={() => {
                        this.props.closeDialogHandler();
                    }}>
                    <DonorForm address={this.props.address}
                        disableAddDonor={this.props.disableAddDonor}
                        closeDialogHandler={this.props.closeDialogHandler}
                        openSuccessDialogBox={this.openSuccessDialogBox}
                        latitude={this.props.latitude}
                        longitude={this.props.longitude}
                        submitForm={this.submitForm}
                    />
                </Dialog>
                <Dialog
                    contentStyle={{ width: '100%', maxWidth: '470px' }}
                    autoScrollBodyContent={true}
                    title={`Congratulations. You registered`}
                    modal={false}
                    open={this.state.successDialogBoxOpen}
                    onRequestClose={this.closeSuccessDialogBox}>
                    <Table selectable={false}>
                        <TableBody displayRowCheckbox={false}>
                            <TableRow>
                                <TableRowColumn>Name</TableRowColumn>
                                <TableRowColumn>{this.state.name}</TableRowColumn>
                            </TableRow>
                            <TableRow>
                                <TableRowColumn>Blood group</TableRowColumn>
                                <TableRowColumn>{this.state.bloodgroup}</TableRowColumn>
                            </TableRow>
                            <TableRow>
                                <TableRowColumn>Email</TableRowColumn>
                                <TableRowColumn>{this.state.email}</TableRowColumn>
                            </TableRow>
                            <TableRow>
                                <TableRowColumn>Contact</TableRowColumn>
                                <TableRowColumn>{this.state.contact}</TableRowColumn>
                            </TableRow>
                            <TableRow>
                                <TableRowColumn>Address</TableRowColumn>
                                <TableRowColumn>{this.state.address}</TableRowColumn>
                            </TableRow><TableRow>
                                <TableRowColumn>IP Address</TableRowColumn>
                                <TableRowColumn>{this.state.ip}</TableRowColumn>
                            </TableRow>
                        </TableBody>
                    </Table>
                    To edit your listing, goto <a href={`${baseURL}/donor/edit/${this.state.id}`}>
                        {`${baseURL}/donor/edit/${this.state.id}`}</a>.
                </Dialog>
            </div >
        );
    }
}

export { DonorForm, DonorDialog };
