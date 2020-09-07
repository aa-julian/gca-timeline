const checkValue = (id) => {

    document.getElementById(id).value == false ? true : document.getElementById(id).value == false;

};


const checkboxCreate = (actors, count) => {

    var checkDiv = document.createElement('div');
    let id = 'check'+count;
    checkDiv.setAttribute('class', 'form-check');
    checkDiv.setAttribute('id', id);
    document.getElementById('checkbox-body').appendChild(checkDiv);

    var newInput = document.createElement('input');
    let inputID = 'input'+count;
    newInput.setAttribute('class','form-check-input');
    newInput.setAttribute('type','checkbox');
    newInput.setAttribute('id', inputID);
    newInput.setAttribute('value', 'false');
    document.getElementById(id).appendChild(newInput);
    document.getElementById(inputID).onclick = checkValue(inputID);
    

    var newLabel = document.createElement('label');
    let labelID = 'label'+count;
    checkDiv.setAttribute('class', 'form-check-label');
    checkDiv.setAttribute('id', labelID);
    document.getElementById(labelID).innerHTML(actors);
    document.getElementById(id).appendChild(newLabel);
};

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