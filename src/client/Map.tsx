import * as React from "react";
import Map = require('esri/Map');
import MapView = require('esri/views/MapView');

function MapDiv() {
  const map = new Map({ basemap: "streets" });

  var view = new MapView({
    container: "viewDiv",
    map: map,
  });
  return (
    <div></div >
  )
}

export default MapDiv;
