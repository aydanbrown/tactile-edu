const mysql = require('mysql');

var connection = mysql.createConnection(require('./credentials.js'));

var connected = false;
var pending = [];

connection.connect(function(err) {
  if(err) { console.log('Failed to connect to database'); return console.error(err); }
  connected = true;
  for(var p in pending) {
    connection.query(pending[p][0], pending[p][1], pending[p][2]);
  }
  pending = [];
});

module.exports = function(param1, param2, param3) {
  if(!connected) pending.push([param1, param2, param3]);
  else connection.query(param1, param2, param3);
};

// connection.connect();
//
// module.exports = connection.query;
