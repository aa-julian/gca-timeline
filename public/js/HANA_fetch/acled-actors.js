//Creates list of all unique primary actors within selected bounding box
const listCreate = (actors, count) => {

    var id = '' + count;
    var listElement = document.createElement('a');
    listElement.setAttribute('class','list-group-item list-group-item-action');
    listElement.setAttribute('id', id);
    listElement.setAttribute('href','#');
    document.getElementById('list-div').appendChild(listElement);
    document.getElementById(id).innerHTML = actors.actor1;
    
};


const fetchAcledActors = () => {

    var url = '/actorGet?polygon='+encodeURIComponent(poly);

    fetch(url).then((response) => {

        response.json().then((data) => {
            if (data.error) {
                return console.error(data.error);
            }

            var count = 1;
            data.data.forEach(actors => {
                listCreate(actors, count);
                count ++;
            });
        });
    });
};