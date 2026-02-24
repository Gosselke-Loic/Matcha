from datetime import datetime, timedelta, timezone
from flask import Blueprint, jsonify, request, current_app
from flask_jwt_extended import (
    JWTManager, create_access_token, create_refresh_token,
    decode_token, jwt_required, get_jwt, get_jwt_identity,
    set_access_cookies, set_refresh_cookies, unset_jwt_cookies
)
from .models import db, User, RefreshToken

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


@bp.route("/login", methods=["POST"])
def login():
    username = request.json.get("username")
    password = request.json.get("password")
    user = User.query.filter_by(username=username).first()
    if not user or password != "test":  # replace with real hash check
        return jsonify(msg="Bad username or password"), 401

    access = create_access_token(identity=user.id)
    refresh = create_refresh_token(identity=user.id)
    refresh_jti = decode_token(refresh)["jti"]
    store_refresh_token(refresh_jti, user.id, current_app.config["JWT_REFRESH_TOKEN_EXPIRES"])

    resp = jsonify(msg="Login successful")
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
    # Access the identity of the current user with get_jwt_identity
    current_user = get_jwt_identity()
    return jsonify(logged_in_as=current_user), 200