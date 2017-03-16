const sql = require('../sql');

module.exports = function(req, res, error) {
	sql('SELECT * FROM Voices WHERE id=? LIMIT 1', [req.values.id], function(err, result) {
		if(err) return error(err);
		if(result.length == 0) {
			res.writeHead(404);
			return res.end('Voice does not exist');
		}

		var voice = {
			id: result[0].id,
			content: result[0].content,
			content_audio: 'http://' + req.headers.host + '/audio/voice/' + result[0].id + '-content.ogg'
		};

		res.writeHead(200, { 'Content-Type': 'application/json' });
		res.end(JSON.stringify(voice));
	});
}
