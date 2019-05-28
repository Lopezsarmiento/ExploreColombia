(function () {
    'use strict';

    angular.module('myApp', ['myApp.services'])
        .controller('NewTabController', function ($scope, $timeout, $filter, UtilsService) {
            $scope.time = clock();
            $scope.city = ``;
            $scope.temperature = ``;
            $scope.weatherIcon = '';
            $scope.bgImage = {};
            $scope.locationName = '';
            $scope.location = '';
            $scope.fact = '';
            $scope.link = '';
            $scope.url = '';
            $scope.owner = '';
            $scope.photo = '';

            let config = {};
            let lang = UtilsService.getLang();
            const photo = {
                "en": "Photographer",
                "es": "Fotógrafo"
            }
            const file = 'js/locations.json';

            // initiate
            getJsonInfo();

            function clock() {
                let now = Date.now();
                const format = "HH:mm";
                $scope.time = $filter('date')(now, format);
                $timeout(clock, 1000);
            }

            function getJsonInfo() {
                fetch(file)
                    .then(function (response) {
                        if (!response.ok) {
                            throw Error(response.statusText);
                        }
                        // Read the response as json.
                        return response.json();
                    })
                    .then(function (data) {
                        config = data.config;
                        setLocationData(data.locations);
                        getLocation(getWeather);

                    })
                    .catch(function (error) {
                        console.log('Looks like there was a problem: \n', error);
                    });
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

            function getLocation(onSuccess) {
                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(onSuccess);
                } else {
                    console.log(`location is not supported`);
                    $scope.city = `Unable to get location`;
                }
            }

            function getWeather(data) {
                let lat = data.coords.latitude;
                let long = data.coords.longitude;
                const key = config.api;
                const call = config.url;
                const latlong = `lat=${lat}&lon=${long}`;
                const units = '&units=metric';
                const url = `${call}${latlong}${units}${key}`;

                fetch(url)
                    .then(function (response) {
                        if (!response.ok) {
                            throw Error(response.statusText);
                        }
                        // Read the response as json.
                        return response.json();
                    })
                    .then(function (jsonData) {
                        console.log(jsonData);
                        let icon = getIcon(jsonData);
                        let temperature = (jsonData.main.temp).toFixed(1);
                        $scope.city = jsonData.name;
                        $scope.temperature = `${temperature} \u00B0`;
                        $scope.weatherIcon = icon;

                    })
                    .catch(function (error) {
                        console.log('Looks like there was a problem: \n', error);
                    });
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