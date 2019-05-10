(function () {
    'use strict';

    angular.module('myApp', [])
        .controller('NewTabController', function ($scope, $timeout, $filter) {
            $scope.time = clock();

            function clock() {
                let now = Date.now();
                const format = "hh:mm:ss";
                $scope.time = $filter('date')(now, format);
                $timeout(clock, 1000);
            }

        });
})();