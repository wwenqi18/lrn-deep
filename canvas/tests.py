""" Tests for canvas app """

# from django.test import TestCase
# from django.test import LiveServerTestCase
from django.contrib.staticfiles.testing import StaticLiveServerTestCase
from selenium import webdriver
from selenium.webdriver.common.keys import Keys

from users.models import CustomUser

import urllib

# Create your tests here.

class DragFromPaletteTestCase(StaticLiveServerTestCase):
    """ Test drag from palette """
    def setUp(self):
        self.driver = webdriver.Firefox()
        selenium_login(self.driver, self.live_server_url)
        super(DragFromPaletteTestCase, self).setUp()
    
    def tearDown(self):
        self.driver.close()
        super(DragFromPaletteTestCase, self).tearDown()
    
    def test_drag_from_palette(self):
        driver = self.driver
        # Opening the link we want to test
        driver.get(urllib.parse.urljoin(self.live_server_url, "canvas/workspace/"))
        # Utilize the Robot class to simulate input in GoJS
        script1 = "var robot = new Robot(diagram); "
        driver.execute_script("".join([script1]))
        print(driver.page_source)

def selenium_login(driver, live_server_url):
    """ Login via fake credentials """
    # Create fake credentials
    credentials = {
        'username': 'testuser',
        'password': '123456',
        'email': 'testuser@url.com'
    }
    # Store user
    user = CustomUser.objects.create_superuser(**credentials)
    user.save()
    # Opening the link of login page
    driver.get(urllib.parse.urljoin(live_server_url, "users/login/"))
    # Find the form elements
    username = driver.find_element_by_id('inputUserame')
    password = driver.find_element_by_id('inputPassword')
    # Fill the form with data
    username.send_keys(credentials['username'])
    password.send_keys(credentials['password'])
    # Submit form
    driver.find_element_by_tag_name('button').click()