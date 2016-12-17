import * as React from "react";
import Map = require('esri/Map');
import SceneView = require('esri/views/SceneView');

function MapDiv() {
  const map = new Map({ basemap: "streets" });

  var view = new SceneView({
    container: "viewDiv",
    map: map,
    scale: 50000000,
    center: [-101.17, 21.78]
  });
  return (
    <div></div >
  )
}

export default MapDiv;
