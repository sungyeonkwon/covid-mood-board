import datetime

from peewee import *
from playhouse.db_url import connect
from models import *

# TODO: pw needs not to be exposed
def get_db():
    db = PostgresqlDatabase(
        "covid-mood-board",  # databsename
        user="doadmin",
        password="c03qirpg5l5jrk7p",
        host="private-db-postgresql-nyc1-12975-do-user-6405713-0.b.db.ondigitalocean.com",  # remote host external ip
        port=25060,
    )
    db.connect()
    return db


db = get_db()


class Base(Model):
    class Meta:
        database = db


# Objects


class User(Base):
    created_date = DateTimeField(
        default=datetime.datetime.now, formats=["%Y-%m-%d %H:%M:%S"]
    )
    isAnonymous = BooleanField(default=False)  # required
    mood = CharField()  # required
    coords = CharField()  # required
    message = TextField()  # required
    age = CharField(null=True)  # opt
    gender = CharField(null=True)  # opt
    name = CharField(null=True)  # opt
    profession = CharField(null=True)  # opt


if __name__ == "__main__":
    db.create_tables([User])
