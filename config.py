from os import path, environ
from dotenv import load_dotenv

basedir = path.abspath(path.dirname(__file__))
load_dotenv(dotenv_path=path.join(basedir, ".env"), verbose=True)


class Config:
    """
    Set Flask config variables.
    """

    FLASK_ENV = "development"
    TESTING = True
    STATIC_FOLDER = "static"
    TEMPLATES_FOLDER = "templates"
    DB_NAME = environ.get("DB_NAME")
    DB_USER = environ.get("DB_USER")
    DB_PASSWORD = environ.get("DB_PASSWORD")
    DB_PORT = environ.get("DB_PORT")


class ProdConfig(Config):
    FLASK_ENV = "production"
    DEBUG = False
    TESTING = False
    DB_HOST = environ.get("DB_INTERNAL_HOST")


class DevConfig(Config):
    FLASK_ENV = "development"
    DEBUG = True
    TESTING = True
    DB_HOST = environ.get("DB_EXTERNAL_HOST")
