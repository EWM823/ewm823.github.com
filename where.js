var myLat = 0;
var myLng = 0;
var waldo_coord;
var carmen_coord;
var waldo_marker;
var carmen_marker;
var request_sched = new XMLHttpRequest();
var request_w_and_c = new XMLHttpRequest();

var parsed_w_and_c;
			
var me = new google.maps.LatLng(myLat, myLng);
var myOptions = {
	zoom: 13, // The larger the zoom number, the bigger the zoom
	center: me,
	mapTypeId: google.maps.MapTypeId.ROADMAP
};
var map;
var marker_me;
var infowindow = new google.maps.InfoWindow();
var places;
var stations = {"RALE": [42.395428, -71.142483, "Alewife Station"],"RDAV": [42.39674, -71.121815, "Davis Square"],"RPOR": [42.3884, -71.119149, "Porter Square "],"RHAR": [42.373362, -71.118956, "Harvard Square"],"RCEN": [42.365486, -71.103802, "Central Square"],"RKEN": [42.36249079, -71.08617653, "Kendall/MIT"],"RMGH": [42.361166, -71.070628, "Charles/MGH"],"RPRK": [42.35639457, -71.0624242,"Park Street"],"RDTC": [42.355518, -71.060225, "Downtown Crossing"],"RSOU": [42.352271, -71.055242, "South Station"],"RBRO": [42.342622, -71.056967, "Broadway"],"RAND": [42.330154, -71.057655, "Andrew"],"RJFK": [42.320685, -71.052391, "JFK/UMass"],"RSAV": [42.31129, -71.053331, "Savin Hill"],"RFIE": [42.300093, -71.061667, "Fields Corner"],"RSHA": [42.29312583, -71.06573796, "Shawmut"],"RASH":[42.284652, -71.064489,"Ashmont"],"RNQU": [42.275275, -71.029583, "North Quincy"],"RWOL": [42.2665139, -71.0203369,"Wollaston"],"RQUC": [42.251809, -71.005409, "Quincy Center"],"RQUA":[42.233391, -71.007153, "Quincy Adams"],"RBRA": [42.2078543, -71.0011385, "Braintree"]};
var stations_marker = [];
var w_and_c_marker = [];
var stations_iw = [];
var w_and_c_iw = [];
var stations_coords = [];
var infowindow = new google.maps.InfoWindow();
			
function init()
{
	map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
	getMyLocation();
	request_sched.open("GET", "http://mbtamap-cedar.herokuapp.com/mapper/redline.json", true);
	request_sched.send(null);
	/* get parsed schedule of T arrivals and departures */
    request_sched.onreadystatechange = parse_sched;
	request_w_and_c.open("GET", "http://messagehub.herokuapp.com/a3.json", true);
	request_w_and_c.send(null);
	/* get parsed locations/info of waldo and carmen sandiego */
    request_w_and_c.onreadystatechange = plot_w_and_c;
    plot_stations()
    draw_lines()
}
			
/* get Red Line MBTA schedule information for JSON format*/
function parse_sched()
{
	if (request_sched.readyState==4 && request_sched.status==200) {
       	var str = request_sched.responseText;
       	parsed_sched = JSON.parse(str);
    }
}
/* find location of waldo and carmen from JSON format*/
function plot_w_and_c()
{
	if (request_w_and_c.status == 0) {
        alert("File failed to load.");
   	}
   	if (request_w_and_c.readyState==4 && request_w_and_c.status==200) {
   	    var str = request_w_and_c.responseText;
       	parsed_w_and_c = JSON.parse(str);
             	
       	var curr_marker;           	
		var curr_coords; 
									
    	for (i=0; i < parsed_w_and_c.length; i++) {
	      	curr_coords = new google.maps.LatLng(parsed_w_and_c[i].loc.latitude, parsed_w_and_c[i].loc.longitude);        		        		
   			curr_marker = new google.maps.Marker({
	   			position: curr_coords,
	   			title: parsed_w_and_c[i].name + '\n' + parsed_w_and_c[i].loc.note,
	   			icon: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
	   		});
	   		curr_marker.setMap(map);
	   		w_and_c_marker.push(curr_marker);
           		
	   		w_and_c_marker[i] = curr_marker;  		
	   		google.maps.event.addListener(w_and_c_marker[i], 'click', (function(i) {
				return function () {
					w_and_c_iw[i] = new google.maps.InfoWindow({content: w_and_c_marker[i].title});
					w_and_c_iw[i].setContent(w_and_c_marker[i].title);
  					w_and_c_iw[i].open(map, w_and_c_marker[i]);
 	  			}
	 	    })(i));
		}
	}
}
function haversine()
{
	var R = 6371; // km
	var dLat = (lat2-lat1).toRad();
	var dLon = (lon2-lon1).toRad();
	var lat1 = lat1.toRad();
	var lat2 = lat2.toRad();

	var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
	        Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2); 
	var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
	var d = R * c;
}

function plot_stations() {
	var curr_marker;           	
	var curr_station;
    for (var i in stations) {
					
       	curr_station = new google.maps.LatLng(stations[i][0], stations[i][1]);        		        		
		curr_marker = new google.maps.Marker({
    		position: curr_station,
    		title: stations[i][2],
   			icon: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png'
   		});
   		curr_marker.setMap(map);	
   		stations_marker.push(curr_marker);
            		            		
 		stations_marker[i] = curr_marker;  		
   		google.maps.event.addListener(stations_marker[i], 'click', (function(i) {
			return function () {
				
				infowindow.close(this.title);
				infowindow.open(map, this);
//				stations_iw[i] = new google.maps.InfoWindow({content: stations_marker[i].title});
  // 				stations_iw[i].setContent(stations_marker[i].title);
   	//			stations_iw[i].open(map, stations_marker[i]);
  			}
		})(i));
   	}
}
			   
function draw_lines()
{
	for (var i in stations) {
		coord = new google.maps.LatLng(stations[i][0], stations[i][1]);
		stations_coords.push(coord);
	}
	var polyOptions = new google.maps.Polyline({
       	map: map,
    	path: stations_coords,
   	    strokeColor: "#FF0000",
    	strokeOpacity: .6,
	    strokeWeight: 3,
        clickable: false
    });
    stations_line = new google.maps.Polyline(polyOptions);
		stations_line.setMap(map);
}

/* uses navigator.geolocation to find my location */
function getMyLocation()
{
	if (navigator.geolocation) { // the navigator.geolocation object is supported on your browser
		navigator.geolocation.getCurrentPosition(function(position) {
			myLat = position.coords.latitude;
			myLng = position.coords.longitude;
			renderMap();
		});
	}
	else {
		alert("Geolocation is not supported by your browser.");
	}
}
/* renders map to go to my position */
function renderMap()
{
	me = new google.maps.LatLng(myLat, myLng);

	// Update map and go there...
	map.panTo(me);

	// Create a marker
	marker_me = new google.maps.Marker({
		position: me,
		title: "Here I Am!"
	});
	marker_me.setMap(map);

	// Open info window on click of marker
	google.maps.event.addListener(marker_me, 'click', function() {
		infowindow.setContent(marker_me.title);
		infowindow.open(map, marker_me);
	});

}

function createMarker(place)
{
	var placeLoc = place.geometry.location;
	var marker_me = new google.maps.Marker({
		map: map,
		position: place.geometry.location
	});

	google.maps.event.addListener(marker_me, 'click', function() {
		infowindow.close();
		infowindow.setContent(place.name);
		infowindow.open(map, this);
	});
}