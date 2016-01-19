#!/usr/bin/env python
# -*- coding: utf-8 -*-
# @Author: sahildua2305
# @Date:   2016-01-06 00:11:27
# @Last Modified by:   sahildua2305
# @Last Modified time: 2016-01-19 18:39:03

from django.conf.urls import url

from . import views

app_name = 'hackIDE'
urlpatterns = [
	# ex: /
	url(r'^$', views.index, name='index'),
	# ex: /ajSkHb
	url(r'^(?P<code_id>[-\w]+)$', views.savedCodeView, name='saved-code'),
	# ex: /compile/
	url(r'^compile/$', views.compileCode, name='compile'),
	# ex: /run/
	url(r'^run/$', views.runCode, name='run'),
]
