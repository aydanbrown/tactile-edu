const sql = require('../sql');

module.exports = function(req, res, error) {
	if(!req.body.objectRef || !req.body.ntag) {
		res.writeHead(400);
		return res.end('Request validation errors: missing objectRef or ntag');
	}

	sql('INSERT INTO Links (objectRef, ntag) VALUES (?, ?)', [req.body.objectRef, req.body.ntag], function(err, result) {
		if(err) return error(err);

		var linkId = result.insertId;

		res.writeHead(200, { 'Content-Type': 'application/json' });
		res.end(JSON.stringify({ id: linkId }));
	});
}
