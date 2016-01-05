#!/usr/bin/env python
# -*- coding: utf-8 -*-
# @Author: sahildua2305
# @Date:   2016-01-06 00:11:27
# @Last Modified by:   sahildua2305
# @Last Modified time: 2016-01-06 02:35:51

from django.conf.urls import url

from . import views

app_name = 'hackIDE'
urlpatterns = [
	# ex: /ide/
	url(r'^$', views.index, name='index'),
	# ex: /ide/compile/
	url(r'^compile/$', views.compileCode, name='compile'),
]
