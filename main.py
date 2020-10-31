from os import path, environ

from flask import Flask, send_from_directory, render_template, request

from models import *
from app import *


@app.route("/submit", methods=["GET", "POST"])
def submit():
    print("??? submit 1")
    if request.method == "POST":
        print("submit 2", User)
        print("HERE")
        entry = User(
            isAnonymous=request.json["isAnonymous"],
            mood=request.json["mood"],
            coords=request.json["coords"],
            message=request.json["message"],
            age=request.json["age"],
            gender=request.json["gender"],
            name=request.json["name"],
            profession=request.json["profession"],
        )
        print("THERE")

        print("submit entry 1", entry)
        entry.save()
        print("submit entry 2", entry)

        return {}
    print("@@submit 2", User)
    return "hello"


# - filter can be: age, mood, gender
@app.route("/users", methods=["GET"])
def getUsers():
    return send_from_directory("dist/static", path)


########## Serve frontend static files


@app.route("/")
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
