#!/usr/bin/env python
# -*- coding: utf-8 -*-
# @Author: sahildua2305
# @Date:   2016-01-06 00:11:27
# @Last Modified by:   Sahil Dua
# @Last Modified time: 2016-01-08 09:01:47


from django.test import TestCase
from django.core.urlresolvers import reverse


class IndexViewTests(TestCase):

	def test_index_view_in_general(self):
		"""
		Testing for status code returned as well checking for text matching from different parts of index view
		"""
		response = self.client.get(reverse('hackIDE:index'))
		self.assertEqual(response.status_code, 200)
		self.assertContains(response, "hackIDE")
		self.assertContains(response, "Use custom input to test the code")
		self.assertContains(response, "Powered by")
