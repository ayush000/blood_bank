declare module "formsy-react" {
    const Formsy: any;
    export = Formsy;
}

declare module "formsy-material-ui/lib" {
    import * as React from "react";

    export class FormsyCheckbox extends React.Component<any, any> { }
    export class FormsyDate extends React.Component<any, any> { }
    export class FormsyRadio extends React.Component<any, any> { }
    export class FormsyRadioGroup extends React.Component<any, any> { }
    export class FormsySelect extends React.Component<any, any> { }
    export class FormsyText extends React.Component<any, any> { }
    export class FormsyTime extends React.Component<any, any> { }
    export class FormsyToggle extends React.Component<any, any> { }
}