var zoom = 17;
var center = [40.7761361, -73.9609186]; //set center coordinates
var map = L.map('map').setView(center, zoom);

//http://leaflet-extras.github.io/leaflet-providers/preview/
var provider_name = "Acetate.all";

L.tileLayer.provider(provider_name).addTo(map);

map.attributionControl.setPrefix("YUMMY MILKSHAKES!");


$( "#map_title" ).html("Where shall we get milkshakes today?");


//define marker icon using Leaflet Awesome
//(https://github.com/lvoogdt/Leaflet.awesome-markers)
//markerColor options : //['red','darkred','lightred','orange',
//'beige','green','darkgreen','lightgreen','blue','darkblue',
//'lightblue','purple','darkpurple','pink','cadetblue','white',
//'gray','lightgray','black']
//browse icons: http://fortawesome.github.io/Font-Awesome/icons/
var theIcons = L.AwesomeMarkers.icon({
  icon: 'fire',
  prefix: 'fa',
  markerColor: 'lightgray',
  iconColor: '#413D3D' //any hex color (e.g., "#FFFFFF")
});

var theMarkers = []; //array to store c_type1 markers
var all_markers = []; //array to store all markers

//build the data URL
// https://api.foursquare.com/v2/venues/explore?client_id=051BYUUU1KUVCIE42FYC43PGVH0EWMUJOTQFK1BDKZ44ERNM&client_secret=KPG50HKPTGHSARFL1ZFL03DNWJWMYVKS0M54USQKIUC34MZX&v=20130815%20&ll=40.7,-74&query=milkshake
// var URL = "https://api.foursquare.com/v2/venues/explore";
//   URL += "?";
//   URL += "client_id=";
//   URL += "051BYUUU1KUVCIE42FYC43PGVH0EWMUJOTQFK1BDKZ44ERNM"; //only return records with coordinates
//   URL += "&";
//   URL += "client_secret=";
//   URL += "KPG50HKPTGHSARFL1ZFL03DNWJWMYVKS0M54USQKIUC34MZX";
//   URL += "&";
//   URL += "&v=20130815%20&ll=40.7,-74&query=milkshake";

  // URL = encodeURI("https://api.foursquare.com/v2/venues/explore?client_id=051BYUUU1KUVCIE42FYC43PGVH0EWMUJOTQFK1BDKZ44ERNM&client_secret=KPG50HKPTGHSARFL1ZFL03DNWJWMYVKS0M54USQKIUC34MZX&v=20130815%20&ll=40.7,-74&query=milkshake");

  $.ajax({
    type: "get",
    url: "https://api.foursquare.com/v2/venues/explore?client_id=051BYUUU1KUVCIE42FYC43PGVH0EWMUJOTQFK1BDKZ44ERNM&client_secret=KPG50HKPTGHSARFL1ZFL03DNWJWMYVKS0M54USQKIUC34MZX&v=20130815%20&ll=40.7,-74&query=milkshake",
    dataType: "json"
  }).done(function(data) {
    // debugger
    for (var i = 0, len = data.response.groups[0].items.length; i < len; i++){
      place = data.response.groups[0].items[i]
      // debugger
      var popup_html = "<b>" + place.venue.name + "</b>";
      popup_html += "<br>";
      popup_html += " You can find milkshakes here! ";

      var marker;


      marker = L.marker([place.venue.location.lat, place.venue.location.lng], { icon: theIcons }).bindPopup(popup_html);
      theMarkers.push(marker); //add marker to array of c_type1 markers

      all_markers.push(marker)
    } // end of for loop
  })


  // $.ajax({
  //   type: "get",
  //   url: "https://api.foursquare.com/v2/venues/explore?client_id=051BYUUU1KUVCIE42FYC43PGVH0EWMUJOTQFK1BDKZ44ERNM&client_secret=KPG50HKPTGHSARFL1ZFL03DNWJWMYVKS0M54USQKIUC34MZX&v=20130815%20&ll=40.7,-74&query=milkshake",
  //   dataType: "json"
  // }).done(function(data) {
  //   debugger
  //   for (var i = 0, len = data.response.groups[0].items.length; i < len; i++){
  //     place = data.response.groups[0].items
  //     if(place[i].map_id == mapId) {
  //       L.mapbox.featureLayer({
  //         type: 'Feature',
  //         geometry: {
  //         type: 'Point',
  //         coordinates: [
  //           data[i].long,
  //           data[i].lat
  //         ]
  //       },
  //       properties: {
  //         description: data[i].popup_content,
  //         "marker-symbol": "star",
  //         "marker-size": "medium",
  //         "marker-color": "#B24FB8"
  //       }
  //       }).addTo(map);
  //     }
  //   } // end of for loop
  // })

// debugger

// $.getJSON(URL, function (data) {

//   var theMarkers = []; //array to store c_type1 markers
//   var all_markers = []; //array to store all markers

//   $.each(data, function(index, rec){

//     var popup_html = "<b>" + rec.complaint_type + "</b>";
//       popup_html += "<br>";
//       popup_html += rec.count + " complaint(s) at this location";

//     var marker;

//     if (rec.complaint_type==c_type1) {
//       marker = L.marker([rec.latitude, rec.longitude], { icon: c_type1_icon }).bindPopup(popup_html);
//       theMarkers.push(marker); //add marker to array of c_type1 markers
//     }
//     else {
//       marker = L.marker([rec.latitude, rec.longitude], { icon: theIcons }).bindPopup(popup_html);
//       c_type2_markers.push(marker); //add marker to array of c_type2 markers
//     }
//     all_markers.push(marker); //add marker to array of all markers
//   });


  var all_layer = L.featureGroup(all_markers);
  var theLayers = L.featureGroup(theMarkers).addTo(map); //create layer of c_type1 markers and add to map

  L.featureGroup(theMarkers).addTo(map);
  map.fitBounds(theLayers.getBounds()); //use layer of all markers to set map extent

  //create object containing c_type1 and c_type2 marker layers
  // var overlays = {};
  //   overlays[theIcons] = theLayers;

  //add layer control using above object
  L.control.layers(null,L.featureGroup(theMarkers)).addTo(map);

