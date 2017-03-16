const sql = require('../sql');

module.exports = function(req, res, error) {
	sql('SELECT * FROM Questions', function(err, result) {
		if(err) return error(err);
		res.writeHead(200, { 'Content-Type': 'application/json' });
		res.end(JSON.stringify(result));
	});
}
