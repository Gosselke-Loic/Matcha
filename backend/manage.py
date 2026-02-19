from flask.cli import FlaskGroup
from project.app import create_app, db
from sqlalchemy import text

cli = FlaskGroup(create_app=create_app)


@cli.command("create_db")
def create_db():
    engine = db.get_engine()
    with engine.begin() as conn:
        conn.execute(text("CREATE EXTENSION IF NOT EXISTS postgis"))
    db.drop_all()
    db.create_all()
    db.session.commit()


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
        data["email"] = "test@example.com"
    if "password" in cols:
        data["password"] = "test"
    elif "password_hash" in cols:
        data["password_hash"] = "test"

    user = User(**data)
    db.session.add(user)
    db.session.commit()
    print("Seeded user 'test'.")


if __name__ == "__main__":
    cli()