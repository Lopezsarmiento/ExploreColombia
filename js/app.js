(function () {
    'use strict';

    angular.module('myApp', [])
        .controller('NewTabController', function ($scope, $timeout, $filter) {
            $scope.time = clock();
            $scope.location = `Buenos Aires`;
            $scope.temperature = `20 \u00B0`;
            $scope.weatherIcon = '';

            getLocation(getWeather);

            function clock() {
                let now = Date.now();
                const format = "hh:mm:ss";
                $scope.time = $filter('date')(now, format);
                $timeout(clock, 1000);
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
                console.log(data);
                let lat = data.coords.latitude;
                let long = data.coords.longitude;

                const pepper = '&appid=cf6f3902316f9fa78adcc4f336e2728a';
                const latlong = `lat=${lat}&lon=${long}`;
                const units = '&units=metric';
                const url = `http://api.openweathermap.org/data/2.5/weather?${latlong}${units}${pepper}`;

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
                        $scope.location = jsonData.name;
                        $scope.temperature = `${temperature} \u00B0`;

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