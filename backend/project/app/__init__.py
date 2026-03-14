from flask import Flask

from .auth import bp as auth_bp, jwt
from .profile import bp as profile_bp
from .models import db
from .email import mail


def create_app(config_object="project.config.Config"):
    app = Flask(__name__)
    app.config.from_object(config_object)

    db.init_app(app)
    jwt.init_app(app)
    mail.init_app(app)

    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(profile_bp, url_prefix="/api/users")

    @app.route("/")
    def _root():
        return {"i am": "alive"}

    return app

app = create_app()