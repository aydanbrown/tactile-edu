const sql = require('../sql');

module.exports = function(req, res, error) {
	if(!req.body.question) {
		res.writeHead(400);
		return res.end('Missing question');
	}

	sql('INSERT INTO Questions (question) VALUES (?)', [req.body.question], function(err, result) {
		if(err) return error(err);
		res.writeHead(200, { 'Content-Type': 'application/json' });
		res.end(JSON.stringify({ id: result.insertId }));
	});
}
