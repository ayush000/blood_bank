import * as React from 'react';
import Map from './Map';
import AddDonorButton from './AddDonorButton';
// import UpdateDonorButton from './UpdateDonorButton';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import * as injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();
Map();
function App() {
  return (
    <div>
      <MuiThemeProvider>
        <AddDonorButton />
      </MuiThemeProvider>
    </div>
  );
}

export default App;
