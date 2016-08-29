heatmap.factory('pipService', ['$rootScope', function($rootScope) {
    'use strict';
    var IMPORTANCE_CHANGE = 'importance_change';
    var SHOW_NODES = 'show_nodes';
    var GRAPH_IS_READY = 'graph_is_ready';
    var pipService = {};

    pipService.onImportanceChange = function(scope, callback) {
        scope.$on(IMPORTANCE_CHANGE, function(event, msg) {
            callback(msg);
        });
    };

    pipService.emitImportanceChange = function(msg) {
        $rootScope.$broadcast(IMPORTANCE_CHANGE, msg);
    };

    pipService.onShowNodes = function(scope, callback) {
        scope.$on(SHOW_NODES, function(event, msg) {
            callback(msg);
        });
    };

    pipService.emitShowNodes = function(msg) {
        $rootScope.$broadcast(SHOW_NODES, msg);
    };

    pipService.onGraphIsReady = function(scope, callback) {
        scope.$on(GRAPH_IS_READY, function(event, msg) {
            callback(msg);
        });
    };

    pipService.emitGraphIsReady = function(msg) {
        $rootScope.$broadcast(GRAPH_IS_READY, msg);
    };

    return pipService;
}]);
