from itsdangerous import URLSafeTimedSerializer
from flask_mail import Message, Mail
from flask import current_app


mail = Mail()


def get_serializer():
    return URLSafeTimedSerializer(current_app.config["MAIL_SECRET_KEY"], salt="email-confirm-salt")


def generate_token(email: str):
    return get_serializer().dumps(email)


def confirm_token(token: str, max_age: int = 60*60*24):
    try:
        return get_serializer().loads(token, max_age=max_age)
    except Exception:
        return None


def send_confirmation_email(to_email: str, confirm_url: str, user_first_name: str = ""):
    subject = "Confirm your account"
    html = (
        f"<p>Hi {user_first_name},</p>"
        f"<p>Confirm your email by clicking <a href=\"{confirm_url}\">this link</a>.</p>"
        "<p>If you didn't sign up, you will die in 2 days.</p>"
    )
    msg = Message(subject=subject, recipients=[to_email], html=html)

    if not current_app.config["MAIL_SUPPRESS_SEND"]:
        mail.send(msg)


def send_reset_email(to_email: str, reset_url: str):
    subject = "Reset your password"
    html = (
        f"<p>Hi,</p>"
        f"<p>Reset your password by clicking <a href=\"{reset_url}\">this link</a>.</p>"
        "<p>If you didn't request this, you will die in 2 days.</p>"
    )
    msg = Message(subject=subject, recipients=[to_email], html=html)

    if not current_app.config["MAIL_SUPPRESS_SEND"]:
        mail.send(msg)