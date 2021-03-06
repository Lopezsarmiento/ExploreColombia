(function () {
    'use strict';

    angular.module('myApp.services', [])

        .factory('FetchService', function ($http) {
            var service = {
                getLocations: getLocations
            }

            function getLocations() {

                const file = '../js/locations.json';
                $http({
                    method: 'GET',
                    url: file
                }).success()

            }

            return service;
        })

        .factory('UtilsService', function ($filter, $timeout) {
            var service = {
                getRandomNumber: getRandomNumber,
                getLang: getLang
            }

            function getRandomNumber(obj) {
                // Get a number between 0 and obj.Length
                const objLength = obj.length;
                const item = Math.floor((Math.random() * objLength));
                return item;
            }

            function getLang() {

                let lang = 'en';
                let browserLang = navigator.language;

                if (browserLang.includes('es')) {
                    return lang = 'es';
                }
                return lang;
            }

            return service;
        });


})();