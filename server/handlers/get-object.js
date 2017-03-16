const sql = require('../sql');

const buttonNames = 'ABCDEFG';

const objectAudioDir = rootDir + '/object/';
const menuItemAudioDir = rootDir + '/menu-item/';

module.exports = function(req, res, error) {
	var audioUrl = 'http://' + req.headers.host + '/audio/';
	sql('SELECT * FROM Objects WHERE id=? LIMIT 1', [req.values.id], function(err, result) {
		if(err) return error(err);
		if(result.length == 0) {
			res.writeHead(404);
			return res.end('Object does not exist');
		}

		var objectId = result[0].id;

		var obj = {
			id: objectId,
			name: result[0].name,
			content: result[0].content,
			name_audio: audioUrl + 'object/' + objectId + '-name.ogg',
			content_audio: audioUrl + 'object/' + objectId + '-content.ogg',
			menu: {}
		};

		sql('SELECT * FROM MenuItems WHERE objectRef=?', [objectId], function(err, result) {
			if(err) return error(err);

			result.forEach(function(item, i) {
				obj.menu[buttonNames[i]] = {
					id: item.id,
					name: item.name,
					content: item.content,
					name_audio: audioUrl + 'menu-item/' + item.id + '-name.ogg',
					content_audio: audioUrl + 'menu-item/' + item.id + '-content.ogg'
				};
			});

			res.writeHead(200, { 'Content-Type': 'application/json' });
			res.end(JSON.stringify(obj));
		});
	});
}
