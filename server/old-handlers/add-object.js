const sql = require('../sql');
const polly = require('../polly');
const fs = require('fs');

module.exports = function(req, res, error) {
	var validationErrors = validate(req.body);
	if(validationErrors.length > 0) {
		validationErrors = validationErrors.join(', ');
		console.log('Request validation errors: ' + req.id + ' - ' + validationErrors);
		res.writeHead(400);
		res.end(validationErrors);
		return;
	}

	sql('INSERT INTO Objects (name, intro) VALUES (?, ?)', [req.body.name, req.body.intro], function(err, result) {
		if(err) return error(err);
		var objectId = result.insertId;
		var introFile = dirRoot + '/audio/intros/' + objectId + '.ogg';
		downloadAudio(introFile, req.body.intro, function(err) {
			if(err) {
				sql('DELETE FROM Objects WHERE id=? LIMIT 1', [objectId]);
				fs.unlink(introFile);
				return error(err);
			}
			var remaining = 0;
			var failCount = 0;
			var answerIds = [];

			function answerDone(id, err) {
				remaining--;
				if(id) answerIds.push(id);
				if(err) {
					console.log('Failed to download answer');
					console.error(err);
					failCount++;
				}
				if(remaining == 0) {
					if(failCount > 0) {
						answerIds.forEach(function(id) {
							sql('DELETE FROM Answers WHERE id=? LIMIT 1', [id]);
							fs.unlink(dirRoot + '/audio/answers/' + id + '.ogg');
						});
						return error('Failed to download ' + failCount + ' answer(s)');
					}
					res.writeHead(200, { 'Content-Type': 'application/json' });
					res.end(JSON.stringify({ id: objectId }));
				}
			}

			req.body.answers.forEach(function(answer) {
				remaining++;
				sql('INSERT INTO Answers (objectRef, questionRef, answer) VALUES (?, ?, ?)', [objectId, answer.id, answer.answer], function(err, result) {
					if(err) return answerDone(null, err);
					var answerId = result.insertId;
					var file = dirRoot + '/audio/answers/' + answerId + '.ogg';
					downloadAudio(file, answer.answer, function(err) {
						answerDone(answerId, err);
					});
				});
			});
		});
	});
}

function validate(body) {
	var errors = [];
	if(!body.name) errors.push('missing name');
	if(!body.intro) errors.push('missing intro');
	if(!body.answers) errors.push('missing answers');
	if(!Array.isArray(body.answers)) errors.push('answers must be an array');
	return errors;
}

function downloadAudio(file, text, callback) {
	polly.synthesize(text, function(err, data) {
		if(err) {
			console.log('Failed to get audio via Polly');
			callback(err);
		}
		fs.writeFile(file, data.AudioStream, callback);
	});
}
