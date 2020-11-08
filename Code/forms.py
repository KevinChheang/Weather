from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, DateField
from wtforms.validators import InputRequired, Email

class UserSignupForm(FlaskForm):
    """User registration form"""

    first_name = StringField("First name", validators=[InputRequired()])

    last_name = StringField("Last name", validators=[InputRequired()])

    email = StringField("Email", validators=[])

    username = StringField("Username", validators=[InputRequired()])

    password = PasswordField("Password", validators=[InputRequired()])


class UserLoginForm(FlaskForm):
    """User login form"""

    username = StringField("Username", validators=[InputRequired()])

    password = PasswordField("Password", validators=[InputRequired()])

class UpcomingTripForm(FlaskForm):
    """Upcoming trip form"""

    city = StringField("City", validators=[InputRequired()])

    date = DateField("Date", format="%m/%d/%Y")