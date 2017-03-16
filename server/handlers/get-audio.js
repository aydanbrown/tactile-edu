const sql = require('../sql');
const fs = require('fs');

const allowedTypes = ['object', 'menu-item', 'voice'];

module.exports = function(req, res, error) {
	if(allowedTypes.indexOf(req.values.type) == -1) {
		res.writeHead(400);
		return res.end('Invalid audio type, allowed types are "' + allowedTypes.join('", "') + '"');
	}
	var file = rootDir + '/audio/' + req.values.type + '/' + req.values.file;
	fs.readFile(file, function(err, data) {
		if(err) {
			console.error('Error getting audio file');
			console.error(err);
			res.writeHead(404);
			return res.end('Could not find audio file');
		}
		res.writeHead(200, { 'Content-Type': 'audio/ogg' }); 
		res.end(data);
	}); 
}
