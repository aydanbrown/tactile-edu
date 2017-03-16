const sql = require('../sql');
const polly = require('../polly');
const fs = require('fs');

const objectAudioDir = rootDir + '/audio/object/';
const menuItemAudioDir = rootDir + '/audio/menu-item/';

module.exports = function(req, res, error) {
	var validationErrors = validate(req.body);

	if(validationErrors.length > 0) {
		validationErrors = validationErrors.join(', ');
		error('Request validation error(s): ' + req.id + ' - ' + validationErrors);
		return;
	}

	sql('INSERT INTO Objects (name, content) VALUES (?, ?)', [req.body.name, req.body.content], function(err, result) {
		if(err) return error(err);

		var objectId = result.insertId;

		var remaining = 0;
		var failCount = 0;
		
		function done(err) {
			remaining--;
			if(err) {
				console.error(err);
				failCount++;
			}
			if(remaining == 0) {
				if(failCount > 0) {
					return error('Failed to add object, with ' + failCount + ' errors');
				}
				res.writeHead(200, { 'Content-Type': 'application/json' });
				res.end(JSON.stringify({ id: objectId }));
			}
		}

		remaining += 2;
		downloadAudio(objectAudioDir + objectId + '-name.ogg', req.body.name, done);
		downloadAudio(objectAudioDir + objectId + '-content.ogg', req.body.content, done);

		req.body.menu.forEach(function(item) {
			remaining++;

			sql('INSERT INTO MenuItems (objectRef, name, content) VALUES (?, ?, ?)', [objectId, item.name, item.content], function(err, result) {
				if(err) return done(err);

				var itemId = result.insertId;

				remaining += 2;
				done();

				downloadAudio(menuItemAudioDir + itemId + '-name.ogg', item.name, done);
				downloadAudio(menuItemAudioDir + itemId + '-content.ogg', item.content, done);
			});
		});
	});
}

function validate(body) {
	var errors = [];

	if(!body.name) errors.push('missing name');
	if(!body.content) errors.push('missing content');
	if(body.menu) {
		body.menu.forEach(function(item, i) {
			if(!item.name) errors.push('item ' + i + ' missing name');
			if(!item.content) errors.push('item ' + i + ' missing content');
		});
	}
	return errors;
}

function downloadAudio(file, content, callback) {
	polly.synthesize(content, function(err, data) {
		if(err) {
			console.error('Failed to get audio via Polly');
			return callback(err);
		}
		fs.writeFile(file, data.AudioStream, callback);
	});
}
