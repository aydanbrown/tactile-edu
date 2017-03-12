const sql = require('../sql');

module.exports = function(req, res, error) {
	var validationErrors = validate(req.body);
	if(validationErrors.length > 0) {
		validationErrors = validationErrors.join(', ');
		console.log('Request validation errors: ' + req.id + ' - ' + validationErrors);
		res.writeHead(400);
		res.end(validationErrors);
		return;
	}

	sql('SELECT id FROM Objects where id=? LIMIT 1', [req.body.objectRef], function(err, result) {
		if(err) return error(err);
		if(result.length < 0) {
			console.log('Failed to link object because the object doesn\'t exist: ' + req.body.objectRef);
			res.writeHead(404);
			return res.end('Object does not exist');
		} 
		sql('INSERT INTO ObjectLinks (objectRef, rfRef) VALUES (?, ?)', [req.body.objectRef, req.body.rfRef], function(err, result) {
			if(err) return error(err);
			res.writeHead(200, { 'Content-Type': 'application/json' });
			res.end(JSON.stringify({ id: result.insertId }));
		});
	});
}

function validate(body) {
	var errors = [];
	if(!body.objectRef) errors.push('missing objectRef');
	if(!body.rfRef) errors.push('missing rfRef');
	return errors;
}
