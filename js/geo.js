const geojson_path = 'assets/polygon.geojson'

let file = $.ajax({
    url: geojson_path,
    dataType: "json",
    success: console.log("County data successfully loaded."),
    error: function (xhr) {
        alert(xhr.statusText)
    }
})

$.when(file).done(function () {

    let layer = file.responseJSON

    function getColor(d) {
        return d > 85 ? "#e60049" :
            d > 80 ? "#0bb4ff" :
            d > 75 ? '#e6d800' :
            d > 70 ? '#9b19f5' :
            d < 70 ? '#00bfa0' :
            '#f0cccc';
    }

    function highlightFeature(e) {
        var layer = e.target;

        layer.setStyle({
            weight: 5,
            color: 'blue',
            dashArray: '',
            fillOpacity: 0.7
        });

        if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
            layer.bringToFront();
        }
    }

    function resetHighlight(e) {
        geojson.resetStyle(e.target);
    }

    function onEachFeature(feature, layer) {
        layer.on({
            mouseover: highlightFeature,
            mouseout: resetHighlight,
        });
    }
    let geojson = L.geoJSON(layer, {
        onEachFeature: onEachFeature,
        style: function (feature) {
            year = feature.properties.Years;
            return {
                fillColor: getColor(year),
                fillOpacity: 1,
                weight: 1,
                color: 'black',
                opacity: 1
            }
        }
    }).addTo(map).on('mouseover',function(f){
        let prop = f.layer.feature.properties
        let latlng = f.latlng
        if (map) {
            layerPopup = L.popup()
                .setLatLng([latlng.lat,latlng.lng])
                .setContent(`<table class='popup-table' cellspacing=0 cellpadding=5><tr style="background-color:#000"><td style="color:white">County</td><td style="color:white">Description</td></tr><td>${prop.County}</td><td>${prop.Label}</td></tr></table>`)
                 .openOn(map);
         }
    })

    var legend = L.control({position: 'bottomright'});

    legend.onAdd = function (map) {
    
        var div = L.DomUtil.create('div', 'info legend'),
            grades = [50, 70, 75, 80, 85],
            labels = [];
        
        let item  = [
            '<h3>Life Expectancy of Denver<br>by Age</h3>',
            '<h4>Research Period 2010 - 2015</h4>'
        ]
        
        // loop through our density intervals and generate a label with a colored square for each interval
        for (var i = 0; i < grades.length; i++) {
            item.push('<li style="list-style-type: none;"><i style="background:' + getColor(grades[i] + 1) + '"></i>'+grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + ' Years' : '+')+'</li>')
        }
        item.push('<h4 style="margin-bottom:0px">Source </h4><a href="https://www.denvergov.org/opendata/dataset/city-and-county-of-denver-life-expectancy-2010-2015">https://www.denvergov.org/opendata<br>/dataset/city-and-county-of-denver-life-<br>expectancy-2010-2015</a>')
        div.innerHTML = item.join().replaceAll(',','')

        return div
    };
    
    legend.addTo(map);
})
