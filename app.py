from os import path, environ

from flask import Flask, send_from_directory, render_template, request

import config

app = Flask(__name__)

app.config.from_object("config.Config")

if environ.get("FLASK_ENV") == "development":
    app.config.from_object("config.DevConfig")
else:
    app.config.from_object("config.ProdConfig")

print("READ")
