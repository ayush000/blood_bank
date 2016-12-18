import * as React from 'react';
import Map from './Map';
import Interaction from './Interaction';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import * as injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();
Map();
function App() {
  return (
    <div>
      <MuiThemeProvider>
        <Interaction />
      </MuiThemeProvider>
    </div>
  );
}

export default App;
