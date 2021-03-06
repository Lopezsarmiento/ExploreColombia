(function () {
  'use strict';

  angular.module('myApp', ['myApp.services'])
    .controller('NewTabController', function ($scope, $timeout, $filter, UtilsService) {
      $scope.time = clock();
      const file = 'js/locations.json';
      const photo = {
        "en": "Photographer",
        "es": "Fotógrafo"
      }
      let config = {};
      let lang = UtilsService.getLang();

      // initiate
      getJsonInfo(file);

      function clock() {
        let now = Date.now();
        const format = "HH:mm";
        $scope.time = $filter('date')(now, format);
        $timeout(clock, 1000);
      }

      async function getJsonInfo(file) {

        try {
          const response = await fetch(file)
          if (!response.ok) {
            throw Error(response.statusText);
          }
          const json = await response.json();
          config = json.config;
          setLocationData(json.locations);
          getLocation();


        } catch (error) {
          console.log(error);
        }
      }

      function setLocationData(data) {
        let item = UtilsService.getRandomNumber(data);
        $scope.bgImage = {
          "background-image": data[item].image
        };
        $scope.locationName = (lang === 'en') ? data[item].place.en : data[item].place.es;
        $scope.location = data[item].location;
        $scope.fact = (lang === 'en') ? data[item].fact.en : data[item].fact.es;
        $scope.link = (lang === 'en') ? data[item].link.en : data[item].link.es;
        $scope.owner = data[item].owner;
        $scope.url = data[item].url;
        $scope.photo = (lang === 'en') ? photo.en : photo.es;
      }

      function getLocation() {
        var options = {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        };

        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(getWeather, error, options);
        } else {
          console.log(`location is not supported`);
          $scope.city = `City information is NOT available`;
        }
      }

      async function getWeather(data) {

        const { latitude, longitude } = data.coords;
        const { api, url } = config;
        const latlon = `lat=${latitude}&lon=${longitude}`;
        const units = '&units=metric';
        const api_url = `${url}${latlon}${units}${api}`;

        try {
          const response = await fetch(api_url);
          if (!response.ok) {
            throw Error(response.statusText);
          }
          const jsonData = await response.json();
          let icon = getIcon(jsonData);
          let temperature = (jsonData.main.temp).toFixed(1);
          $scope.city = jsonData.name;
          $scope.temperature = `${temperature} \u00B0`;
          $scope.weatherIcon = icon;

        } catch (e) {
          console.log(e)
        }
      }

      function error(err) {
        console.warn(`ERROR(${err.code}): ${err.message} `);
      }

      function getIcon(data) {
        // Get icon depending on time of day
        const date = new Date();
        const sunrise = new Date(data.sys.sunrise * 1000); //Convert a Unix timestamp to time
        const sunset = new Date(data.sys.sunset * 1000);

        /* Get suitable icon for weather */
        if (date.getHours() >= sunrise.getHours() && date.getHours() < sunset.getHours()) {
          var weatherIconID = `wi wi-owm-day-${data.weather[0].id}`;
        }
        else {
          var weatherIconID = `wi wi-owm-night-${data.weather[0].id}`;
        }

        return weatherIconID;
      }
    });
})();