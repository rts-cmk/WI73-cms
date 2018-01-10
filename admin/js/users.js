function users() {
    fetch('/users', { method: 'get', credentials:'include'})
    .then(function (data) {
        if(data.redirected){
            // Hvis response objectets 'redirected' er true...
            location = data.url; // ...så send browseren til redirected url'en...
        }
        return data.json();
    })
    .then(function (jsonData) {
        if(jsonData){
            var content = `
            <div class="tbl-container"><div class="tbl-head">Rediger brugere</div>
                <form>
                    <div class="tbl-row">
                        <div class="tbl-cell"><input class="center" readonly type="text" value="Brugernavn"></div>
                        <div class="tbl-cell"><input class="center" readonly type="text" value="Adgangskode"></div>
                    </div>
                </form>`;
            jsonData.forEach(function (d) {
                content += `<form id="frm${d.id}">
                <div class="tbl-row">
                    <div class="tbl-cell">
                        <input name="id" type="hidden" value="${d.id}">
                        <input name="username" type="text" value="${d.username}">
                    </div>
                    <div class="tbl-cell">
                        <input name="password" type="text" placeholder="Ny adgangskode">
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
            content += `
            <br><hr>Eller tilføj
            <form id="frmUserAdd">
                <div class="tbl-row">
                    <div class="tbl-cell">
                        <input name="username" type="text" placeholder="Brugernavn">
                    </div>
                    <div class="tbl-cell">
                        <input name="password" type="text" placeholder="Adgangskode">
                    </div>
                        <div class="tbl-cell">
                            <img data-cmd="userAdd"  class="iconImage clickable" src="img/plus-2x.png" title="Opdater">
                        </div>
                    </div>
                    </form>`;
                    content += `</div>`;
                    document.querySelector('#content').innerHTML = content;
        }
    })
    .catch(function (err) {
        console.log(err);
    })
}    

function userAdd(caller){
    var form = document.querySelector('#frmUserAdd');
    var formData = new FormData(form);
    if(formData.get("username").trim().length < 1){
        alert("Brugernavn skal angives");
        document.getElementsByName('username')[document.getElementsByName('username').length - 1].focus()            
        return;
    }
    if(formData.get("password").trim().length < 1){
        alert("Adgangskode skal angives");
        document.getElementsByName('password')[document.getElementsByName('password').length - 1].focus()
        return;
    }
    fetch('/users', {
        credentials: 'include',
        method: 'post',
        body: formData
    })
        .then(function(serverResponse){
            if(serverResponse.redirected){
                // Hvis response objectets 'redirected' er true...
                location = serverResponse.url; // ...så send browseren til redirected url'en...
            }            
            document.querySelector('div[data-cmd="users"]').click();
        })
        .catch(function(err){
            console.log(err)
        })
}

function userDelete(caller){
    var formId = caller.dataset.id
    var frm = document.querySelector(`#${formId}`);
    var frmData = new FormData(frm);
    fetch('/users', {
        credentials: 'include',
        method: 'delete',
        body: frmData
    })
    .then(function (serverResponse) {
        if(serverResponse.redirected){
            // Hvis response objectets 'redirected' er true...
            location = serverResponse.url; // ...så send browseren til redirected url'en...
        }            
        document.querySelector('div[data-cmd="users"]').click();
    });
}

function userEdit(caller) {
    var formId = caller.dataset.id
    var frm = document.querySelector(`#${formId}`);
    var frmData = new FormData(frm);
    fetch('/users', {
        credentials: 'include',
        method: 'put',
        body: frmData
    })
        .then(function (serverResponse) {
            if(serverResponse.redirected){
                // Hvis response objectets 'redirected' er true...
                location = serverResponse.url; // ...så send browseren til redirected url'en...
            }                        
            document.querySelector('div[data-cmd="users"]').click();
        })
}