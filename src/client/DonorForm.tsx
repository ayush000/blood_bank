import * as React from 'react';
import * as Formsy from 'formsy-react';
import Dialog from 'material-ui/Dialog';
import FormsyText from 'formsy-material-ui/lib/FormsyText';
import RaisedButton from 'material-ui/RaisedButton';
import FormsySelect from 'formsy-material-ui/lib/FormsySelect';
import MenuItem from 'material-ui/MenuItem';
import { errorMessages } from './constants';

interface MyProps { }
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
    submitForm(data) {
        alert(JSON.stringify(data, null, 4));
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
                    validations="isWords"
                    validationError={errorMessages.wordsError}
                    required
                    hintText="What is your first name?"
                    floatingLabelText="First name"
                    />
                <FormsyText
                    name="lname"
                    validations="isWords"
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
    latitude: number;
    longitude: number;
}
interface DialogState { }
class DonorDialog extends React.Component<DialogProps, DialogState> {
    render() {
        return (
            <Dialog
                contentStyle={{ width: '100%', maxWidth: '470px' }}
                autoScrollBodyContent={true}
                title={`(${this.props.latitude},${this.props.longitude}) Add as donor`}
                modal={false}
                open={this.props.dialogBoxOpen}
                onRequestClose={() => {
                    this.props.closeDialogHandler();
                } }>
                <DonorForm />
            </Dialog>
        );
    }
}
export { DonorForm, DonorDialog };
