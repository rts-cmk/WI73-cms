


<a id="top" name="top"></top>
# Simpelt CMS bygget med Node.js

### Jeg vil her vise hvordan man kan opbygge et meget simpelt CMS site, programmeret i Node.js. Lad mig straks påpege, at koden først og fremmest er skrevet til undervisningsbrug, og udgør ikke på nogen måde et produktionsklart system.

## Indhold.
* [1.0 Indledning](#1.0-indledning)
* [2.0 Database](#2.0-database)
* [3.0 API](#3.0-api)
    * [3.1 Endpoints](#3.1-endpoints)
    * [3.2 Metoder](#3.2-metoder)
    * [3.3 Endpoints tabel](#endpointTabel)
    * [3.4 Request og Response](#3.4-request_response)    
* [4.0 Backend](#4.0-backend)
    * [4.1-filstruktur](#4.1-filstruktur)
    * [4.2-statiske filer](#4.2-staticfiles)
* [5.0 Frontend](#5.0-frontend)

* [6.0 Login](#6.0-login)


<a id="1.0-indledning"></a> [top &uarr;](#top)  

---
### Indledning  



**Til de utålmodige.**  
Hvis du bare har har lyst til at se systemet i aktion med det samme, er der her en vejledning. Da systemet er programmeret i Node.js og bruger MySQL som datalager, er det en forudsætning at både Node.js og MySQL er installerede på din maskine. Hvis ikke, kan du downloade Node.js fra https://nodejs.org/en og MySQL fra https://dev.mysql.com/downloads/mysql. Begge de nævnte websteder har installationsvejledninger. Efter at Node.js og MySQL er installerede kan du fortsætte med 5 trins vejledningen nedenfor.  

1. Download og udpak filerne fra dette github repositorium til en mappe efter eget valg. 

2. Kør sql-scriptet `database-dump.sql` i dit yndlings databaseværktøj, fx. phpMyAdmin, mysql-workbench, sequel-pro, Valentina-studio, etc, etc. Scriptet opretter databasen med de nødvendige tabeller og en database-bruger med de nødvendige rettigheder. Det er denne bruger der anvendes af systemkoden til at oprette forbindelse til databasen. (Brugernavn  'wwwuser' og adgangskoden er 'wwwuser'.

3. Åbn en terminal, `cd` hen til mappen med de udpakkede filer og kør kommandoen `npm install`

4. Systemet kan nu startes op med kommandoen `npm start`. Hvis systemet ikke kan starte, kan det skyldes at `nodemon` ikke er installeret. Prøv at installere `nodemon` med kommandoen `npm install nodemon`

5. Åbn en browser og gå til `http://localhost:3003` for at gå til public siden.  
Eller `http://localhost:3003/login` for at gå til administrationssiden. (brugernavn/adgangskode er admin/admin)

<hr>

#### Oversigt 
Dette simple CMS kan opdeles i to dele, frontend og backend. Frontend delen kan så igen opdeles i to dele, nemlig *public-* og *administrationsdelen.* Med publicdelen forstår jeg den del der kan tilgås af alle gennem en internetbrowser. Der kræves ikke login for at tilgå denne del. Administrationsdelen derimod, kan man kun få adgang til ved at logge ind med brugernavn og adgangskode.  
Backend-delen kan faktisk også deles i to dele, kodedelen og databasesystemet.  Selv om databasen er en del af backenden vil backend og databasen blive behandlet hver for sig i denne tekst.
Overordnet set kommunikerer frontend og backend via ajax kald. Alle data der sendes fra backenden er i JSON format. Login delen bruger cookies til at verificere om en given bruger er logget ind. Ellers er backenden opbygget som et simpelt API med et antal endpoints der hver især accepterer en eller flere af http request metoderne: GET, POST, PUT og DELETE.  
Netop fordi dette system er udviklet til undervisning, har jeg bevidst søgt en løsning der kun i begrænset omfang anvender 3. parts moduler. Ikke fordi jeg er modstander af at bruge 3. parts moduler, men min holdning er at læringsudbyttet er langt større når man selv bygger funktionaliteten op helt fra grunden. Det er årsagen til at jeg har valgt kun at bruge to tredieparts moduler, nemlig `mysql2` og  `multiparty`  


<a id="2.0-database"></a> [top &uarr;](#top)  

---
### Database  
  
Som sagt får vi brug for et databasesystem. Der findes mange databasesystemer at vælge i mellem. Jeg har valgt at bruge MySQL. Ligeledes findes der en række databaseværktøjer til at administrere databaser og tabeller i MySQL, fx. phpMyAdmin, MySQL-Workbench, Valentina-studio, Sequel-pro eller den tekstbaserede MySQL client der er en del af MySQL installationen. Jeg vil ikke komme ind på brugen af disse værktøjer, men blot kort beskrive de tabeller vi får brug for og præsentere de sql statements der kan oprette databasen og tabellerne.

Selve databasen kan oprettes med følgende `sql` sætning.
```sql
CREATE DATABASE `demo-cms`;
```
Vi skal oprette en tabel til de brugere som skal kunne logge ind på backenden. Tabellen skal indeholde deres credentials (brugernavn/adgangskode). Tabellen skal som minimum have kolonner for id, brugernavn og adgangskode. Jeg har valgt også at have kolonner for billede og sidste opdatering. Vi må kræve at der ikke er sammenfald mellem brugernavne. Derfor skal vi erklære kolonnen `username` som `unique`. Det gør at vi ikke kan indsætte det samme brugernavn mere end en enkelt gang. Vi kan jo heller ikke have to eller flere brugere med samme brugernavn. Ellers kan vi ikke skelne mellem dem. Kolonnen for sidste opdatering, `updated`,  er sat til at indsætte `current_timestamp` som standardværdi både ved indsættelse af en række og ved opdatering af en række. Det betyder at vi ikke behøver at indsætte noget i denne kolonne. Databasen vil selv sørge for det.

```sql
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(255) NOT NULL,
  `password` varchar(128) NOT NULL,
  `updated` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, ON UPDATE CURRENT_TIMESTAMP,
  `img` varchar(24) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username_UNIQUE` (`username`)
);
```
Vi skal også have nogle testdata indsat i `users` tabellen
```sql
INSERT INTO `users` (`username`,`password`) VALUES ('admin','admin');

```
Læg mærke til vi ikke behøver at indsætte noget i hverken `id`, `updated` eller `img` kolonnerne. Det sørger databasen selv for, fordi der er angivet en defaultværdi for disse kolonner.

Vi skal også oprette en tabel til de menupunkter vi vil vise på siden. Tabellen skal have kolonner for id, navn, eventuel beskrivelse, et timestamp for indsættelsestidspunkt samt en kolonne for den rækkefølge som vi ønsker at menupunkterne skal vises i. 

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
Vi får også brug for nogle testdata i denne tabel
```sql 
INSERT INTO `menu` (`name`, `position`) 
VALUES ('Hjem',1),('Nyheder',2),('Tjenester',3),('Om os',5),('Kontakt',4);
```

Du kan selvfølgelig vælge at indsætte nogle andre data i tabellen.

De artikler vi skal vise skal også have en tabel.  

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
Jeg har indsat nogle testdata i denne tabel.
```sql
INSERT INTO `articles` (`fk_menu_id`, `title`, `content`) 
VALUES (1,'Vejret','<p>Tja, ved ikke rigtig....</p>'),
(2,'Minister går amok','<p>Minister går amok, bider mikrofonledningen over da han får et kritisk spørgsmål</p>'),
(3,'Tjenester','<p>Vi yder en uovertruffen tjeneste mod en beskeden betaling</p>'),
(4,'Hvem er vi','<p>Vi er en virksomhed der lige fra starten af har lagt os i førerfeltet.</p><p>Det hele startede med at NN (vores grundlægger) havde en idé om at det måtte kunne gøres på en nemmere måde.</p><p>Med denne grundtanke gik han i gang med at etablere en virksomhed.</p>'),
(4,'Leverandør til mange virksomheder og institutioner','<p>Vi har lige fra starten leveret totalløsninger af meget høj kvalitet til en lang række virksomheder, både private og offentlige</p><ul style=\"padding-left: 28px;\"><li>AAAAA</li><li>BBBBB</li><li>CCCCC</li><li>DDDDD</li><li>EEEEEE</li></ul>og mange flere'),
(1,'Nederlag for Trump, igen - igen - igen','<p>Det lykkedes heller ikke denne gang for USA\'s præsident at samle flertal for at afskaffe \'Obamacare\'</p>');
```
Vi får senere brug for endnu en tabel i forbindelse med login. Selv om vi først får brug for den senere, kan vi lige så godt oprette den med det samme. 
```sql
CREATE TABLE `user_sessions` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `session_key` varchar(128) COLLATE utf8_danish_ci NOT NULL DEFAULT '',
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `session_key_UNIQUE` (`session_key`)
```
Jeg vil vente med at omtale denne tabel til vi skal bruge den.

For at backenden kan oprette forbindelse til databasen får vi brug for at oprette en databasebruger. Jeg ved at mange blot vælger at bruge MySQL's indbyggede administratorbruger `root`. Det kan imidlertid ikke anbefales fordi `root` har samtlige rettigheder til alle databaser og tabeller og kan ved et uheld virkelig lave rod i systemet. Især i forbindelse med test af `sql` sætninger.  Derfor vil jeg absolut anbefale at oprette en databasebruger der kun har adgang til den database vi arbejder med, og kun har de nødvendige *crud  rettigheder*. Ikke andet. 

Ny bruger:
```sql
-- Vi opretter en bruger der kun kan forbinde til databasesystemet fra 'localhost'
CREATE USER 'wwwuser'@'localhost' IDENTIFIED BY 'wwwuser';
```
Brugernavn og adgangskode er begge sat til `wwwuser`. I en produktionsklar udgave af dette CMS ville man naturligvis vælge en bedre adgangskode end ovenstående, men i udviklingsfasen, hvor systemet ikke er tilgængeligt fra internettet er det ok.

Brugeren skal også have CRUD rettigheder til alle tabeller i `demo-cms` databasen.
```sql
GRANT SELECT, INSERT, UPDATE, DELETE ON `demo-cms`.* TO 'wwwuser'@'localhost';
```
Den grundlæggende databasestruktur er nu på plads.


<a id="3.0-api"></a> [top &uarr;](#top)  

---
### API   
Første gang jeg hørte udtrykket API havde jeg ikke den fjerneste anelse om hvad det betød. Det var inden jeg for alvor var begyndt at beskæftige mig med softwareudviking. API kunne for min skyld lige så godt være et tilsætningsstof til vaskepulver, en ny plasttype eller måske en ny type øl. I dag er jeg så vant til at bruge begrebet, at jeg for sjov godt kunne finde på at gå ind i den nærmeste Matas butik og bede om 250 gram API. Mest for undersøge om Matas skulle ligge inde med noget API. Der er dog en risiko for at Matas ekspedienten ville svare:  `404: Ressource ikke tilgængelig`.  

Spøg til side. API står, som bekendt, for *Application Programming Interface*. Når vi indtaster `http://www.facebook.com` i browserens adressefelt sender browseren en forespørgsel til facebooks webserver. Denne forespørgsel kalder vi oftest en *request*. Requesten skal have et bestemt format for at serveren kan forstå den. Hvis facebooks server forstår requesten vil serveren sende et svar tilbage. Svaret kalder vi *response*. Hvis responsen har et format som browseren forstår, vil den fortolke responsen der så kan blive vist på den planlagte måde. Hvis vores request til serveren ikke har det rigtige format, eller vi requester en ressource der ikke findes, vil serveren svare, ligesom ekspedienten i Matas, med en statuskode der fortæller hvad der gik galt, fx. `404: Ressource ikke tilgængelig`. Det vi har med at gøre her er et web API. Dette API kan vi designe så det er skræddersyet til vores formål.

Når vi designer et web API handler det primært om at definere såkaldte *endpoints* og det dataformat vi skal benytte, fx JSON eller XML eller et andet format.

<a id="3.1-endpoints"></a> [top &uarr;](#top)  
#### Endpoints  
Lad os kigge på en ganske almindelig URL: `http://www.skat.dk/skat.aspx?oid=2661`. Denne URL kan splittes op i forskellige dele:  
* Protokollen:  `http:`.
* Domænenavn: `www.skat.dk`. Protokol og domænenavn adskilles med `//`
* Endpoint: `/skat.aspx` der her består af en skråstreg og et filnavn.
* Og tilsidst querystrengen: `oid=2661` spørgsmålstegn er skilletegn mellem endpoint og querystrengen. Querystrengen kan bestå af en eller flere parametre.

I princippet kan der være et vilkårligt antal parametre. De skal blot adskilles med `&` som vist i det næste
eksempel: `http://eksempel.dk/sport/tennis?place=wi&year=2017&dbl=1`. Her udgør `/sport/tennis` vores endpoint. Efter spørgsmålstegnet kommer querystrengen, der her består af tre parametre: 
1. `place=wi` 
2. `year=2017` 
3. `dbl=1` 

Selv om HTTP protokollen ikke sætter nogen begrænsninger på længden af querystrengen er der i de fleste browsere begrænset hvor mange tegn man kan benytte. De fleste webservere har også en øvre grænse for hvor mange tegn de vil acceptere.

<a id="3.2-metoder"></a> [top &uarr;](#top)
#### Metoder  
Når vi skriver javascript kode der sender HTTP requests til en server skal vi også angive hvilken HTTP metode vi skal benytte. I den forbindelse er det måske på plads lige at berøre dette begreb.  
HTTP protokollen udgør et sæt regler for hvordan beskeder udveksles mellem sender og modtager.  
I HTTP samenhæng er der som minimum to parter involverede, client og server. Clienten vil her være det samme som browseren. Det er altid browseren der indleder en udveksling af beskeder. Det sker ved at browseren sender en forespørgsel (request) til serveren. Serveren svarer tilbage med en respons. De data der udveksles skal overholde et ganske bestemt format der er beskrevet i HTTP protokollen.   
HTTP beskeder er grundlæggende tekstbaserede og er opdelt i *header* og *body*.   
Bodydelen betegnes ofte som *payload*. I headeren er der bl.a. information om payloaden. Fx hvilket tegnsæt den anvender, antal bytes i payloaden, requestens afsenderadresse, HTTP statuskode, etc, etc. Blandt de headerdata der sendes er også hvilken *metode* der skal anvendes. Der er intet magisk ved en HTTP metode. Den får ikke serveren til automatisk at handle på en bestemt måde. Det er i virkeligheden ikke andet end et udsagnsord eller *verbum*. Det er dig som programmør der skal fortolke metoden og skrive kode der udfører det ønskede.

HTTP protokollen beskriver en række metoder eller verber og hvordan de er tænkt anvendt. De metoder vi kommer til at beskæftige os med i dette projekt er, `GET`, `POST`, `PUT` og `DELETE`. 

* GET når vi blot vil hente data fra serveren.
* POST når vi vil oprette en ressource, fx uploade en ny artikel
* PUT når vi vil opdatere en ressource, fx redigere en artikel.
* DELETE når vi vil fjerne en ressource, fx slette en artikel.

Hvis du vil vide mere om HTTP protokollen og HTTP metoder kan du læse mere om det på [IETF's hjemmeside](http://www.ietf.org/rfc/rfc2616.txt)

Kombinationen af endpoints og metode er bestemmende for hvordan en indkommende request skal fortolkes på serveren. Som webudvikler er det dig der skal planlægge hvilke kombinationer af endpoints og metoder serveren skal genkende og hvad responsen skal være.
 
 Derfor kan det være en god ide, allerede på et tidligt tidspunkt i udviklingsfasen, at planlægge et API og de handlinger der skal udføres.  
 Her er et eksempel på en oplistning af et API med angivelse af metoderne for de enkelte endpoints og en kortfattet beskrivelse af hvad der skal udføres.

 <a id="endpointTabel"></a>[top &uarr;](#top)


URL                       |Endpoint    |Metode| Beskrivelse  
--------------------------|------------|------|------------
http://localhost/         |'/'         |GET   |send index.html
http://localhost/menuitems|'/menuitems'|GET   |send hovedmenuen
http://localhost/menuitems|'/menuitems'|POST  |opret et menupunkt
http://localhost/menuitems|'/menuitems'|PUT   |opdater menupunkt
http://localhost/menuitems|'/menuitems'|DELETE|fjern menupunkt
http://localhost/users    |'/users'    |GET   |send liste med brugere
http://localhost/users    |'/users'    |POST  |opret bruger
http://localhost/users    |'/users'    |PUT   |opdater bruger
http://localhost/users    |'/users'    |DELETE|fjern bruger
http://localhost/article  |'/article'  |GET   |send artikler
http://localhost/article  |'/article'  |POST  |opret artikel
http://localhost/article  |'/article'  |PUT   |opdater artikel
http://localhost/article  |'/article'  |DELETE|fjern artikel
http://localhost/login    |'/login'    |GET   |send login.html
http://localhost/login    |'/login'    |POST  |opret login session
http://localhost/login    |'/login'    |DELETE|fjern login session


<a id="3.4-request_response"></a> [top &uarr;](#top)

#### Request og Response    
Som webudvikler skal du også tage stilling til hvilke dataformater der skal anvendes når clienten, her browseren, sender requests til serveren og hvilket format serveren skal anvende når den kvitterer for en request, ved at sende en response. 

I dette projekt har jeg valgt, at simple requests med parametre sendes som såkaldte GET parametre. Fx. når der requestes en artikel skal det være muligt enten at requeste en specifik artikel, eller requeste artikler der tilhører en bestemt kategori. Der kan være flere artikler til hver kategori. Men når det handler om formularer med brugerindtastninger skal requesten sendes som `multipart/form-data`.

Eksempler på GET parametre:
* `http://localhost/article?catid=4` (Request for alle artikler med kategori ID 4)
* `http://localhost/article?artid=8` (Request for artiklen med artikel ID 8)

Dataformatet på responsen skal i dette projekt være i form af JSON strukturer.

Her er et eksempel på responsen for en GET request til `/menuitems`

```json
[
  {
    "id": 1,
    "name": "Hjem",
    "description": null,
    "created": "2017-07-28T07:08:26.000Z",
    "position": 1
  },
  {
    "id": 2,
    "name": "Nyheder",
    "description": null,
    "created": "2017-07-28T07:08:41.000Z",
    "position": 2
  },
  {
    "id": 3,
    "name": "Tjenester",
    "description": null,
    "created": "2017-07-28T07:09:04.000Z",
    "position": 3
  },
  {
    "id": 5,
    "name": "Kontakt",
    "description": null,
    "created": "2017-07-28T07:09:50.000Z",
    "position": 4
  },
  {
    "id": 4,
    "name": "Om os",
    "description": null,
    "created": "2017-07-28T07:09:43.000Z",
    "position": 5
  }
]
```

Vi ser at responsen her er formatteret som et array med 5 JSON elementer.

Jeg har valgt JSON, fordi det er nemt at overskue for os mennesker. Derfor er det også forholdsvis nemt at skrive kode der kan håndtere JSON.

<a id="4.0-backend"></a> [top &uarr;](#top)  

---
### Backend  

Indledningsvis vil jeg demonstrere et meget simpelt API, blot for at vise hvordan det kan gøres.

I første omgang vil jeg udelukkende benytte mig af moduler der er en del af node.js installationen. Derfor er der ikke behov for at installere 3. parts moduler. Jeg vil dog anbefale at `nodemon` modulet installeres. Dette modul gør livet lidt nemmere når man udvikler. Ved at bruge `nodemon` til at starte din node server, slipper du nemlig for at skulle genstarte hver gang du laver ændringer i din kode.

Jeg starter med at vælge hvilken HTTP port vores server skal anvende. Jeg har valgt at bruge port 3003. I princippet kan man bruge hvilken som helst port, blot skal man sikre sig at porten ikke allerede er i brug. Typisk vil man vælge et portnummer højere end 1024, fordi anvendelsen af porte med lavere nummer kræver administratorrettigheder. Det betyder, at hvis man vælger portnummer under 1024 skal man starte sin server op som administrator. Det frarådes af sikkerhedsgrunde.  

Vi skal planlægge vores API. I denne indledende demonstration skal vi konstruere et API med 2 forskellige routes.

Metode|Route|Response
------|-----|--------
GET   |/cat |'Miauw'
GET   |/dog |'Vov-vov'  

Altså en route `/cat` der svarer 'Miauw' på en GET request.  
Og en route `/dog` der svarer 'Vov-vov på en GET request

#### Serveren  
Næste skridt handler om at skrive kode. Vi starter med at opretter en HTTP server.
Selve serveren er defineret i `server.js` og benytter sig af node modulet `http` samt et modul, `router.js` som vi selv skal skrive koden til.

server.js
```javascript
const 
    http = require('http'),
    router = require('./router');

http.createServer(router).listen(3003);
console.log('Server er startet. Venter tålmodigt ved port 3003');
```

I server modulet importerer vi først to moduler, `http` og `router`.  Dernæst opretter vi en server med http modulets `createServer()` metode. Vi sender det importerede modul `router` (som vi ikke har skrevet koden til endnu) "ned i maven" på serveren og konfigurerer serveren til at lytte efter requests på port 3003. Tilsidst sender vi en besked til konsollen om at serveren er oppe at køre.

Koden i modulet `router` der sendes "ned i maven" på serveren vil blive eksekveret hver gang serveren modtager en indkommende *request* på port 3003.

For at starte serveren skal vi indtaste kommandoen `node server.js` i en terminal. Hvis vi forsøger at starte serveren op med denne kommando inden vi har skrevet koden til modulet `router.js` vil det naturlgvis ikke lykkes. Serveren kan nemlig ikke finde `router.js` modulet da det ikke findes endnu.

Men lad oprette modulet og få skrevet den kode der skal være i modulet. Koden skal udgøre de to endpointhandlere for `/cat` og `/dog`. Opret en fil, `router.js` og indsæt koden nedenfor.

`router.js`
```javascript
// Vi importerer modulet 'url';
const url = require('url');

/* Definition af vores API og API-handlere. (Endpointhandlere) */
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
    /* Denne anonyme function er arbejdshesten. 
     * Funktionen kører hver gang serveren modtager en request.
     *
     * Når der modtages en request, vil Request objektet indeholde den information vi behøver.
     * Vi bruger url modulets parse() metode til at trække pathname ud af request objektet.
     * Hvis requesten var fx. http://localhost/cat, vil variablen pathname indholde "/cat"  */
    var pathname = url.parse(req.url).pathname;
    
    /* Hvis vi har en route der matcher '/cat' eller '/dog' henter vi den 
     * ind i 'handler' variablen. Det kan vi gøre fordi vi jo har defineret 
     * routes["/cat"] og routes["/dog"] til at indeholde de funktioner der 
     * sender en respons tilbage til browseren. Hvis vores pathname ikke matcher en
     * af de to foruddefinerede routes vil vores handler blot være "undefined". */
    var handler = routes[pathname];
    
    // Checker om vi har noget i 'handler'...
    if(handler){
        handler(res);   // ...hvis vi har en funktion i 'handler' skal den eksekveres...
        return; // ...derefter afsluttes funktionen.
    }
    
    /* Hvis vi er her er der ikke fundet en route (eller endpointhandler)
     * Det meddeler vi ved at sende en http-status 404 og en tekst til browseren */
    res.writeHead(404, {'Content-type' : 'text/plain; charset=utf-8'});
    res.end('Route ' + pathname + ' findes ikke');                    
}
```

Kigger vi på vores to endpointhandlere ser vi, at de to funktioner ligner hinanden ret meget. Eneste forskel er at den ene sender tekst strengen 'Miauv' til browseren, mens den anden sender 'Vov-vov'.

En af grundtankerne i Node.js er en modular arkitektur. Dvs. at vi opdeler vores system i moduler. Derfor vil jeg placere vores to endpointhandlere i hver sin separate fil. Efterhånden som systemet udvikles vil vi få flere filer med endpointhandlere. Derfor vil jeg placere dem i en mappe for sig, `endpointhandlers`.

`endpointhandlers/cat.js`
```javascript
module.exports = function(res) {
    res.writeHead(200, {'Content-type' : 'application/json'});
    res.end('Miauv');
};
```
`endpointhandlers/dog.js`
```javascript
module.exports = function(res) {
    res.writeHead(200, {'Content-type' : 'application/json'});
    res.end('Vov-vov');
};
```

Vi har nu fået adskilt selve endpointhandlerne fra `routes.js`, men stadig har vi to handlere der har en del til fælles.
Næste skridt vil være at oprette endnu en fil som jeg vil kalde `helpers.js`. Denne fil er tænkt til at indeholde hjælpefunktioner. I dette eksempel vil der til at starte med kun være en enkelt hjælpefunktion, eller rettere sagt metode, nemlig `respond()`. Tanken er at denne metode skal indeholde den kode der er fælles for endpointhandlerne. Koden for `respond()` metoden skal se sådan ud:

`helpers.js`
```javacsript
exports.respond = function(res, message, status = 200){
    res.writeHead(status, {'Content-type' : 'application/json'});
    res.end(JSON.stringify(message));
};
```

Læg mærke til det sidste argument `status`. Dette argument får default værdien 200, hvilket er http-statuskoden for at alt er gået godt. Læg også mærke til at `Content-type` sættes til `application/json`. Det er fordi jeg har planlagt at response data til browseren skal være i JSON format. Derfor skal jeg konvertere payloaden til en JSON-string. Det gør jeg ved hjælp af javascripts indbyggede funktion `JSON.stringify()`


Dette nye modul, `helpers.js`, skal vi bruge i vores `router.js` modul. Vi skal ændre koden i `router.js` så den ser sådan ud:

`router.js`
```javascript
const url = require('url');
const helpers = require('./helpers'); // importer helpers

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

I den sidste linie bruger vi `respond()` metoden.

I sin nuværende form kan vores API ikke skelne mellem request metoder som fx `GET`, `POST`, `PUT` eller `DELETE`

Heldigvis er det enkelt at udvide API'et til også at kunne dette.

Lad os kigge på en af endpointhandlerne, `cat`. Tilføjer lidt kode i dette modul så det ser sådan ud:

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

På tilsvarende vis skal `dog.js` ændres til at se sådan ud:

`endpointhandlers/dog.js`
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
Vi har nu udbygget koden så modulerne indeholder 2 funktioner, en til at håndtere `GET`requests og en til at håndtere `POST` requests.
Men for at få den ændrede kode til at virke, er det også nødvendigt at ændre i `router.js` modulet.

Koden i dette modul ændres så den ser sådan ud:

`router.js`
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
        // Hvis vi er her, er der fundet en route der matcher.
        // Vi skal derfor se om vi også kan finde en metode der matcher
        var action = handler[req.method];
        if(action){
            // Hvis vi er her er der fundet både en matchende route og metode.
            action(res);  // Den fundne funktion eksekveres...
            return;     // ...og afslut.
        }
        
        // Hvis vi er her er der fundet en route der matcher, 
        // men der er ikke fundet en matchende metode.
        helpers.respond(res, `Status: 404. Metode '${req.method}' ikke understøttet.`, 404);
        return;
    }
    // Hvis vi er her er der ikke fundet en route (endpointhandler)
    helpers.respond(res, `Status: 404. Route '${pathname}' findes ikke` , 404);
}
```

Vi har nu et simpelt API der er i stand til at svare på både `GET` og `POST` requests. Det er nu op til dig at udvide dette API til også at kunne håndtere andre requesttyper fx. `PUT` og `DELETE`. Prøv også at tilføje en route, fx. `/duck` der svarer `Rap-rap` på indkommende `GET` request.

Vores API skal nu udvides til at håndtere alle de planlagte routes som vi har angivet i endpointstabellen. ([Se tabel](#endpointTabel))  

Jeg vil ikke gennemgå alle detaljer i endpointhandlerne, men henviser til filerne der er placerede i mappen `endpointhandlers`. 

<a id="4.1-filstruktur"></a> [top &uarr;](#top)  

#### Filstruktur

Efterhånden som antallet af filer øges bliver det nødvendigt at udtænke en mappe- og filstruktur så der er en form for systematik.

Jeg har valgt at strukturere mapper og filer som vist nedenfor. I figuren er der tilføjet et antal dymmyfiler for bedre at illustrere opdelingen af filer i mapperne.

```
│
├── admin
│   ├── css
│   │   └── style.css
│   │
│   ├── img
│   │   ├── logo.png
│   │   ├── img1.png    // dummynavn
│   │   ├── img2.png    // dummynavn
│   │   └── img3.png    // dummynavn
│   │
│   ├── js
│   │   ├── script1.js  // dummynavn
│   │   ├── script2.js  // dummynavn
│   │   └── script3.js  // dummynavn
│   │
│   └── index.html│
│   
├── data
│   └── database.js
│
├── endpointhandlers
│   ├── cat.js
│   ├── dog.js
|   ├── handlerX.js     // dummynavn
|   ├── handlerY.js     // dummynavn
│   └── handlerZ.js     // dummynavn
|
|
├── public
│   ├── css
│   │   └── style.css
│   │
│   ├── img
│   │   ├── logo.png
│   │   └── dummy.png
│   │
│   ├── js
│   │   ├── script.js
│   │   ├── scriptX.js  // dummynavn
│   │   ├── scriptY.js  // dummynavn
│   │   └── scriptZ.js  // dummynavn
│   │
│   └── index.html
│
├── helpers.js
├── router.js
└── server.js
```

<a id="4.2-staticfiles"></a> [top &uarr;](#top)  

---
#### Statiske filer
Vores API kan (endnu) ikke levere statiske filer. Det får vi brug for, så vi skal til at lave de nødvendige tilføjelser til koden. Med statiske filer mener jeg filer der kun sjældent ændres.

De statiske filer der kommer på tale her er af typerne `.html`, `.css`, `.js` og diverse billedfiler som `.png`, `.jpg`, `.gif`, etc. Vi får derfor brug for at kunne bestemme hvilken mimetype vi har med at gøre. Vi skal derfor oprette et objekt til at indholde definitionerne på de mimetyper vi ønsker at kunne håndtere.

Vi opretter et objekt, `mimetypes`, i `helpers.js` filen. Objektet indeholder en række navn/værdi par, hvor navnene svarer til ekstensionen på de filertyper vi ønsker at kunne håndtere, og værdierne svarer til mimetyperne.

Koden der skal tilføjes til `helpers.js`.
```javascript
const fs = require('fs');  // Importer filsystem-modulet
const path = require('path');

// De foreløbige mimetypes. Vi kan tilføje flere når behovet opstår
const mimetypes = {
    '.html' :  'text/html; charset=utf-8',               // mimetype for html
    '.css'  :  'text/css; charset=utf-8',                // mimetype for css
    '.js'   :  'application/javascript; charset=utf-8',  // mimetype for javascript
    '.png'  :  'image/png'                               // mimetype for png 
    '.jpg'  :  'image/jpg'                               // mimetype for png 
};

```
Vi skal tilføje en hjælpefunktion til vores `helpers.js`. Funktionen skal kunne læse en fil fra filsystemet og sende indholdet i filen til en browser. Derfor får vi brug for filsystem-modulet `fs`. Modulet er en del af Node installationen og skal ikke installeres.

Den nye funktion kalder jeg `fileRespond()`. Funktionen skal jo sende til browseren, derfor skal den have `response` objektet som parameter. Den skal også have stien til den fil der skal læses. Stien sendes også som parameter til funktionen.

Funktionen placeres i `helpers.js` 

Her er koden til `fileRespond()`
```javascript
exports.fileRespond = function(res, fileName){
    fs.readFile(fileName, function(err, fileContent){
        // readFile kører asynkront, derfor skal den forsynes med en callback-funktion
        if(err){
            // Hvis der opstod en fejl, fx. at filen ikke findes, 
            // eller manglende læserettigheder eller lignende er vi her.
            exports.respond(res, {besked : `Filen '${fileName}' blev ikke fundet. ${err}`}, 404);
            return;
        }
        
        // Hvis vi er her, er der fundet en fil der kan læses. 
        // Indholdet skal så sendes til browseren,
        // men først skal vi detektere hvilken mimetype det handler om.
        // Til det formål bruger vi filnavnets ekstension
        var ext = path.extname(fileName); // hent fil-ekstension
        var mime = mimetypes[ext] // brug ekstensionen til at hente mimetype
        res.writeHead(200, {'Content-type' : mime });
        res.end(fileContent);
    }
}

```

Sammenlagt ser koden i `helpers.js` nu sådan ud:
```javascript
const fs = require('fs');
const path = require('path');

const mimetypes = {
    '.html' : 'text/html',
    '.css'  : 'text/css',
    '.js'   : 'text/js',
    '.png'  : 'image/png'
};

exports.fileRespond = function(res, fileName){
    console.log(fileName);
    fs.readFile(fileName, function(err, fileContent){
        if(err){
            exports.respond(res, {besked : `Filen '${fileName}' blev ikke fundet. ${err}`}, 404);
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

Indholdet i variablen `pathname` vil indeholde filnavnet på den fil der requestes. Hvis der ikke requestes en specifik fil, dvs. `pathname` kun indeholder `/` skal vi blot sende indholdet af `index.html`. Det kan vi gøre med vores nye funktion, `fileRespond()`

Med en if-sætning kan vi undersøge om `pathname` kun indeholder `/`, 

```javascript 
if(pathname === '/') {
    helpers.fileRespond(res, 'public/index.html'); 
}
```

Hvis browseren sender en GET-request for en fil, fx `css/style.css`, vil variablen `pathname` indeholde tekststrengen `css/style.css`. Pathname variablen vil altid indeholde requesten. Det betyder at vi kan undersøge om variablen indeholder et filnavn, eller rettere, undersøge om indholdet udgør et mønster for et filnavn. Men hvordan ser et mønster for et filnavn ud?. Lad os kigge på de filer der kan komme på tale i vores system. Det er først og fremmest html-, css-, js-, png-, og jpg-filer,  

Mønsteret for disse filer er at de har et filnavn bestånde af en eller flere alfanumeriske karakterer efterfulgt af punktum og derefter bogstaverne 'html', 'css', 'js', 'png', eller 'jpg'. Yderligere kan der være angivet et mappenavn foran filnavnet.

Eksempler
```
index.html
css/style.css
js/script.js
img/logo.png
```

For at undersøge om `patname` indeholder et filnavnmønster, har jeg valgt at bruge den indbyggede javascript metode `.match()`. Denne metode gør brug af `regular expression`

Men lad os kigge på hvad regular expressions er for noget og hvad det kan anvendes til. 

En regular expression, eller blot regex, bruges til at søge efter bestemte mønstre i en tekststreng,fx om en tekststreng indeholder et filnavn som `index.html`, eller `/img/logo.png`. De filnavne vi kommer til at arbejde med, har det til fælles at de har en ekstension der er enten `.html`, `.css`, `js`, `png` eller `jpg`. Derudover kan disse filer være placerede i mapper så stien til dem kan være fx `css/style.css` eller `/img/logo-png`.

Et `regex` mønster placeres mellem to slashes, fx `/mønster/`. Det der står mellem slashene udgør mønsteret vi søger efter.

Eksempel:
```javascript
// Først en variabel der indeholder en tekststreng
var tekst = "Roskilde Tekniske Skole";

// Vi vil undersøge om teksten indeholder "Roskilde".
// Det kan vi bruge .match() metoden til.
var regExResult = text.match(/Roskilde/);

// I dette eksempel vil variablen regExResult indeholde resultatet af match() funktionen

// Hvis vi udskriver variablen til konsollen vil vi se noget i stil med: 
[ 'Roskilde', index: 0, input: 'Roskilde Tekniske Skole' ]
```

Match returnerer altså et array, hvis den finder et match. Det første element i arrayet, element 0,indeholder det som `match()` metoden har fundet, det andet element, `index: 0`, viser positionen i teksten hvor der blev fundet et match, her 0, mens det sidste element, `input: 'Roskilde Tekniske Skole'`, viser den tekststreng der blev søgt i.

Hvis `match()` metoden ikke finder noget der matcher returneres `null`.

Jeg vil ikke gå i dybden med regular expressions. Der findes en række websider med tutorials om regex, fx `https://www.w3schools.com/jsref/jsref_obj_regexp.asp` eller `https://regex101.com/`. 

Jeg vil stærkt anbefale at du bruger lidt tid på at sætte sig ind i regular expressions. Rigtig mange programmeringssprog har indbygget support for regex, og er et _must_ for en programmør at kunne. 

Når du har lært hvordan regex virker, og har fået lidt øvelse i at opbygge regexes, kan du fortsætte her.

Lad os prøve at annvende regex i forbindelse med `match()` metoden.

Nedenstående kodelinie søger i `pathname` efter html, css, js, jpg, og png filnavne.
```javascript
var fileRequest = pathname.match(/^\/((css|js|img)\/)?\w+\.(html|css|js|png|jpg)$/);   
```

Hvis der er fundet noget der matcher, returneres et array med alle matchdata til variablen  `fileRequest`. Ellers returneres `null`.

Det betyder at vi med en simpel `if` kan undersøge om der er fundet noget.

```javascript
var fileRequest = pathname.match(/^\/((css|js|img)\/)?\w+\.(html|css|js|png|jpg)$/);
if(fileRequest){
    // Den fulde match ligger i fileRequest[0], det første element i arrayet.
    // Vi kan derfor sende det fundne sammen med responseobjektet til fileResponse() metoden.
    helpers.fileResond(res, fileRequest[0])
}
```

Koden i `router.js` skal ser nu sådan ud.
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

<a id="5.0-frontend"></a> [top &uarr;](#top)  

---
### Frontend  

I indledningen skrev jeg at frontend delen kunne deles i to; public- og administrationsdelen. I både public og admin mappen omtaler vi filerne som *statiske* filer. Blandt de statiske filer er der både i public og admin mapperne en *dynamisk* fil. Det er `index.html`. Dynamisk fordi indholdet i filen ændres dynamisk alt efter hvilket element brugeren klikker på. Selv om indholdet i disse filer ændres dynamisk vælger jeg alligevel at betragte dem som tilhørende de statiske filer fordi selve den grundlæggende kode i filen kun sjældent ændres.

Her er `public/index.html`
```html
<!DOCTYPE html>
<html>
    <head>
        <meta charset="UTF-8">
        <link rel="stylesheet" href="css/style.css">
        <link rel="shortcut icon" href="img/favicon.ico" type="image/x-icon">
        <title>CMS</title>
    </head>
    <body>
        <main>
            <header id="publicheader">
                <span id="logo"><img src="img/logo.png"></span>
                
		        <nav id="publicnavigationbar"></nav>
            
            </header>

            <section id="content"></section> 
        
        </main>
        <script src="js/articles.js"></script>
        <script src="js/menu.js"></script>
    </body>
</html>
```
Filen fylder ikke ret meget, men det vi skal lægge mærke til er, at den indeholder et container-tag, `<nav id="publicnavigationbar"></nav>`, til menupunkterne, og et container-tag, `<section id="content"></section>`, til det indhold der dynamisk skifter når brugeren klikker på et menupunkt. Begge containere er tomme til at starte med.  

I index.html filen linkes der til to javascript filer, `articles.js` og `menu.js`. Den første, `articles.js` indeholder kode der sender forskellige requests til backenden når der klikkes på et af menupunkterne. Det svar der kommer tilbage indsættes i "content" containeren. Den anden, `menu.js`, sender en request til backenden der svarer ved at sende menupunkterne tilbage. Scriptet indsætter de enkelte menupunkter i "publicnavigationbar" containeren.

Koden til `public/js/menu.js` er gengivet nedenfor.

`public/js/menu.js`
```javascript
(function () {
    document.addEventListener('DOMContentLoaded', menuUpdate);

    function menuUpdate() {
        fetch('/menuitems')
            .then(function (data) {
                return data.json()
            })
            .then(function (menuitems) {
                var menu = '';
                menuitems.forEach(function (item) {
                    menu += `<span class="menuitem" data-categoryid="${item.id}">${item.name}</span>`;
                });
                document.querySelector('#publicnavigationbar').innerHTML = menu;
            })
            .then(function () {
                document.querySelector('.menuitem').click();
            })
            .catch(function (err) {
                console.log(err);
            });
    }
})();
```
Denne funktion er konstrueret som en såkaldt *Immediately-Invoked Function Expression (IIFE)*
Formatet på denne konstruktion er:
```javascript
(function(){ 
    // Kode placeres her
})()
```
Når man på den måde pakker en funktion ind i et sæt paranteser vil javascript fortolkeren opfatte funktionen som et eksekverbart udtryk (på engelsk: executable expression). Det sidste sæt paranteser gør at udtrykket eksekveres når scriptet er indlæst. Det der eksekveres i første omgang er `document.addEventListener()` der registrerer en eventlistener der lytter på `DOMContentLoaded` eventen. EventListeneren registrerer funktionen `menuUpdate()` som eventhandler til denne event. Når eventen `DOMContentLoaded` fyres, sendes et funktionskald til `menuUpdate()`. 

Funktionen sender en `GET` request til routen `/menuitems` ved hjælp af den indbyggede funktion `fetch()`.  

Jeg vil ikke komme med forklaringer om hvordan `fetch()` virker. Men hvis man har lyst til at gå i dybden med `fetch()` (det kan stærkt anbefales) henviser jeg til at fremsøge mere information på nettet fx. på `https://scotch.io/tutorials/how-to-use-the-javascript-fetch-api-to-get-data` eller `https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch`.  

Læg mærke til at koden i `public/js/menu.js` indeholder tre `.then()` blokke. Den første konverterer responsens payload til JSON.  

Den næste blok gennemløber JSON strukturen i et `forEach()` loop. I loopet oprettes der et antal `<span>` elementer. Hvert spanelement forsynes med en data-attribut, `data-categoryid`. Den kommer til at indeholde information om hvilken kategori elementet tilhører.  

I den sidste `.then()` blok hentes en reference til det første element der har CSS-klassen `menuitem` og simulerer et museklik på elementet. 

I det andet script, `articles.js` er der defineret en eventListener der lytter efter click events. Det medfører at når brugeren kommer ind på siden 1. gang vil scriptet `articles.js` "fange" det simulerede museklik og sende en `GET` reguest til routen `/articles`. Requesten vil tilføje en parameter fx `catid=1`, hvor parameterværdien (her 1) stammer fra den føromtalte `data-categoryid`.

Senere i forløbet skal vi opbygge admininstrationsdelen af vores CMS, hvor vi bla. vil kunne oprette, ændre eller fjerne menupunkter fra databasen, og dermed i vores index.html.

For at en bruger kan få adgang til administrationssiden, skal brugeren først gennem en login side. Men det kommer vi til i næste kapitel. 

Vi skal først skrive den kode der gør det muligt at lave dataudtræk fra databasen. Koden skal placeres i et nyt modul som jeg kalder `database.js`. Modulet placeres i mappen `data`. Vi får her brug for at installere et 3. parts modul, nemlig `mysql2`. Det gør vi fra terminalen med kommandoen `npm install mysql2`.

Når module `mysql2` er installeret kan vi indsætte nedenstående kode i `database.js`

`data/database.js`
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
Vi exporterer metoden `select()` der tager tre parametre, `res`, der er et response objekt, `sql` der er selve sql sætningen, og `callback` der er callbackfunktionen der skal tage imod de data der returneres fra databasen.

Men inden vores frontend kan hente data fra databasen skal vi udvide API'et. Det gør vi ved at oprette to nye routes, `/menuitems` og `/article`. Disse to routes skal i første omgang kunne håndtere `GET` requests fra browseren. 
Når vi tilføjer en route til systemet er fremgangsmåden at vi opretter en fil i mappen `endpointhandlers` med de nødvendige endpointhandlere. Derefter importerer vi den nye fil i vores `router.js` modul sådan at den også bliver en del af `routes` variablen.

Filerne med de nye endpointhandlere kalder jeg henholdsvis `menuitems.js` og `article.js`.

`endpointhandlers/menuitems.js`
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

`endpointhandlers/article`
```javascript 
const helpers = require('./../helpers');
const database = require('./../data/database');
const url = require('url');
const qs = require('querystring');

module.exports = {
    'GET' : function(req, res){
        var cond, values;
        var query = url.parse(req.url).query
        var params = qs.parse(query);
        // Hvis params.catid, så hent artikler med cat_id
        // Hvis params.artid, så hent artiklen med artid
        if(params.catid){
            cond = 'category_id';
            values = [params.catid];
        }
        if(params.artid){
            cond = 'id';
            values = [params.artid];
        }
        var sql = `select * from articles where ${cond} = ?`;
        database.articleselect(res, sql, values, function(data){
            helpers.respond(res, data);
        });        
    }
}
```


Senere i forløbet skal vi opbygge admininstrationsdelen af vores CMS, hvor vi vil kunne oprette, ændre eller fjerne menupunkter fra databasen, og dermed i vores index.html.

For at brugere skal få adgang til administrationssiden, skal de først gennem en login side. Næste kapitel vil handle om loginsystemet.


<a id="6.0-login"></a>[tilbage &uarr;](#top)
### Login
Vores loginsystem anvender _cookies_. Men først en lille gennemgang af hvad cookies er for en størrelse.

Cookies er i bund og grund ikke andet end tekstfiler. Indholdet er ypisk organiseret som et eller flere *name/value* par. Via HTTP headere, kan vi sende cookies til en browser, ligesom browseren også er i stand til at sende cookies via HTTP headere. Når browseren modtager en eller flere cookies, lagrer den disse og holder styr på hvilket domæne hver enkelt cookie tilhører. Når browseren igen sender en HTTP request til en server vil den automatisk medsende de cookies der tilhører det pågældende domæne. Cookies der er oprettet af andre domæner vil ikke blive sendt med. Kun cookies der 'tilhører' domænet. På den måde er det muligt for browseren at gemme information om de enkelte domæner i form af cookies. Cookies kan anvendes i forbindelse med login. Når en bruger logger ind kan man sende en cookie til browseren der indholder information der efterfølgende kan bruges til at verificere, at brugeren er logget ind. 

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
response.setHeader('Set-Cookie', ['id=1234; expire=2017-12-24T23:59:59.000Z']);
```

Denne cookie, der har navnet 'id' og værdien '1234', vil udløbe juleaften 2017, et sekund før midnat. 

Men vi får også brug for at kunne læse indkommende cookies på serveren. Vi kan hente den 'rå' cookietekst fra request objektet.

```javascript
var cookie = request.headers.cookie;
```

Lad os skrive koden til `cookieparser` funktionen. Jeg har valgt at placere koden i `helpers.js`.
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

Efter en del overvejelser har jeg besluttet at bruge et tredieparts modul til at læse indkommende formdata. Blandt de mange muligheder der findes, har jeg valgt at bruge modulet `multiparty`. Dette modul har en simpel API, er nemt at bruge og har kun en enkelt dependency. Det betyder at når man installerer dette modul vil det kun være et enkelt modul der yderligere bliver installeret. Jeg er af den opfattelse, at jo færre dependencies, jo bedre. I denne sammenhæng skal man huske at importere `multiparty` modulet i `helpers.js` filen med `require()` funktionen

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

Funktionen tager tre parametre, request og response objekterne og en callback funktion. Ved indkommende data vil `multiparty` parse de indkommende data fra `request` objektet og placere resultaterne i variablene `fields` og `files`, hvor `fields` indeholder form data og `files` indholder eventuelle uploadede filer. Tilsidst fodres callback funktionen med disse variable.

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
Jeg har også tilføjet en funktion der kan være nyttig, nemlig `redirect()`. Functionen sender en redirect header til browseren der får browseren til at requeste en ny fil fra serveren. Den tager to paramtre, et response objekt og den URL som browseren skal redirectes til.

```javascript
exports.redirect = function(res, url){
    res.writeHead(302, {'location': url});
    res.end();
};
```
Mens man udvikler er det en god hjælp, at alle indkommende requests logges på server terminalen. Derfor har jeg tilføjet et modul, `logger.js`. Modulet udskriver forskellige informationer til konsollen. Det er muligt at styre hvilke informationer der logges ved hjælp af parameteren `level` der defaulter til 3

Koden til `logger.js` er gengivet her:
```javascript
// LOGGER
// level 0: Kun timestamp 
// level 1: Timestamp og Remote-address
// level 2: Timestamp, Remote-address og request URL
// level 3: Timestamp, Remote-address, request URL og method (Default)
// level 4: Timestamp, Remote-address, request URL, method og cookies
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


