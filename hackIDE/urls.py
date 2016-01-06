#!/usr/bin/env python
# -*- coding: utf-8 -*-
# @Author: sahildua2305
# @Date:   2016-01-06 00:11:27
# @Last Modified by:   Sahil Dua
# @Last Modified time: 2016-01-06 05:18:19

from django.conf.urls import url

from . import views

app_name = 'hackIDE'
urlpatterns = [
	# ex: /ide/
	url(r'^$', views.index, name='index'),
	# ex: /ide/compile/
	url(r'^compile/$', views.compileCode, name='compile'),
	# ex: /ide/run/
	url(r'^run/$', views.runCode, name='run'),
]
