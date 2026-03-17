from .base import *

import os


APP_URL_DEST = os.environ.get("APP_URL_DEST", default="")
if APP_URL_DEST != "":
    while APP_URL_DEST.startswith('/'):
        APP_URL_DEST = APP_URL_DEST[1:]
    if not APP_URL_DEST.endswith('/'):
        APP_URL_DEST = APP_URL_DEST + '/'

DEBUG = 0

ALLOWED_HOSTS = os.environ.get("DJANGO_ALLOWED_HOSTS", default="backend localhost localhost.localdomain 127.0.0.1").split(" ")

SECRET_KEY = os.environ.get("DJANGO_SECRET_KEY", default="foo")

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
        "level": "DEBUG",
    },
    "loggers": {
        "django": {
            "handlers": ["console"],
            "level": "DEBUG",
            "propagate": False,
        },
    },
}

# Database
# https://docs.djangoproject.com/en/4.2/ref/settings/#databases
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        "NAME": os.environ.get("DJANGO_DB_NAME"),
        'USER': os.environ.get("DJANGO_DB_USER"),
        'PASSWORD': os.environ.get("DJANGO_DB_PASSWORD"),
        'HOST': os.environ.get("DJANGO_DB_HOST"),
        'PORT': os.environ.get("DJANGO_DB_PORT"),
    }
}

# valkey cache
CACHES = {
    "default": {
        "BACKEND": "django.core.cache.backends.redis.RedisCache",
        "LOCATION": f'redis://{os.environ.get("DJANGO_CACHE_HOST")}:{os.environ.get("DJANGO_CACHE_PORT")}',
    }
}

# django-q2 worker
Q_CLUSTER = {
    'redis': f'redis://{os.environ.get("DJANGO_CACHE_HOST")}:{os.environ.get("DJANGO_CACHE_PORT")}',
    'retry': 180,
    'timeout': 120,
}

# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/4.2/howto/static-files/
STATIC_URL = APP_URL_DEST + 'static/'
STATIC_ROOT = os.path.join(BASE_DIR, "static") 

# Dynamic Files (saved in the database)
MEDIA_URL = APP_URL_DEST + 'dynamic/'
MEDIA_ROOT = os.path.join(BASE_DIR, "dynamic")
