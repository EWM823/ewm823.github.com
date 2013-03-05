var myLat = 0;		//my coordinates
var myLng = 0;
var waldo_coord;		//struct of waldo's LatLng
var carmen_coord;		//struct of carmen's LatLng
var waldo_marker;		//marker of waldo's location
var carmen_marker;		//marker of carmen's location

var request_sched;
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
var stations = {"RALE": [42.395428, -71.142483, "Alewife Station", "RALE"],"RDAV": [42.39674, -71.121815, "Davis Square", "RDAV"],"RPOR": [42.3884, -71.119149, "Porter Square", "RPOR"],"RHAR": [42.373362, -71.118956, "Harvard Square", "RHAR"], "RCEN": [42.365486, -71.103802, "Central Square", "RCEN"],"RKEN": [42.36249079, -71.08617653, "Kendall/MIT", "RKEN"],"RMGH": [42.361166, -71.070628, "Charles/MGH", "RMGH"],"RPRK": [42.35639457, -71.0624242,"Park Street", "RPRK"],"RDTC": [42.355518, -71.060225, "Downtown Crossing", "RDTC"],"RSOU": [42.352271, -71.055242, "South Station", "RSOU"],"RBRO": [42.342622, -71.056967, "Broadway", "RBRO"],"RAND": [42.330154, -71.057655, "Andrew", "RAND"],"RJFK": [42.320685, -71.052391, "JFK/UMass", "RJFK"],"RSAV": [42.31129, -71.053331, "Savin Hill", "RSAV"],"RFIE": [42.300093, -71.061667, "Fields Corner", "RFIE"],"RSHA": [42.29312583, -71.06573796, "Shawmut", "RSHA"],"RASH":[42.284652, -71.064489,"Ashmont", "RASH"],"RNQU": [42.275275, -71.029583, "North Quincy", "RNQU"],"RWOL": [42.2665139, -71.0203369,"Wollaston", "RWOL"],"RQUC": [42.251809, -71.005409, "Quincy Center", "RQUC"],"RQUA":[42.233391, -71.007153, "Quincy Adams", "RQUA"],"RBRA": [42.2078543, -71.0011385, "Braintree", "RBRA"]};
var stations_marker = [];	//array of station markers
var w_and_c_marker = [];	// array of up waldo's and/or/nor carmen's markers
var stations_iw = [];		// DELETE THIS--ARRAY OF INFO WINDOWS IS UNNECESARRY
var w_and_c_iw = [];		// DELETE THIS--ARRAY OF INFO WINDOWS IS UNNECESARRY
var stations_coords = [];	// Array of stations coordinates
var stations_fork1_coords = [];		//Array of stations coordinates on left fork
var stations_fork2_coords = [];		//Array of stations coordinates on left fork
var index_of_closest;		//index of closest T Station
var closest_station;		//name of closest T Station
var shortest;				//shortest distance between me and T station
var distance = [];
var carmen_icon = 'assets/carmen.png'
var waldo_icon = 'assets/waldo.png'
var parsed_sched
function init()
{
	map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
	getMyCoordinates()
	request_w_and_c.open("GET", "http://messagehub.herokuapp.com/a3.json", true);
	request_w_and_c.send(null);
	/* get parsed locations/info of waldo and carmen sandiego */
    request_w_and_c.onreadystatechange = plot_w_and_c;
    plot_stations()
    draw_lines()
    getMyLocation()
}
			
/* get Red Line MBTA schedule information for JSON format*/
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
    		distance[i] = google.maps.geometry.spherical.computeDistanceBetween(me, curr_coords);
    		distance[i] = distance[i] / 1609.34;
    		distance[i] = Math.round(distance[i]*100)/100;
    		if (parsed_w_and_c[i].name == "Carmen Sandiego") {
    			img = carmen_icon;
    		}
    		if (parsed_w_and_c[i].name == "Waldo") {
    			img = waldo_icon;
    		}
       			curr_marker = new google.maps.Marker({
	   			position: curr_coords,
	   			title: parsed_w_and_c[i].name + '\n' + parsed_w_and_c[i].loc.note + '\n' + "Distance from you: " + distance[i],
	   			icon: img
	   		});
	   		curr_marker.setMap(map);
	   		w_and_c_marker.push(curr_marker);
           		
	   		w_and_c_marker[i] = curr_marker;  		
	   		google.maps.event.addListener(w_and_c_marker[i], 'click', function() {
					infowindow.setContent(this.title);
					infowindow.open(map, this);
	 	    });
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
   		google.maps.event.addListener(stations_marker[i], 'click', function() {
				updateSTimes(stations_marker[i])
				infowindow.setContent(this.title);
				infowindow.open(map, this);
				
  			})
  	}
}

   /*
   What I want to do: For each infowindow on the station that is opened,
   I want to get an XMLHttpRequest and parse it. Then, I want to get the information of the 
   station (use string subtract). Send it back and print within the statement (setContent)
   
   
   
      
   
     */

function updateSTimes(curr_marker) {
	request_sched = new XMLHttpRequest()
	request_sched.open("GET", "http://mbtamap-cedar.herokuapp.com/mapper/redline.json", true);
	request_sched.send(null);
	/* get parsed schedule of T arrivals and departures */
    request_sched.onreadystatechange = parse_sched		   
	
}

function parse_sched() {	
	if (request_sched.readyState==4 && request_sched.status==200) {
       	var str = request_sched.responseText;
       	parsed_sched = JSON.parse(str);
    
    console.log("success");
    }
    var temp_str;
    for (var i in stations) {
	    temp_str = parsed_sched.substr(0, 4);    	
    	if (temp_str == parsed_sched[i][3]) {
    		console.log("sucess");
    	}
    }


}		
			   
function draw_lines()
{
	for (var i in stations) {
		coord = new google.maps.LatLng(stations[i][0], stations[i][1]);
		stations_coords.push(coord);
	}
	for (i = 0; i < 17; i++) {
		stations_fork1_coords.push(stations_coords[i]);
	}
	var polyOptions = new google.maps.Polyline({
   		map: map,
	   	path: stations_fork1_coords,
   	    strokeColor: "#FF0000",
    	strokeOpacity: .6,
	    strokeWeight: 3,
        clickable: false
    });
    stations_line1 = new google.maps.Polyline(polyOptions);
    stations_line1.setMap(map);	
	stations_fork2_coords.push(stations_coords[12]);
	for (i = 17; i < 22; i++) {
		stations_fork2_coords.push(stations_coords[i]);
	}
	var polyOptions = new google.maps.Polyline({
       	map: map,
		path: stations_fork2_coords,
   	    strokeColor: "#FF0000",
 		strokeOpacity: .6,
	    strokeWeight: 3,
	    clickable: false
   	});
    stations_line2 = new google.maps.Polyline(polyOptions);
	stations_line2.setMap(map);
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

function getMyCoordinates()
{
	if (navigator.geolocation) { // the navigator.geolocation object is supported on your browser
		navigator.geolocation.getCurrentPosition(function(position) {
			myLat = position.coords.latitude;
			myLng = position.coords.longitude;
		});
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
		title: "You are here!"
	});
	marker_me.setMap(map);

	// Open info window on click of marker
	google.maps.event.addListener(marker_me, 'click', function() {
		infowindow.setContent("You are here!" + "<br />" + "Closest Station: " + closest_station + " is " + shortest + " miles from you.");
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

