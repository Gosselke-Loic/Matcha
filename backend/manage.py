from flask.cli import FlaskGroup
from project.app import create_app, db
from sqlalchemy import text
from datetime import date
from project.app.security import hash_password

cli = FlaskGroup(create_app=create_app)


@cli.command("create_db")
def create_db():
    engine = db.engine
    with engine.begin() as conn:
        conn.execute(text("CREATE EXTENSION IF NOT EXISTS postgis"))
        conn.execute(text("DROP INDEX IF EXISTS idx_users_location;"))
        conn.execute(text("DROP INDEX IF EXISTS idx_user_prefs_tags;"))
        conn.execute(text("DROP TYPE IF EXISTS genders;"))
        conn.execute(text("DROP TYPE IF EXISTS sex_prefs;"))
    db.drop_all()
    db.create_all()
    db.session.commit()
    print("Database schema created.")


@cli.command("seed_db")
def seed_db():
    from project.app.models import User

    cols = {c.name for c in User.__table__.columns}
    existing = User.query.filter_by(username="test").first() if "username" in cols else None
    if existing:
        print("User 'test' already exists")
        return

    data = {}
    if "username" in cols:
        data["username"] = "test"
    if "email" in cols:
        data["email"] = "sean.belometti@gmail.com"
    if "first_name" in cols:
        data["first_name"] = "Test"
    if "last_name" in cols:
        data["last_name"] = "User"
    if "password" in cols:
        data["password"] = hash_password("test")
    if "birthday_date" in cols:
        data["birthday_date"] = date(1990, 1, 1)

    user = User(**data)
    db.session.add(user)
    db.session.commit()
    print("Seeded user 'test'.")


if __name__ == "__main__":
    cli()