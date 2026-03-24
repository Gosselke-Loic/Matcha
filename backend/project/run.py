from app import app, socketio
from app.models import db


if __name__ == "__main__":
    with app.app_context():
        db.create_all()
    socketio.run(app, debug=True)
