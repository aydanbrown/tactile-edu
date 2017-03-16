function CreateElement(tag, parent, attributes) {
	var element = document.createElement(tag);
	for(var a in attributes) {
		element.setAttribute(a, attributes[a]);
	}
	if(parent) parent.appendChild(element);
	return element;
}

var ToggleClass = function(element, className) {
	var split = element.className.split(' ');
	var index = split.indexOf(className);
	if(index == -1) split.push(className);
	else split.splice(index, 1);
	element.className = split.join(' ');
	return index == -1;
}

var CapitalizeFirstLetter = function(string) {
	return string.charAt(0).toUpperCase() + string.slice(1);
}


var TimeFormat = (function() {
	var monthIndex = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

	var timeOfDay = function(d) {
		return ('0' + (d.getHours() % 12 || 12)).slice(-2) + ':' + ('0' + (d.getMinutes() < 10)).slice(-2) + (d.getHours() >= 12 ? 'pm' : 'am');
	}

	var date = function(d) {
		var y = d.getFullYear();
		return d.getDate() + ' ' + monthIndex[d.getMonth()] + (y != (new Date()).getFullYear() ? ' ' + y : '');
	}

	var dateTime = function(d) {
		return timeOfDay(d) + ' ' + date(d);
	}

	var relativePeriod = function(d) {
		var n = new Date();
		var diff = d.getTime() - n.getTime();
		if(diff > -5000 && diff < 5000) return 'now';
		var historical = diff < 0;
		if(historical) diff = -diff;
		var period;
		if(diff < 60000) period = parseInt(diff / 1000) + ' seconds';
		else if(diff < 3600000) period = parseInt(diff / 60000) + ' minutes';
		else if(diff < 86400000) period = parseInt(diff / 3600000) + ' hours';
		else if(diff < 2628000000) period = parseInt(diff / 86400000) + ' days';
		else if(diff < 31536000000) period = parseInt(diff / 2628000000) + ' months';
		else period = parseInt(diff / 31536000000) + ' years';
		return historical ? period + ' ago' : 'in ' + period;
	}

	return {
		timeOfDay: timeOfDay,
		date: date,
		dateTime: dateTime,
		relativePeriod: relativePeriod
	};
})();
