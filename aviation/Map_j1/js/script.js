var MAP_API = {

	AVIATION_API_URL: "http://api.aviationstack.com/v1/airports?access_key=efb8a0fa89b9b0e6547920613d5b9fd2",

	infoWindow : null,
	map : null,
	airports: null,

	initMap : function () {

		/**
		 * Initalize the map with creating it and fetching data from AviationStack
		 */

		this.buildMap();
		this.fetchData();
	},

	buildMap : function () {

		/**
		 * Initialize map and its event
		 */
		
		this.map = new google.maps.Map(document.getElementById("map"), {
			center: { lat: 48.8534, lng: 2.3488 },
    		zoom: 5,
		});
		this.map.setOptions({disableDoubleClickZoom: true})
		this.map.addListener('dblclick', (e) => {
			const coords = e.latLng.toJSON()
			const content = `<div>
				<p>Add a new airport</p>
				<form id="addAirport" style="display:flex; flex-direction: column;">
					<input type="text" id="newAirport" name="newAirport">
					<input type="text" id="lat" name="lat" value="${coords.lat}" disabled>
					<input type="text" id="lng" name="lng" value="${coords.lng}" disabled>
					<button type="submit">Add</button>
				</form>
			</div>`

			if (this.infoWindow) this.infoWindow.close()
			this.infoWindow = new google.maps.InfoWindow({
				content,
				position: coords
			})
			this.infoWindow.open({
				map: this.map
			})
			const form = document.querySelector("addAirport")
			form.addEventListener('submit', (e) => {
				e.preventDefault
				console.log('test')
			})
		})

		
	},

	fetchData : function () {

		/**
		 * Fetch data from API and append elements
		 */

		fetch(this.AVIATION_API_URL)
		.then((response) => {
			return response.json()
		})
		.then((airports) => {
			this.airports = airports.data
			this.airports.forEach((airport) => {
				this.appendElementToList(airport)
			})
		})
	},

	appendElementToList : function ( airport ) {

		/**
		 * Add an airport from data
		 */

		const airportsList = document.querySelector("#airports-list")

		const el = document.createElement('li')
		el.innerHTML = `${airport.airport_name}`
		airportsList.appendChild(el)
		el.addEventListener('click', () => {
			this.map.setCenter({ lat: parseFloat(airport.latitude), lng: parseFloat(airport.longitude)})
			this.map.zoom = 8
		})

		this.appendMarkerToMap(airport)

	},

	appendMarkerToMap: function( airport ) {

		/**
		 * Create a new Marker with custom Icon on the map
		 */

		icon = {
			url: "./img/plane.svg",
			scaledSize: new google.maps.Size(25,25),
			origin: new google.maps.Point(0,0),
			anchor: new google.maps.Point(0,0)
		}

		const marker = new google.maps.Marker({
			position: { lat: parseFloat(airport.latitude), lng: parseFloat(airport.longitude) },
			map: this.map,
			icon: icon
		})

		const contentBubble = `<div class="infoBubble">
		<p>Name : ${airport.airport_name}</p>
		<p>Country : ${airport.country_name}</p>
		<p>Latitude : ${airport.latitude}</p>
		<p>Longitude : ${airport.longitude}</p>
		</div>`

		marker.addListener('click', () => {
			if (this.infoWindow) this.infoWindow.close()
			this.infoWindow = new google.maps.InfoWindow({
				content: contentBubble
			})
			this.infoWindow.open({
				anchor: marker,
				map: this.map
			})
		})

	}
}
