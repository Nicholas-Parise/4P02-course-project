DROP TABLE IF EXISTS idea_categories
DROP TABLE IF EXISTS ideas
DROP TABLE IF EXISTS contributions;
DROP TABLE IF EXISTS items;
DROP TABLE IF EXISTS wishlist_members;
DROP TABLE IF EXISTS event_members;
DROP TABLE IF EXISTS wishlists;
DROP TABLE IF EXISTS events;
DROP TABLE IF EXISTS user_categories;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS notifications
DROP TABLE IF EXISTS sessions;
DROP TABLE IF EXISTS users;


CREATE TABLE users(
id SERIAL PRIMARY KEY,
password TEXT NOT NULL,
email TEXT UNIQUE NOT NULL,
displayName TEXT,
bio TEXT,
picture TEXT,
notifications BOOLEAN,
pro BOOLEAN,
setup BOOLEAN,
dateupdated TIMESTAMP,
datecreated TIMESTAMP DEFAULT NOW()
);


CREATE TABLE sessions(
id SERIAL PRIMARY KEY,   
user_id integer REFERENCES users(id) ON DELETE CASCADE,
token TEXT UNIQUE,
created TIMESTAMP DEFAULT NOW()
);


CREATE TABLE notifications(
id SERIAL PRIMARY KEY,   
user_id integer REFERENCES users(id) ON DELETE CASCADE,
title TEXT,
body TEXT,
url TEXT,
is_read BOOLEAN,
created TIMESTAMP DEFAULT NOW()
);


CREATE TABLE categories(
id SERIAL PRIMARY KEY,   
name TEXT UNIQUE,
description TEXT,
created TIMESTAMP DEFAULT NOW()
);


CREATE TABLE user_categories(
id SERIAL PRIMARY KEY,   
user_id INTEGER REFERENCES users (id) ON DELETE CASCADE,
category_id INTEGER REFERENCES categories (id) ON DELETE CASCADE,
love BOOLEAN,
created TIMESTAMP DEFAULT NOW(),
UNIQUE (user_id,category_id) -- only need one entry per category per user
);


CREATE TABLE events(
id SERIAL PRIMARY KEY, 
creator_id INTEGER REFERENCES users (id) ON DELETE SET NULL,
name TEXT,
description TEXT,
url TEXT,
addr TEXT,
city TEXT,
image TEXT,
deadline TIMESTAMP,
share_token TEXT UNIQUE,
dateUpdated TIMESTAMP,
dateCreated TIMESTAMP DEFAULT NOW()
);


CREATE TABLE wishlists(
id SERIAL PRIMARY KEY,   
event_id INTEGER REFERENCES events (id) ON DELETE SET NULL,
creator_id INTEGER REFERENCES users (id) ON DELETE SET NULL,
name TEXT,
description TEXT,
image TEXT,
deadline TIMESTAMP,
share_token TEXT UNIQUE,
dateUpdated TIMESTAMP,
dateCreated TIMESTAMP DEFAULT NOW()
);


CREATE TABLE wishlist_members(
id SERIAL PRIMARY KEY,   
user_id INTEGER REFERENCES users (id) ON DELETE CASCADE,
wishlists_id INTEGER REFERENCES wishlists (id) ON DELETE CASCADE,
notifications BOOLEAN,
blind BOOLEAN,
owner BOOLEAN,
dateUpdated TIMESTAMP,
dateCreated TIMESTAMP DEFAULT NOW(),
UNIQUE (user_id,wishlists_id) --only want one membership per user per wishlist
);

CREATE TABLE event_members(
id SERIAL PRIMARY KEY,   
user_id INTEGER REFERENCES users (id) ON DELETE CASCADE,
event_id INTEGER REFERENCES events (id) ON DELETE CASCADE,
owner BOOLEAN,
notifications BOOLEAN,
dateUpdated TIMESTAMP,
dateCreated TIMESTAMP DEFAULT NOW(),
UNIQUE (user_id,event_id) --only want one membership per user per event
);



CREATE TABLE items(
id SERIAL PRIMARY KEY, 
member_id INTEGER REFERENCES wishlist_members (id) ON DELETE CASCADE,
idea_id INTEGER REFERENCES ideas(id) ON DELETE SET NULL,
name TEXT,
description TEXT,
url TEXT,
image TEXT,
quantity INTEGER,
price real,
priority INTEGER,
dateUpdated TIMESTAMP,
dateCreated TIMESTAMP DEFAULT NOW()
);


CREATE TABLE contributions(
id SERIAL PRIMARY KEY, 
item_id INTEGER REFERENCES items (id) ON DELETE CASCADE,
member_id INTEGER REFERENCES wishlist_members (id) ON DELETE CASCADE,
quantity INTEGER,
purchased BOOLEAN,
note TEXT,
dateUpdated TIMESTAMP,
dateCreated TIMESTAMP DEFAULT NOW(),
UNIQUE (item_id,member_id) --only want one contribution per user per item
);


CREATE TABLE ideas(
id SERIAL PRIMARY KEY,
name TEXT NOT NULL,
description TEXT,
url TEXT,
image TEXT,
price REAL,
rating REAL,
sponsored BOOLEAN DEFAULT FALSE,
uses INT DEFAULT 0,   -- Track how many times this item is added by users
created TIMESTAMP DEFAULT NOW()
);

CREATE TABLE idea_categories (
idea_id INT REFERENCES ideas(id) ON DELETE CASCADE,
category_id INT REFERENCES categories(id) ON DELETE CASCADE,
PRIMARY KEY (idea_id, category_id)
);



GRANT CONNECT ON DATABASE wishify TO wishify;
GRANT USAGE ON SCHEMA public TO wishify;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO wishify;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO wishify;
-- Ensure future tables also get permissions
ALTER DEFAULT PRIVILEGES IN SCHEMA public 
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO wishify;


CREATE OR REPLACE FUNCTION delete_empty_wishlist()
RETURNS TRIGGER AS $$
BEGIN
    -- Check if the wishlist still has any members
    IF NOT EXISTS (
        SELECT 1 FROM wishlist_members WHERE wishlists_id = OLD.wishlists_id
    ) THEN
        -- Delete the wishlist if no members are left
        DELETE FROM wishlists WHERE id = OLD.wishlists_id;
    END IF;
    RETURN OLD;
END;
$$ LANGUAGE plpgsql;


CREATE TRIGGER trigger_delete_empty_wishlist
AFTER DELETE ON wishlist_members
FOR EACH ROW
EXECUTE FUNCTION delete_empty_wishlist();



CREATE OR REPLACE FUNCTION delete_empty_event()
RETURNS TRIGGER AS $$
BEGIN
    -- Check if the event still has any members
    IF NOT EXISTS (
        SELECT 1 FROM event_members WHERE event_id = OLD.event_id
    ) THEN
        -- Delete the event if no members are left
        DELETE FROM events WHERE id = OLD.event_id;
    END IF;
    RETURN OLD;
END;
$$ LANGUAGE plpgsql;


CREATE TRIGGER trigger_delete_empty_event
AFTER DELETE ON event_members
FOR EACH ROW
EXECUTE FUNCTION delete_empty_event();

