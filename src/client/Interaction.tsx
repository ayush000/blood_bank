// tslint:disable:no-require-imports
import * as React from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import { view } from './Map';
import { DONOR_LABEL_ADD, LABEL_CANCEL } from './constants';
// import Popup = require('esri/widgets/Popup');


interface MyProps { }
interface MyState { isDonor: boolean; donorButtonLabel: string; }

class Button extends React.Component<MyProps, MyState> {

    constructor() {
        super();
        this.state = {
            isDonor: false,
            donorButtonLabel: DONOR_LABEL_ADD,
        };
    }

    addDonorHandler(event) {
        if (this.state.isDonor) {
            console.log('adsfdasf');
            console.log(event);
            view.popup.open({
                title: `[${Math.round(event.mapPoint.latitude * 1000) / 1000},
      ${Math.round(event.mapPoint.longitude * 1000) / 1000}] Add donor`,
                location: event.mapPoint,
                content: 'Nothing',
            });
        }
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
                <RaisedButton label={this.state.donorButtonLabel} onTouchTap={() => {
                    this.setState({ isDonor: !this.state.isDonor, donorButtonLabel: this.state.isDonor ? DONOR_LABEL_ADD : LABEL_CANCEL });
                } } />
            </div>
        );
    }
}

export default Button;
