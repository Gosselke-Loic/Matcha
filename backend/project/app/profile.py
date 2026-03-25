from flask import Blueprint, jsonify, request, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity, verify_jwt_in_request
from werkzeug.utils import secure_filename
import os, time

from .models import db, User, UserPhoto, RefreshToken, Interest
from .security import verify_password, hash_password


bp = Blueprint("profiles", __name__)


def base_user_payload(user: User):
    return {
        "id": user.id,
        "username": user.username,
        "firstName": user.first_name,
        "lastName": user.last_name,
        "biography": user.biography,
        "interests": [],
        "gender": user.gender.value,
        "city": user.city
    }


def public_user_payload(user: User):
    payload = base_user_payload(user)
    payload.update({
        "lastSeen": user.last_seen.isoformat() if user.last_seen is not None else None,
        "images": [],
        "isActive": user.is_active,
        "hasLiked": True,
        "birthdayDate": user.birthday_date.isoformat(),
        "fameRate": user.fame_rate,
    })
    return payload


def private_user_payload(user: User):
    payload = base_user_payload(user)
    payload.update({
        "email": user.email,
        "address": user.address,
        "lat": user.lat,
        "lon": user.lon,
        "sex_pref": user.sex_pref.value
    })
    return payload


@bp.route("/<int:user_id>", methods=["GET"])
@jwt_required()
def get_profile(user_id: int):
    current = get_jwt_identity()

    user = User.query.get(user_id)
    if not user:
        return jsonify({"code": "NOT_FOUND", "message": "User not found"}), 404

    if int(current) == int(user_id):
        ids = user.interests_cache or []
        if ids:
            interests = Interest.query.filter(Interest.id.in_(ids)).all()
            payload = private_user_payload(user)
            payload["interests"] = [{"id": i.id, "label": i.name} for i in interests]
        else:
            payload = private_user_payload(user)
        return jsonify(payload), 200

    ids = user.interests_cache or []
    if ids:
        interests = Interest.query.filter(Interest.id.in_(ids)).all()
        payload = public_user_payload(user)
        payload["interests"] = [{"id": i.id, "label": i.name} for i in interests]
    else:
        payload = public_user_payload(user)
    return jsonify(payload), 200


@bp.route("/me", methods=["GET"])
@jwt_required()
def get_my_profile():
    current = get_jwt_identity()

    user = User.query.get(current)
    if not user:
        return jsonify(msg="User not found"), 404

    return jsonify(private_user_payload(user)), 200


@bp.route("/me", methods=["PATCH"])
@jwt_required()
def update_my_profile():
    current = get_jwt_identity()
    user = User.query.get(current)
    if not user:
        return jsonify(msg="User not found"), 404

    data = request.get_json() or {}

    # Password change
    if data.get("oldPassword") is not None:
        old = data.get("oldPassword")
        new = data.get("password")
        if not old or not new:
            return jsonify(msg="Invalid request"), 400
        if not verify_password(old, user.password):
            return jsonify(msg="Old password incorrect"), 403
        user.password = hash_password(new)
        # revoke refresh tokens
        RefreshToken.query.filter_by(user_id=user.id).update({"revoked": True})
        db.session.add(user)
        db.session.commit()
        return ("", 204)

    # Profile fields mapping
    mapping = {
        "firstName": "first_name",
        "lastName": "last_name",
        "biography": "biography",
        "birthdayDate": "birthday_date",
        "gender": "gender",
        "sex_pref": "sex_pref",
        "sexPref": "sex_pref",
        "interests": "interests_cache",
        "interests_cache": "interests_cache",
        "email": "email",
    }

    changed = False
    for k, v in data.items():
        if k in mapping:
            field = mapping[k]
            # basic handling for interests array (expect ints)
            if field == "interests_cache" and isinstance(v, list):
                user.interests_cache = v
            else:
                setattr(user, field, v)
            changed = True

    if changed:
        db.session.add(user)
        db.session.commit()
        return ("", 204)

    return jsonify(msg="Nothing to update"), 400


@bp.route("/me/images", methods=["POST"])
@jwt_required()
def upload_images():
    current = get_jwt_identity()
    user = User.query.get(current)
    if not user:
        return jsonify(msg="User not found"), 404

    if not request.files:
        return jsonify(msg="No files provided"), 400

    upload_folder = os.path.join(current_app.root_path, "uploads")
    os.makedirs(upload_folder, exist_ok=True)

    saved = []
    for f in request.files.values():
        if f.filename == "":
            continue
        filename = secure_filename(f.filename)
        prefix = f"u{user.id}_{int(time.time())}_"
        fname = prefix + filename
        path = os.path.join(upload_folder, fname)
        f.save(path)
        url = f"/uploads/{fname}"
        photo = UserPhoto(user_id=user.id, url=url)
        db.session.add(photo)
        saved.append(photo)

    db.session.commit()
    return ("", 204)


@bp.route("/me/images/<int:image_id>", methods=["DELETE"])
@jwt_required()
def delete_image(image_id: int):
    current = get_jwt_identity()
    user = User.query.get(current)
    if not user:
        return jsonify(msg="User not found"), 404

    photo = UserPhoto.query.filter_by(id=image_id, user_id=user.id).first()
    if not photo:
        return jsonify(msg="Image not found"), 404

    # try remove file on disk
    try:
        static_prefix = os.path.join(current_app.root_path, photo.url.lstrip("/"))
        if os.path.exists(static_prefix):
            os.remove(static_prefix)
    except Exception:
        pass

    db.session.delete(photo)
    db.session.commit()
    return ("", 204)


@bp.route("/me/images/<int:image_id>", methods=["PATCH"])
@jwt_required()
def set_main_image(image_id: int):
    current = get_jwt_identity()
    user = User.query.get(current)
    if not user:
        return jsonify(msg="User not found"), 404

    data = request.get_json() or {}
    if not data.get("primary"):
        return jsonify(msg="Invalid request"), 400

    target = UserPhoto.query.filter_by(id=image_id, user_id=user.id).first()
    if not target:
        return jsonify(msg="Image not found"), 404

    # unset others
    UserPhoto.query.filter_by(user_id=user.id).update({"is_primary": False})
    target.is_primary = True
    db.session.add(target)
    db.session.commit()
    return ("", 204)


@bp.route("/<int:user_id>/images", methods=["GET"])
@jwt_required()
def get_user_images(user_id: int):
    user = User.query.get(user_id)
    if not user:
        return jsonify({"code": "NOT_FOUND", "message": "User not found"}), 404

    photos = UserPhoto.query.filter_by(user_id=user.id).all()
    images = []
    for p in photos:
        filename = os.path.basename(p.url)
        images.append({"id": p.id, "filename": filename, "isPrimary": bool(p.is_primary)})

    return jsonify(images=images), 200