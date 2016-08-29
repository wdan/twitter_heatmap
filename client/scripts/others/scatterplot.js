(function main(){
    d3.json("data/data2-tsne.json", function(error, data) {
        var data_array = [];
        var maxX = -Infinity, maxY = -Infinity;
        var minX = Infinity, minY = Infinity;
        for (var key in data) {
            if (data.hasOwnProperty(key)) {
                var value = data[key];
                x = value.position[0];
                y = value.position[1];
                if (x > maxX) {
                    maxX = x;
                }
                if (x < minX) {
                    minX = x;
                }
                if (y > maxY) {
                    maxY = y;
                }
                if (y < minY) {
                    minY = y;
                }
                data_array.push(value);
            }
        }
        console.log(data_array.length);
        for (var i = 0; i < data_array.length; i++) {
            var oldX = data_array[i].position[0];
            var oldY = data_array[i].position[1];
            var newX = (oldX - minX) / (maxX - minX) * 1000;
            var newY = (oldY - minY) / (maxY - minY) * 1000;
            data_array[i] = {x: newX, y: newY, value: .15}
        }
        var canvas = d3.select('#canvas svg');
        canvas.selectAll('.node')
            .data(data_array)
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
            .attr('fill', 'steelblue');
    });
})();
