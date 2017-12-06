function categories() {
    fetch('/menuitems', { method: 'get' })
        .then(function (serverResponse) {
            return serverResponse.json();
        })
        .then(function (jsonData) {
            var content = `
                        <div class="tbl-container"><div class="tbl-head">Rediger menu</div>
                            <form>
                                <div class="tbl-row">
                                    <div class="tbl-cell"><input class="center" readonly type="text" value="Navn"></div>
                                    <div class="tbl-cell"><input class="center" readonly type="text" value="Position"></div>
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

            // content += `<br><button type="button" data-cmd="catAdd" style="width:99%">Tilføj menupunkt</button>`
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
    fetch('/menuitems', {
        credentials: 'include',
        method: 'post',
        body: formData
    })
        .then(function(serverResponse){
            if(serverResponse.redirected){
                // Hvis response objectets 'redirected' er true...
                location = serverResponse.url; // ...så send browseren til redirected url'en...
            }                                    
            document.querySelector('div[data-cmd="categories"]').click();
        })
        .catch(function(err){
            console.log(err)
        })
}
 
function catDelete(caller){
    var formId = caller.dataset.id
    var frm = document.querySelector(`#${formId}`);
    var frmData = new FormData(frm);
    fetch('/menuitems', {
        credentials: 'include',
        method: 'delete',
        body: frmData
    })
    .then(function (serverResponse) {
        if(serverResponse.redirected){
            // Hvis response objectets 'redirected' er true...
            location = serverResponse.url; // ...så send browseren til redirected url'en...
        }                                
        document.querySelector('div[data-cmd="categories"]').click();
    });

    // });
}

function catEdit(caller) { 
    var formId = caller.dataset.id
    var frm = document.querySelector(`#${formId}`);
    var frmData = new FormData(frm);
    if(frmData.get('catname').trim().length < 1){
        alert('Kategorinavnet skal angives');
        return;
    }
    if(frmData.get('catpos').trim().length < 1){
        alert('Positionen skal angives');
        return;
    }
    fetch('/menuitems', {
        credentials: 'include',
        method: 'put',
        body: frmData
    })
        .then(function (serverResponse) {
            if(serverResponse.redirected){
                // Hvis response objectets 'redirected' er true...
                location = serverResponse.url; // ...så send browseren til redirected url'en...
            }                                    
            document.querySelector('div[data-cmd="categories"]').click();
        })
}