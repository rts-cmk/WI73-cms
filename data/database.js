const mysql = require('mysql2');
const helpers = require('./../helpers');

const dbcreds = {
    user : 'wwwuser',
    password : 'wwwuser',
    host : 'localhost',
    database : 'demo-cms'
};

const connection = mysql.createConnection(dbcreds);

exports.select = function(res, sql, callback){
    connection.query(sql, function(err, data){
        if(err){
            helpers.respond(res, {message : 'Databasefejl...', error : err});
            return;
        }
        callback(data);
    });
};

exports.articleSelect = function(res, sql, values, callback){
    connection.query(sql, values, function(err, data){
        if(err){
            helpers.respond(res, {message : 'Databasefejl...', error : err});
            return;
        }
        callback(data);
    });
};
