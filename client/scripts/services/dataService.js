heatmap.factory('dataService', ['$http', function($http) {
    'use strict';

    var dataService = {
    };

    dataService.setData = function(dataName, data) {
        dataService.graphName = dataName;
        dataService.graphData = data;
    };

    dataService.getGraphName = function() {
        return dataService.graphName;
    };

    dataService.getGraphData = function() {
        return dataService.graphData;
    };
    return dataService;
}]);
