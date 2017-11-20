
(function () {
    document.addEventListener('DOMContentLoaded', menuUpdate);

    function menuUpdate() {
        fetch('/menuitems')
            .then(function (data) {
                return data.json()
            })
            .then(function (menuitems) {
                var menu = '';
                menuitems.forEach(function (item) {
                    menu += `<span class="menuitem" data-categoryid="${item.id}">${item.name}</span>`;
                });
                document.querySelector('#publicnavigationbar').innerHTML = menu;
            })
            .then(function () {
                document.querySelector('.menuitem').click();
            })
            .catch(function (err) {
                console.log(err);
            });
    }
})();