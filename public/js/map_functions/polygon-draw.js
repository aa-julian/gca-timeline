map.pm.addControls({
    position: 'topleft',
    drawPolyline: false,
    drawMarker: false,
    drawCircleMarker: false,
    drawCircle: false,
    drawRectangle: false
  });

map.pm.setPathOptions({
    color: 'steelblue',
    fillColor: 'red',
    fillOpacity: 0.05
});  


//translating draw into an object to be returned to grab data

var shape = '';
var counter = 1;
var firstPoint = '';

map.on('pm:drawstart', ({ workingLayer }) => {
    workingLayer.on('pm:vertexadded', e => {

        counter == 1 ? firstPoint = firstPoint + e.latlng.lng.toString() + ' ' + e.latlng.lat.toString(): firstPoint;

        shape = shape + e.latlng.lng.toString() + ' ' + e.latlng.lat.toString() + ', ';
        counter ++;
    });
});

map.on('pm:drawend', e => {
    //shape = shape.slice(0, -2);
    console.log(shape);
    let url = '/acledGet?polygon='+encodeURIComponent(shape + firstPoint);
    fetchAcledData(url);

});

  
