(function () {
    
    document.addEventListener("click", menuclick, true);    // Først en eventlistener der 'fanger' alle museklik på siden

    function menuclick(e) {
        // Vi skal kun håndtere musklik der sker på elementer der har en 'data-cmd' attribut
        // denne attribut bruges også til at angive hvilken kommando der skal udføres.
        var caller = e.target;
        if (!caller.dataset.cmd) {
            return;
        }
        if (document.querySelector('.itemActive')) {
            // henter det element der har class = "itemActive"
            document.querySelector('.itemActive').classList.toggle('itemActive');   // toggler klassen 'itemactive' 
        }
        caller.classList.toggle('itemActive');  // Toggler 'itemeActive' på 'caller' elementet

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
            case 'article' :    // OK
                article(caller);
                break
            case 'edit' :   // OK
                edit();
                break;
            case 'articleAdd' : // OK
                articleAdd(caller);
                break;
            case 'articleDelete' :  // OK
                articleDelete(caller);
                break;
            case 'articleEdit' :
                articleEdit(caller);
                break;
            case 'articleUpdate' :
                articleUpdate(caller);
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
                alert(`Ikke implementeret endu: ${caller.dataset.cmd}`);
        }
    }

    //

 
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
