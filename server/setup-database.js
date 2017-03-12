const tables = { 
	Objects: [
 		'id INT NOT NULL PRIMARY KEY AUTO_INCREMENT',
		'name TEXT',
		'intro TEXT',
 		'created TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP'
	],  
	ObjectLinks: [
 		'id INT NOT NULL PRIMARY KEY AUTO_INCREMENT',
		'objectRef INT NOT NULL',
		'rfRef INT NOT NULL',
		'created TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP'
	],  
	Questions: [
		'id INT NOT NULL PRIMARY KEY AUTO_INCREMENT',
		'question TEXT NOT NULL',
		'created TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP'
	],
	Answers: [
		'id INT NOT NULL PRIMARY KEY AUTO_INCREMENT',
		'objectRef INT NOT NULL',
		'questionRef INT NOT NULL',
		'answer TEXT NOT NULL',
		'created TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP'
	],
	Records: [
		'id INT NOT NULL PRIMARY KEY AUTO_INCREMENT',
		'objectRef INT NOT NULL',
		'questionRef INT NOT NULL',
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
