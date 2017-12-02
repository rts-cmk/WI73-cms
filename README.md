<a name="top"></top>
# CMS bygget med Node.js
### Jeg vil her vise hvordan man kan opbygge et meget simpelt CMS site, programmeret i Node.js. Lad mig straks påpege, at koden først og fremmest er skrevet til undervisningsbrug, og udgør ikke et produktionsklart system.

## Indhold.
* [1. del - simpelt API](#simpleAPI)
* [2. del - statiske filer](#publicStatic)
* [3. del - database](#database)
* [4. del - login](#login)

<a name="simpleAPI"></a>
### 1. Del. 


### Indledningsvis vil vi starte med at demonstrere et simpelt API

#### Et meget simpelt API der viser hvordan routes kan opbygges i node.js.

Dvs. dette eksempel benytter sig udelukkende af moduler der er en del af node.js installationen. Derfor er der ikke behov for at installere 3. parts moduler. Jeg vil dog anbefale at _nodemon_ modulet installeres. 

API'et har 2 forskellige routes.
* `/cat    (der svarer 'Miauw' på en GET request)`
* `/dog   (der svarer 'Vov-vov på en GET request)`

 
Selve serveren er defineret i `server.js` og benytter sig af node modulet `http` samt et modul, `router.js` som vi selv skal skrive koden til.

server.js
```javascript
const 
    http = require('http'),
    router = require('./router');

http.createServer(router).listen(3003);
console.log('Server er startet. Venter tålmodigt ved port 3003');
```

Vi opretter en server med createServer() metoden. Samtidig sendes modulet `router` "ned i maven" på serveren. Derefter konfigureres serveren til at benytte port 3003.

Koden i modulet `router` der sendes "ned i maven" på serveren vil blive eksekveret hver gang serveren modtager en _request_ fra en browser på port 3003.

Men lad os kigge på koden i modulet `router`. I dette modul skal vi importere modulet `url`. Også dette modul er en del af Node.js installationen og behøver derfor ikke at installeres. 

router.js
```javascript
const url = require('url');

// Definition af vores API og API-handlere
const routes = {
    '/cat' : function(res) {
                 res.writeHead(200, {'Content-type' : 'application/json'});
                 res.end('Miauv');
             },
             
    '/dog' : function(res){
                 res.writeHead(200, {'Content-type' : 'application/json'});
                 res.end('Vov-vov');                
              }            
};

module.exports = function(req, res){
    // Vi henter pathname fra request objektet.
    var pathname = url.parse(req.url).pathname;
    
    // Hvis vi har en route der matcher '/cat' eller '/dog'
    // henter vi den ind i 'handler' variablen
    var handler = routes[pathname];
    
    // Checker om vi har noget i 'handler'...
    if(handler){
        handler(res);   // ...hvis vi har en funktion i 'handler' skal den eksekveres...
        return; // ...derefter afsluttes funktionen.
    }
    
    // Hvis vi er her er der ikke fundet en route (eller endpointhandler)
    // Det meddeler vi i form af en tekst
    res.writeHead(404, {'Content-type' : 'text/plain; charset=utf-8'});
    res.end('Route ' + pathname + ' findes ikke');                    
}
```

Kigger vi på vores endpointhandlere ser vi, at de to funktioner ligner hinanden ret meget. Eneste forskel er at den ene sender tekststrengen 'Miauv' til browseren, mens den anden sender 'Vov-vov'.

Derfor vil jeg ændre koden lidt. Først opretter jeg en ny mappe, `endpointhandlers`. I denne mappe vil jeg oprette to filer, `cat.js` og `dog.js`.

I de to filer placeres funktionerne for henholdsvis `/cat` og `/dog` routene.

endpointhandlers/cat.js
```javascript

module.exports = function(res) {
    res.writeHead(200, {'Content-type' : 'application/json'});
    res.end('Miauv');
};
```
endpointhandlers/dog.js
```javascript

module.exports = function(res) {
    res.writeHead(200, {'Content-type' : 'application/json'});
    res.end('Vov-vov');
};
```

Vi har nu fået adskilt selve endpointhandlerne fra `routes.js`, men stadig har vi to handlere der har en del til fælles.
Næste skridt vil være at oprette endnu en fil som jeg vil kalde `helpers.js`. Denne fil er tænkt til at indeholde hjælpefunktioner. I dette eksempel vil der til at starte med kun være en enkelt hjælpefunktion, eller rettere sagt metode, nemlig `respond()`. Tanken er at denne metode skal indeholde den kode der er fælles for endpointhandlerne. Koden for `respond()` metoden skal se sådan ud:


helpers.js
```javacsript
exports.respond = function(res, message, status = 200){
    res.writeHead(status, {'Content-type' : 'application/json'});
    res.end(JSON.stringify(message));
};
```

Det man skal lægge mærke til her er det sidste argument `status`. Dette argument får som default værdien 200, hvilket er http-statuskoden for at alt er gået godt.


Denne metode kan også benyttes i vores `router` modul. Lad os ændre koden i dette modul så den ser sådan ud:

router.js
```javascript
const url = require('url');
const helpers = require('./helpers');

// Definition af vores API og API-handlere
const routes = {
    '/cat' : require('./endpointhandlers/cat'),
             
    '/dog' : require('./endpointhandlers/dog')            
};

module.exports = function(req, res){
    var pathname = url.parse(req.url).pathname;
    
    var handler = routes[pathname];
    if(handler){
        handler(res);
        return;
    }
    // Hvis vi er her er der ikke fundet en route (eller endpointhandler)
    helpers.respond(res, `Status: 404. Route '${pathname}' findes ikke` , 404);
}
```

I sin nuværende form kan vores API ikke skelne mellem request metoder som fx `GET`, `POST`, `PUT` eller `DELETE`

Heldigvis er det enkelt at udvide API'et til også at kunne dette.

Lad os kigge på en af endpointhandlerne, `cat`. Hvis vi i dette modul ændrer koden til at se sådan ud:

endpointhandlers/cat.js
```javascript

module.exports = {
    'GET' : function(res) {
                res.writeHead(200, {'Content-type' : 'application/json'});
                res.end('GET: Miauv');
            },
    'POST' : function(res) {
                res.writeHead(200, {'Content-type' : 'application/json'});
                res.end('POST: Miauv');
            }            
};
```

På tilsvarende vis skal `dog` ændres til at se sådan ud:

endpointhandlers/cat.js
```javascript

module.exports = {
    'GET' : function(res) {
                res.writeHead(200, {'Content-type' : 'application/json'});
                res.end('GET: Vov-vov');
            },
    'POST' : function(res) {
                res.writeHead(200, {'Content-type' : 'application/json'});
                res.end('POST: Vov-vov');
            }            
};
```

Men for at få den ændrede kode til at virke, er det også nødvendigt at ændre i `router` modulet.

Koden i dette modul ændres så den ser sådan ud:

router.js
```javascript
const url = require('url');
const helpers = require('./helpers');

// Definition af vores API og API-handlere
const routes = {
    '/cat' : require('./endpointhandlers/cat'),
             
    '/dog' : require('./endpointhandlers/dog')            
};

module.exports = function(req, res){
    var pathname = url.parse(req.url).pathname;
    
    var handler = routes[pathname];
    if(handler){
        var action = handler[req.method];
        if(action){
            // Hvis vi er her er der fundet både en matchende route og metode.
            action(res);
            return;
        }
        
        // Hvis vi er her er der fundet en route, men der er ikke fundet en metode der er understøttet.
        helpers.respond(res, `Status: 404. Metode '${req.method}' ikke understøttet.`, 404);
        return;
    }
    // Hvis vi er her er der ikke fundet en route (eller endpointhandler)
    helpers.respond(res, `Status: 404. Route '${pathname}' findes ikke` , 404);
}
```

Vi har nu et simpelt API der er i stand til at svare på både `GET` og `POST` request. Det er nu op til dig at udvide dette API til også at kunne håndtere andre requesttyper fx. `PUT` og `DELETE`. Prøv også at tilføje en route, fx. `/and` der svarer `Rap-rap` på indkommende request.

<a name="publicStatic"></a>[^ tilbage](#top)
### 2. del. Statiske filer 

Vores API kan ikke levere statiske filer. Det får vi brug for, så vi skal til at lave de nødvendige tilføjelser til koden for at det kan lade sig gøre. 

Vi skal tilføje en hjælpefunktion til vores `helpers.js`. Funktionen skal kunne læse en fil fra filsystemet og sende indholdet i filen til en browser. Derfor får vi brug for filsystem-modulet `fs`. Modulet er en del af Node installationen og skal ikke installeres.

Vi får også brug for at kunne bestemme hvilken mimetype vi har med at gøre. Vi skal derfor oprette et objekt til at indholde definitionerne på de mimetyper vi ønsker at kunne håndtere.

Vi opretter et objekt i `helpers.js` filen. Objektet indeholder en række navn/værdi par, hvor navnene svarer til ekstensionen på de filertyper vi ønsker at kunne håndtere, og værdierne svarer til mimetyperne.

Koden der skal tilføjes til `helpers.js`.
```javascript
const fs = require('fs');  // Importer filsystem-modulet
const path = require('path');

// De foreløbige mimetypes. Vi kan tilføje flere når behovet opstår
const mimetypes = {
    '.html' :  'text/html',               // mimetype for html
    '.css'  :  'text/css',                // mimetype for css
    '.js'   :  'application/javascript',  // mimetype for javascript
    '.png'  :  'image/png'                // mimetype for png 
};

```

Vi får også brug for en funktion der kan læse filer fra serverens filsystem. 

Koden til denne funktionen der læser fra filsystemet sender til browseren placeres også i `helpers.js` 

Her er koden
```javascript
exports.fileRespond = function(res, fileName){
    fs.readFile(fileName, function(err, fileContent){
        if(err){
            // Hvis der opstod en fejl, er vi her.
            exports.respond(res, `Filen '${fileName}' findes ikke.`, 404);
            return;
        }
        
        // Hvis vi er her, er der fundet en fil der kan læses. Indholdet skal så sendes til browseren,
        // men først skal vi detektere hvilken mimetype det handler om.
        
        var ext = path.extname(fileName); // hent fil-ekstension
        var mime = mimetypes[ext] // brug ekstensionen til at hente mimetype
        res.writeHead(200, {'Content-type' : mime });
        res.end(fileContent);
    }
}

```

Funktionen tager to parametre, response objektet og stien til filen der skal sendes.

Koden i `helpers.js` ser nu sådan ud:
```javscript
const fs = require('fs');
const path = require('path');

const mimetypes = {
    '.html' : 'text/html',
    '.css' : 'text/css',
    '.js' : 'text/js',
    '.png' : 'image/png'
};

exports.fileRespond = function(res, fileName){
    console.log(fileName);
    fs.readFile(fileName, function(err, fileContent){
        if(err){
            exports.respond(res, `Filen blev ikke fundet', 404);
            return;
        }
        var ext = path.extname(fileName);
        var mime = mimetypes[ext];
        res.writeHead(200, {'Content-type': mime})
        res.end(fileContent);
    });
};

exports.respond = function (res, besked, status = 200) {
    res.writeHead(status, { 'Content-type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify(besked));
};
```



Men inden vi ændrer mere i koden skal vi oprette mapper til vores statiske filer. Jeg har valgt at placere alle statiske filer i en mappe jeg kalder `public`. Inde i denne mappe vil jeg, til at begynde med, placere en html-fil samt tre undermapper `js`, `css` og `img`. Mapperne er tænkt til at indeholde henholdsvis javascript-, stylesheet- og billedfiler. Efter at have oprettet disse filer, ser mappestrukturen således ud:


```
├── endpointhandlers
│   ├── cat.js
│   └── dog.js
│
├── public
│   ├── css
│   │   └── style.css
│   │
│   ├── img
│   │   ├── logo.png
│   │   └── anonymprofil.png
│   │
│   ├── js
│   │   └── script.js
│   │
│   └── index.html
│
├── helpers.js
├── router.js
└── server.js
```

Planen er nu at undersøge indholdet i variablen `pathname`. Hvis den kun indeholder `/`, skal vi blot sende indholdet af `index.html`. Det kan vi gøre med vores nye funktion.

Med en if-sætning kan vi undersøge om `pathname` kun indeholder `/`, 

```javacsript 
if(pathname === '/') {
    helpers.fileRespond(res, 'public/index.html'); 
}
```

Hvis browseren sender en GET-request for en fil, fx `css/style.css`, vil variablen `pathname` indeholde tekststrengen `css/style.css`. Pathname variablen vil altid indeholde requesten. Det betyder at vi kan undersøge om variablen indeholder et filnavn, eller rettere, undersøge om indholdet udgør et mønster for et filnavn. Men hvordan ser et mønsteret for et filnavn ud?. Lad os kigge på de filer der kan komme på tale i vores system. Det er først og fremmest html-, css-, js-, png-, og jpg-filer,  

Mønsteret for disse filer er at de har et filnavn bestånde af en eller flere alfanumeriske karakterer efterfulgt af punktum og derefter bogstaverne 'html', 'css', 'js', 'png', eller 'jpg'. Yderligere kan der være angivet et mappenavn foran filnavnet.

Eksempel
```
index.html
css/style.css
js/script.js
img/logo.png
```

For at undersøge om `patname` indeholder filnavnmønster, har jeg valgt at bruge den indbyggede javascript metode `.match()`. Denne metode gør brug af `regular expression`

Men lad os kigge på hvad regular expressions er for noget og hvad det kan anvendes til. 

En regular expression, eller blot regex, bruges til at søge efter bestemte mønstre i en tekststreng, fx om en tekststreng indeholder et filnavn som `index.html`, eller `/img/logo.png`. De filnavne vi kommer til at arbejde med, har det til fælles de har en ekstension der er enten `.html`, `.css`, `js`, `png` eller `jpg`
Derudover kan disse filer være placerede i mapper så stien til dem kan være fx `css/style.css` eller `/img/logo-png`.

Et `regex` mønster placeres mellem to slashes, fx `/mønster/`. Det der står mellem slashene udgør mønsteret vi søger efter.

Eksempel:
```javascript
// Først en variabel der indeholder en tekststreng
var tekst = "Roskilde Tekniske Skole";

// Vi vil undersøge om teksten indeholder "Roskilde".
// Det kan vi bruge .match() metoden til.
var regExResult = text.match(/Roskilde/);

// I dette eksempel vil variablen regExReult indeholde resultatet af match() funktionen

// Hvis vi udskriver variablen til konsollen vil vi se noget i stil med: 
[ 'Roskilde', index: 0, input: 'Roskilde Tekniske Skole' ]
```

Det første element i arrayet, element 0, indeholder det som `match()` metoden har fundet, det andet element, `index: 0`, viser positionen i teksten hvor der blev fundet et match, her 0, mens det sidste element, `input: 'Roskilde Tekniske Skole'`, viser den tekststreng der blev søgt i.

Hvis `match()` metoden ikke finder noget der matcher returneres `null`.

Jeg vil ikke gå i dybden med regular expressions. Der findes en række websider med tutorials om regex, fx `https://www.w3schools.com/jsref/jsref_obj_regexp.asp` eller `https://regex101.com/`. 

Jeg vil stærkt anbefale at du bruger lidt tid til at sætte sig ind i regular expressions. De findes i rigtig mange programmeringssprog, og er et _must_ for en programmør at kunne. 

Når du har lært hvordan regex virker, og har fået lidt øvelse i at opbygge regexes, kan du fortsætte her.

Lad os prøve at annvende regex i forbindelse med `match()` metoden.

Nedenstående kodelinie kan finde request for html, css, js, jpg, og png filer.
```
var fileRequest = pathname.match(/^\/((css|js|img)\/)?\w+\.(html|css|js|png|jpg)$/);   
```

Hvis der er fundet noget der matcher, returneres et array med alle matchdata til variablen  `fileRequest`. Ellers returneres `null`.

Det betyder at vi med en simpel `if` kan undersøge om der er fundet noget.

```
var fileRequest = pathname.match(/^\/((css|js|img)\/)?\w+\.(html|css|js|png|jpg)$/);
if(fileRequest){
    // Den fulde match ligger i fileRequest[0], det første element i arrayet.
    // Vi kan derfor sende det fundne sammen med responseobjektet til fileResponse() metoden.
    helpers.fileResond(res, fileRequest[0])
}
```

Koden i `router.js` skal nu se sådan ud.
```javascript
const url = require('url');
const helpers = require('./helpers');

const routes = {
    '/cat': require('./endpointhandlers/cat'),

    '/dog': require('./endpointhandlers/dog')
};

module.exports = function (req, res) {
    
    var pathname = url.parse(req.url).pathname;

    if(pathname === '/'){
        helpers.fileRespond(res, 'public/index.html');
        return;
    }

    var regexFile = pathname.match(/^\/((css|js|img)\/)?\w+\.(html|css|js|png)$/);
    if(regexFile){
        helpers.fileRespond(res, 'public' + regexFile[0]);
        return;
    }
    // console.log(regexFile[0]);
    
    var action = routes[pathname];
    if (action) {
        var method = req.method;
        var handler = action[method];

        if (handler){
            handler(res);
        }
        else{
            helpers.respond(res, `Metode ${req.method} ikke tilladt`, 404);
            return;
        }
        // action(res);
        return;
    }
    // Hvis vi er her er der ikke fundet en route
    helpers.respond(res, 'Route findes ikke', 404);
};
```
<a name="database"></a>[^ tilbage](#top)
### 3. Del. Databasen.

I vores CMS får vi brug for at opbevare data. Til det formål skal vi oprette en database med de nødvendige tabeller.
Der findes mange databasesystemer at vælge i mellem. Jeg har valgt at bruge MySQL.

Til at starte med skal vi oprette en database. Det kan vi gøre med en række databaseværktøjer fx phpMyAdmin eller MySQL-Workbench eller fra den tekstbaserede MySQL client.

```sql
CREATE DATABASE `demo-cms` /*!40100 DEFAULT CHARACTER SET utf8 COLLATE utf8_danish_ci */;
```

Vi får brug for en tabel til de menupunkter vi vil vise på siden. Tabellen skal have kolonner for primærnøgle (id), navn, eventuel beskrivelse, et timestamp for indsættelse af en række samt en kolonne for rækkefølgen som vi ønsker at vise de enkelte menupunkter. 

Menu tabellen
```sql
CREATE TABLE `menu` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(45) NOT NULL DEFAULT '',
  `description` varchar(255) NULL,
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `position` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
); 
```

Vi får også brug for en tabel til de artikler vi ønsker at vise på vores side.

Articles tabellen
```sql
CREATE TABLE `articles` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `fk_menu_id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `content` text NOT NULL,
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
);

```

Vi skal også oprette en databasebruger med de nødvendige crud-rettigheder. Jeg har valgt at brugeren skal hedde `wwwuser`.
Jeg har sat brugerens adgangskode `wwwuser`. I en produktionsklar udgave af dette CMS skal man naturligvis vælge en bedre adgangskode end ovenstående, men i udviklingsfasen, hvor systemet ikke er tilgængeligt fra internettet er det ok.

Ny bruger:
```sql
CREATE USER 'wwwuser'@'localhost' IDENTIFIED BY 'wwwuser';
```

Brugeren skal også have CRUD rettigheder til alle tabeller i `demo-cms` databasen
```sql
GRANT SELECT, INSERT, UPDATE, DELETE ON `demo-cms`.* TO 'wwwuser'@'localhost';
```

For at få adgang til databasen fra node.js skal vi bruge et 3. parts modul. Modulet er `mysql2.js`. Vi installerer modulet med npm: `npm install --save mysql2`

Nu skal vi oprette en ny mappe til de javascript filer der skal håndtere databasen.

Jeg har valgt at kalde mappen for `data`. Inde i den mappe opretter jeg en fil der hedder `database.js` Filstrukturen ser nu således ud

```
├── data
│   ├── database.js
│
├── endpointhandlers
│   ├── cat.js
│   └── dog.js
│
├── public
│   ├── css
│   │   └── style.css
│   │
│   ├── img
│   │   ├── logo.png
│   │   └── anonymprofil.png
│   │
│   ├── js
│   │   └── script.js
│   │
│   └── index.html
│
├── helpers.js
├── router.js
└── server.js
```

Lad os kigge på `database.js` filen.
```javscript
const helpers = require('./../helpers');
const mysql = require('mysql2');

// objekt til database credentials
const dbcreds = {
    user : 'wwwuser',
    password : 'wwwuser',
    host : 'localhost',
    database : 'demo-cms'
};

// Opret forbindelse til databasen
var connection = mysql.createConnection(dbcreds);
```
Hvis det lykkes at oprette en forbindelse til databasen, vil variablen `connection` indeholde et database objekt der har forbindelse til databasen og giver os mulighed for at manipulere med databasen.

Næste skridt er at exportere en metode, eller funktion der kan hente data fra databasen. Metoden skal tage et response objekt, en sql streng samt en callback funktion der kan tage imod de data der kommer fra databasen.

Med den tilføjede kode ser `database.js` sådan ud.


```javascript
const mysql = require('mysql2');
const helpers = require('./../helpers');

const creds = {
    host : 'localhost',
    user : 'wwwuser',
    password : 'wwwuser',
    database : 'demo-cms'
};

const connection = mysql.createConnection(creds);

exports.select = function(res, sql, callback){
    connection.query(sql, function(err, data){
        if(err){
            helpers.respond(res, {besked : 'Der opstod en fejl...'}, 404);
            return
        }
        callback(data);
    })
}
```

Menutabellen i databasen skal som sagt indeholde de menupunkter vi ønsker at få vist på `index.html`. Vi skal tilføje noget kode for at få menuen til at virke.

Først skal vi oprette en route, `menuitems`. Denne route skal kunne håndtere `GET` requests fra browseren. 

Filen `router.js` skal derfor have denne tilføjelse til de routes der allerede findes:
```javascript
   '/menuitems' : require('./endpointhandlers/menuitems')
```

Vi skal også oprette en fil i `endpointhandlers` mappen. Jeg vælger at kalde filen `menuitems.js`.
Indholdet i denne fil ser sådan ud:
```javascript
const helpers = require('./../helpers');
const database = require('./../data/database');

module.exports = {
    'GET' : function(req, res){
        var sql = "SELECT * FROM menu ORDER BY position";
        database.menuselect(res, sql, function(data){
            helpers.respond(res, data);
        });
    }
}
```

Næste skridt er at oprette en javascript fil i `public/js` mappen. Jeg kalder filen menu.js. Den skal indeholde kode der sender en GET request til serveren.

public/js/menu.js
```javascript
fetch('/menuitems')
    .then(function(data){
        return data.json()
    })
    .then(function(menuitems){
        var menu = '';
        menuitems.forEach(function(item){
            menu += '<span class="menuitem">' + item.name + '</span>';
        });
        document.querySelector('#publicnavigationbar').innerHTML = menu;
    })
    .then(function () {
        document.querySelector('.menuitem').click();  // Simuler et museklik ved at aktivere click eventen.
    })
    .catch(function(err){
        console.log(err);
    });
```

Koden sender en GET request til `/menuitems`. Serveren svarer tilbage med en array struktur med JSON elementer der indeholder menupunkterne. Arrayet gennemløbes i et forEach-loop der genererer en række html elementer, her span elementer, der indeholder menuteksten. Til sidst indsættes html elementerne i menubaren, der her er et html div med id="publicnavigationbar".

Læg mærke til at koden indeholder tre `.then()` blokke. Den sidste blok henter en reference til det første element der har klassen `menuitem` og simulerer et museklik på elementet. Det medfører at når brugeren kommer ind på siden 1. gang vil artiklerne der hører til dette 1. menupunkt blive vist.

Senere i forløbet skal vi opbygge admininstrationsdelen af vores CMS, hvor vi vil kunne oprette, ændre eller fjerne menupunkter fra databasen, og dermed i vores index.html.

For at brugere skal få adgang til administrationssiden, skal de først gennem en login side. Næste kapitel vil handle om loginsystemet.


<a name="login"></a>[^ tilbage](#top)
### Login
Vores loginsystem anvender _cookies_. Men først en lille gennemgang af hvad cookies er for en størrelse.

Cookies er i bund og grund ikke andet end en stump tekst. Typisk organiseret som et eller flere _name/value_ par. Via http headere, kan vi sende cookies til en browser, ligesom browseren også er i stand til at sende cookies via http headere. Når en eller flere cookies modtages af en browser, lagrer den disse og holder styr på hvilket domæne hver enkelt cookie tilhører. Når browseren igen sender en http request til en server vil den automatisk medsende de cookies der tilhører det pågældende domæne. Cookies der er oprettet af andre domæner vil ikke blive sendt med. Kun cookies der 'tilhører' domænet. På den måde er det muligt for browseren at gemme information om de enkelte domæner i cookies. En måde at anvende cookies på, er i forbindelse med login. Hvis en bruger er logget ind kan man lade en cookie indholde information der kan verificere, at brugeren er logget ind. 

Det er også muligt at sætte et `expire` timestamp for hver enkelt cookie. Når dette timestamp overskrides, vil browseren automatisk slette den pågældende cookie.

Når vi skal oprette en eller flere cookies kan vi gøre det sådan:
Eksempel.
```javascript
var cookieValue1 = 'Værdi1', cookieValue2 = 'Værdi2'
response.setHeader('Set-Cookie', ['cookie1=' + cookieValue1, 'cookie2=' + cookieValue2]);
```

I eksemplet sætter vi en HTTP header med to cookies, `cookie1` og `cookie2` med værdierne i de to foruddefinerede variabler, `cookieValue1` og `cookivalue2`

Hvis vi ønsker at sætte en `expire` timestamp for en cookie, kan vi gøre det således:
```javascript
response.setHeader('Set-Cookie', ['id=1234'; expire=2017-12-24T23:59:59.000Z]);
```

Denne cookie, der har navnet 'id' og værdien '1234', vil udløbe juleaften et sekund før midnat. 

Men vi får også brug for at kunne læse indkommende cookies på serveren. Vi kan hente den 'rå' cookietekst fra request objektet.

```javascript
var cookie = request.headers.cookie;
```

Lad os skrive koden til `cookieparser` funktion
```javascript
function getCookies(req) { 
    var cookies = {}, cookieParts = [];

    // Hvis der eksisterer en (eller flere) cookies...
    if(req.headers.cookie){
        cookies.raw = req.headers.cookie;   // hent den 'rå' cookie
        cookieParts = cookies.raw.split(';') {
        cookieParts.forEach(function(part){
            if(part.match(/=/){
                var name = decodeURI(part.split('=').trim()[0]) // navne-delen af cookien
                var value = decodeURI(part.split('=').trim()[1]) // værdi-delen af cookien
                cookies[name] = value; // indsæt delene i cookies-objektet
            }
    }); 
    return cookies; // Returner objektet
} 
```

Funktionen tager et request objekt som parameter og returnerer et objekt med de cookies der blev modtaget af serveren.
Hvis der ikke blev modtaget nogen cookie, vil funktionen returnere et tomt objekt.

Ud over vores cookie-parser funktion får vi brug for at kunne læse form-data der submittes til serveren som en POST request.

~~Når en form submittes til serveren vil request objektets 'data' og 'end' events kunne bruges til at styre indlæsningen af de indkommende form-data.~~~

Efter en del overvejelser har jeg besluttet at bruge et tredieparts modul til at læse indkommende formdata. Blandt de mange muligheder der findes, har jeg valgt at bruge modulet `multiparty`. Dette modul har en simpel API, er namt at bruge og har kun en enkelt dependency. Det betyder at når man installerer dette modul vil det kun være enkelt modul der yderligere bliver installeret. Jo færre dependencies, jo bedre. I denne sammenhæng skal man huske at importere `multiparty` modulet i `helpers.js` filen med `require()` funktionen


Eksempel på anvendelse af multiparty:
```javascript
const multiparty = require('multiparty');

function getFormData = function(req, res, callback){
    var form = new multiparty.Form();

    form.parse(req, function(err, fields, files){
        if(err){
            exports.respond(res, {besked: 'Der opstod en fejl'}, 404);
            console.log(err);
            return;
        }
        callback(fields, files);
    });
    
};
// Oprindelig kode er udkommenteret
// function getFormData(req, callback){
//    var userdata = '';
//    req.on('data', function(data){  // bruger 'data' eventen...
//        userdata += data;   // ...til at trække formdata ind i variablen 'userdata'
//    });
//    req.on('end', function(){   // 
//        var formData = qs.parse(userdata);
//        callback(formData);
//    });
//};
```

~~Funktionen tager to parametre, request objektet og en callback funktion. Ved indkommende data vil request objektets 'data' event indtræffe. Den bruger vi til at eksekvere en funktion der overfører alle de submittede data til variablen `userData` Når alle data er overført, vil 'end' eventen indtræffe og eksekvere en funktion. Denne funktion bruger `querystring` mudulet til at parse `userData` og placerer resultatet i variablen `formData`. Tilsidst fodres callback funktionen med denne variabel.~~~

Funktionen tager tre parametre, request og response objekterne og en callback funktion. Ved indkommende data vil `multiparty` parse indkommende data fra `request` objektet og placere resultaterne i variablene `fields` og `files`, hvor `fields` indeholder form data og `files` indholder uploadede filer. Tilsidst fodres callback funktionen med disse variable.

Både `getCookies()` og `getFormData()` funktionerne skal tilføjes til `helpers.js` filen.

Tilføjet til `helpers.js`
```javascript
exports.getCookies = function(req){
    var cookies = {}, cookieParts = [];
    if(req.headers.cookie){
        cookies.raw = req.headers.cookie;
        cookieParts = cookies.raw.split(';');
        cookieParts.forEach(function(cp){
            var name = decodeURI(cp.split('=')[0].trim());
            var value = decodeURI(cp.split('=')[1].trim());
            cookies[name] = value;
        });
    }
    return cookies;
};


exports.redirect = function(res, url){
    res.writeHead(302, {'location': url});
    res.end();
};

exports.getFormData = function(req, res, callback){
    var form = new multiparty.Form();
    form.parse(req, function(err, fields, files){
        if(err){
            exports.respond(res, {besked: 'Der opstod en fejl'}, 404);
            console.log(err);
            return;
        }
        callback(fields, files);
    });
};
```
Mens man udvikler er det en god hjælp, at alle indkommende requests udskrives på server terminalen. Derfor har jeg tilføjet et modul, `logger`, i filem `logger.js`. Modulet udskriver forskellige informationer til konsollen. Det er muligt at styre hvilke informationer der logges ved hjælp af parameteren `level` der defaulter til 3

Koden til `logger.js` er gengivet her:
```javascript
// LOGGER
// level 0: Kun timestamp 
// level 1: Timestamp og Remote-address
// level 2: Timestamp, Remote-address og url
// level 3: Timestamp, Remote-address, url og method (Default)
// level 4: Timestamp, Remote-address, url method og cookies
module.exports = function(req, level = 3){
    var cookies = req.headers.cookie ? req.headers.cookie : 'none';
    var logTxt = new Date().toString();
        logTxt += level >= 1? `; From: ${req.connection.remoteAddress}` : '';
        logTxt += level >= 2? `; URL: ${req.url}` : '';
        logTxt += level >= 3? `; Method: ${req.method}` : '';
        logTxt += level >= 4? `; Cookies: ${cookies}` : '';
    console.log(logTxt);
}
```
Logger.js skal så importeres i `router.js`. Logger funktionen kan så kaldes som det første funktionskald i `router.js`.

Eksempel uddrag fra `router.js`
```
// Importer logger
const logger = require('./logger');

// Denne funktion er arbejdshesten. Den kaldes hver gang serveren modtager en request fra en client
module.exports = function(req, res){
    // Funktionskald til logger() i starten af router-functionen.
    logger(req, 4);
    // -- slut på uddrag

```




Fortsættes...
