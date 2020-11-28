from os import path, environ
import datetime
import collections
from operator import itemgetter

from flask import Flask, send_from_directory, render_template, request, json
from playhouse.shortcuts import model_to_dict, dict_to_model

from models import *
from app import *

# some manual checking required. meh
merge_tuples = [
    ("anxiety", "anxious", "", ""),
    ("covid", "covid-19", "", ""),
    ("day", "days", "", ""),
    ("die", "died", "dying", "dies"),
    ("disgust", "disgusted", "disgusting","disgusts"),
    ("distance", "distancing", "", ""),
    ("fail", "failed", "failing", "fails"),
    ("feel", "felt", "feeling", "feels"),
    ("friend", "friends", "", ""),
    ("fuck", "fucked", "fucking", ""),
    ("get", "got", "gotten", "gets"),
    ("kill", "killed", "killing", "kills"),
    ("life", "lives", "", ""),
    ("like", "liked", "liking", "likes"),
    ("loneliness", "lonely", "alone", ""),
    ("lose", "lost", "losing", "loses"),
    ("love", "loved", "loving", "loves"),
    ("make", "made", "making", "makes"),
    ("many", "much", "", ""),
    ("mask", "masks", "", ""),
    ("care", "cared", "caring", "cares"),
    ("people", "people’s", "", ""),
    ("risk", "risks", "", ""),
    ("sad", "sadness", "sadly", ""),
    ("see", "saw", "seen", "seeing"),
    ("selfish", "selfishness", "", ""),
    ("take", "took", "taking", "takes"),
    ("find", "found", "finding", "finds"),
    ("thing", "things", "", ""),
    ("time", "times", "", ""),
    ("country", "countries", "", ""),
    ("try", "tried", "trying", "tries"),
    ("wear", "wore", "wearing", "wears"),
    ("work", "wored", "working", "works"),
    ("year", "years", "", ""),
]

# playground for text frequency
def getTopFrequentWords():
    query = User.select()
    text = "".join([model_to_dict(user)["message"] for user in query])

    stopwords = set(line.strip() for line in open("words/stopwords.txt"))
    word_count = {}

    for word in text.lower().split():
        word = word.replace(".", "")
        word = word.replace(",", "")
        word = word.replace(":", "")
        word = word.replace('"', "")
        word = word.replace("'", "’")
        word = word.replace("!", "")
        word = word.replace("*", "")
        if word not in stopwords:
            if word not in word_count:
                word_count[word] = 1
            else:
                word_count[word] += 1

    counter = collections.Counter(word_count)

    # get the merge list: if the word shares the first 3 letters
    # for word, count in counter.most_common(200):
    #     for word2, count2 in counter.most_common(200):
    #         if word in word2 and len(word) >= 3 and len(word) != len(word2) and word[0] == word2[0]:
    #             print(word, word2)

    merged_counts = []
    single_counts = []
    for words in merge_tuples:
        merged = (f"{words[0]} {words[1]} {words[2]} {words[3]}", 0)
        for word, count in counter.most_common(222):
            if word == words[0] or word == words[1] or word == words[2] or word == words[3]:
                merged = (merged[0], merged[1] + count)
        merged_counts.append(merged)

    flat_words = list(sum(merge_tuples, ()))
    single_counts = [
        item for item in counter.most_common(222) if item[0] not in flat_words
    ]
    total = merged_counts + single_counts
    total.sort(key=itemgetter(1))
    return total[::-1]


@app.route("/create", methods=["GET", "POST"])
def create():
    if request.method == "POST":
        entry = User(
            age=request.json["age"],
            latitude=request.json["latitude"],
            longitude=request.json["longitude"],
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
    query = User.select().order_by(User.created_by.desc())
    users = [model_to_dict(user) for user in query]
    response = app.response_class(
        response=json.dumps(users),
        status=200,
        mimetype="application/json",
    )
    return response


@app.route("/words")
def words():
    words_list = getTopFrequentWords()
    response = app.response_class(
        response=json.dumps(words_list),
        status=200,
        mimetype="application/json",
    )
    return response


##########
#  Serve frontend static files
##########


@app.route("/")
@app.route("/list")
@app.route("/map")
@app.route("/info")
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
