const sql = require('../sql');
const fs = require('fs');

module.exports = function(req, res, error) {
	var file = dirRoot + '/audio/intros/' + req.values.id + '.ogg';
	fs.readFile(file, function(err, data) {
		if(err) return error(err);
		res.writeHead(200, { 'Content-Type': 'audio/ogg' });
		res.end(data);
	});
}

