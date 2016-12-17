// tslint:disable:no-require-imports
import Map = require('esri/Map');
import Locate = require('esri/widgets/Locate');
import MapView = require('esri/views/MapView');
import Search = require('esri/widgets/Search');

export default function () {
  const map = new Map({ basemap: 'streets' });

  let view = new MapView({
    container: 'viewDiv',
    map: map,
    center: [76.75110710, 30.716816812],
    zoom: 18,
  });

  view.constraints = {
    maxZoom: 18,
  };
  const locateBtn = new Locate({
    view: view,
  });
  locateBtn.startup();
  view.ui.add(locateBtn, {
    position: 'top-left',
    index: 0,
  });

  let searchWidget = new Search({
    sugggestionsEnabled: true,
    view: view,
  });
  searchWidget.startup();
  view.ui.add(searchWidget, {
    position: 'top-left',
    index: 0,
  });

  console.log('1');
  view.on('layerview-create', () => {
    locateBtn.locate();
  });
}
