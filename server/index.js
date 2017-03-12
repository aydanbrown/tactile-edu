const http = require('http');
const PORT = 80;

global.dirRoot = __dirname;

var requestCounter = 1;

var handlers = {
	'/object': {
		PUT: require('./handlers/add-object'),
		POST: require('./handlers/link-object'),
		GET: require('./handlers/list-objects')
	},
	'/object/answer/{id}': { GET: require('./handlers/list-object-answers') },
	'/object/{id}': { GET: require('./handlers/get-object') },
	'/answer': { GET: require('./handlers/list-answers') },
	'/answer/{id}': { GET: require('./handlers/get-answer') },
	'/question': {
		GET: require('./handlers/list-questions'),
		POST: require('./handlers/add-question')
	},
	'/question/{id}': { GET: require('./handlers/get-question') },
	'/audio/intro/{id}': { GET: require('./handlers/get-intro-audio') },
	'/audio/answer/{id}': { GET: require('./handlers/get-answer-audio') },
	'/record': { POST: require('./handlers/add-record') }
}

function handle(url, method, query, headers, body, res) {
	var path = url.split('/');
	for(var h in handlers) {
		var handlerPath = h.split('/');
		var match = matchPath(path, handlerPath);
		if(match != null && handlers[h][method] != null) {
			var request = { id: requestCounter++, url: url, method: method, query: query, headers: headers, values: match, body: body };
			console.log('Request: ' + JSON.stringify(request));
			handlers[h][method](request, res, function(err) {
				console.log('Request failed: ' + JSON.stringify(request, true, 2));
				handleError(err, res);
			});
			return;
		}
	}
	res.writeHead(404);
	res.end('Could not find the resource you were looking for');
}

function handleError(err, res) {
	console.error(err);
	res.writeHead(500);
	res.end('Internal service error');
}

function matchPath(path, handlerPath) {
	if(path.length != handlerPath.length) return null;
	var urlValues = {};
	for(var p in path) {
		if(handlerPath[p][0] == '{' && handlerPath[p][handlerPath[p].length - 1] == '}') {
			console.log(handlerPath[p].substring(1, handlerPath[p].length - 1));
			urlValues[handlerPath[p].substring(1, handlerPath[p].length - 1)] = path[p];
		} else if(handlerPath[p] != path[p]) {
			return null;
		}
	}
	return urlValues;
}

function formatQuery(queryString) {
	var values = queryString.split('&');
	var query = {};
	for(var v in values) {
		var split = values[v].split('=');
		var key = decodeURI(split[0]);
		if(split.length == 1) query[split[0]] = '';
		else if(split.length > 1) query[split[0]] = decodeURI(split[1]);
	}
	return query;
}

var server = http.createServer(function(req, res) {
	var url = req.url.split('?');
	var query = url.length > 1 ? formatQuery(url[1]) : {};
	var body = [];
	req.on('error', function(err) {
		handleError(req, err);
	}).on('data', function(chunk) {
		body.push(chunk);
	}).on('end', function() {
		body = Buffer.concat(body).toString();
		try {
			body = body ? JSON.parse(body) : {};
		} catch(err) {
			console.log('Failed to parse incoming body');
			console.error(err);
			res.writeHead(400);
			return res.end('Invalid JSON');
		}
		handle(url[0], req.method, query, req.headers, body, res);
	});
});

server.listen(PORT);

console.log('Server is good to go');
