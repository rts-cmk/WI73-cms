function getUsers() {
    fetch('users', { credentials: 'include' })
        .then((res) => {
            if (res.status != 200) return [];
            else return res.json();
        })
        .then(function (data) {
            console.log(data);
            var content = `<table class="userTbl">
                                <tr>
                                    <th>id</th>
                                    <th>Brugernavn</th>
                                    <th></th>
                                    <th></th>
                                </tr>`;
            data.forEach((dataKlump) => {
                content += `<tr>
                                    <td>${dataKlump.id}</td>
                                    <td>${dataKlump.username}</td>
                                    <td data-cmd="deluser" data-userid="${dataKlump.id}">Del</td>
                                    <td>Edit</td>
                                </tr>`
            });
            content += `<tr>
                                    <td colspan="4">
                                        <button data-cmd="addUser">Tilføj Bruger</button>
                                    </td>
                                </tr>
                                </table>`;
            //content += '</table>';
            document.querySelector('#content').innerHTML = content;
        })
        .catch(function (err) {
            console.log(err);
        }
        );
}

function categories() {
    fetch('/menuitems', { credentials: 'include', method: 'GET' })
        .then((data) => data.json())
        .then(function (jsonData) {
            //console.log(data);
            var content = `<table class="catsTbl">
                                <tr>
                                    <th>Kategori</th>
                                    <th>Position</th>
                                    <th></th>
                                    <th></th>
                                </tr>`;
            jsonData.forEach(function (d) {
                content += `<tr>
                                <td>${d.name}</td>
                                <td>${d.position}</td>
                                <td class="clickable"><img data-id="${d.id} data-cmd="catedit" class="iconImage" src="img/Pencil.png" title="Rediger kategori"></td>
                                <td class="clickable"><img data-catid="${d.id}" data-cmd="delCat" class="iconImage" src="img/Trash.png" title="Slet kategori"></td>
                            </tr>`
            });
            content += `<tr><td colspan="6"><button data-cmd="addCat">Tilføj Kategori</button></td></table>`;
            document.querySelector('#content').innerHTML = content;
        })
        .catch(function (err) {
            console.log(err);
        }
        );
}

function getArticles(catid) {
    fetch('articles/' + catid, { credentials: 'include' })
        .then((res) => res.json())
        .then(function (data) {
            //console.log(data);
            var content = ` <table class="articlesTbl">
                                <tr>
                                    <th>id</th>
                                    <th>Artikel</th>
                                    <th></th>
                                    <th></th>
                                </tr>`;
            data.forEach((klump) => {
                content += `    <tr>
                                    <td>${klump.id}</td> 
                                    <td>${klump.title}</td>
                                    <td>Edit</td>
                                    <td>Del</td>
                                </tr>`
            });
            content += '</table>';
            document.querySelector('#content').innerHTML = content;
        })
        .catch(function (err) {
            console.log(err);
        }
        );
}

function addCat() {
    fetch('addMenuItem.html', { credentials: 'include' })
        .then(
        function (res) {
            return res.text()
        }
        )
        .then(function (data) {
            console.log(data.resposeText);
            document.querySelector('#content').innerHTML = data;
        })
        .catch(function (err) {
            console.log(err)
        }
        );
}

function sendNewmenuItem() {
    var item = document.querySelector("#itemName").value;
    if (!item) return;
    fetch('categories/' + item, {
        credentials: 'include',
        method: 'post',
    })
        .then(
        function (res) { return res.text() }
        )
        .then(
        function (data) {
            document.querySelector('#content').innerHTML = data;
        }
        )
}

function delCat(e) {
    var id = e.target.dataset.catid;
    if (confirm("Delete " + id)) {
        fetch('categories/' + id, {
            credentials: 'include',
            method: 'delete',
        })
            .then(function (res) {
                return res.text()
            })
            .then(function (data) {
                document.querySelector('#content').innerHTML = data;
            })
        return;
    }
    alert('Not deleting');
}

function addUser() {
    fetch('addUser.html', { credentials: 'include' })
        .then(
        function (res) {
            return res.text()
        }
        )
        .then(function (data) {
            //console.log(data);
            document.querySelector('#content').innerHTML = data;
        })
        .catch(function (err) {
            console.log(err);
        }
        );
}



function logout() {
    fetch('/logout', { credentials: 'include', method: 'delete' })
        .then(function (data) {
            location.href = "/";
        })
}

function menuclick(e) {
    if (!e.target.dataset.cmd) {
        return;
    }
    if (document.querySelector('.itemActive')) {
        document.querySelector('.itemActive').classList.toggle('itemActive');
    }
    e.target.classList.toggle('itemActive');

    var cmd = e.target.dataset.cmd;
    switch (cmd) {
        case 'users':
            users();
            break
        case 'categories':
            categories();
            break;
        case 'logout':
            logout();
            break;
    }
}

document.addEventListener("click", menuclick, true);