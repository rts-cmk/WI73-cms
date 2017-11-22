
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
            case 'article':
                break
            case 'users':
                alert(ds.cmd)
                break;
            default:
                alert(caller);
        }
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
                            <div class="cat-container"><div class="cat-head">Rediger menu</div>
                                <form>
                                    <div class="cat-row">
                                        <div class="cat-cell"><input readonly type="text" value="Navn"></div>
                                        <div class="cat-cell"><input readonly type="text" value="Position"></div>
                                    </div>
                                </form>`;
                jsonData.forEach(function (d) {
                    content += `<form id="frm${d.id}">
                                    <div class="cat-row">
                                        <div class="cat-cell">
                                            <input name="id" type="hidden" value="${d.id}">
                                            <input name="catname" type="text" value="${d.name}">
                                        </div>
                                        <div class="cat-cell">
                                            <input name="catpos" type="number" value="${d.position}">
                                        </div>
                                        <div class="cat-cell">
                                            <img data-cmd="catEdit" data-id="frm${d.id}" class="iconImage clickable" src="img/Refresh.png" title="Opdater">
                                        </div>
                                        <div class="cat-cell">
                                            <img data-cmd="catDelete" data-id="frm${d.id}" class="iconImage clickable" src="img/Trash.png" title="Slet">
                                        </div>
                                    </div>
                                </form>`;
                });
                content += `<br><hr>Eller tilføj<form id="frmCatAdd">
                                <div class="cat-row">
                                    <div class="cat-cell">
                                        <input name="catname" type="text" placeholder="Menunavn">
                                    </div>
                                    <div class="cat-cell">
                                        <input name="catpos" type="number" placeholder="position">
                                    </div>
                                    <div class="cat-cell">
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
        fetch()
        // console.log(formData.getAll('catname'));
        // alert(caller.dataset.cmd);
        
    }

    // Interval-functtion der holder øje med om session-cookien stadig eksisterer
    setInterval(function () {
        if (!document.cookie.length) {
            alert("Du logges af nu...");
            setTimeout(function () { location.href = "/"; }, 2000);
        }
    }, 1000 * 60 * 5)

})();

