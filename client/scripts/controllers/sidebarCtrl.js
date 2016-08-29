heatmap.controller('sidebarCtrl', ['$scope', 'pipService', function($scope, pipService) {
    'use strict';
    $scope.$watch('showNodesFlag', function(value) {
        if (value != undefined) {
            pipService.emitShowNodes(value);
        }
    });
    $scope.$watch('importanceFlag', function(value) {
        if (value != undefined) {
            pipService.emitImportanceChange(value);
        }
    });
}]);
