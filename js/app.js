(function () {
    'use strict';

    angular.module('myApp', [])
        .controller('NewTabController', function ($scope, $timeout) {
            $scope.clock;

            var udpateClock = function() {
                $scope.clock = new Date();
                $timeout(function(){
                    udpateClock();
                }, 1000);
            }
            udpateClock();
        });
})();