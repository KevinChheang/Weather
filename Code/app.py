from flask import Flask, request, flash, render_template, redirect, session, jsonify
from flask_debugtoolbar import DebugToolbarExtension

from models import db, connect_db, User, UpcomingTrip, Search
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
    # if "user_id" not in session:
    #     flash("Signup/Login to unlock full features.", "info")

    return render_template("index.html")

@app.route("/logout", methods=["GET", "POST"])
def logout():
    """Logout user, clear session"""
    session.pop("user_id")
    session.pop("username")

    flash("Logout sucessful", "success")

    return redirect("/")


@app.route("/login", methods=["GET", "POST"])
def login():
    """Login user, check if login credentials are correct"""
    form = UserLoginForm()

    if form.validate_on_submit():
        username = form.username.data
        password = form.password.data

        user = User.authenticate(username.upper(), password)

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
    """Signup user, hased password and save user info to db"""
    form = UserSignupForm()

    if form.validate_on_submit():
        first_name = form.first_name.data
        last_name = form.last_name.data
        email = form.email.data
        username = form.username.data
        password = form.password.data

        new_user = User.signup(first_name, last_name, email, username.upper(), password)
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

@app.route("/add-trip/<int:user_id>", methods=["GET", "POST"])
def add_trip(user_id):
    """Adding upcoming trip and save to db"""
    form = UpcomingTripForm()

    if form.validate_on_submit():
        country = form.country.data
        city = form.city.data
        date = form.date.data

        trip = UpcomingTrip(country=country, city=city, date=date, user_id=user_id)
        db.session.add(trip)
        db.session.commit()

        flash("Trip saved", "success")

        return redirect("/")

    return render_template("add_trip_form.html", form=form)

@app.route("/all_trips/<int:user_id>")
def show_all_trips(user_id):
    # check if user login or not
    if "user_id" not in session:
        flash("Please login to gain access.", "info")

        return redirect("/")
    
    trips = UpcomingTrip.query.filter(UpcomingTrip.user_id==user_id).all()

    return render_template("display_all_trips.html", trips=trips)

@app.route("/trip_details/<int:trip_id>")
def show_trip_details(trip_id):
    # check if user login or not
    if "user_id" not in session:
        flash("Please login to gain access.", "info")

        return redirect("/")
    
    trip = UpcomingTrip.query.get_or_404(trip_id)

    return render_template("display_trip_details.html", trip=trip)

# RESTful API route to get data from db
# will be call from js file
# @app.route("/trips")
# def get_all_trips():
#     # check if user login or not
#     if "user_id" not in session:
#         flash("Please login to gain access.", "info")

#         return redirect("/")

#     trips = UpcomingTrip.query.all()
#     serialized = [trip.serialize_trip() for trip in trips]

#     return jsonify(serialized)