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
			var marker;
			var infowindow = new google.maps.InfoWindow();
			var places;

			function init()
			{
				map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
				getMyLocation();
				request_sched.open("GET", "http://mbtamap-cedar.herokuapp.com/mapper/redline.json", true);
				request_sched.send(null);
                request_sched.onreadystatechange = parse_sched;
				request_w_and_c.open("GET", "http://messagehub.herokuapp.com/a3.json", true);
				request_w_and_c.send(null);
                request_w_and_c.onreadystatechange = parse_waldo_and_carmen;
			}
			
			function parse_sched()
			{
				if (request_sched.status == 0) {
                    alert("File failed to load.");
                }
                if (request_sched.readyState==4 && request_sched.status==200) {
                	var str = request_sched.responseText;
                	parsed = JSON.parse(str);
                }
            }

			function parse_w_and_c()
			{
				if (request_w_and_c.status == 0) {
                    alert("File failed to load.");
            	}
            	if (request_w_and_c.readyState==4 && request_w_and_c.status==200) {
            	    var str = request_w_and_c.responseText;
                	parsed = JSON.parse(str);
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
				marker = new google.maps.Marker({
					position: me,
					title: "Here I Am!"
				});
				marker.setMap(map);

				// Open info window on click of marker
				google.maps.event.addListener(marker, 'click', function() {
					infowindow.setContent(marker.title);
					infowindow.open(map, marker);
				});

			}

			function createMarker(place)
			{
				var placeLoc = place.geometry.location;
				var marker = new google.maps.Marker({
					map: map,
					position: place.geometry.location
				});

				google.maps.event.addListener(marker, 'click', function() {
					infowindow.close();
					infowindow.setContent(place.name);
					infowindow.open(map, this);
				});
      		}
      		
