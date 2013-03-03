			var myLat = 0;
			var myLng = 0;
			var request_sched = new XMLHttpRequest();
			var request_w_and_c = new XMLHttpRequest();
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
			var stations = [{"RALE": "Alewife Station", "42.395428,-71.14248"}, {"RDAV": "Davis Square", "42.39674,-71.121815"}, {"RPOR": "Porter Square", "42.3884,-71.119149"}, {"RHAR": "Harvard Square", "42.373362,-71.118956"}, {"RCEN": "Central Square", "42.365486,-71.103802"}, {"RKEN": "Kendall/MIT", "42.36249079,-71.08617653"}, {"RMGH": "Charles MGH", "42.361166,-71.070628"}}, {"RPRK": "Park Street Station", "42.35639457,-71.0624242"}, {"RDTC": "Downtown Crossing Station", "42.355518,-71.060225"}, {"RSOU": "South Station", "42.352271,-71.055242"}, {"RBRO": "Broadway Station", "42.342622,-71.056967"}, {"RAND": "Andrew Station", "42.330154,-71.057655"}, {"RJFK": "JFK Station", "42.320685,-71.052391"}, {"RSAV": "Savin Hill Station", "42.31129,-71.053331"}, {"RFIE": "Fields Station", "42.300093,-71.061667"}, {"RSHA": "Shawmut Station", "42.29312583,-71.06573796"}, {"RASH": "Ashmont Station", "42.284652,-71.064489"}, {"RNQU": "North Quincy Station", "42.275275,-71.029583"}, {"RWOL": "Wollaston Station", "42.2665139,-71.0203369"}, {"RQUC": "Quincy Center Station", "42.251809,-71.005409"}, {"RQUA": "Quincy Adams Station", "42.233391,-71.007153"}, {"RBRA": "Braintree Station", "42.2078543,-71.0011385"}];
			function init()
			{
				map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
				getMyLocation();
				request_sched.open("GET", "http://mbtamap-cedar.herokuapp.com/mapper/redline.json", true);
				request_sched.send(null);
                request_sched.onreadystatechange = parse_sched;
				request_w_and_c.open("GET", "http://messagehub.herokuapp.com/a3.json", true);
				request_w_and_c.send(null);
                request_w_and_c.onreadystatechange = parse_w_and_c;
                parse_stations;
			}
			/* get Red Line MBTA schedule information */

			function parse_stations()
			{
				parsed_stations = JSON.parse(stations);
			}
			function parse_sched()
			{
                if (request_sched.readyState==4 && request_sched.status==200) {
                	var str = request_sched.responseText;
                	parsed_sched = JSON.parse(str);
                }
            }
            /* find location of waldo and carmen */
			function parse_w_and_c()
			{
				if (request_w_and_c.status == 0) {
                    alert("File failed to load.");
            	}
            	if (request_w_and_c.readyState==4 && request_w_and_c.status==200) {
            	    var str = request_w_and_c.responseText;
                	parsed_w_and_c = JSON.parse(str);
                }
            }

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
					alert("Geolocation is not supported by your web browser.  What a shame!");
				}
			}

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
      		
