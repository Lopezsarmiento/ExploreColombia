(function () {
    'use strict';

    angular.module('myApp.services', [])
        .factory('UtilsService', function () {
            var service = {
                log: log
            }

            function log() {
                console.log('UtilsServices');
            }

            return service;
        });
})();