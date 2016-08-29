heatmap.controller('dataSelectorCtrl', ['$scope', 'pipService', 'dataService', function($scope, pipService, dataService) {
    'use strict';
    $scope.data = {
        'dbList': ['twitter-ds', 'twitter-ds-heatmap']
    };

    $scope.init = function(){
    };

    $scope.init();

    $scope.updateGraph = function(param){
        var dataURL = 'data/' + param + '.json';
        d3.json(dataURL, function(error, data) {
            dataService.setData(param, data);
            pipService.emitGraphIsReady('graph is ready');
        });
    };
}]);
