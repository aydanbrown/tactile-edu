# tactileedu

The tactileedu server repository for the Tactile Astronomy project.

## SQL Database Tables

Note - These are defined in the `server/setup-database.js` script for convenience of creating the tables.

### Objects

```
id INT NOT NULL PRIMARY KEY AUTO_INCREMENT
name TEXT
content TEXT
created TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
```

### ObjectLinks

```
id INT NOT NULL PRIMARY KEY AUTO_INCREMENT
objectRef INT NOT NULL
ntag INT NOT NULL
created TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
```

### MenuItems

```
id INT NOT NULL PRIMARY KEY AUTO_INCREMENT
objectRef INT NOT NULL
name TEXT
content TEXT
created TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
```

### Voices

```
id INT NOT NULL PRIMARY KEY AUTO_INCREMENT
name TEXT
content TEXT
created TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
```

## API

### Endpoints

```
GET /object
PUT /object
GET /object/{id}
GET /link
PUT /link
GET /link/{id}
GET /voice
PUT /voice
GET /voice/{id}
GET /audio/{type}/{file}
```

### GET /object

List objects - returns a list of objects.

No request parameters.

Response
```json
[
	{
		"id": 123,
		"name": "string",
		"content": "string",
		"created": "date-string"
	}
]
```

### PUT /object

Create object - creates a new object with menu items.

Request
```json
{
	"name": "string",
	"content": "string",
	"menu": [
		{
			"name": "string",
			"content": "string"
		}
	]
}
```

Response
```json
{
	"id": 123
}
```

### GET /object/{id}

Get object - Returns a full object including menu components and audio links.

Request requires and ID in the url.

Response
```json
{
	"id": 123,
	"name": "string",
	"name_audio": "http://host/audio/object/123-name.ogg",
	"content": "string",
	"content_audio": "http://host/audio/object/123-content.ogg",
	"menu": {
		"A": {
			"id": 123,
			"name": "string",
			"name_audio": "http://host/audio/object/123-name.ogg",
			"content": "string",
			"content_audio": "http://host/audio/object/123-content.ogg"
		},
		"B": {
			"id": 124,
			"name": "string",
			"name_audio": "http://host/audio/object/124-name.ogg",
			"content": "string",
			"content_audio": "http://host/audio/object/124-content.ogg"
		}
	}
}
```

### GET /link

List links - returns a list of all links.

No request parameters.

Response
```json
[
	{
		"id": 123,
		"ntag": 123,
		"objectRef": 123,
		"created": "date-string"
	}
]
```

### PUT /link

Create link - creates a link for an nfc tag to relate to an object.

Request
```json
{
	"objectRef": 123,
	"ntag": 123
}
```

Response
```json
{
	"id": 123
}
```

### GET /link/{ntag}

Get link - returns a link containing the nfc tag and the object related to it.

```json
{
	"id": 123,
	"ntag": 123,
	"objectRef": 123,
	"created": "date-string"
}
```

### GET /voice

List voices - returns a list of all voices.

No request paramters.

Response
```json
[
	{
		"id": 123,
		"content": "string",
		"created": "date-string"
	}
]
```

### PUT /voice

Create voice - creates a piece of audio for easy api access.

Request
```json
{
	"content": "string"
}
```

Response
```json
{
	"id": 123
}
```

### GET /voice/{id}

Get voice - returns the details of a voice.

Request requires the id parameter.

Response
```json
{
	"id": 123,
	"content": "string",
	"created": "date-string"
}
```

### GET /audio/{type}/{file}

Get file - returns an ogg audio file.

Request requires a type and a file, currently there are 3 types.
```
/audio/object/1-name.ogg
/audio/menu-item/1-content.ogg
/audio/voice/1-content.ogg
```

Response is an ogg file.


