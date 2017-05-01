var login = angular.module('login', [
    'ngMaterial', 'ngSanitize'
]);

login
    .config(function ($mdThemingProvider) {
        $mdThemingProvider.theme('default')
            .primaryPalette("blue")
            .accentPalette('green', {
                'default': '400' // by default use shade 400 from the pink palette for primary intentions
            });
    });

login.controller('LoginCtrl', function ($scope) {
    $scope.token="";

    $scope.$watch("token", function(){
        console.log($scope.token)
        $scope.token = $scope.token.trim();
    })
});

