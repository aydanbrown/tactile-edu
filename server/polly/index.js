const AWS = require('aws-sdk');
const fs = require('fs');
const sql = require('../sql');

var config = new AWS.Config(require('./credentials.js'));

var polly = new AWS.Polly(config);

function synthesize(text, callback) {
	var params = {
		OutputFormat: 'ogg_vorbis',
		Text: text,
		VoiceId: 'Joanna'
	};

	polly.synthesizeSpeech(params, function(err, data) {
		if(err) return callback(err);
		callback(null, data);
	});
}

module.exports = {
	synthesize: synthesize
}

/*
sql('SELECT id, intro FROM Objects', function(err, result) {
	if(err) {
		console.log('Failed to get object when trying to update audio files');
		return console.error(err);
	}
	result.forEach(function(object) {
		var file = dirRoot + '/audio/intros/' + object.id + '.ogg';
		if(!fs.existsSync(file)) {
			synthesize(object.intro, function(err, data) {
				if(err) {
					console.log('Failed to syncronize intro audio: ' + object.id);
					return console.log(err);
				}
				fs.writeFile(file, data.AudioStream, function(err) {
					if(err) {
						console.log('Failed to write file when trying to syncronize intro audio: ' + object.id);
						return console.error(err);
					}
					console.log('Downloaded intro audio file: ' + object.id);
				});
			});
		}
	});
});

sql('SELECT id, answer FROM Answers', function(err, result) {
	if(err) {
		console.log('Failed to get object when trying to update audio files');
		return console.error(err);
	}
	result.forEach(function(object) {
		var file = dirRoot + '/audio/answers/' + object.id + '.ogg';
		if(!fs.existsSync(file)) {
			synthesize(object.answer, function(err, data) {
				if(err) {
					console.log('Failed to syncronize answer audio: ' + object.id);
					return console.log(err);
				}
				fs.writeFile(file, data.AudioStream, function(err) {
					if(err) {
						console.log('Failed to write file when trying to syncronize answer audio: ' + object.id);
						return console.error(err);
					}
					console.log('Downloaded answer audio file: ' + object.id);
				});
			});
		}
	});
});
*/

/*
synthesize('Hello Tactile Astronomy, I look forward to working with you.', function(err, data) {
	var filename = 'polly-test';
	if(err) {
		console.error('Error synthesizing speech');
		return console.error(err);
	} else {
		console.log('Writing polly response to file');
		fs.writeFile('../audio/' + filename + '.ogg', data.AudioStream, function(err) {
			if(err) return console.error('Failed to write Polly response to file');
			console.log('Wrote Polly response to file');
		});
	}
});
*/
