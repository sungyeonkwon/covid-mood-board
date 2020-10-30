from flask import Flask, send_from_directory, render_template, request

app = Flask(__name__)
from models import *

####### Database


@app.route("/submit", methods=["GET", "POST"])
def submit():
    if request.method == "POST":
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
        entry.save()

        return {}
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
