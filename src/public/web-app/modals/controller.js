
angular.module('Modals').controller("ErrorCtrl", function ($scope, $mdDialog, items) {

    $scope.message = items;

    $scope.cancel = function () {
        $mdDialog.cancel()
    };
    $scope.confirm = function () {
        $mdDialog.hide();
    }
});




angular.module('Modals').controller('ConfirmCtrl', function ($scope, $mdDialog, items) {
    // items is injected in the controller, not its scope!
    $scope.items = items;
    $scope.cancel = function () {
        $mdDialog.cancel()
    };
    $scope.confirm = function () {
        $mdDialog.hide();
    }
});