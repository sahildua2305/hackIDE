#!/usr/bin/env python
# -*- coding: utf-8 -*-
# @Author: sahildua2305
# @Date:   2016-01-06 00:11:27
# @Last Modified by:   sahildua2305
# @Last Modified time: 2016-01-07 01:56:36


from django.shortcuts import render
from django.http import JsonResponse, HttpResponseForbidden

import requests

from heCredentials import CLIENT_SECRET


COMPILE_URL = "https://api.hackerearth.com/v3/code/compile/"
RUN_URL = "https://api.hackerearth.com/v3/code/run/"


"""
View catering to /ide/ URL,
simply renders the index.html template
"""
def index(request):
	# render the index.html
	return render(request, 'hackIDE/index.html', {})

"""
"""
def compileCode(request):
	try:
		source = request.POST['source']
		lang = request.POST['lang']
	except KeyError:
		# TODO: handle error
		return HttpResponseForbidden()
	else:
		# # default value of 5 sec, if not set
		# time_limit = request.POST.get('time_limit', 5)
		# # default value of 262144KB (256MB), if not set
		# memory_limit = request.POST.get('memory_limit', 262144)

		compile_data = {
			'client_secret': CLIENT_SECRET,
			'async': 0,
			'source': source,
			'lang': lang,
		}

		r = requests.post(COMPILE_URL, data=compile_data)
		print r.json()
		return JsonResponse(r.json(), safe=False)


"""
"""
def runCode(request):
	try:
		source = request.POST['source']
		lang = request.POST['lang']
	except KeyError:
		# TODO: handle error
		return HttpResponseForbidden()
	else:
		# default value of 5 sec, if not set
		time_limit = request.POST.get('time_limit', 5)
		# default value of 262144KB (256MB), if not set
		memory_limit = request.POST.get('memory_limit', 262144)

		run_data = {
			'client_secret': CLIENT_SECRET,
			'async': 0,
			'source': source,
			'lang': lang,
			'time_limit': time_limit,
			'memory_limit': memory_limit,
		}

		r = requests.post(RUN_URL, data=run_data)
		print r.json()
		return JsonResponse(r.json(), safe=False)
