from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity, verify_jwt_in_request
from .models import db, User


bp = Blueprint("profiles", __name__)


def public_user_payload(user: User):
    return {
        "id": user.id,
        "username": user.username,
        "first_name": user.first_name,
        "last_name": user.last_name,
        "fame_rate": user.fame_rate,
        "biography": user.biography,
    }


def private_user_payload(user: User):
    payload = public_user_payload(user)
    payload.update({
        "email": user.email,
        "birthday_date": user.birthday_date.isoformat() if user.birthday_date else None,
        "sex_pref": user.sex_pref.value if hasattr(user.sex_pref, "value") else user.sex_pref,
        "gender": user.gender.value if hasattr(user.gender, "value") else user.gender,
        "interests_cache": user.interests_cache,
    })
    return payload


@bp.route("/<int:user_id>", methods=["GET"])
def get_profile(user_id: int):
    verify_jwt_in_request()
    current = get_jwt_identity()

    user = User.query.get(user_id)
    if not user:
        return jsonify(msg="User not found"), 404

    if int(current) == int(user_id):
        return jsonify(private_user_payload(user)), 200

    return jsonify(public_user_payload(user)), 200


@bp.route("/me", methods=["GET"])
def get_my_profile():
    verify_jwt_in_request()
    current = get_jwt_identity()

    user = User.query.get(current)
    if not user:
        return jsonify(msg="User not found"), 404

    return jsonify(private_user_payload(user)), 200