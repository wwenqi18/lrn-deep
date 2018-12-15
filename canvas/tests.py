""" Tests for canvas app """

# from django.test import TestCase
# from django.test import LiveServerTestCase
from django.contrib.staticfiles.testing import StaticLiveServerTestCase
from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.alert import Alert
from selenium.common.exceptions import NoAlertPresentException, TimeoutException
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as ExpectedConditions

from users.models import CustomUser

import urllib
from time import sleep

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
        scripts = []
        scripts.append("var robot = new Robot(palette); ")
        scripts.append("fcl = palette.findNodeForKey(\"add\"); ")
        scripts.append("loc = fcl.location; ")
        scripts.append("robot.mouseDown(loc.x + 10, loc.y + 10, 0, { }); ")
        scripts.append("robot.mouseUp(loc.x + 10, loc.y + 10, 100, { }); ")
        sleep(2) # To make sure the object is in place
        driver.execute_script("".join(scripts))
        # Send input and output dimensions to the alert
        wait = WebDriverWait(driver, 10)
        try:
            while wait.until(ExpectedConditions.alert_is_present()):
                sleep(2)
                driver.switch_to.alert.accept()
        except TimeoutException:
            pass
        sleep(5)

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