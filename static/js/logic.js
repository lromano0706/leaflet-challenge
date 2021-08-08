// Creating map object
var myMap = L.map("map", {
  center: [39, -98],
  zoom: 3
});

// Create the tile layer that will be the background of our map
var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "light-v10",
  accessToken: API_KEY
}).addTo(myMap);


// This function determines the colo
function chooseColor(depth) {
  switch (true) {
    case depth >= 200:
      return "#FF0000";
    case depth >= 100:
      return "#FFA500";
    case depth >= 20:
      return "#FFD700";
    case depth >= 15:
      return "#FFFF00";
    case depth >= 5:
      return "#32CD32";
    case depth >= 0:
      return "#00FF00";
    case depth < 0:
      return "#ADFF2F";
    default:
      return "black";
  }
};



// Use this link to get the geojson data.
var geoData = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Perform an API call to the Earthquake.usgs.gov  API to get earthquake information. Call function when complete
d3.json(geoData).then(function (data) {
  console.log(data.features)
  var depthReading = []
  maxMag = (data.features).forEach(function (feature) { depthReading.push(feature.geometry.coordinates[2]) });
  var min = Math.min.apply(null, depthReading);
  var max = Math.max.apply(null, depthReading);
  console.log(min);
  console.log(max);
  // Marker Formatting  
  function markerOptions(feature) {
    return {
      radius: (feature.properties.mag) * 4,
      fillColor: chooseColor(feature.geometry.coordinates[2]),
      color: "white",
      weight: .5,
      opacity: 1,
      fillOpacity: 0.8
    }
  };



  // Creating a geoJSON layer with the retrieved data
  L.geoJSON(data, {
    pointToLayer: function (feature, latlng) {
      return L.circleMarker(latlng);
    },

    style: markerOptions,

    onEachFeature: function (feature, layer) {
      layer.bindPopup(feature.properties.place + "<hr> Magnitude: " + feature.properties.mag + "<br> Depth: " + feature.geometry.coordinates[2])
    }
  }).addTo(myMap);

  // Set up the legend
  var legend = L.control({ position: "bottomright" });
  legend.onAdd = function () {
    var div = L.DomUtil.create("div", "info legend");
    var limits = [0, 1, 2, 3, 4, 5, 6];
    var colors = ["#ADFF2F", "#00FF00", "#32CD32", "#FFFF00", "#FFD700", "#FFA500","#FF0000"];
    var labels = [];

    // Add min & max
    var legendInfo = "<h1>Earth Quake Depth</h1>" +
      "<div class=\"labels\">" +
      "<div class=\"min\">" + "-5" + "</div>" +
      "<div class=\"max\">" + ">200" + "</div>" +
      "</div>";

    div.innerHTML = legendInfo;

    limits.forEach(function (limit, index) {
      labels.push("<li style=\"background-color: " + colors[index] + "\"></li>");
    });

    div.innerHTML += "<ul>" + labels.join("") + "</ul>";
    return div;
  };

  // Adding legend to the map
  legend.addTo(myMap);
});


















