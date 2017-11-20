module.exports = {
    '/' : require('./endpointhandlers/home'),
    '/article' : require('./endpointhandlers/article'),
    '/cat': require('./endpointhandlers/cat'),
    '/test': require('./endpointhandlers/test'),
    '/dog': require('./endpointhandlers/dog'),
    '/menuitems': require('./endpointhandlers/menuitems'),
    '/login' : require('./endpointhandlers/login')
};