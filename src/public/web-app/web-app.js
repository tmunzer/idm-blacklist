angular.module("Modals", []);
var lockout = angular.module("lockout", [
    'ngSanitize',
    'ngMaterial',
    'ngMessages',
    'md.data.table',
    'Modals'
]);

lockout
    .config(function ($mdThemingProvider) {
        $mdThemingProvider.theme('default')
            .primaryPalette("blue", {
                'default': '600'
            })
            .accentPalette('green', {
                'default': '400' // by default use shade 400 from the pink palette for primary intentions
            });
    }).config(['$httpProvider', function ($httpProvider) {
        //initialize get if not there
        if (!$httpProvider.defaults.headers.get) {
            $httpProvider.defaults.headers.get = {};
        }

        // Answer edited to include suggestions from comments
        // because previous version of code introduced browser-related errors

        //disable IE ajax request caching
        $httpProvider.defaults.headers.get['If-Modified-Since'] = 'Mon, 26 Jul 1997 05:00:00 GMT';
        // extra
        $httpProvider.defaults.headers.get['Cache-Control'] = 'no-cache';
        $httpProvider.defaults.headers.get['Pragma'] = 'no-cache';
    }]);

lockout
    .controller("AppCtrl", function ($scope, BlacklistService) {
        $scope.appDetails = {};
        $scope.query = {
            order: "lockingStartTime",
            limit: 10,
            page: 1,
            filter: ""
        }
        $scope.request;
        $scope.blacklist = [];
        $scope.displayedBlacklist = [];
        $scope.refresh = refresh;
        $scope.unlock = unlock;

        $scope.$watch("query.filter", function () {
            filter();
        })

        function filter() {
            $scope.displayedBlacklist = [];
            if ($scope.query.filter == "") $scope.displayedBlacklist = angular.copy($scope.blacklist);
            else $scope.blacklist.forEach(function (device) {
                if (device.customerId.toLowerCase().indexOf($scope.query.filter.toLowerCase()) >= 0
                    || device.clientMac.toLowerCase().indexOf($scope.query.filter.toLowerCase()) >= 0
                    || device.ssid.toLowerCase().indexOf($scope.query.filter.toLowerCase()) >= 0)
                    $scope.displayedBlacklist.push(device);
            })
        }

        function refresh() {
            $scope.request = BlacklistService.get()
            $scope.request.then(function (promise) {
                $scope.blacklist = promise;
                filter();
            })
        }
        function unlock(device) {
            BlacklistService.unlock(device.clientMac, refresh);
        }
        refresh();
    });


lockout
    .service("BlacklistService", function ($http, $q, $mdDialog, ErrorService) {
        function unlock(macAddress, cb) {
            return $mdDialog.show({
                controller: 'ConfirmCtrl',
                templateUrl: 'modals/confirmLock.html',
                locals: {
                    items: { macAddress: macAddress }
                }
            }).then(function () {
                reqDelete(macAddress).then(function (promise) {
                    if (promise) cb();
                });
            });
        }

        function get() {
            var canceller = $q.defer();
            var request = $http({
                url: "/api/blacklist",
                method: "GET",
                timeout: canceller.promise
            });
            return httpReq(request);
        }
        function reqDelete(macAddress) {
            var canceller = $q.defer();
            var request = $http({
                url: "/api/blacklist",
                method: "DELETE",
                params: { clientMacs: macAddress },
                timeout: canceller.promise
            });
            return httpReq(request);
        }

        function httpReq(request) {
            var promise = request.then(
                function (response) {
                    return response.data;
                },
                function (response) {
                    if (response.status >= 0) ErrorService.display(response.data);
                });

            promise.abort = function () {
                canceller.resolve();
            };
            promise.finally(function () {
                console.info("Cleaning up object references.");
                promise.abort = angular.noop;
                canceller = request = promise = null;
            });

            return promise;
        }

        return {
            get: get,
            unlock: unlock
        }
    });