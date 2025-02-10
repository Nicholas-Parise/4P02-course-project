DROP TABLE IF EXISTS contributions;
DROP TABLE IF EXISTS items;
DROP TABLE IF EXISTS wishlist_members;
DROP TABLE IF EXISTS event_members;
DROP TABLE IF EXISTS wishlists;
DROP TABLE IF EXISTS events;
DROP TABLE IF EXISTS user_categories;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS sessions;
DROP TABLE IF EXISTS users;


CREATE TABLE users(
id SERIAL PRIMARY KEY,
password TEXT NOT NULL,
email TEXT UNIQUE NOT NULL,
displayName TEXT,
picture TEXT,
datecreated TIMESTAMP,
dateupdated TIMESTAMP
);


CREATE TABLE sessions(
id SERIAL PRIMARY KEY,   
user_id integer REFERENCES users(id) ON DELETE CASCADE,
token TEXT UNIQUE,
created TIMESTAMP
);


CREATE TABLE categories(
id SERIAL PRIMARY KEY,   
name TEXT,
description TEXT,
created TIMESTAMP
);


CREATE TABLE user_categories(
id SERIAL PRIMARY KEY,   
user_id INTEGER REFERENCES users (id) ON DELETE CASCADE,
category_id INTEGER REFERENCES categories (id) ON DELETE CASCADE,
created TIMESTAMP
);


CREATE TABLE events(
id SERIAL PRIMARY KEY, 
name TEXT,
description TEXT,
url TEXT,
addr TEXT,
city TEXT,
image TEXT,
dateUpdated TIMESTAMP,
dateCreated TIMESTAMP
);


CREATE TABLE wishlists(
id SERIAL PRIMARY KEY,   
event_id INTEGER REFERENCES events (id) ON DELETE SET NULL,
name TEXT,
description TEXT,
image TEXT,
dateUpdated TIMESTAMP,
dateCreated TIMESTAMP
);


CREATE TABLE wishlist_members(
id SERIAL PRIMARY KEY,   
user_id INTEGER REFERENCES users (id) ON DELETE CASCADE,
wishlists_id INTEGER REFERENCES wishlists (id) ON DELETE CASCADE,
blind BOOLEAN,
owner BOOLEAN,
dateUpdated TIMESTAMP,
dateCreated TIMESTAMP,
UNIQUE (user_id,wishlists_id) --only want one membership per user per wishlist
);

CREATE TABLE event_members(
id SERIAL PRIMARY KEY,   
user_id INTEGER REFERENCES users (id) ON DELETE CASCADE,
event_id INTEGER REFERENCES events (id) ON DELETE CASCADE,
owner BOOLEAN,
dateUpdated TIMESTAMP,
dateCreated TIMESTAMP,
UNIQUE (user_id,event_id) --only want one membership per user per event
);



CREATE TABLE items(
id SERIAL PRIMARY KEY, 
member_id INTEGER REFERENCES wishlist_members (id) ON DELETE CASCADE,
name TEXT,
description TEXT,
url TEXT,
image TEXT,
quantity INTEGER,
price real,
dateUpdated TIMESTAMP,
dateCreated TIMESTAMP
);


CREATE TABLE contributions(
id SERIAL PRIMARY KEY, 
item_id INTEGER REFERENCES items (id) ON DELETE CASCADE,
member_id INTEGER REFERENCES wishlist_members (id) ON DELETE CASCADE,
quantity INTEGER,
purchased BOOLEAN,
dateUpdated TIMESTAMP,
dateCreated TIMESTAMP
);

