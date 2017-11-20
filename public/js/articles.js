
(function () {
    document.querySelector("#publicnavigationbar").addEventListener("click", menuClick)

    function menuClick(evt) {
        if (!evt.target.classList.contains("menuitem")) {
            return;
        }
        if (document.querySelector(".itemActive")) {
            document.querySelector(".itemActive").classList.toggle("itemActive");
        }
        evt.target.classList.toggle("itemActive");
        var catID = evt.target.dataset.categoryid;

        fetch(`/article?catid=${catID}`)
            .then(function (data) {
                return data.json();
            })
            .then(function (items) {
                var cnt = '';
                items.forEach(function (elm) {
                    cnt += `<article class="article"><h4>${elm.title}</h4>${elm.content}</article>`;
                });
                document.querySelector("#content").innerHTML = cnt
            })
    }
})()
























/**
 * 
 *     fetch(`/article?id=${articleID}`)
        .then(function(data){
            return data.json();
        })
        .then(function(jsonData){
            var content = '';
            jsonData.forEach(function(elm){
                content += `<article class="article"><h4>${elm.title}</h4>${elm.content}<h4></article>`;
            });
            document.querySelector("#content").innerHTML = content;
        })
        .catch(function(err){
            console.log(err);
        });
 */