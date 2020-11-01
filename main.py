from os import path, environ

from flask import Flask, send_from_directory, render_template, request, json
from playhouse.shortcuts import model_to_dict, dict_to_model

from models import *
from app import *


@app.route("/create", methods=["GET", "POST"])
def create():
    if request.method == "POST":
        entry = User(
            age=request.json["age"],
            coords=request.json["coords"],
            gender=request.json["gender"],
            is_anonymous=request.json["is_anonymous"],
            message=request.json["message"],
            mood=request.json["mood"],
            name=request.json["name"],
            profession=request.json["profession"],
        )
        entry.save()

        return {}
    return send_from_directory("dist/", "index.html")


@app.route("/users")
def users():
    query = User.select()
    users = [model_to_dict(user) for user in query]
    response = app.response_class(
        response=json.dumps(users),
        status=200,
        mimetype="application/json",
    )
    return response


########## Serve frontend static files


@app.route("/")
@app.route("/list")
@app.route("/map")
@app.route("/submit")
def root():
    return send_from_directory("dist/", "index.html")


@app.route("/<path:path>", methods=["GET"])
def static_proxy(path):
    return send_from_directory("dist/static", path)


@app.errorhandler(500)
def server_error(e):
    return "An internal error occurred [main.py] %s" % e, 500


if __name__ == "__main__":
    # This is used when running locally only. When deploying use a webserver process
    # such as Gunicorn to serve the app.
    app.run(host="127.0.0.1", port=8080, debug=True)
