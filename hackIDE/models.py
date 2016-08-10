#!/usr/bin/env python
# -*- coding: utf-8 -*-
# @Author: sahildua2305
# @Date:   2016-01-06 00:11:27
# @Last Modified by:   sahildua2305
# @Last Modified time: 2016-01-12 05:51:06


from __future__ import unicode_literals

from django.db import models
from mongoengine import *

# Create your models here.

class codes(Document):
    code_id = StringField(required=True)
    code_content = StringField(required=True)
    lang = StringField(required=True)
    code_input = StringField(required=True)
    compile_status= StringField(required=True)
    run_status_status=StringField(required=True)
    run_status_time=StringField(required=True)
    run_status_memory=StringField(required=True)
    run_status_output=StringField(required=True)
    run_status_stderr=StringField(required=True)
