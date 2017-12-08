// Alle routes er definerede her. Filen burde være en selvstændig fil.
module.exports = {
    '/cat'          : require('./endpointhandlers/cat'),        // Test route i forbindelse med intro
    '/dog'          : require('./endpointhandlers/dog'),        // Test route i forbindelse med intro
    '/menuitems'    : require('./endpointhandlers/menuitems'),  // Henter menupunkter fra DB
    '/login'        : require('./endpointhandlers/login'),      // Login route, handler håndterer både GET og POST
    '/article'      : require('./endpointhandlers/article'),    // Article route handler håndterer GET, POST, 
    '/logout'       : require('./endpointhandlers/logout'),     // Logout route handler håndterer DELETE
    '/users'        : require('./endpointhandlers/users')       // Users håndterer brugere (tilføj, fjern og update)
}
