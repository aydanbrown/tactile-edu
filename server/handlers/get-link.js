const sql = require('../sql');

module.exports = function(req, res, error) {
	sql('SELECT * FROM Links WHERE ntag=? LIMIT 1', [req.values.ntag], function(err, result) {
		if(err) return error(err);
		if(result.length == 0) {
			res.writeHead(404);
			return res.end('Link does not exist');
		}

		res.writeHead(200, { 'Content-Type': 'application/json' });
		res.end(JSON.stringify(result[0]));
	});
}
