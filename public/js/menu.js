fetch('/menuitems')
    .then(function(data){
        return data.json();
    })
    .then(function(jsonData){
        var menu = '';
        jsonData.forEach(function(menuElement){
            menu += '<span class="menuitem">' + menuElement.name + '</span>';
        });
        document.querySelector('#publicnavigationbar').innerHTML = menu;
    })
    .catch(function(err){
        console.log(err);
    })