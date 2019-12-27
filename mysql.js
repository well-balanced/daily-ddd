var mysql      = require('mysql');
var db = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'softkei7&',
  database : 'todo'
});
 
db.connect();
 
db.query('SELECT * FROM users', function (error, results, fields) {
  if (error) {console.log(error)}
  console.log(results[0].username);
});
 
db.end();
