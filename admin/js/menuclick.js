(function () {
    document.addEventListener("click", menuclick, true);

    function menuclick(e) {
        var caller = e.target;
        if (!caller.dataset.cmd) {
            return;
        }
        if (document.querySelector('.itemActive')) {
            document.querySelector('.itemActive').classList.toggle('itemActive');
        }
        caller.classList.toggle('itemActive');

        switch (caller.dataset.cmd) {
            case 'logout': // OK
                logout();
                break;
            case 'categories': // OK 
                categories();
                break;
            case 'catEdit': // OK
                catEdit(caller);
                break;
            case 'catAdd':
                catAdd(caller);
                break;
            case 'catDelete' :
                catDelete(caller);
                break;
            case 'article':
                break
            case 'users':
                users(caller)
                break;
            case 'userAdd' :
                userAdd(caller);
                break;
            case 'userEdit':
                userEdit(caller);
                break;
            case 'userDelete' :
                userDelete(caller);
                break;
            default:
                alert(caller);
        }
    }

    function users(){
        fetch('/users', {credentials : 'include', method : 'get'})
        .then(function(data){
            return data.json();
        })
        .then(function(jsonData){
            var content = `
                <div class="tbl-container"><div class="tbl-head">Rediger brugere</div>
                <form>
                    <div class="tbl-row">
                        <div class="tbl-cell"><input readonly type="text" value="Brugernavn"></div>
                        <div class="tbl-cell"><input readonly type="text" value="Adgangskode"></div>
                    </div>
                </form>`;
            jsonData.forEach(function (d) {
                content += `<form id="frm${d.id}">
                    <div class="tbl-row">
                        <div class="tbl-cell">
                            <input name="id" type="hidden" value="${d.id}">
                            <input name="username" type="text" value="${d.username}">
                            <input name="password" type="password" placeholder="Ny adgangskode">
                        </div>
                        <div class="tbl-cell">
                            <img data-cmd="userEdit" data-id="frm${d.id}" class="iconImage clickable" src="img/Refresh.png" title="Opdater">
                        </div>
                        <div class="tbl-cell">
                            <img data-cmd="userDelete" data-id="frm${d.id}" class="iconImage clickable" src="img/Trash.png" title="Slet">
                        </div>
                    </div>
                </form>`;
            });
            content += `<br><hr>Eller tilføj<form id="frmUserAdd">
                <div class="tbl-row">
                    <div class="tbl-cell">
                        <input name="username" type="text" placeholder="Brugernavn">
                    </div>
                    <div class="tbl-cell">
                        <input name="password" type="text" placeholder="Adgangskode">
                    </div>
                    <div class="tbl-cell">
                        <img data-cmd="userAdd"  class="iconImage clickable" src="img/plus-2x.png" title="Tilføj">
                    </div>
                </div>
            <form>`;
            content += `</div>`;
            document.querySelector('#content').innerHTML = content;            
        })
    }

    function userAdd(caller){
        var form = document.querySelector('#frmUserAdd');
        var formData = new FormData(form);
        fetch('/users',{
            method : 'post', 
            credentials: 'include',
            body : formData
        })
        .then(function (data) {
            document.querySelector('div[data-cmd="users"]').click();
        })        
        .catch(function(err){
            console.log(err);
        });
    }

    function userEdit(caller){
        var formId = caller.dataset.id;
        var form = document.querySelector(`#${formId}`);
        var formData = new FormData(form);
        fetch('/users', {method : 'put', credentials : 'include', body : formData})
        .then(function(){
            document.querySelector('div[data-cmd="users"]').click();
        })
        .catch(function(err){
            console.log(err);
        })
    }

    function userDelete(caller){
        var formId = caller.dataset.id;
        var form = document.querySelector(`#${formId}`);
        var formData = new FormData(form);
        fetch('/users',{
            method : 'delete', 
            credentials: 'include',
            body : formData
        })
        .then(function (data) {
            document.querySelector('div[data-cmd="users"]').click();
        })        
        .catch(function(err){
            console.log(err);
        });
    }

    function catDelete(caller){
        var formId = caller.dataset.id;
        var form = document.querySelector(`#${formId}`);
        var formData = new FormData(form);
        fetch('/menuitems',{
            method : 'delete', 
            credentials: 'include',
            body : formData
        })
        .then(function (data) {
            document.querySelector('div[data-cmd="categories"]').click();
        })        
        .catch(function(err){
            console.log(err);
        });
    }

    function catEdit(caller) {
        var formId = caller.dataset.id
        var frm = document.querySelector(`#${formId}`);
        var frmData = new FormData(frm);
        fetch('/menuitems', {
            credentials: 'include',
            method: 'put',
            body: frmData
        })
            .then(function (data) {
                document.querySelector('div[data-cmd="categories"]').click();
                // return data.json();
            })
    }

    function logout() {
        fetch('/logout', { credentials: 'include', method: 'delete' })
            .then(function () {
                document.querySelector("#title").innerHTML = 'Du loggede af...';
                setTimeout(function () { location.href = "/"; }, 1000);
            });
    }

    function categories() {
        fetch('/menuitems', { method: 'get' })
            .then(function (data) {
                return data.json();
            })
            .then(function (jsonData) {
                var content = `
                            <div class="tbl-container"><div class="tbl-head">Rediger menu</div>
                                <form>
                                    <div class="tbl-row">
                                        <div class="tbl-cell"><input readonly type="text" value="Navn"></div>
                                        <div class="tbl-cell"><input readonly type="text" value="Position"></div>
                                    </div>
                                </form>`;
                jsonData.forEach(function (d) {
                    content += `<form id="frm${d.id}">
                                    <div class="tbl-row">
                                        <div class="tbl-cell">
                                            <input name="id" type="hidden" value="${d.id}">
                                            <input name="catname" type="text" value="${d.name}">
                                        </div>
                                        <div class="tbl-cell">
                                            <input name="catpos" type="number" value="${d.position}">
                                        </div>
                                        <div class="tbl-cell">
                                            <img data-cmd="catEdit" data-id="frm${d.id}" class="iconImage clickable" src="img/Refresh.png" title="Opdater">
                                        </div>
                                        <div class="tbl-cell">
                                            <img data-cmd="catDelete" data-id="frm${d.id}" class="iconImage clickable" src="img/Trash.png" title="Slet">
                                        </div>
                                    </div>
                                </form>`;
                });
                content += `<br><hr>Eller tilføj<form id="frmCatAdd">
                                <div class="tbl-row">
                                    <div class="tbl-cell">
                                        <input name="catname" type="text" placeholder="Menunavn">
                                    </div>
                                    <div class="tbl-cell">
                                        <input name="catpos" type="number" placeholder="position">
                                    </div>
                                    <div class="tbl-cell">
                                        <img data-cmd="catAdd"  class="iconImage clickable" src="img/plus-2x.png" title="Opdater">
                                    </div>
                                </div>
                            <form>`;
                content += `</div>`;
                document.querySelector('#content').innerHTML = content;
            })
            .catch(function (err) {
                console.log(err);
            })
    }

    function catAdd(caller){
        var form = document.querySelector('#frmCatAdd');
        var formData = new FormData(form);
        fetch('/menuitems',{
            method : 'post', 
            credentials: 'include',
            body : formData
        })
        .then(function (data) {
            document.querySelector('div[data-cmd="categories"]').click();
        })        
        .catch(function(err){
            console.log(err);
        });
        
    }

    // Interval-functtion der holder øje med om session-cookien stadig eksisterer
    setInterval(function () {
        if (!document.cookie.length) {
            alert("Du logges af nu...");
            setTimeout(function () { location.href = "/"; }, 2000);
        }
    }, 1000 * 60 * 5)

})();

