from datetime import datetime, timedelta, timezone
from flask import Blueprint, jsonify, request, current_app, url_for
from flask_jwt_extended import (
    JWTManager, create_access_token, create_refresh_token,
    decode_token, jwt_required, get_jwt, get_jwt_identity,
    set_access_cookies, set_refresh_cookies, unset_jwt_cookies
)

from .models import db, User, RefreshToken
from .security import verify_password, hash_password
from .email import generate_confirmation_token, send_confirmation_email, confirm_token


bp = Blueprint("auth", __name__)
jwt = JWTManager()


def store_refresh_token(jti: str, user_id: int, expires_delta: timedelta):
    expires_at = datetime.now(timezone.utc) + expires_delta
    rt = RefreshToken(jti=jti, user_id=user_id, expires_at=expires_at)
    db.session.add(rt)
    db.session.commit()
    return rt


def revoke_refresh_token(jti: str):
    rt = RefreshToken.query.filter_by(jti=jti).one_or_none()
    if rt and not rt.revoked:
        rt.revoked = True
        db.session.add(rt)
        db.session.commit()
    return rt


def is_refresh_token_revoked(jti: str) -> bool:
    rt = RefreshToken.query.filter_by(jti=jti).one_or_none()
    if rt is None:
        return True  # treat unknown tokens as revoked
    if rt.revoked:
        return True
    if rt.expires_at < datetime.now(timezone.utc):
        return True
    return False


# Helper to get refresh token expiry delta used by flask-jwt-extended config
def get_refresh_expires_delta():
    delta = current_app.config.get("JWT_REFRESH_TOKEN_EXPIRES")
    # Flask-JWT-Extended may store timedelta or int seconds; normalize to timedelta
    if isinstance(delta, int):
        return timedelta(seconds=delta)
    return delta


@bp.route("/signup", methods=["POST"])
def signup():
    data = request.get_json() or {}
    username = data.get("username")
    email = data.get("email")
    password = data.get("password")
    first_name = data.get("first_name", "First")
    last_name = data.get("last_name", "Last")
    birthday = data.get("birthday_date")  #YYYY-MM-DD

    if not username or not email or not password or not birthday:
        return jsonify(msg="Missing required fields"), 400

    if User.query.filter((User.username == username) | (User.email == email)).first():
        return jsonify(msg="Username or email already in use"), 409

    #try:
    #    birthday_date = date.fromisoformat(birthday)
    #except Exception:
    #    return jsonify(msg="Invalid birthday_date format, use YYYY-MM-DD"), 400

    hashed = hash_password(password)
    user = User(
        username=username,
        email=email,
        first_name=first_name,
        last_name=last_name,
        password=hashed,
        birthday_date=birthday,
        is_active=current_app.config["MAIL_SUPPRESS_SEND"]
    )

    db.session.add(user)
    db.session.commit()

    token = generate_confirmation_token(user.email)
    confirm_url = url_for("auth.confirm_email", token=token, _external=True)
    send_confirmation_email(user.email, confirm_url, user.first_name)

    return jsonify(msg="User created. Please check your email to confirm."), 201


@bp.route("/confirm/<token>", methods=["GET"])
def confirm_email(token):
    email = confirm_token(token)
    if not email:
        return jsonify(msg="Invalid or expired token"), 400
    user = User.query.filter_by(email=email).first()
    if not user:
        return jsonify(msg="User not found"), 404
    if user.is_active:
        return jsonify(msg="Account already confirmed"), 200
    user.is_active = True
    user.email_confirmed_at = datetime.now(timezone.utc)
    db.session.commit()
    return jsonify(msg="Email confirmed, account activated"), 200


@bp.route("/login", methods=["POST"])
def login():
    username = request.json.get("username")
    password = request.json.get("password")
    user = User.query.filter_by(username=username).first()
    if not user or not verify_password(password, user.password):
        return jsonify(msg="Bad username or password"), 401
    if not user.is_active:
        return jsonify(msg="Email not confirmed"), 403

    identity_str = str(user.id)
    access = create_access_token(identity=identity_str)
    refresh = create_refresh_token(identity=identity_str)
    refresh_jti = decode_token(refresh)["jti"]
    store_refresh_token(refresh_jti, user.id, current_app.config["JWT_REFRESH_TOKEN_EXPIRES"])

    resp = jsonify(id=user.id, username=user.username)
    set_access_cookies(resp, access)
    set_refresh_cookies(resp, refresh)
    return resp


@bp.route("/refresh", methods=["POST"])
@jwt_required(refresh=True)
def refresh():
    jwt_data = get_jwt()
    current_jti = jwt_data["jti"]
    identity = get_jwt_identity()
    if is_refresh_token_revoked(current_jti):
        return jsonify(msg="Refresh token revoked"), 401

    revoke_refresh_token(current_jti)

    new_access = create_access_token(identity=identity)
    new_refresh = create_refresh_token(identity=identity)
    new_jti = decode_token(new_refresh)["jti"]
    store_refresh_token(new_jti, identity, current_app.config["JWT_REFRESH_TOKEN_EXPIRES"])

    resp = jsonify(access_token=new_access)
    set_access_cookies(resp, new_access)
    set_refresh_cookies(resp, new_refresh)
    return resp


@bp.route("/logout", methods=["POST"])
@jwt_required(refresh=True)
def logout():
    jti = get_jwt()["jti"]
    revoke_refresh_token(jti)
    resp = jsonify(msg="Logged out")
    unset_jwt_cookies(resp)
    return resp


@bp.route("/protected", methods=["GET"])
@jwt_required()
def protected():
    current_user = get_jwt_identity()
    return jsonify(logged_in_as=current_user), 200


@jwt.unauthorized_loader
def custom_missing_token_message(callback):
    # called when no JWT is present
    return jsonify({"msg": "Authentication required: no token provided"}), 401


@jwt.invalid_token_loader
def custom_invalid_token_message(reason):
    # called when token is malformed/invalid
    return jsonify({"msg": f"Invalid token: {reason}"}), 422


@jwt.expired_token_loader
def custom_expired_token_message(jwt_header, jwt_payload):
    # called when token is expired
    return jsonify({"msg": "Token expired — please log in again"}), 401


@jwt.revoked_token_loader
def custom_revoked_token_message(jwt_header, jwt_payload):
    # called when token was revoked (e.g. logout)
    return jsonify({"msg": "Token revoked — please log in again"}), 401


@jwt.needs_fresh_token_loader
def custom_needs_fresh_message(jwt_header, jwt_payload):
    # called when a fresh token is required
    return jsonify({"msg": "Fresh token required"}), 401