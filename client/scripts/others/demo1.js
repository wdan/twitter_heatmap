(function main(){
    d3.json('data/data2-tsne.json', function(error, data) {
        var data_array = [];
        var maxX = -Infinity, maxY = -Infinity;
        var minX = Infinity, minY = Infinity;
        for (var key in data) {
            if (data.hasOwnProperty(key)) {
                var value = data[key];
                var x = value.position[0];
                var y = value.position[1];
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
        console.log(minX, maxX, minY, maxY);

        for (var i = 0; i < data_array.length; i++) {
            var oldX = data_array[i].position[0];
            var oldY = data_array[i].position[1];
            var newX = (oldX - minX) / (maxX - minX) * 800;
            var newY = (oldY - minY) / (maxY - minY) * 800;
            data_array[i] = {x: newX, y: newY, value: .05};
        }

        //var canvas = document.querySelector('#canvas canvas');
        var config = {
            container: document.getElementById('canvas'),
            radius: 15,
            blur: .7,
            gradient: {
                '.125': '#fff7fb',
                '.25': '#ece7f2',
                '.375': '#d0d1e6',
                '.5': '#a6bddb',
                '.625': '#74a9cf',
                '.75': '#3690c0',
                '.875': '#0570b0'
            }
        };
        var heatmapInstance = h337.create(config);
        console.log(data_array);
        heatmapInstance.setData({max: 1, min: 0, data: data_array});
    });
})();
