""" Tests for users app """
from selenium import webdriver
from selenium.webdriver.common.keys import Keys

import urllib
from unittest import mock

from django.contrib.auth import authenticate, get_user, signals
from django.test import (
    LiveServerTestCase, SimpleTestCase, TestCase, modify_settings, override_settings,
)
from django.contrib.auth.backends import ModelBackend
from django.contrib.auth.hashers import MD5PasswordHasher
from django.contrib.auth.models import AnonymousUser, Group, Permission
from django.contrib.contenttypes.models import ContentType
from django.test.client import Client
from .models import CustomUser

# Create your tests here.


class LoginTestCase(LiveServerTestCase):
    # Test case for /users/login
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


class CountingMD5PasswordHasher(MD5PasswordHasher):
    """Hasher that counts how many times it computes a hash."""

    calls = 0

    def encode(self, *args, **kwargs):
        type(self).calls += 1
        return super().encode(*args, **kwargs)

class CustomUserTests(TestCase):
    """
    A custom user should be able to login.
    """
    UserModel = CustomUser
    user_credentials = {'username': 'test', 'password': 'test'}
    backend = 'django.contrib.auth.backends.ModelBackend'

    def create_users(self):
        self.user = CustomUser.objects.create_user(email='test@example.com', **self.user_credentials)
        self.superuser = CustomUser.objects.create_superuser(
            username='test2',
            email='test2@example.com',
            password='test',
        )

    def setUp(self):
        self.patched_settings = modify_settings(
            AUTHENTICATION_BACKENDS={'append': self.backend},
        )
        self.patched_settings.enable()
        self.create_users()

    def tearDown(self):
        self.patched_settings.disable()
        # The custom_perms test messes with ContentTypes, which will
        # be cached; flush the cache to ensure there are no side effects
        # Refs #14975, #14925
        ContentType.objects.clear_cache()

    def test_has_perm(self):
        user = self.UserModel._default_manager.get(pk=self.user.pk)
        self.assertIs(user.has_perm('auth.test'), False)

        user.is_staff = True
        user.save()
        self.assertIs(user.has_perm('auth.test'), False)

        user.is_superuser = True
        user.save()
        self.assertIs(user.has_perm('auth.test'), True)

        user.is_staff = True
        user.is_superuser = True
        user.is_active = False
        user.save()
        self.assertIs(user.has_perm('auth.test'), False)

    def test_custom_perms(self):
        user = self.UserModel._default_manager.get(pk=self.user.pk)
        content_type = ContentType.objects.get_for_model(Group)
        perm = Permission.objects.create(name='test', content_type=content_type, codename='test')
        user.user_permissions.add(perm)

        # reloading user to purge the _perm_cache
        user = self.UserModel._default_manager.get(pk=self.user.pk)
        self.assertEqual(user.get_all_permissions(), {'auth.test'})
        self.assertEqual(user.get_group_permissions(), set())
        self.assertIs(user.has_module_perms('Group'), False)
        self.assertIs(user.has_module_perms('auth'), True)

        perm = Permission.objects.create(name='test2', content_type=content_type, codename='test2')
        user.user_permissions.add(perm)
        perm = Permission.objects.create(name='test3', content_type=content_type, codename='test3')
        user.user_permissions.add(perm)
        user = self.UserModel._default_manager.get(pk=self.user.pk)
        self.assertEqual(user.get_all_permissions(), {'auth.test2', 'auth.test', 'auth.test3'})
        self.assertIs(user.has_perm('test'), False)
        self.assertIs(user.has_perm('auth.test'), True)
        self.assertIs(user.has_perms(['auth.test2', 'auth.test3']), True)

        perm = Permission.objects.create(name='test_group', content_type=content_type, codename='test_group')
        group = Group.objects.create(name='test_group')
        group.permissions.add(perm)
        user.groups.add(group)
        user = self.UserModel._default_manager.get(pk=self.user.pk)
        exp = {'auth.test2', 'auth.test', 'auth.test3', 'auth.test_group'}
        self.assertEqual(user.get_all_permissions(), exp)
        self.assertEqual(user.get_group_permissions(), {'auth.test_group'})
        self.assertIs(user.has_perms(['auth.test3', 'auth.test_group']), True)

        user = AnonymousUser()
        self.assertIs(user.has_perm('test'), False)
        self.assertIs(user.has_perms(['auth.test2', 'auth.test3']), False)

    def test_has_no_object_perm(self):
        """Regressiontest for #12462"""
        """what is this ..."""
        user = self.UserModel._default_manager.get(pk=self.user.pk)
        content_type = ContentType.objects.get_for_model(Group)
        perm = Permission.objects.create(name='test', content_type=content_type, codename='test')
        user.user_permissions.add(perm)

        self.assertIs(user.has_perm('auth.test', 'object'), False)
        self.assertEqual(user.get_all_permissions('object'), set())
        self.assertIs(user.has_perm('auth.test'), True)
        self.assertEqual(user.get_all_permissions(), {'auth.test'})

    def test_anonymous_has_no_permissions(self):
        """
        #17903 -- Anonymous users shouldn't have permissions in
        ModelBackend.get_(all|user|group)_permissions().
        """
        backend = ModelBackend()

        user = self.UserModel._default_manager.get(pk=self.user.pk)
        content_type = ContentType.objects.get_for_model(Group)
        user_perm = Permission.objects.create(name='test', content_type=content_type, codename='test_user')
        group_perm = Permission.objects.create(name='test2', content_type=content_type, codename='test_group')
        user.user_permissions.add(user_perm)

        group = Group.objects.create(name='test_group')
        user.groups.add(group)
        group.permissions.add(group_perm)

        self.assertEqual(backend.get_all_permissions(user), {'auth.test_user', 'auth.test_group'})
        self.assertEqual(backend.get_user_permissions(user), {'auth.test_user'})
        self.assertEqual(backend.get_group_permissions(user), {'auth.test_group'})

        with mock.patch.object(self.UserModel, 'is_anonymous', True):
            self.assertEqual(backend.get_all_permissions(user), set())
            self.assertEqual(backend.get_user_permissions(user), set())
            self.assertEqual(backend.get_group_permissions(user), set())

    def test_inactive_has_no_permissions(self):
        """
        #17903 -- Inactive users shouldn't have permissions in
        ModelBackend.get_(all|user|group)_permissions().
        """
        backend = ModelBackend()

        user = self.UserModel._default_manager.get(pk=self.user.pk)
        content_type = ContentType.objects.get_for_model(Group)
        user_perm = Permission.objects.create(name='test', content_type=content_type, codename='test_user')
        group_perm = Permission.objects.create(name='test2', content_type=content_type, codename='test_group')
        user.user_permissions.add(user_perm)

        group = Group.objects.create(name='test_group')
        user.groups.add(group)
        group.permissions.add(group_perm)

        self.assertEqual(backend.get_all_permissions(user), {'auth.test_user', 'auth.test_group'})
        self.assertEqual(backend.get_user_permissions(user), {'auth.test_user'})
        self.assertEqual(backend.get_group_permissions(user), {'auth.test_group'})

        user.is_active = False
        user.save()

        self.assertEqual(backend.get_all_permissions(user), set())
        self.assertEqual(backend.get_user_permissions(user), set())
        self.assertEqual(backend.get_group_permissions(user), set())

    def test_get_all_superuser_permissions(self):
        """A superuser has all permissions. Refs #14795."""
        user = self.UserModel._default_manager.get(pk=self.superuser.pk)
        self.assertEqual(len(user.get_all_permissions()), len(Permission.objects.all()))

    @override_settings(PASSWORD_HASHERS=['users.tests.CountingMD5PasswordHasher'])
    def test_authentication_timing(self):
        """Hasher is run once regardless of whether the user exists. Refs #20760."""
        # Re-set the password, because this tests overrides PASSWORD_HASHERS
        self.user.set_password('test')
        self.user.save()

        CountingMD5PasswordHasher.calls = 0
        username = getattr(self.user, self.UserModel.USERNAME_FIELD)
        authenticate(username=username, password='test')
        self.assertEqual(CountingMD5PasswordHasher.calls, 1)

        CountingMD5PasswordHasher.calls = 0
        authenticate(username='no_such_user', password='test')
        self.assertEqual(CountingMD5PasswordHasher.calls, 1)

    def test_login(self):
        self.assertTrue(self.client.login(username='test', password='test'))
        self.assertFalse(self.client.login(username='bug', password='test'))
        self.assertFalse(self.client.login(username='test', password='bug'))
        self.assertFalse(self.client.login(username='nobody', password='bug'))

    def test_authenticate_inactive(self):
        """
        An inactive user can't authenticate.
        """
        self.assertEqual(authenticate(**self.user_credentials), self.user)
        self.user.is_active = False
        self.user.save()
        self.assertIsNone(authenticate(**self.user_credentials))
        
