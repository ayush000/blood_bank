// tslint:disable:no-require-imports
import * as React from 'react';
import Map = require('esri/Map');
import Locate = require('esri/widgets/Locate');
import MapView = require('esri/views/MapView');
import Search = require('esri/widgets/Search');
require('esri/symbols/SimpleMarkerSymbol');

function MapDiv() {
  const map = new Map({ basemap: 'streets' });

  let view = new MapView({
    container: 'viewDiv',
    map: map,
    center: [76.75110710513971, 30.716816812189858],
    zoom: 18,
  });

  view.constraints = {
    maxZoom: 18,
  };

  // Add the locate widget to the top left corner of the view  
  const locateBtn = new Locate({
    view: view,
  });
  locateBtn.startup();
  view.ui.add(locateBtn, {
    position: 'top-left',
    index: 0,
  });

  // Add the search widget to the top left corner of the view
  let searchWidget = new Search({
    sugggestionsEnabled: true,
    view: view,
  });
  searchWidget.startup();

  view.ui.add(searchWidget, {
    position: 'top-left',
    index: 0,
  });
  return (<div />);
}

export default MapDiv;
