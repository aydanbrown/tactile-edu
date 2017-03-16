import urllib2
import json

host_url = 'http://localhost/'

def request(path):
	return json.loads(urllib2.urlopen(host_url + path))

def list_objects():
	return request('object')

def get_object(object_id):
	return request('object/' + object_id)

def list_links():
	return request('link')

def get_link(ntag):
	return request('link/' + ntag)

def list_voices():
	return request('voice')

def get_voice(voice_id):
	return request('voice/' + voice_id)

def get_audio(url):
	return urllib2.urlopen(url)

