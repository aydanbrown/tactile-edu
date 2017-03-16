/*

Tactile web API

callback format:
callback(err, result)

Methods:
listObjects(callback)
getObject(objectId, callack)
addObject(object, callback)
*/

var API = (function() {

	const host = 'http://192.168.1.14/';

	function request(method, path, body, callback) {
		var xhttp = new XMLHttpRequest();
		xhttp.onreadystatechange = function() {
			if(this.readyState == 4) {
				var status = this.status;
				var response = xhttp.responseText;
				if(status == 200) {
					callback(null, JSON.parse(response));
				} else {
					callback(new Error(status + ': ' + response));
				}
			}
		}
		xhttp.open(method, path, true);
		if(body) xhttp.setRequestHeader('Content-Type', 'application/json');
		xhttp.send(body ? JSON.stringify(body) : null);
	}

	function listObjects(callback) {
		request('GET', 'object', null, callback);
	}

	function getObject(objectId, callback) {
		request('GET', 'object/' + objectId, null, callback);
	}

	function addObject(object, callback) {
		request('PUT', 'object', object, callback);
	}

	function 

	return {
		request: request,
		getObject: getObject,
		listObjects: listObjects,
		addObject: addObject,
		getQuestion: getQuestion,
		listQuestions: listQuestions,
		addQuestion: addQuestion,
		getAnswer: getAnswer,
		listAnswers: listAnswers,
		listObjectAnswers: listObjectAnswers,
		getIntroAudio: getIntroAudio,
		getAnswerAudio: getAnswerAudio
	}
})();
