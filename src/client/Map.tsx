// tslint:disable:no-require-imports
import * as React from 'react';
import Map = require('esri/Map');
import Locate = require('esri/widgets/Locate');
import MapView = require('esri/views/MapView');
import Search = require('esri/widgets/Search');
// import SimpleMarkerSymbol = require('esri/symbols/SimpleMarkerSymbol');
// import Graphic = require('esri/Graphic');
// import Point = require('esri/geometry/Point');

interface MyProps { }
interface MyState { }
class MapDiv extends React.Component<MyProps, MyState> {
  render() {
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

    // const point = new Point({
    //   longitude: 76.45110710513971,
    //   latitude: 30.316816812189858,
    // }),
    //   markerSymbol = new SimpleMarkerSymbol({
    //     style: 'square',
    //     size: '20px',
    //     color: 'blue',
    //   }),
    //   pointGraphic = new Graphic({
    //     geometry: point,
    //     symbol: markerSymbol,
    //     visible: true,
    //   });

    // view.graphics.add(pointGraphic);

    view.on('layerview-create', () => {
      locateBtn.locate();
    });
    // view.ui.add(symbol, {
    //   position: 'top-left',
    //   index: 0,
    // });
    return (<div />);
  }
}

export default MapDiv;
