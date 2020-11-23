from models import db
from app import app

# Delete and then create all tables
db.drop_all()
db.create_all()