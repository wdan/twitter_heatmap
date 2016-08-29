heatmap.controller('heatmapCtrl', ['$scope', 'pipService', 'dataService', function($scope, pipService, dataService) {
    'use strict';
    $scope.canvasWidth = 800;
    $scope.canvasHeight = 800;
    $scope.tileSize = 256;
    $scope.isDrawNodes = false;
    $scope.importanceThreshod = 0.002123; 
    $scope.importanceFlag = false;
    $scope.color = d3.scale.category20c();

    pipService.onImportanceChange($scope, function(msg) {
        $scope.importanceFlag = msg;
        if ($scope.isDrawNodes) {
            var tiles = $scope.tile
                .scale($scope.zoom.scale())
                .translate($scope.zoom.translate())
                ();
            $scope.drawNodes(tiles);
        }
    });
    pipService.onShowNodes($scope, function(msg){
        $scope.isDrawNodes = msg;
        if (!msg) {
            var canvas = d3.select('#canvas svg');
            canvas.selectAll('#nodeGroup').remove();
        } else {
            var tiles = $scope.tile
                .scale($scope.zoom.scale())
                .translate($scope.zoom.translate())
                ();
            $scope.drawNodes(tiles);
        }
    });

    pipService.onGraphIsReady($scope, function(){
        var graphName = dataService.getGraphName();
        var graphData = dataService.getGraphData();
        $scope.drawHeatmap(graphName);
        $scope.initNodes(graphData);
    });

    $scope.isHeatmap = function(graphName) {
        if (graphName.indexOf('heatmap') != -1) {
            $('#canvas').css('background-color', 'rgb(249, 249, 254)');
            return true;
        } else {
            $('#canvas').css('background-color', 'black');
            return false;
        }
    };
    
    $scope.initNodes = function(graphData) {
        var data_array = [];
        $scope.maxX = -Infinity, $scope.maxY = -Infinity;
        $scope.minX = Infinity, $scope.minY = Infinity;
        for (var key in graphData) {
            if (graphData.hasOwnProperty(key)) {
                var value = graphData[key];
                var x = value.position[0];
                var y = value.position[1];
                if (x > $scope.maxX) {
                    $scope.maxX = x;
                }
                if (x < $scope.minX) {
                    $scope.minX = x;
                }
                if (y > $scope.maxY) {
                    $scope.maxY = y;
                }
                if (y < $scope.minY) {
                    $scope.minY = y;
                }
                data_array.push(value);
            }
        }
        $scope.graphData = data_array;
    };

    $scope.drawNodes = function(tiles) {
        var curLevel = tiles[0][2];
        var canvasLen = $scope.tileSize * (1 << curLevel);
        var scale = tiles.scale / 256;
        var r = scale % 1 ? Number : Math.round;
        var marginX = r(tiles.translate[0] * tiles.scale);
        var marginY = r(tiles.translate[1] * tiles.scale);
        $scope.data_array = [];
        var tip = d3.tip().attr('class', 'd3-tip').html(function(d) { return 'Name: ' + d.name + '<br/>' + 'Cluster: ' + d.cluster; });

        for (var i = 0; i < $scope.graphData.length; i++) {
            var oldX = $scope.graphData[i].position[0];
            var oldY = $scope.graphData[i].position[1];
            var name = $scope.graphData[i].name;
            var community = $scope.graphData[i].community;
            var importance = $scope.graphData[i].importance;
            var newX = (oldX - $scope.minX) / ($scope.maxX - $scope.minX) * canvasLen * scale + marginX;
            var newY = (1 - (oldY - $scope.minY) / ($scope.maxY - $scope.minY)) * canvasLen * scale + marginY;
            if (newX >= 0 && newX <= $scope.canvasWidth && newY >= 0 && newY <= $scope.canvasHeight) {
                if (!$scope.importanceFlag || importance > $scope.importanceThreshod) {
                    $scope.data_array.push({x: newX, y: newY, name: name, cluster: community, importance: importance});
                }
            }
        }
        var canvas = d3.select('#canvas svg');
        canvas.selectAll('#nodeGroup').remove();
        var nodeGroup = canvas.append('g').attr('id', 'nodeGroup');
        nodeGroup.call(tip);
        nodeGroup.selectAll('.node')
            .data($scope.data_array)
            .enter()
            .append('circle')
            .attr('class', 'node')
            .attr('cx', function(d) {
                return d.x;
            })
            .attr('cy', function(d) {
                return d.y;
            })
            .attr('r', 2)
            .attr('fill', function(d) {
                return $scope.color(d.cluster);
            })
            .on('mouseover', tip.show)
            .on('mouseout', tip.hide);
            //.style('display', 'none');
    };

    $scope.drawHeatmap = function(graphName) {
        var isHeatmap = $scope.isHeatmap(graphName);
        var maxZoom = 1 << 12;
        var minZoom = 1 << 8; 
        var width = $scope.canvasWidth;
        var height = $scope.canvasHeight;
        var prefix = prefixMatch(['webkit', 'ms', 'Moz', 'O']);

        $scope.tile = d3.geo.tile()
            .size([width, height]);
        var projection = d3.geo.mercator();
        $scope.zoom = d3.behavior.zoom()
            .scale(1 << 8)
            .scaleExtent([minZoom, maxZoom])
            .translate([width / 2, height / 2])
            .on('zoom', function() {
                return zoomed(isHeatmap);
            });

        var canvas = d3.select('#canvas');
        $('#canvas').empty();
        canvas.call($scope.zoom);
        var layer = canvas.append('svg')
            .attr('class', 'layer')
            .attr('width', width)
            .attr('height', height);

        var group = layer.append('g');

        zoomed(isHeatmap);

        function zoomed(isHeatmap) {
            var tiles = $scope.tile
                .scale($scope.zoom.scale())
                .translate($scope.zoom.translate())
                ();

            projection
                .scale($scope.zoom.scale())
                .translate($scope.zoom.translate());

            var image = group
                .style(prefix + 'transform', matrix3d(tiles.scale, tiles.translate))
                .selectAll('.tile')
                .data(tiles, function(d) { return d; });
            image.exit()
                .remove();
            image.enter().append('image')
                .attr('class', 'tile')
                .attr('width', $scope.tileSize)
                .attr('height', $scope.tileSize)
                .on('error', function() {
                    d3.select(this)
                        .attr('xlink:href', 'data/blank.png');
                })
                .attr('xlink:href', function(d) { return 'data/' + graphName + '_' + d[2] + '_' + d[1] + '_' + d[0] + '.png'; })
                .attr('x', function(d) { return (d[0] << 8) + 'px'; })
                .attr('y', function(d) { return (d[1] << 8) + 'px'; })
                .attr('filter', function() {
                    if (isHeatmap) {
                        return 'url(#gaussianBlur)';
                    } else {
                        return '';
                    }
                });
            if ($scope.isDrawNodes) {
                $scope.drawNodes(tiles);
            }
        }
    };

    function matrix3d(scale, translate) {
        var k = scale / 256, r = scale % 1 ? Number : Math.round;
        return 'matrix3d(' + [k, 0, 0, 0, 0, k, 0, 0, 0, 0, k, 0, r(translate[0] * scale), r(translate[1] * scale), 0, 1 ] + ')';
    }


    function prefixMatch(p) {
        var i = -1, n = p.length, s = document.body.style;
        while (++i < n) if (p[i] + 'Transform' in s) return '-' + p[i].toLowerCase() + '-';
        return '';
    }
}]);
