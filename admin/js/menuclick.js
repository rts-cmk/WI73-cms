
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
            case 'catAdd':  // OK
                catAdd(caller);
                break;
            case 'catDelete' :   // OK
                catDelete(caller)
                break;
            case 'article' :
                article(caller);
                break
            case 'edit' : 
                edit();
                break;
            case 'articleAdd' : // OK
                articleAdd(caller);
                break;
            case 'articleDelete' :
                articleDelete(caller);
                break;
            case 'users':   // OK
                users(caller);
                break;
            case 'userAdd' :    // OK
                userAdd(caller);
                break;
            case 'userDelete' :     // OK
                userDelete(caller);
                break;
            case 'userEdit' :   // OK
                userEdit(caller);
                break;
            default:
                alert(caller.dataset.cmd);
        }
    }

    function articleDelete(caller){
        // alert('Delete ' + caller.dataset.formid);
        var form = document.querySelector(`#${caller.dataset.id}`);
        var formdata = new FormData(form);
        fetch('/article',{method : 'delete', credentials : 'include', body : formdata})
        .then(function(data){
            document.querySelector('div[data-cmd="edit"]').click();
        });
    }
    
    // Sender ny artikel til serveren
    function articleAdd(caller){
        var frmId = caller.dataset.frm;
        var frm = document.querySelector(`#${frmId}`);
        var frmData = new FormData(frm);
        fetch('/article',{credentials:'include', method: 'post', body: frmData})
        .then(function(data){
            document.querySelector('div[data-cmd="article"]').click();
        })
        .catch(function(err){
            console.log(err);
        })
    }

    // Dropdownbox med artikelkategorier
    function edit(id){
        fetch('/menuitems', {method: 'get'})
        .then(function(data){
            return data.json();
        })
        .then(function(jsonData){
            if(jsonData){
                var dropdown = document.createElement("select");
                dropdown.name="catId";
                dropdown.onchange = function(){
                    articleOverview(this)
                };
                var option = document.createElement("option");
                option.value = 0;
                option.textContent = "Vælg kategori";
                dropdown.appendChild(option);
                jsonData.forEach(function(jd){
                    option = document.createElement("option");
                    option.value = jd.id;
                    option.textContent = jd.name;
                    dropdown.appendChild(option);
                });

                var container = document.createElement("div");  // Opret div-container til dropdown
                container.id = "editContainer"                  // Set id på container
                container.className = "tbl-container";          // set className på container
                container.appendChild(dropdown);
                var content = document.querySelector("#content")
                content.innerHTML = '';                         // Tøm #content
                content.appendChild(container);                 // append container til #content
                
            }
        });
    }
    
    function articleOverview(caller){
        fetch('/article?catid='+caller.value, {method:'get'})
        .then(function(data){
            return data.json();
        })
        .then(function(jsonData){
            if(jsonData && jsonData.length > 0){
                // opret container
                var editContainer = document.querySelector("#editContainer");
                while(editContainer.childNodes.length > 1) {
                     editContainer.removeChild(editContainer.lastChild);
                }
                var hr = document.createElement('hr')
                hr.style.margin = '10px';

                editContainer.appendChild(hr);

                jsonData.forEach(function(jd){
                    
                    var form = document.createElement('form');   // Opret form med id
                    form.id = `frm${jd.id}`;
                    
                    var row = document.createElement('div');    // opret row med classname
                    row.className = "tbl-row";

                    var cell = document.createElement('div');   // opret cell med classname
                    cell.className = 'tbl-cell';

                    var input = document.createElement('input');      // opret readonly-input med value
                    input.readOnly = true;  
                    input.value = jd.title;
                            
                    cell.appendChild(input);    // append input til cell

                    input = document.createElement('input');
                    input.type = "hidden";
                    input.value = jd.id;
                    input.name = "id";
                    cell.appendChild(input);    //
                    row.appendChild(cell);   // append cell til row

                    cell = document.createElement('div');   // opret cell til img-edit
                    cell.className = "tbl-cell";
                                
                    
                    var img = document.createElement('img'); // opret img til 'rediger-knap'
                    img.classList = "iconImage clickable";
                    img.src = "img/Refresh.png";
                    img.dataset.cmd = "articleEdit"

                    cell.appendChild(img);  // append img til cell
                    row.appendChild(cell);   // append cell til row

                    cell = document.createElement('div') // opret cell til img-edit
                    cell.className = "tbl-cell";

                    var img = document.createElement('img');    // opret img
                    img.classList = "iconImage clickable";
                    img.src = "img/Trash.png";
                    img.dataset.cmd = "articleDelete";
                    img.dataset.id = `frm${jd.id}`

                    cell.appendChild(img);  // append img til cell

                    row.appendChild(cell);  // append cell til row

                    form.appendChild(row);   // append row til form

                    // container.appendChild(form);    // append form til container
                    editContainer.appendChild(form);

                });
            }
            
        })
        .catch(function(err){
            console.log(err);
        })
    }

    // Formular med textarea til ny artikel
    function article(){
        fetch('/menuitems', {method : 'get'})
        .then(function(data){
            return data.json();
        })
        .then(function(jsonData){
            if(jsonData){
                var dropdown = document.createElement("select");
                dropdown.name="catId";
                var option = document.createElement("option");
                option.value = 0;
                option.textContent = "Vælg kategori";
                dropdown.appendChild(option);
                jsonData.forEach(function(jd){
                    option = document.createElement("option");
                    option.value = jd.id;
                    option.textContent = jd.name;
                    dropdown.appendChild(option);
                });
                var form = document.createElement("form")
                form.id = "frmArticle";

                var title = document.createElement("input")
                title.width = 50;
                title.type = "text";
                title.name = "title";
                title.placeholder = "Artikel overskrift";
                var textarea = document.createElement("textarea")
                textarea.name = "article";
                form.appendChild(title);
                form.appendChild(textarea);
                form.appendChild(dropdown);
                var btn = document.createElement('button')
                btn.type = "button";
                btn.dataset.cmd = "articleAdd"
                btn.dataset.frm = "frmArticle";
                btn.innerHTML = "Upload";
                form.appendChild(btn);
                var container = document.createElement("div");
                container.className = "tbl-container";
                container.appendChild(form);
                var content = document.querySelector('#content');
                content.innerHTML = '';
                content.appendChild(container);
            }
        })
        .catch(function(err){
            console.log(err);
        })
    }

    // Oversigt over brugere med opdater og slette knapper
    function users() {
        fetch('/users', { method: 'get' })
        .then(function (data) {
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
        fetch('/users', {
            credentials: 'include',
            method: 'post',
            body: formData
        })
            .then(function(){
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
        .then(function (data) {
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
            .then(function (data) {
                document.querySelector('div[data-cmd="users"]').click();
                // return data.json();
            })
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
            .then(function(){
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
        .then(function (data) {
            document.querySelector('div[data-cmd="categories"]').click();
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

    // Interval-function der holder øje med om session-cookien stadig eksisterer
    setInterval(function () {
        if (!document.cookie.length) {
            alert("Du logges af nu...");
            setTimeout(function () { location.href = "/"; }, 2000);
        }
    }, 1000 * 60 * 5)

})();
