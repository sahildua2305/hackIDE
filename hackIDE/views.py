#!/usr/bin/env python
# -*- coding: utf-8 -*-
# @Author: sahildua2305
# @Date:   2016-01-06 00:11:27
# @Last Modified by:   sahildua2305
# @Last Modified time: 2016-01-06 00:54:58

from django.http import HttpResponse
from django.template import loader
from django.shortcuts import render

def index(request):
	# render the index.html
	return render(request, 'hackIDE/index.html', {})
