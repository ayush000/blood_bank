import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { view } from './Map';

import App from './App';

const node = document.createElement('div');
view.ui.add(node, 'bottom-right');
ReactDOM.render(
    <App />,
    node,
);
