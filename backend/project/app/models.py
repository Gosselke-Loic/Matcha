import enum
from datetime import datetime, timezone

from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import (
    Column, Integer, SmallInteger, String, Text, Date, Boolean,
    TIMESTAMP, ForeignKey, UniqueConstraint, Index, ARRAY, text
)
from sqlalchemy.dialects.postgresql import ENUM as PG_ENUM
from geoalchemy2 import Geometry
from sqlalchemy.sql import func

db = SQLAlchemy()

class GenderEnum(str, enum.Enum):
    male = "male"
    female = "female"
    non_binary = "non_binary"

class SexPrefEnum(str, enum.Enum):
    straight = "straight"
    gay = "gay"
    lesbian = "lesbian"
    bisexual = "bisexual"

genders_type = PG_ENUM(GenderEnum, name="genders", create_type=True)
sex_prefs_type = PG_ENUM(SexPrefEnum, name="sex_prefs", create_type=True)


class Interest(db.Model):
    __tablename__ = "interests"

    id = db.Column(Integer, primary_key=True)
    name = db.Column(String(50), unique=True, nullable=False)


class User(db.Model):
    __tablename__ = "users"

    id = db.Column(Integer, primary_key=True)
    username = db.Column(String(50), unique=True, nullable=False)
    email = db.Column(String(50), unique=True, nullable=False)
    first_name = db.Column(String(50), nullable=False)
    last_name = db.Column(String(50), nullable=False)
    password = db.Column(Text, nullable=False)
    birthday_date = db.Column(Date, nullable=False)
    fame_rate = db.Column(Integer, default=0)
    gender = db.Column(genders_type, server_default="non_binary", nullable=False)
    sex_pref = db.Column(sex_prefs_type, server_default="bisexual", nullable=False)
    interests_cache = db.Column(ARRAY(Integer), server_default=text("'{}'::integer[]"), nullable=False)
    biography = db.Column(Text, nullable=True)
    location = db.Column(Geometry(geometry_type="POINT", srid=4326), nullable=True)
    created_at = db.Column(TIMESTAMP(timezone=True), server_default=func.now(), nullable=False)
    is_active = db.Column(Boolean, default=False, nullable=False)
    email_confirmed_at = db.Column(TIMESTAMP(timezone=True), nullable=True)

    photos = db.relationship("UserPhoto", back_populates="user", cascade="all, delete-orphan")
    prefs = db.relationship("UserPrefs", uselist=False, back_populates="user", cascade="all, delete-orphan")


class RefreshToken(db.Model):
    __tablename__ = "refresh_tokens"

    id = db.Column(Integer, primary_key=True)
    jti = db.Column(String(36), unique=True, nullable=False)  # JWT ID
    user_id = db.Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    created_at = db.Column(TIMESTAMP(timezone=True), server_default=func.now(), nullable=False)
    expires_at = db.Column(TIMESTAMP(timezone=True), nullable=False)
    revoked = db.Column(Boolean, default=False, nullable=False)

    user = db.relationship("User", backref="refresh_tokens")


class UserPrefs(db.Model):
    __tablename__ = "user_prefs"

    user_id = db.Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), primary_key=True)
    interested_tags = db.Column(ARRAY(Integer), server_default=text("'{}'::integer[]"), nullable=False)
    min_age = db.Column(SmallInteger, default=18, nullable=False)
    max_age = db.Column(SmallInteger, default=99, nullable=False)
    max_distance_km = db.Column(Integer, default=50, nullable=False)

    user = db.relationship("User", back_populates="prefs")


# Indexes
Index("idx_user_prefs_tags", UserPrefs.interested_tags, postgresql_using="gin")
Index("idx_users_location_matcha", User.location, postgresql_using="gist")


class Swipe(db.Model):
    __tablename__ = "swipes"
    __table_args__ = (UniqueConstraint("from_user_id", "to_user_id", name="uq_swipe_pair"),)

    id = db.Column(Integer, primary_key=True)
    from_user_id = db.Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    to_user_id = db.Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    is_like = db.Column(Boolean, nullable=False)
    created_at = db.Column(TIMESTAMP(timezone=True), server_default=func.now(), nullable=False)


class Match(db.Model):
    __tablename__ = "matches"
    __table_args__ = (UniqueConstraint("user_one_id", "user_two_id", name="unique_match_pair"),)

    id = db.Column(Integer, primary_key=True)
    user_one_id = db.Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    user_two_id = db.Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    matched_at = db.Column(TIMESTAMP(timezone=True), server_default=func.now(), nullable=False)


class Message(db.Model):
    __tablename__ = "messages"

    id = db.Column(Integer, primary_key=True)
    match_id = db.Column(Integer, ForeignKey("matches.id", ondelete="CASCADE"), nullable=False)
    sender_id = db.Column(Integer, ForeignKey("users.id"), nullable=False)
    content = db.Column(Text, nullable=False)
    send_at = db.Column(TIMESTAMP(timezone=True), server_default=func.now(), nullable=False)


class UserPhoto(db.Model):
    __tablename__ = "user_photos"

    id = db.Column(Integer, primary_key=True)
    user_id = db.Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    url = db.Column(Text, nullable=False)

    user = db.relationship("User", back_populates="photos")