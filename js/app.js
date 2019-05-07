(function () {
    'use strict';

    angular.module('myApp', [])
        .controller('NewTabController', function ($scope, $timeout) {
            $scope.clock = '12:00';

            function udpateClock() {
                $scope.clock = new Date();
            }

            udpateClock();


        });
})();