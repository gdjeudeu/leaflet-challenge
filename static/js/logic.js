var myMap = L.map("map", {
  center: [36.77, -119.41],
  zoom: 5
  });


L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 512,
  maxZoom: 18,
  zoomOffset: -1,
  id: "mapbox/streets-v11",
  accessToken: API_KEY
}).addTo(myMap);


var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"


d3.json(url, function(data) {
  function styleInfo(feature) {
    return {
      opacity: 1,
      fillOpacity: 1,
      fillColor: chooseColor(feature.properties.mag),
      color: "#000000",
      radius: markerSize(feature.properties.mag),
      stroke: true,
      weight: 0.5
    };
  };

  function markerSize(magnitude) {
    if (magnitude === 0) {
      return 1;
    }
    return magnitude * 3;
  };

  function chooseColor(magnitude) {
    switch (true) {
    case magnitude > 5:
      return "#581845";
    case magnitude > 4:
      return "#900C3F";
    case magnitude > 3:
      return "#C70039";
    case magnitude > 2:
      return "#FF5733";
    case magnitude > 1:
      return "#FFC300";
    default:
      return "#DAF7A6";
    }
  };




  L.geoJSON(data, {
    pointToLayer: function(feature, latlng) {
      return L.circleMarker(latlng);
    },
    style: styleInfo,
    onEachFeature: function(feature, layer) {

      layer.bindPopup("<h3>" + feature.properties.place + "</h3><hr><p>" + 
      new Date(feature.properties.time) + "</p><hr><p><strong>Magnitude: </strong>" + 
      feature.properties.mag + "</p>");
    }
  }).addTo(myMap);

  var legend = L.control({ position: "bottomright" });
  legend.onAdd = function() {
    var div = L.DomUtil.create("div", "info legend"),
    magnitudeLevels = [0, 1, 2, 3, 4, 5];
    div.innerHTML += "<h3>Magnitude</h3>"
    for (var i = 0; i < magnitudeLevels.length; i++) {
      div.innerHTML +=
          '<i style="background: ' + chooseColor(magnitudeLevels[i] + 1) + '"></i> ' +
          magnitudeLevels[i] + (magnitudeLevels[i + 1] ? '&ndash;' + magnitudeLevels[i + 1] + '<br>' : '+');
    }
    return div;
  };
  legend.addTo(myMap);
});