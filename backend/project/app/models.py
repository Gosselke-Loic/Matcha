import enum
from datetime import datetime, timezone

from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import (
    Column, Integer, SmallInteger, String, Text, Date, Boolean,
    TIMESTAMP, ForeignKey, UniqueConstraint, Index, ARRAY
)
from sqlalchemy.dialects.postgresql import ENUM as PG_ENUM
from geoalchemy2 import Geometry

db = SQLAlchemy()

# Mirror Postgres enum types without trying to create them (create_type=False)
class GenderEnum(str, enum.Enum):
    male = "male"
    female = "female"
    non_binary = "non-binary"

class SexPrefEnum(str, enum.Enum):
    straight = "straight"
    gay = "gay"
    lesbian = "lesbian"
    bisexual = "bisexual"

genders_type = PG_ENUM(GenderEnum, name="genders", create_type=False)
sex_prefs_type = PG_ENUM(SexPrefEnum, name="sex_prefs", create_type=False)


class Interest(db.Model):
    __tablename__ = "interests"

    id = Column(Integer, primary_key=True)
    name = Column(String(50), unique=True, nullable=False)


class User(db.Model):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True)
    username = Column(String(50), unique=True, nullable=False)
    email = Column(String(50), unique=True, nullable=False)
    first_name = Column(String(50), nullable=False)
    last_name = Column(String(50), nullable=False)
    password = Column(Text, nullable=False)  # store hashed password
    birthday_date = Column(Date, nullable=False)
    fame_rate = Column(Integer, default=0)
    gender = Column(genders_type, server_default="non-binary", nullable=False)
    sex_pref = Column(sex_prefs_type, server_default="bisexual", nullable=False)
    interests_cache = Column(ARRAY(Integer), server_default="{}", nullable=False)
    biography = Column(Text, nullable=True)
    location = Column(Geometry(geometry_type="POINT", srid=4326), nullable=True)
    created_at = Column(TIMESTAMP(timezone=True), default=datetime.now(timezone.utc), nullable=False)

    # convenience relationship examples (not required)
    photos = db.relationship("UserPhoto", back_populates="user", cascade="all, delete-orphan")
    prefs = db.relationship("UserPrefs", uselist=False, back_populates="user", cascade="all, delete-orphan")


class RefreshToken(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    jti = db.Column(db.String(36), unique=True, nullable=False)  # JWT ID
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.now(timezone.utc), nullable=False)
    expires_at = db.Column(db.DateTime, nullable=False)
    revoked = db.Column(db.Boolean, default=False, nullable=False)

    user = db.relationship("User", backref="refresh_tokens")


class UserPrefs(db.Model):
    __tablename__ = "user_prefs"

    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), primary_key=True)
    interested_tags = Column(ARRAY(Integer), server_default="{}", nullable=False)
    min_age = Column(SmallInteger, default=18, nullable=False)
    max_age = Column(SmallInteger, default=99, nullable=False)
    max_distance_km = Column(Integer, default=50, nullable=False)

    user = db.relationship("User", back_populates="prefs")


# GIN index for interested_tags defined at model level
Index("idx_user_prefs_tags", UserPrefs.interested_tags, postgresql_using="gin")
# GIST index for location — created by migration or DB; definable via Index too
Index("idx_users_location", User.location, postgresql_using="gist")


class Swipe(db.Model):
    __tablename__ = "swipes"
    __table_args__ = (UniqueConstraint("from_user_id", "to_user_id", name="uq_swipe_pair"),)

    id = Column(Integer, primary_key=True)
    from_user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    to_user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    is_like = Column(Boolean, nullable=False)
    created_at = Column(TIMESTAMP(timezone=True), default=datetime.now(timezone.utc), nullable=False)


class Match(db.Model):
    __tablename__ = "matches"
    __table_args__ = (UniqueConstraint("user_one_id", "user_two_id", name="unique_match_pair"),)

    id = Column(Integer, primary_key=True)
    user_one_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    user_two_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    matched_at = Column(TIMESTAMP(timezone=True), default=datetime.now(timezone.utc), nullable=False)


class Message(db.Model):
    __tablename__ = "messages"

    id = Column(Integer, primary_key=True)
    match_id = Column(Integer, ForeignKey("matches.id", ondelete="CASCADE"), nullable=False)
    sender_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    content = Column(Text, nullable=False)
    send_at = Column(TIMESTAMP(timezone=True), default=datetime.now(timezone.utc), nullable=False)


class UserPhoto(db.Model):
    __tablename__ = "user_photos"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    url = Column(Text, nullable=False)

    user = db.relationship("User", back_populates="photos")
