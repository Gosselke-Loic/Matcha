CREATE EXTENSION IF NOT EXISTS postgis;

CREATE TYPE genders AS ENUM ('male', 'female', 'non-binary');
CREATE TYPE sex_prefs AS ENUM ('heterosexual', 'gay', 'lesbian', 'bisexual');

CREATE TABLE interests (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(50) UNIQUE NOT NULL,
  first_name VARCHAR(50) NOT NULL,
  last_name VARCHAR(50) NOT NULL,
  password TEXT NOT NULL,
  birthday_date DATE NOT NULL,
  fame_rate INTEGER DEFAULT 0,
  gender genders DEFAULT 'non-binary',
  sex_pref sex_prefs DEFAULT 'bisexual',
  interests_cache INTEGER[] DEFAULT '{}',
  biography TEXT,
  location GEOMETRY(Point, 4326),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Filter options
CREATE TABLE user_prefs (
  user_id INTEGER PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  interested_tags INTEGER[] DEFAULT '{}',
  min_age SMALLINT DEFAULT 18,
  max_age SMALLINT DEFAULT 99,
  max_distance_km INTEGER DEFAULT 50
);

CREATE INDEX idx_user_prefs_tags on user_prefs USING GIN (interested_tags);
CREATE INDEX idx_users_location on users USING GIST (location);

CREATE TABLE swipes (
  id SERIAL PRIMARY KEY,
  from_user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  to_user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  is_like BOOLEAN NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(from_user_id, to_user_id)
);

CREATE TABLE matches (
  id SERIAL PRIMARY KEY,
  user_one_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  user_two_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  matched_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT unique_match_pair UNIQUE(user_one_id, user_two_id)
);

CREATE TABLE messages (
  id SERIAL PRIMARY KEY,
  match_id INTEGER REFERENCES matches(id) ON DELETE CASCADE,
  sender_id INTEGER REFERENCES users(id),
  content TEXT NOT NULL,
  send_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE user_photos (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  -- More properties? is_primary boolean
);
