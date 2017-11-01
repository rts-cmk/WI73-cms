
document.querySelector("#publicnavigationbar").addEventListener("click", function(evt){
    if(!evt.target.classList.contains("menuitem")){
        return;
    }
    if(document.querySelector(".itemActive")){
        document.querySelector(".itemActive").classList.toggle("itemActive");
    }
    evt.target.classList.toggle("itemActive");

    var catid = evt.target.dataset.catid;

    fetch(`/article?catid=${catid}`)
        .then(function(data){
            return data.json();
        })
        .then(function(articles){
            var cnt = '';
            articles.forEach(function(a){
                cnt += `<article class="article"><h4>${a.title}</h4>${a.content}</article>`;
            })
            document.querySelector("#content").innerHTML = cnt;
        })

})

