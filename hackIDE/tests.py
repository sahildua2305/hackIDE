#!/usr/bin/env python
# -*- coding: utf-8 -*-
# @Author: sahildua2305
# @Date:   2016-01-06 00:11:27
# @Last Modified by:   sahildua2305
# @Last Modified time: 2016-01-12 05:49:53


from django.test import TestCase, LiveServerTestCase
from django.core.urlresolvers import reverse

from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.by import By # for classes
import os
from time import sleep

# URL-related constants
BASE_URL = 'localhost:8000'

# List of important elements' ids and classes.
MAIN_TEXT_AREA_CLASS_NAME = 'ace_text-input'
COMPILE_BUTTON_ID = 'compile-code'
RUN_BUTTON_ID = 'run-code'
CUSTOM_INPUT_ID = 'custom-input'
CUSTOM_INPUT_CHECKBOX_ID = 'custom-input-checkbox'

# List of important messages.
COMPILE_SUCCESS = 'OK'
COMPILE_FAILURE = '--'

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


# """
# TODO: Write some Selenium tests - testing UI for different features
# """


class CompileSuccessOnIndex(LiveServerTestCase):

  def setUp(self):
    self.selenium = webdriver.Chrome()
    super(CompileSuccessOnIndex, self).setUp()

  def tearDown(self):
    self.selenium.quit()
    super(CompileSuccessOnIndex, self).tearDown()

  def test_go_on(self):
    """
    Testing if the application displays the proper success status without any additional input
    """
    selenium = self.selenium
    selenium.get(BASE_URL)

    compile_btn = selenium.find_element_by_id(COMPILE_BUTTON_ID)

    compile_btn.send_keys(Keys.RETURN)

    sleep(3)

    assert COMPILE_SUCCESS in selenium.page_source


class CompileFailOnIndex(LiveServerTestCase):

  def setUp(self):
    self.selenium = webdriver.Chrome()
    super(CompileFailOnIndex, self).setUp()

  def tearDown(self):
    self.selenium.quit()
    super(CompileFailOnIndex, self).tearDown()

  def test_go_on(self):
    """
    Testing if the application displays the proper failure status for compilation errors
    """
    selenium = self.selenium
    selenium.get(BASE_URL)

    compile_btn = selenium.find_element_by_id(COMPILE_BUTTON_ID)

    ace_text_area = selenium.find_elements_by_class_name(MAIN_TEXT_AREA_CLASS_NAME)[0]
    ace_text_area.clear()
    ace_text_area.send_keys('fail')

    sleep(2)
    compile_btn.send_keys(Keys.RETURN)
    sleep(3)

    assert 'Compile Status:' in selenium.page_source
    assert COMPILE_FAILURE in selenium.page_source


class CheckCustomInputDisplay(LiveServerTestCase):

  def setUp(self):
    self.selenium = webdriver.Chrome()
    super(CheckCustomInputDisplay, self).setUp()

  def tearDown(self):
    self.selenium.quit()
    super(CheckCustomInputDisplay, self).tearDown()

  def test_go_on(self):
    """
    Testing if the custom input is displayed
    """
    selenium = self.selenium
    selenium.get(BASE_URL)
    test_input = '123 test'

    custom_input_checkbox = selenium.find_element_by_id(CUSTOM_INPUT_CHECKBOX_ID)
    run_btn = selenium.find_element_by_id(RUN_BUTTON_ID)

    custom_input_checkbox.click()
    custom_input = selenium.find_element_by_id(CUSTOM_INPUT_ID)

    custom_input.send_keys(test_input)
    run_btn.send_keys(Keys.RETURN)

    sleep(4)

    assert COMPILE_SUCCESS in selenium.page_source
    assert test_input in selenium.page_source


class TestSavedCode(LiveServerTestCase):

  def setUp(self):
    self.selenium = webdriver.Chrome()
    super(TestSavedCode, self).setUp()

  def tearDown(self):
    self.selenium.quit()
    super(TestSavedCode, self).tearDown()

  def test_go_on(self):
    """
    Testing the save code feature.
    """
    selenium = self.selenium
    selenium.get(BASE_URL)

    run_btn = selenium.find_element_by_id(RUN_BUTTON_ID)

    ace_text_area = selenium.find_elements_by_class_name(MAIN_TEXT_AREA_CLASS_NAME)[0]
    ace_text_area.clear()
    ace_text_area.send_keys('#include <iostream>')
    ace_text_area.send_keys(Keys.RETURN) # Need a blank line after an include directive.

    code_text = 'Hello, World!'
    code = 'using namespace std; int main() { cout << "' + code_text + '" << endl; return 0; }'
    ace_text_area.send_keys(code)

    sleep(2)
    run_btn.send_keys(Keys.RETURN)
    sleep(3)

    new_link = selenium.find_element_by_id('copy_code').text

    selenium.get(new_link)
    sleep(2)

    run_btn = selenium.find_element_by_id(RUN_BUTTON_ID)
    run_btn.send_keys(Keys.RETURN)
    sleep(3)
    assert code_text in selenium.page_source