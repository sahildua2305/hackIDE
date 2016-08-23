#!/usr/bin/env python
# -*- coding: utf-8 -*-
# @Author: sahildua2305
# @Date:   2016-01-06 00:11:27
# @Last Modified by:   Sahil Dua
# @Last Modified time: 2016-08-10 23:58:19

from django.conf.urls import url

from . import views

app_name = 'hackIDE'

urlpatterns = [
  # ex: /
  url(r'^$', views.index, name='index'),
  # ex: /compile/
  url(r'^compile/$', views.compileCode, name='compile'),
  # ex: /run/
  url(r'^run/$', views.runCode, name='run'),
  url(r'^register/$', views.register, name='register'),
  url(r'^login/$', views.login, name='login'),
  url(r'^logout/$', views.logout, name='logout'),
  url(r'^savetoprofile/$', views.savetoprofile, name='savetoprofile'),
  url(r'^displayprofile/$', views.displayprofile, name='displayprofile'),
  url(r'^removecode/$', views.removecode, name='removecode'),
  # ex: /code=ajSkHb/
  url(r'code_id=((?P<code_id>\w{0,50}))/$', views.savedCodeView, name='saved-code'),
]
