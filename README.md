# CMS bygget med Node.js

### 1. Del.


### Indledningsvis vil vi starte med at demonstrere et simpelt API

#### Et meget simpelt API der viser hvordan routes kan opbygges i node.js (næsten) uden brug af 3. parts moduler.

Dvs. dette eksempel benytter sig udelukkende af moduler der er en del af node.js installationen. Derfor er der ikke behov for at installere 3. parts moduler. Jeg vil dog anbefale at _nodemon_ modulet installeres. 

API'et har 2 forskellige routes.
* `/kat    (der svarer 'Miav' på en GET request)`
* `/hund   (der svarer 'Vov-vov på en GET request)`

 
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
    '/kat' : function(res) {
                 res.writeHead(200, {'Content-type' : 'application/json'});
                 res.end('Miav');
             },
             
    '/hund' : function(res){
                 res.writeHead(200, {'Content-type' : 'application/json'});
                 res.end('Vov-vov');                
              }            
};

module.exports = function(req, res){
    // Vi henter pathname fra request objektet.
    var pathname = url.parse(req.url).pathname;
    
    // Hvis vi har en route der matcher '/kat' eller '/hund'
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

Derfor vil jeg ændre koden lidt. Først opretter jeg en ny mappe, `endpointhandlers`. I denne mappe vil jeg oprette to filer, `kat.js` og `hund.js`.

I det to filer placeres funktionerne for henholdsvis `/kat` og `/hund` routene.

endpointhandlers/kat.js
```javascript

module.exports = function(res) {
    res.writeHead(200, {'Content-type' : 'application/json'});
    res.end('Miav');
};
```
endpointhandlers/hund.js
```javascript

module.exports = function(res) {
    res.writeHead(200, {'Content-type' : 'application/json'});
    res.end('Vov-vov');
};
```

Vi har nu fået adskilt selve endpointhandlerne fra `routes.js`, men stadig har vi to handlere der har en del til fælles.
Næste skridt vil være at oprette endnu en fil som jeg vil kalde `helpers.js`. Denne fil er tænkt til at indeholde hjælpefunktioner. I dette eksempel vil der dog kun være en enkelt hjælpefunktion, eller rettere sagt metode, nemlig `.respond()`. Tanken er at denne metode skal indeholde den kode der er fælles for endpointhandlerne. Koden for `respond()` metoden skal se sådan ud:


helpers.js
```javacsript
exports.respond = function(res, message, status = 200){
    res.writeHead(status, {'Content-type' : 'application/json'});
    res.end(message);
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
    '/kat' : require('./endpointhandlers/kat'),
             
    '/hund' : require('./endpointhandlers/hund')            
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

Lad os kigge på en af endpointhandlerne, `kat`. Hvis vi i dette modul ændrer koden til at se sådan ud:

endpointhandlers/kat.js
```javascript

module.exports = {
    'GET' : function(res) {
                res.writeHead(200, {'Content-type' : 'application/json'});
                res.end('GET: Miav');
            },
    'POST' : function(res) {
                res.writeHead(200, {'Content-type' : 'application/json'});
                res.end('POST: Miav');
            }            
};
```

På tilsvarende vis skal `hund` ændres til at se sådan ud:

endpointhandlers/kat.js
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

Men for at få den ændrede kode til at virke, er det nødvendigt at ændre i `router` modulet.

Koden i dette modul ændres så den ser sådan ud:

router.js
```javascript
const url = require('url');
const helpers = require('./helpers');

// Definition af vores API og API-handlere
const routes = {
    '/kat' : require('./endpointhandlers/kat'),
             
    '/hund' : require('./endpointhandlers/hund')            
};

module.exports = function(req, res){
    var pathname = url.parse(req.url).pathname;
    
    var handler = routes[pathname];
    if(handler){
        var action = handler[req.method];
        if(action){
            action(res);
            return;
        }
        helpers.respond(res, `Status: 404. Metode '${req.method}' ikke understøttet.`, 404);
        return;
    }
    // Hvis vi er her er der ikke fundet en route (eller endpointhandler)
    helpers.respond(res, `Status: 404. Route '${pathname}' findes ikke` , 404);
}
```

Vi har nu et simpelt API der er i stand til at svare på både `GET` og `POST` request. Det er nu op til dig at udvide dette API til også at kunne håndtere andre requesttyper fx. `PUT` og `DELETE`. Prøv også at tilføje en route, fx. `/and` der svarer `Rap-rap` på indkommende request.

### 2. del. Statiske filer

Vores API kan ikke levere statiske filer. Det får vi brug for, så vi skal til at lave de nødvendige tilføjelser til koden for at det kan lade sig gøre. 

Vi skal tilføje en hjælpefunktion til vores `helpers.js`. Funktionen skal kunne læse en fil fra filsystemet og sende indholdet i filen til en browser ved hjælp af `response` objektet. Derfor får vi brug for filsystem-modulet `fs`. 

Vi får også brug for at kunne detektere hvilken mimetype vi har med at gøre. Vi skal derfor oprette et objekt til at indholde definitionerne på de mimetyper vi ønsker at kunne håndtere.

Vi opretter et json-objekt i `helpers` filen. Objektet indeholder en række navn/værdi par, hvor navnene svarer til ekstensionen på de filer vi ønsker at håndtere, og værdierne svarer til mimetyperne.

Koden for mimetype-objektet.
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

Vi får også brug for en funktion der kan læse filer fra serverens filsystem. Derfor får vi brug for at importere filsystem modulet `fs` der også er en del af node installationen.

Det gør vi i starten af filen `helpers.js` med denne linje `var fs = require('fs');` 

Koden til funktionen der skal læse en fil fra filsystemet sende den til browseren placeres også i `helpers.js` 

Her er koden
```javascript
exports.fileRespond = funktion(res, fileName){
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


Fortsættes...
