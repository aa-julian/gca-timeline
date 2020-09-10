const fetchAcledData = () => {
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

    let actor = document.getElementById('text-input').value;
    
    btnHandlers.toggleBusy();
    fetch('/acledGet?polygon='+encodeURIComponent(poly)+'&actor='+encodeURIComponent(actor)).then((response) => {
        btnHandlers.toggleBusy();

        response.json().then((data) => {
            if (data.error) {
                return console.error(data.error);
            }

            var acledData = [];

            data.data.forEach((data) => {
                acledData.push({
                    'type': 'Feature',
                    'properties': {
                        'ACTOR1': data.actor1,
                        'time': Date.parse(data.event_date),
                        'EVENT_DATE': data.event_date,
                        'EVENT_TYPE': data.event_type,
                        'LOCATION': data.location,
                        'SOURCE': data.source,
                        'popupContent': 'LOCATION: ' + data.location + '\nEVENT: ' + data.event_type + '\nSOURCE: ' + data.source + '\nDATE: ' + data.event_date + ' ' + data.country
                    },
                    'geometry': JSON.parse(data.COORDINATES),
                });
            });

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

            var timeDimension = new L.TimeDimension({
                period: 'P1Y'
             });


             L.Control.TimeDimensionCustom = L.Control.TimeDimension.extend({
                _getDisplayDateFormat: function(date){
                    return date.format('dS mmmm yyyy');
                }    
            });
             map.timeDimension = timeDimension; 
             
             var player = new L.TimeDimension.Player({
             transitionTime: 50, 
             loop: true,
             startOver:true
             }, timeDimension);
             
             var timeDimensionControlOptions = {
                 player:        player,
                 timeDimension: timeDimension,
                 position:      'bottomleft',
                 autoPlay:      false,
                 minSpeed:      1,
                 speedStep:     1,
                 maxSpeed:      5,
                 timeSliderDragUpdate: true
             };
             var timeDimensionControl = new L.Control.TimeDimension(timeDimensionControlOptions);
             
             map.addControl(timeDimensionControl);

            var geoJSONTDLayer = L.timeDimension.layer.geoJson(acledLayer, {
                updateTimeDimension: false,
                duration: 'P1M',
                updateTimeDimensionMode: 'replace'
            });

            geoJSONTDLayer.on('update',(e)=>{
                console.log(e);
            });

            geoJSONTDLayer.addTo(map);
        });

    });

};