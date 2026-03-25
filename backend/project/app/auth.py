import secrets, hashlib
from datetime import datetime, timedelta, timezone
from flask import Blueprint, jsonify, request, current_app, url_for, make_response
from flask_jwt_extended import (
    JWTManager, create_access_token, create_refresh_token,
    decode_token, jwt_required, get_jwt, get_jwt_identity,
    set_access_cookies, set_refresh_cookies, unset_jwt_cookies
)

from .models import db, User, RefreshToken, MailToken, UserPhoto
from .security import verify_password, hash_password
from .email import generate_token, send_confirmation_email, confirm_token, send_reset_email


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
    if isinstance(delta, int):
        return timedelta(seconds=delta)
    return delta


def issue_password_reset_token(user):
    raw = secrets.token_urlsafe(48)
    h = hashlib.sha256(raw.encode()).hexdigest()
    pr = MailToken(
        token_hash=h,
        user_id=user.id,
        expires_at=datetime.now(timezone.utc) + timedelta(minutes=5)
    )
    db.session.add(pr)
    db.session.commit()
    return url_for("auth.password_reset_confirm", token=raw, _external=True)


@bp.route("/register", methods=["POST"])
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

    token = generate_token(user.email)
    confirm_url = url_for("auth.confirm_email", token=token, _external=True)
    send_confirmation_email(user.email, confirm_url, user.first_name)

    return jsonify(msg="User created. Please check your email to confirm."), 204


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


@bp.route("/forgot-password", methods=["POST"])
def request_password_reset():
    data = request.get_json() or {}
    email = (data.get("email") or "").strip().lower()
    if not email:
        return jsonify(msg="Invlid request"), 400
    user = User.query.filter_by(email=email).first()
    if user:
        reset_url = issue_password_reset_token(user)
        send_reset_email(user.email, reset_url)
        db.session.commit()
        return jsonify(msg="A reset link has been sent"), 200
    return jsonify(msg="User not found"), 404


@bp.route("/reset-password", methods=["POST"])
def password_reset_confirm():
    data = request.get_json() or {}
    raw = data.get("token")
    new_password = data.get("new_password")
    if not raw or not new_password:
        return jsonify(msg="Invalid request"), 400

    h = hashlib.sha256(raw.encode()).hexdigest()
    pr = MailToken.query.filter_by(token_hash=h).first()
    if not pr or pr.used or pr.expires_at < datetime.now(timezone.utc):
        return jsonify(msg="Invalid or expired token"), 400

    user = User.query.get(pr.user_id)
    if not user:
        return jsonify(msg="Invalid token"), 400
    user.password = hash_password(new_password)
    db.session.add(user)
    db.session.commit()
    RefreshToken.query.filter_by(user_id=user.id).update({"revoked": True})
    db.session.commit()
    return jsonify(msg="Password has been reset"), 200


@bp.route("/login", methods=["POST"])
def login():
    data = request.get_json() or {}
    username = data.get("username")
    password = data.get("password")
    if not username or not password:
        return jsonify(msg="Invalid request"), 400
    user = User.query.filter_by(username=username).first()
    if not user or not verify_password(password, user.password):
        return jsonify(msg="Bad username or password"), 401
    if not user.is_active:
        return jsonify(message="Email not confirmed"), 403

    identity_str = str(user.id)
    access = create_access_token(identity=identity_str)
    refresh = create_refresh_token(identity=identity_str)
    refresh_jti = decode_token(refresh)["jti"]
    store_refresh_token(refresh_jti, user.id, current_app.config["JWT_REFRESH_TOKEN_EXPIRES"])

    primary = UserPhoto.query.filter_by(user_id=user.id, is_primary=True).first()
    profile_image_url = primary.url if primary else ""

    resp = jsonify({
        "id": user.id,
        "username": user.username,
        "isComplete": True,
        "profileImage": profile_image_url
        })
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
    resp = make_response('', 204)
    unset_jwt_cookies(resp)
    return resp


@bp.route("/protected", methods=["GET"])
@jwt_required()
def protected():
    current_user = get_jwt_identity()
    return jsonify(logged_in_as=current_user), 200


@bp.route("/me", methods=["GET"])
@jwt_required()
def get_user_info():
    current = get_jwt_identity()

    user = User.query.get(current)
    if not user:
        return jsonify(msg="User not found"), 404
    
    return jsonify(id=user.id, username=user.username)


@jwt.unauthorized_loader
def custom_missing_token_message(callback):
    # called when no JWT is present
    return jsonify({"code": "UNAUTHORIZED", "message": "Missing credentials"}), 401


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