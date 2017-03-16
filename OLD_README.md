# tactile-edu

The Tactile Astronomy prototype.

### Contents

[Database](#Database)
[HTTP Endpoints](#HTTP Endpoints)
[Web API Functions](#Web API Functions)

## Database

### Tables:
[Objects](#Objects)
[ObjectLinks](#ObjectLinks)
[Questions](#Questions)
[Answers](#Answers)
[Records](#Records)

#### Objects

Each object (moon, crater, e.g.) will have a row with a name and an introduction clip (played when scanned).

```
id INT
name TEXT
intro TEXT
created DATETIME
```

#### ObjectLinks

RFIDs will be linked to objects so we can have multiple instances of a single object.

```
id INT
objectRef INT
rfRef INT
created DATETIME
```

#### Questions

Questions will be predefined so the voice recognition software will know what to interpret.

```
id INT
question TEXT
created DATETIME
```

#### Answers

There will be several answers linked to an object, all with a unique question.

```
id INT
objectRef
questionRef
answer TEXT
created DATETIME
```

#### Records

A record will be kept when a question is asked so we can later analyse what worked and what didn't.

```
id `INT
objectRef INT
questionRef INT
created DATETIME
```

## Server

The server will be running on a Raspberry Pi and will act as a hub containing the database and serving out files.

### HTTP Endpoints

PUT /object
GET /object
GET /object/{id}
POST /object
GET /answer
GET /answer/{id}
GET /question
GET /question/{id}
POST /question
GET /object/answer/{id}
POST /record
GET /audio/intro/{id}
GET /audio/answer/{id}

### Add Object

PUT /object

Request:
```json
{
	"name": "string",
	"intro": "string",
	"answers": [
		{
			"id": 123,
			"answer": "string"
		}
	]
}
```

Response:
```json
{
	"id": 123
}
```

### List Objects

GET /object

Response:
```json
[
	{
		"id": 123,
		"name": "string",
		"intro": "string",
		"created": "date-string"
	}
]
```

### Get Object

GET /object/{id}

Response:
```json
{
	"id": 123,
	"name": "string",
	"intro": "string",
	"created": "date-string"
}
```

### Link RFID to Object

POST /object

Request:
```json
{
	"objectRef": 123,
	"rfRef": 123
}
```

Response:
```json
{
	"id": 123
}
```

### List Answers

GET /answer

Response:
```json
[
	{
		"id": 123,
		"objectRef": 123,
		"questionRef": 123,
		"answer": "string",
		"created": "date-string"
	}
]
```

### Get Answer

GET /answer/{id}

Response:
```json
{
	"id": 123,
	"objectRef": 123,
	"questionRef": 123,
	"answer": "string",
	"created": "date-string"
}
```

### List Questions

GET /question

Response:
```json
[
	{
		"id": 123,
		"question": "string",
		"created": "date-string"
	}
]
```

### Get Question

GET /question/{id}

Request:
```json
{
	"id": 123,
	"question": "string",
	"created": "date-string"
}
```

### Add Question

POST /question

Request:
```json
{
	"question": "string"
}
```

### List Object Answers

GET /object/answer/{id}

(id = object ID)

Respose:
```json
[
	{
		"id": 123,
		"objectRef": 123,
		"questionRef": 123,
		"answer": "string",
		"created": "date-string"
	}
]
```

### Add Record

POST /record

Request:
```json
{
	"objectRef": 123,
	"questionRef": 123
}
```

Response:
```json
{
	"id": 123
}
```

### Get Intro Audio Clip

GET /audio/intro/{id}

(id = object ID)

Responds with an ogg file.

### Get Answer Audio Clip

GET /audio/answer/{id}

(id = answer ID)

Responds with an ogg file.

## Web API Functions

```js
getObject(objectId, callback)
listObjects(callback)
addObject(name, intro, answers, callback)
getQuestion(questionId, callback)
listQuestions(callback)
addQuestion(question, callback)
getAnswer(answerId, callback)
listAnswers(callback)
listObjectAnswers(objectId, callback)
getIntroAudio(objectId, callback)
getAnswerAudio(answerId, callback)
```

### Example Usage

```js
API.getObject(123, function(err, result) {
	if(err) return console.error(err);
	result.forEach(function(obj) {
		console.log(obj.name);
	});
}
```
