import datetime

from flask import current_app as app
from peewee import *
from playhouse.db_url import connect

from app import *


def get_db():
    db = PostgresqlDatabase(
        app.config["DB_NAME"],
        user=app.config["DB_USER"],
        password=app.config["DB_PASSWORD"],
        host=app.config["DB_HOST"],
        port=app.config["DB_PORT"],
    )
    db.connect()
    return db


db = get_db()


class Base(Model):
    class Meta:
        database = db


# Objects


class User(Base):
    created_by = DateTimeField(
        default=datetime.datetime.now, formats=["%Y-%m-%d %H:%M:%S"]
    )
    is_anonymous = BooleanField(default=False)  # required
    mood = CharField()  # required
    latitude = CharField()  # required
    longitude = CharField()  # required
    message = TextField()  # required
    age = CharField(null=True)  # opt
    gender = CharField(null=True)  # opt
    name = CharField(null=True)  # opt
    profession = CharField(null=True)  # opt


if __name__ == "__main__":
    db.create_tables([User])
