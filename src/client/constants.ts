
export const DONOR_LABEL_ADD: string = 'Add donor';
export const LABEL_CANCEL: string = 'Cancel';
export const errorMessages: {
    wordsError: string,
    emailError: string,
    phoneError: string,
} = {
        wordsError: 'Please only use letters',
        emailError: 'Please provide a valid email address',
        phoneError: 'Please provide phone number in correct format(+xx xxx xxxx xxx | 00xx xxx xxxx xxx)',
    };
export const bloodGroups: Object = {
    'A+': [],
    'A-': [],
    'B+': [],
    'B-': [],
    'O+': [],
    'O-': [],
    'AB+': [],
    'AB-': [],
};
export const baseURL: string = location.origin.replace(/^https/, 'http');
