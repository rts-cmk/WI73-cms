/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ *
 * Nogle client javacsript  functioner der 
 * henter indhold fra serveren via ajax kald (fetch)
 * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

 /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
 // Henter navigationsmenuen fra serveren i form af JSON

function menuUpdate(){
    fetch('/menuitems', {credentials : 'include'})
        .then(function(res){
            return res.json()
        })
        .then(function(data){
            var items = ''
            data.forEach(function(element) { // Gennemløber JSON-menuen
                items += `<span class="menuitem" data-menuid="${element.id}">${element.name}</span>`;
            });
            document.querySelector("#publicnavigationbar").innerHTML = items;
        }).then(function(){
            document.querySelector('.menuitem').click();
        })
        .catch(function(err){
            console.log(err);
    });
}
/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
function getArticle(id){
    fetch('article?catid='+id,{credentials:'include'})
        .then(function(res){
            return res.json()
        })
        .then(function(data){
            var content = '';
            data.forEach(function(klump) {
                content += `<article class="article"><h4>${klump.title}</h4>${klump.content}</article>`
            });
            document.querySelector('#content').innerHTML = content;
        })
        .catch(function(err){
            console.log(err);
        }
    );
}
/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
function menuclick(e){
    if(!e.target.classList.contains('menuitem')) {
        return;
    }   

    if(document.querySelector('.itemActive')){
        document.querySelector('.itemActive').classList.toggle('itemActive');
    }
    e.target.classList.toggle('itemActive');

    getArticle(e.target.dataset.menuid);
}
/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
document.addEventListener("DOMContentLoaded", menuUpdate);

document.querySelector("#publicnavigationbar").addEventListener("click", menuclick, true);

// document.querySelector('.menuitem').click();



// var cat = getQueryVariable('kategori');
// if(cat){
//     type = cat;
// }



// /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
// function getQueryVariable(variable) {
//     var query = window.location.search.substring(1);
//     var vars = query.split('&');
//     for (var i = 0; i < vars.length; i++) {
//         var pair = vars[i].split('=');
//         if (decodeURIComponent(pair[0]) == variable) {
//             return decodeURIComponent(pair[1]);
//         }
//         else {
//             return 0;
//         }
//     }
//     console.log('Query variable %s not found', variable);
// }
/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */


// /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
// function getArticles(){
//     fetch('/article',{credentials:'include'})
//         .then(function(res){
//             return res.json()
//         })
//         .then(function(data){
//             document.querySelector('#content').innerHTML = data.article;
//         })
//         .catch(function(err){
//             console.log(err);
//         }
//     );
// }
// /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */