const sql = require('../sql');
const polly = require('../polly');
const fs = require('fs');

const voiceAudioDir = rootDir + '/audio/voice/';

module.exports = function(req, res, error) {
	if(!req.body.content) {
		res.writeHead(400);
		return res.end('Request validation errors: missing content');
	}

	sql('INSERT INTO Voices (content) VALUES (?)', [req.body.content], function(err, result) {
		if(err) return error(err);

		var voiceId = result.insertId;

		polly.synthesize(req.body.content, function(err, data) {
			if(err) {
				console.error('Failed to download audio from Polly');
				return error(err);
			}
			fs.writeFile(voiceAudioDir + voiceId + '-content.ogg', data.AudioStream, function(err, result) {
				if(err) {
					console.error('Failed to save audio file');
					return error(err);
				}
				res.writeHead(200, { 'Content-Type': 'application/json' });
				res.end(JSON.stringify({ id: voiceId }));
			});
		});
	});
}
