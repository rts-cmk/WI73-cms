const helpers = require('./../helpers');
const database = require('./../data/database');
module.exports = {
    'GET' : function(req, res){
        var cookie = helpers.getCookies(req);
        database.verifySession(res, cookie, function(data){
            if(helpers.objEmpty(data)){
                // Hvis vi er her er brugeren ikke logget ind
                helpers.redirect(res, '/login.html');
                return;
            } 
            // Hvis vi er her er brugeren allerede logget ind
            // Sætter expiretime til now() + 900000 ms svarende til 15 min ude i fremtiden
            // var expiretime = new Date(new Date().getTime() + 900000).toUTCString();  // 900000 ms = 15 min
            // res.setHeader('Set-cookie', [`id=${cookie.id}; expires=${expiretime}`]);
            res.setHeader('Set-cookie', [`id=${cookie.id}`]);            
            helpers.redirect(res, 'admin/index.html');
            // helpers.fileRespond(res, 'admin/index.html');
        })
        
    },

    'POST' : function(req, res){
        var cookie = helpers.getCookies(req);
        database.verifySession(res, cookie, function(data){
            if(!helpers.objEmpty(data)){
                helpers.redirect(res, '/admin/index.html');
                return;
            }
            helpers.getFormData(req, res, function(userCreds){
                database.verifyUserCreds(res, userCreds, function(data){
                    var empty = helpers.objEmpty(data);
                    if(empty){
                        // helpers.redirect(res, '/login.html');
                        helpers.fileRespond(res, 'public/login.html', '<h5 class="msg">Forkert brugernavn eller kodeord</h5>');
                        return;
                    }

                    database.createSession(res, data[0], function(dbsess){
                        if(helpers.objEmpty(dbsess)){
                            helpers.respond(res, {besked : "Kunne ikke oprette session"}, 404);
                            return;
                        }
                        // Sætter expiretime til now() + 900000 ms svarende til 15 min ude i fremtiden
                        // var expiretime = new Date(new Date().getTime() + 900000).toUTCString();  
                        // res.setHeader('Set-cookie', [`id=${dbsess}; expires=${expiretime}`]);
                        res.setHeader('Set-cookie', [`id=${dbsess}`]);                    
                        // helpers.fileRespond(res, 'admin/index.html');
                        helpers.redirect(res, '/admin/index.html');
                    })
                });
            });
        });
    }
};
