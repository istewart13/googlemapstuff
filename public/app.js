var Map = function(latLng, zoom) {
  this.googleMap = new google.maps.Map(document.getElementById('map'), {
      center: latLng, 
      zoom: zoom
  });

  this.addMarker = function(latLng, title) {
    var marker = new google.maps.Marker({
      position: latLng,
      map: this.googleMap,
      title:title
  });
    return marker;
}

this.addInfoWindow = function(latLng, title) {
    var marker = this.addMarker(latLng);
    var infoWindow = new google.maps.InfoWindow({
        content: title
    })
    infoWindow.open(this.map, marker);
}
}

window.onload = function () {
    var url = 'https://restcountries.eu/rest/v1'
    var request = new XMLHttpRequest();
    request.open("GET", url);
    request.onload = function () {
        if (request.status === 200) {
            var jsonString = request.responseText;
            var countries = JSON.parse(jsonString);
            main(countries);
        }
    }
    request.send();

};

var main = function (countries) {
    populateSelect(countries);
    var cached = localStorage.getItem("selectedCountry");
    var selected = countries[0];
    if(cached){
        selected = JSON.parse(cached);
        document.querySelector('#countries').selectedIndex = selected.index;
    }
    updateDisplay(selected);
    document.querySelector('#info').style.display = 'block';
    
    var button = document.getElementById('btn');
    console.log(button);
    var locator = new GeoLocator(map);
    button.onclick = function(){ locator.setCenter() };
}

var GeoLocator = function(map) {
  this.map = map;
  this.setCenter = function() {
    navigator.geolocation.getCurrentPosition(function(response) { 
      var pos = { lat: response.coords.latitude, lng: response.coords.longitude }
      console.log(this.map);
      this.map.googleMap.panTo(pos);
  }.bind(this))
}
}

var populateSelect = function (countries) {
    var parent = document.querySelector('#countries');
    countries.forEach(function (item, index) {
        item.index = index;
        var option = document.createElement("option");
        option.value = index.toString();
        option.text = item.name;
        parent.appendChild(option);
    });
    parent.style.display = 'block';
    parent.addEventListener('change', function (e) {
        var index = this.value;
        var country = countries[index];
        updateDisplay(country);
        localStorage.setItem("selectedCountry",JSON.stringify(country));
        setupMap(country);
    });
}

var updateDisplay = function (lala) {
    var tags = document.querySelectorAll('#info p');
    tags[0].innerText = lala.name;
    tags[1].innerText = lala.population;
    tags[2].innerText = lala.capital;
}

var setupMap = function(country) {
    var lat = country.latlng[0];
    var lng = country.latlng[1];
    var area = country.area;
    var center = {lat: lat, lng: lng};
    var countryInfo = country.name + "  -  " + country.population + "  -  " + country.capital;

    switch(true) {
        case (area <100):
        createMap(center, 13, countryInfo);
        break;
        case (area <1000):
        createMap(center, 10, countryInfo);
        break;
        case (area <10000):
        createMap(center, 8, countryInfo);
        break;
        case (area <100000):
        createMap(center, 7, countryInfo);
        break;
        case (area <250000):
        createMap(center, 5, countryInfo);
        break;
        case (area >250000):
        createMap(center, 3, countryInfo);
        break;
    }
}

var createMap = function(center, zoomLevel, countryInfo) {
    var map = new Map(center, zoomLevel);
    map.addInfoWindow(center, countryInfo);
}
