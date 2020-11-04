from flask import Flask, request, flash, render_template, redirect
from flask_debugtoolbar import DebugToolbarExtension

from models import db, connect_db, User, Upcoming_trip, Search

from secrets import SESSION_KEY
# from os import environ
# environ.get('SECRET_KEY')

app = Flask(__name__)

app.config["SECRET_KEY"] = SESSION_KEY
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql:///weather'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SQLALCHEMY_ECHO'] = True
app.config["DEBUG_TB_INTERCEPT_REDIRECTS"] = False

debug = DebugToolbarExtension(app)

connect_db(app)

# Drop then create table
db.drop_all()
db.create_all()

@app.route("/")
def homepage():
    return render_template("index.html")

