
fetch('/menuitems')
    .then(function(data){
        return data.json();
    })
    .then(function(jsonMenu){
        var menu = '';
        jsonMenu.forEach(function(menuItem){
            menu += `<span class="menuitem" data-catid="${menuItem.id}">${menuItem.name}</span>`;
        });
        document.querySelector('#publicnavigationbar').innerHTML = menu;
    })
    .catch(function(err){
        console.log(err)
    });
