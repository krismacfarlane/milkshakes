var zoom = 16;
var center = [40.7761361, -74.9609186]; //set center coordinates
var map = L.map('map').setView(center, zoom);

//http://leaflet-extras.github.io/leaflet-providers/preview/
var provider_name = "Acetate.all";

L.tileLayer.provider(provider_name).addTo(map);

map.attributionControl.setPrefix("YUMMY MILKSHAKES!");


//data URL variables
var start_date = '2014-01-01'; //YYYY-MM-DD
var end_date = '2014-10-31'; //YYYY-MM-DD
var borough = 'BRONX';
var c_type1 = 'Air Quality'; //complaint type 1
var c_type2 = 'Smoking'; //complaint type 2

$( "#map_title" ).html("Where shall we get milkshakes today?");


//define marker icon using Leaflet Awesome
//(https://github.com/lvoogdt/Leaflet.awesome-markers)
//markerColor options : //['red','darkred','lightred','orange',
//'beige','green','darkgreen','lightgreen','blue','darkblue',
//'lightblue','purple','darkpurple','pink','cadetblue','white',
//'gray','lightgray','black']
//browse icons: http://fortawesome.github.io/Font-Awesome/icons/
var c_type2_icon = L.AwesomeMarkers.icon({
  icon: 'fire',
  prefix: 'fa',
  markerColor: 'lightgray',
  iconColor: '#413D3D' //any hex color (e.g., "#FFFFFF")
});


//build the data URL
https://api.foursquare.com/v2/venues/explore?client_id=051BYUUU1KUVCIE42FYC43PGVH0EWMUJOTQFK1BDKZ44ERNM&client_secret=KPG50HKPTGHSARFL1ZFL03DNWJWMYVKS0M54USQKIUC34MZX&v=20130815%20&ll=40.7,-74&query=milkshake
var URL = "https://api.foursquare.com/v2/venues/explore";
  URL += "?";
  URL += "client_id=";
  URL += "051BYUUU1KUVCIE42FYC43PGVH0EWMUJOTQFK1BDKZ44ERNM"; //only return records with coordinates
  URL += "&";
  URL += "client_secret=";
  URL += "KPG50HKPTGHSARFL1ZFL03DNWJWMYVKS0M54USQKIUC34MZX";
  URL += "&";
  URL += "&v=20130815%20&ll=40.7,-74&query=milkshake";

  URL = encodeURI(URL);


$.getJSON(URL, function (data) {

  var c_type1_markers = []; //array to store c_type1 markers
  var c_type2_markers = []; //array to store c_type2 markers
  var all_markers = []; //array to store all markers

  $.each(data, function(index, rec){

    var popup_html = "<b>" + rec.complaint_type + "</b>";
      popup_html += "<br>";
      popup_html += rec.count + " complaint(s) at this location";

    var marker;

    if (rec.complaint_type==c_type1) {
      marker = L.marker([rec.latitude, rec.longitude], { icon: c_type1_icon }).bindPopup(popup_html);
      c_type1_markers.push(marker); //add marker to array of c_type1 markers
    }
    else {
      marker = L.marker([rec.latitude, rec.longitude], { icon: c_type2_icon }).bindPopup(popup_html);
      c_type2_markers.push(marker); //add marker to array of c_type2 markers
    }
    all_markers.push(marker); //add marker to array of all markers
  });


  var all_layer = L.featureGroup(all_markers);
  var c_type1_layer = L.featureGroup(c_type1_markers).addTo(map); //create layer of c_type1 markers and add to map
  var c_type2_layer = L.featureGroup(c_type2_markers).addTo(map); //create layer of c_type2 markers and add to map


  map.fitBounds(all_layer.getBounds()); //use layer of all markers to set map extent

  //create object containing c_type1 and c_type2 marker layers
  var overlays = {};
    overlays[c_type1] = c_type1_layer;
    overlays[c_type2] = c_type2_layer;

  //add layer control using above object
  L.control.layers(null,overlays).addTo(map);

});
