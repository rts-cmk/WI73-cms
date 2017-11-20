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