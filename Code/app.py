from flask import Flask, request, flash, render_template, redirect, session
from flask_debugtoolbar import DebugToolbarExtension

from models import db, connect_db, User, Upcoming_trip, Search
from forms import UserSignupForm, UserLoginForm, UpcomingTripForm

from sqlalchemy.exc import IntegrityError

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
# db.drop_all()
# db.create_all()

@app.route("/")
def homepage():
    return render_template("index.html")

@app.route("/logout", methods=["GET", "POST"])
def logout():
    session.pop("user_id")
    session.pop("username")

    flash("Logout sucessful", "success")

    return redirect("/")


@app.route("/login", methods=["GET", "POST"])
def login():
    form = UserLoginForm()

    if form.validate_on_submit():
        username = form.username.data
        password = form.password.data

        user = User.authenticate(username, password)
        print("***************************")
        print(user)
        print("***************************")
        if user:
            session["user_id"] = user.id
            session["username"] = user.username

            flash(f"Welcome {user.username}", "success")

            return redirect("/")
        else:
            form.username.errors = ["Incorrect username/password."]

    return render_template("login_form.html", form=form)

@app.route("/signup", methods=["GET", "POST"])
def signup():
    form = UserSignupForm()

    if form.validate_on_submit():
        first_name = form.first_name.data
        last_name = form.last_name.data
        email = form.email.data
        username = form.username.data
        password = form.password.data

        new_user = User.signup(first_name, last_name, email, username, password)
        db.session.add(new_user)
        try:
            db.session.commit()
            session["user_id"] = new_user.id
            session["username"] = new_user.username
            
            flash("Account created successfully", "success")

            return redirect("/")
        except IntegrityError:
            form.username.errors.append("Username taken. Please choose another.")

            return render_template("signup_form.html", form=form)

    return render_template("signup_form.html", form=form)
