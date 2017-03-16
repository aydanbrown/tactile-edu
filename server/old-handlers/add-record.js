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
	sql('INSERT INTO Records (objectRef, questionRef) VALUES (?, ?)', [req.body.objectRef, req.body.questionRef], function(err, result) {
		if(err) return error(err);
		res.writeHead(200, { 'Content-Type': 'application/json' });
		res.end(JSON.stringify({ id: result.insertId }));
	});
}

function validate(body) {
	var errors = [];
	if(!body.objectRef) errors.push('missing objectRef');
	if(!body.questionRef) errors.push('missing questionRef');
	return errors;
}
