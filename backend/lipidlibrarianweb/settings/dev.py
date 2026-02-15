from .base import *

import os


APP_URL_DEST = ''

DEBUG = 1

ALLOWED_HOSTS = ["*"]

SECRET_KEY = 'development_only_secret_key'

# No django-q, no redis
INSTALLED_APPS = [
    app for app in INSTALLED_APPS if app != "django_q"
]

# Logging
# https://docs.djangoproject.com/en/4.2/topics/logging/
LOGGING = {
    "version": 1,
    "disable_existing_loggers": False,
    "handlers": {
        "console": {
            "class": "logging.StreamHandler",
        },
    },
    "root": {
        "handlers": ["console"],
        "level": "INFO",
    },
    "loggers": {
        "django": {
            "handlers": ["console"],
            "level": "INFO",
            "propagate": False,
        },
    },
}

# Database
# https://docs.djangoproject.com/en/4.2/ref/settings/#databases
DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.sqlite3",
        "NAME": os.path.join(BASE_DIR, "db.sqlite3"),
    }
}

CACHES = {
    "default": {
        "BACKEND": "django.core.cache.backends.dummy.DummyCache",
    }
}

# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/4.2/howto/static-files/
STATIC_URL = APP_URL_DEST + 'static/'
STATIC_ROOT = os.path.join(BASE_DIR, "static") 

# Dynamic Files (saved in the database)
MEDIA_URL = APP_URL_DEST + 'dynamic/'
MEDIA_ROOT = os.path.join(BASE_DIR, "dynamic")
