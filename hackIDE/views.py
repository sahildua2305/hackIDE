#!/usr/bin/env python
# -*- coding: utf-8 -*-
# @Author: sahildua2305
# @Date:   2016-01-06 00:11:27
# @Last Modified by:   sahildua2305
# @Last Modified time: 2016-01-06 00:44:32

from django.http import HttpResponse
from django.template import loader
from django.shortcuts import render

def index(request):
	context = {}
	# render the index.html
	# template = loader.get_template('hackIDE/index.html')
	# return HttpResponse(template.render(context, request))
	return render(request, 'hackIDE/index.html', {})
