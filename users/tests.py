""" Tests for users app """
# from django.test import TestCase
from django.test import LiveServerTestCase
from selenium import webdriver
from selenium.webdriver.common.keys import Keys

from users.models import CustomUser

import urllib

# Create your tests here.

class LoginTestCase(LiveServerTestCase):
    """ Test case for /users/login """
    def setUp(self):
        self.credentials = {
            'username': 'testuser111',
            'password': 'Apple-1234567',
            'email': 'testuser111@url.com'
        }
        self.user = CustomUser.objects.create_superuser(**self.credentials)
        self.user.save()
        self.driver = webdriver.Firefox()
        super(LoginTestCase, self).setUp()
    
    def tearDown(self):
        self.driver.close()
        super(LoginTestCase, self).tearDown()
    
    def test_login(self):
        driver = self.driver
        # Opening the link we want to test
        driver.get(urllib.parse.urljoin(self.live_server_url, "users/login"))
        # Find the form elements
        username = driver.find_element_by_id('inputUserame')
        password = driver.find_element_by_id('inputPassword')
        # Fill the form with data
        username.send_keys(self.credentials['username'])
        password.send_keys(self.credentials['password'])
        # Submit form
        driver.find_element_by_tag_name('button').click()
        print(driver.page_source)