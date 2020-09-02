const fetchAcledData = (url) => {

    const acledColor = (d) => {
        let color;
        switch (d) {
            case 'Battles':
                color = '#e55353'; // danger
                break;
            case 'Explosions/Remote violence':
                color = '#f9b115'; // warning
                break;
            case 'Protests':
                color = '#ced2d8'; // brand secondary
                break;
            case 'Riots':
                color = '#321fdb'; // primary
                break;
            case 'Strategic developments':
                color = '#2eb85c'; // success
                break;
            case 'Violence against civilians':
                color = '#3399ff'; // info
                break;
            default:
                console.warn(`No color match for ${d}`);
                color = '#636f83'; // brand dark
        }
        return color;
    };

    var acledLayer;

    function resetHighlight(e) {
        acledLayer.resetStyle(e.target);
        mapInfo.update();
    }

        //What functions are run on each feature for interaction
    function onEachFeature(feature, layer) {
        // does this feature have a property named popupContent?
        if (feature.properties && feature.properties.popupContent) {
            layer.bindPopup(feature.properties.popupContent);
        }

        layer.on({
            mouseover: highlightFeature,
            mouseout: resetHighlight
        });

        // coords.push(feature.geometry.coordinates);
    }  
    
    function highlightFeature(e) {
        var layer = e.target;

        layer.setStyle({
            radius: 8,
            fillColor: acledColor(layer.feature.properties.EVENT_TYPE),
            color: '#000',
            weight: 1,
            opacity: 1,
            fillOpacity: 0.9
        });

        //error checking depending on the browser
        if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
            layer.bringToFront();
        }

        mapInfo.update(layer.feature.properties);
    }


    //Styles the polygons and colors based on population
    function style(feature) {
        return {

            radius: 6,
            fillColor: acledColor(feature.properties.EVENT_TYPE),
            color: 'white',
            weight: 1,
            opacity: 1,
            fillOpacity: 0.5
        };
    }


    
    btnHandlers.toggleBusy();
    fetch(url).then((response) => {
        btnHandlers.toggleBusy();

        response.json().then((data) => {
            if (data.error) {
                return console.error(data.error);
            }


            console.log(data);
            var acledData = [];
            var geos = [];



            data.data.forEach((data) => {
                acledData.push({
                    'type': 'Feature',
                    'properties': {
                        'ACTOR1': data.actor1,
                        'EVENT_DATE': data.event_date,
                        'EVENT_TYPE': data.event_type,
                        'LOCATION': data.location,
                        'SOURCE': data.source,
                        'time': Date.parse(data.event_date),
                        'popupContent': 'LOCATION: ' + data.location + '\nEVENT: ' + data.event_type + '\nSOURCE: ' + data.source + '\nDATE: ' + data.event_date + ' ' + data.country
                    },
                    'geometry': JSON.parse(data.COORDINATES),
                });

                geos.push(JSON.parse(data.COORDINATES));
            });


            var coords = geos.map(a => a.coordinates.reverse());


            console.log(acledData);
            acledLayer = L.geoJSON(acledData, {
                style: style,
                pointToLayer: function (feature, latlng) {

                    var geojsonMarkerOptions = {
                        radius: 6,
                        fillColor: acledColor(feature.properties.EVENT_TYPE),
                        color: 'white',
                        weight: 1,
                        opacity: 1,
                        fillOpacity: 0.5
                    };

                    return L.circleMarker(latlng, geojsonMarkerOptions);
                },
                onEachFeature: onEachFeature

            });

            acledLayerGroup.addLayer(acledLayer);

            let options = {
                'minOpacity': 0.24,
                'maxZoom': 9,
                'radius': 12,
                'gradient': { 0.35: 'blue', 0.45: 'lime', 1: 'red' }
            };
            var heat = L.heatLayer(coords, options);

            acledHeatLayer.addLayer(heat);
        });

    });

};