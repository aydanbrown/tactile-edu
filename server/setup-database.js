const tables = { 
	Objects: [
 		'id INT NOT NULL PRIMARY KEY AUTO_INCREMENT',
		'name TEXT',
		'content TEXT',
 		'created TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP'
	],  
	Links: [
 		'id INT NOT NULL PRIMARY KEY AUTO_INCREMENT',
		'objectRef INT NOT NULL',
		'ntag INT NOT NULL',
		'created TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP'
	],  
	MenuItems: [
		'id INT NOT NULL PRIMARY KEY AUTO_INCREMENT',
		'objectRef INT NOT NULL',
		'name TEXT',
		'content TEXT',
		'created TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP'
	],
	Voices: [
		'id INT NOT NULL PRIMARY KEY AUTO_INCREMENT',
		'content TEXT',
		'created TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP'
	]
}


const sql = require('./sql');

var remaining = 0;

function create(name) {
  remaining++;
  var query = 'CREATE TABLE ' + name + '(' + tables[name].join(', ') + ')';
  console.log(query);
  sql(query, function(err, result) {
    remaining--;
    if(err) {
      console.log('Failed to create table (' + name + '), ' + remaining + ' remaining'); console.log(err);
    } else {
      console.log('Created table (' + name + '), ' + remaining + ' remaining');
    }   
    if(remaining == 0) console.log('done')
  }); 
}

for(name in tables) {
	create(name);
}
