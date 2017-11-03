function menuUpdate() {
    fetch('/menuitems', { credentials: 'include' })
        .then(function (data) {
            return data.json();
        })
        .then(function (jsonData) {
            var menu = '';
            jsonData.forEach(function (menuElement) {
                menu += `<span class="menuitem" data-catid="${menuElement.id}" >${menuElement.name}</span>`;
            });
            document.querySelector('#publicnavigationbar').innerHTML = menu;
        })
        .then(function(){
            document.querySelector('.menuitem').click();
        })
        .catch(function (err) {
            console.log(err);
        });
}

// Registrerer en eventhandler til 'DOMContentLoaded' eventen. 
// Når dokumentet er loadet, kaldes 'menuupdate()' der sender en 
// 'GET' request til routen '/menuitems'
document.addEventListener('DOMContentLoaded', menuUpdate);
