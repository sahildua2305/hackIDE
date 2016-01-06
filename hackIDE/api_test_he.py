#! -*- coding: utf-8 -*-

import requests

# constants
RUN_URL = u'https://api.hackerearth.com/v3/code/compile/'
CLIENT_SECRET = '61f6a3f97501c7376ce546d27c34097d15cb0856'

source = "print 'Hello World'"

data = {
    'client_secret': CLIENT_SECRET,
    'async': 0,
    'source': source,
    'lang': "PYTHON",
    'time_limit': 5,
    'memory_limit': 262144,
}

r = requests.post(RUN_URL, data=data)
print r.json()
