import os
from datetime import timedelta


basedir = os.path.abspath(os.path.dirname(__file__))


class Config(object):
    # Database settings 
    SQLALCHEMY_DATABASE_URI = os.getenv("DATABASE_URL", "sqlite://")
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
	# JWT settings
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "super-secret")
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(minutes=15)
    JWT_REFRESH_TOKEN_EXPIRES = timedelta(days=7)
    JWT_TOKEN_LOCATION = "cookies"
    JWT_COOKIE_SECURE = "True"
    JWT_COOKIE_SAMESITE = "Strict"
    
    # Mail settings
    MAIL_SECRET_KEY = os.getenv("MAIL_SECRET_KEY", "super-secret")
    MAIL_SERVER = "smtp.gmail.com"
    MAIL_PORT = 587
    MAIL_USE_TLS = True
    MAIL_USE_SSL = False
    MAIL_USERNAME = "smtp-user"
    MAIL_PASSWORD = "smtp-pass"
    MAIL_DEFAULT_SENDER = "Matcha <no-reply@matcha.com>"
    MAIL_SUPPRESS_SEND = True
