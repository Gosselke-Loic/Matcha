from flask import Blueprint, request, jsonify, current_app
from flask_socketio import emit, SocketIO
from flask_jwt_extended import decode_token

from .models import db, Message


bp = Blueprint("chat", __name__)
socketio = SocketIO()


def _get_user_id_from_request(req):
    cookie_name = current_app.config.get("JWT_ACCESS_COOKIE_NAME", "access_token_cookie")
    token = req.cookies.get(cookie_name)
    if not token:
        return None
    try:
        decoded = decode_token(token)
        identity = decoded.get("sub")
        return int(identity)
    except Exception:
        return None


@bp.route("/chat/<int:chat_id>", methods=["GET"])
def get_chat_messages(chat_id: int):
    msgs = (
        Message.query.filter_by(match_id=chat_id)
        .order_by(Message.send_at)
        .all()
    )

    out = [
        {
            "id": m.id,
            "chatId": m.match_id,
            "text": m.content,
            "senderId": m.sender_id,
            "createdAt": m.send_at.isoformat()
        }
        for m in msgs
    ]

    return jsonify({"id": chat_id, "messages": out}), 200


@bp.route("/notifications/unread", methods=["GET"])
def unread_notifications():
    # TODO
    return jsonify({"unreadChats": []}), 200


@socketio.on("send_message")
def handle_send_message(data):
    user_id = _get_user_id_from_request(request)
    if not user_id:
        emit("error", {"msg": "unauthenticated"})
        return

    chat_id = data.get("chatId")
    text = data.get("text")
    if not chat_id or not text:
        emit("error", {"msg": "invalid_payload"})
        return

    try:
        m = Message(match_id=chat_id, sender_id=user_id, content=text)
        db.session.add(m)
        db.session.commit()

        payload = {
            "id": m.id,
            "chatId": m.match_id,
            "text": m.content,
            "senderId": m.sender_id,
            "createdAt": m.send_at.isoformat()
        }

        socketio.emit("new_message", payload, broadcast=True)
    except Exception as e:
        current_app.logger.exception("failed to store message")
        emit("error", {"msg": "server_error"})


@socketio.on("mark_as_read")
def handle_mark_as_read(data):
    # TODO
    emit("marked_as_read", {"id": data.get("id")})
