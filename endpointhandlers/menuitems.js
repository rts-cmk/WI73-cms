const helpers = require('./../helpers');
const database = require('./../data/database');

module.exports = {
    'GET' :function(res){
        // helpers.respond(res, [{name : 'hjem'},{name : 'nyheder'},{name:'about'}]);
        var sql = "select * from menu order by position";
        database.select(res, sql, function(data){
            helpers.respond(res, data);
        });
    }
};  