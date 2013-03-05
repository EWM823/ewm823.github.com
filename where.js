var myLat = 0;		//my coordinates
var myLng = 0;
var waldo_coord;		//struct of waldo's LatLng
var carmen_coord;		//struct of carmen's LatLng
var waldo_marker;		//marker of waldo's location
var carmen_marker;		//marker of carmen's location

var request_sched = new XMLHttpRequest();
var request_w_and_c = new XMLHttpRequest();

var parsed_w_and_c;		//parsed JSON object for waldo and carmen
			
var me = new google.maps.LatLng(myLat, myLng);	//my coordinates
var myOptions = {
	zoom: 11, // The larger the zoom number, the bigger the zoom
	center: me,
	mapTypeId: google.maps.MapTypeId.ROADMAP
};
var map;										//the map
var marker_me;									//my marker
var infowindow = new google.maps.InfoWindow();	//the one infowindow that shows up
var places;
// the struct of all the stations
var stations = {"RALE": [42.395428, -71.142483, "Alewife Station"],"RDAV": [42.39674, -71.121815, "Davis Square"],"RPOR": [42.3884, -71.119149, "Porter Square "],"RHAR": [42.373362, -71.118956, "Harvard Square"],"RCEN": [42.365486, -71.103802, "Central Square"],"RKEN": [42.36249079, -71.08617653, "Kendall/MIT"],"RMGH": [42.361166, -71.070628, "Charles/MGH"],"RPRK": [42.35639457, -71.0624242,"Park Street"],"RDTC": [42.355518, -71.060225, "Downtown Crossing"],"RSOU": [42.352271, -71.055242, "South Station"],"RBRO": [42.342622, -71.056967, "Broadway"],"RAND": [42.330154, -71.057655, "Andrew"],"RJFK": [42.320685, -71.052391, "JFK/UMass"],"RSAV": [42.31129, -71.053331, "Savin Hill"],"RFIE": [42.300093, -71.061667, "Fields Corner"],"RSHA": [42.29312583, -71.06573796, "Shawmut"],"RASH":[42.284652, -71.064489,"Ashmont"],"RNQU": [42.275275, -71.029583, "North Quincy"],"RWOL": [42.2665139, -71.0203369,"Wollaston"],"RQUC": [42.251809, -71.005409, "Quincy Center"],"RQUA":[42.233391, -71.007153, "Quincy Adams"],"RBRA": [42.2078543, -71.0011385, "Braintree"]};
var stations_marker = [];	//array of station markers
var w_and_c_marker = [];	// array of up waldo's and/or/nor carmen's markers
var stations_iw = [];		// DELETE THIS--ARRAY OF INFO WINDOWS IS UNNECESARRY
var w_and_c_iw = [];		// DELETE THIS--ARRAY OF INFO WINDOWS IS UNNECESARRY
var stations_coords = [];	// Array of stations coordinates
var index_of_closest;		//index of closest T Station
var closest_station;		//name of closest T Station
var shortest;


function init()
{
	map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
	request_w_and_c.open("GET", "http://messagehub.herokuapp.com/a3.json", true);
	request_w_and_c.send(null);
	/* get parsed locations/info of waldo and carmen sandiego */
    request_w_and_c.onreadystatechange = plot_w_and_c;
	request_sched.open("GET", "http://mbtamap-cedar.herokuapp.com/mapper/redline.json", true);
	request_sched.send(null);
	/* get parsed schedule of T arrivals and departures */
    request_sched.onreadystatechange = parse_sched;	
    plot_stations()
    draw_lines()
    getMyLocation()
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
	   		google.maps.event.addListener(w_and_c_marker[i], 'click', (function() {
					infowindow.setContent(this.title);
					infowindow.open(map, this);
	 	    }));
		}
	}
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
   		google.maps.event.addListener(stations_marker[i], 'click', (function() {
				infowindow.setContent(this.title);
				infowindow.open(map, this);
  			}))
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


	// Find distance between me and closest T Station
	findClosestStation()
	
	// Create a marker	
	marker_me = new google.maps.Marker({
		position: me,
		title: "Here I Am!"
	});
	marker_me.setMap(map);

	// Open info window on click of marker
	google.maps.event.addListener(marker_me, 'click', function() {
		infowindow.setContent(<p> + "Closest Station: " + closest_station + " is " + shortest + " miles from you." </p>);
		infowindow.open(map, this);
	});

}
function findClosestStation()
{
	shortest = google.maps.geometry.spherical.computeDistanceBetween(me, stations_coords[0]);
	closest_station = 'Alewife Station'; //Set equal to First station in array
	for (var i in stations) {
		var coord = new google.maps.LatLng(stations[i][0], stations[i][1]);
		if (google.maps.geometry.spherical.computeDistanceBetween(me, coord) < shortest) {
			shortest = google.maps.geometry.spherical.computeDistanceBetween(me, coord);
			closest_station = stations[i][2];
		}
	}
	shortest = shortest / 1609.34;
	shortest = Math.round(shortest*100)/100;
}