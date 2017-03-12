const sql = require('../sql');

module.exports = function(req, res, error) {
	sql('SELECT * FROM Questions WHERE id=? LIMIT 1', [req.values.id], function(err, result) {
		if(err) return error(err);
		if(result.length > 0) {
			res.writeHead(200, { 'Content-Type': 'application/json' });
			res.end(JSON.stringify(result[0]));
		} else {
			console.log('Question not found: ' + req.values.id);
			res.writeHead(404);
			res.end('Question not found');
		}
	});
}
