const baseMaps = {
    '<span style="color: gray">Open Street Map</span>': L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }),
    '<span style="color: gray">Esri Street Map</span>': L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}', {
        maxZoom: 18,
        attribution: 'Tiles &copy; Esri &mdash; Source: Esri, DeLorme, NAVTEQ, USGS, Intermap, iPC, NRCAN, Esri Japan, METI, Esri China (Hong Kong), Esri (Thailand), TomTom, 2012'
    })
};

const map = L.map('mapid', {
    center: [33.3152, 44.3661],
    zoom: 3,
    layers: [baseMaps['<span style="color: gray">Esri Street Map</span>']]
});

const acledLayerGroup = new L.LayerGroup();
const acledHeatLayer = new L.LayerGroup();


var timeDimension = new L.TimeDimension({
    period: 'PT1H',
});
map.timeDimension = timeDimension; 

var player = new L.TimeDimension.Player({
transitionTime: 100, 
loop: false,
startOver:true
}, timeDimension);
var timeDimensionControlOptions = {
player:        player,
timeDimension: timeDimension,
position:      'bottomleft',
autoPlay:      true,
minSpeed:      1,
speedStep:     1,
maxSpeed:      15,
timeSliderDragUpdate: true
};
var timeDimensionControl = new L.Control.TimeDimension(timeDimensionControlOptions);

map.addControl(timeDimensionControl);


const overlayMaps = {

    '<span style="color: gray">Heat Layer</span>': acledHeatLayer,
    '<span style="color: gray">ACLED</span>': acledLayerGroup
};

const controlLayer = new L.control.layers(baseMaps, overlayMaps);

mapInfo.addTo(map);

controlLayer.addTo(map);

