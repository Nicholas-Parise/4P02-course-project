DROP TABLE IF EXISTS contributions;
DROP TABLE IF EXISTS items;
DROP TABLE IF EXISTS members;
DROP TABLE IF EXISTS wishlists;
DROP TABLE IF EXISTS events;
DROP TABLE IF EXISTS user_cats;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS sessions;
DROP TABLE IF EXISTS users;


CREATE TABLE users(
id SERIAL PRIMARY KEY,
username TEXT UNIQUE NOT NULL,
password TEXT NOT NULL,
email TEXT,
picture TEXT,
datecreated TIMESTAMP,
dateupdated TIMESTAMP,
isadmin BOOL
);

CREATE TABLE sessions(
id SERIAL PRIMARY KEY,   
user_id integer REFERENCES users(id),
token TEXT UNIQUE,
created TIMESTAMP
);

CREATE TABLE categories(
id SERIAL PRIMARY KEY,   
name TEXT,
description TEXT,
created TIMESTAMP
);


CREATE TABLE user_cats(
id SERIAL PRIMARY KEY,   
user_id BIGINT REFERENCES users (id),
category_id INTEGER REFERENCES categories (id),
created TIMESTAMP
);


CREATE TABLE events(
id SERIAL PRIMARY KEY, 
user_id BIGINT REFERENCES users(id),
name TEXT,
description TEXT,
url TEXT,
addr TEXT,
city TEXT,
dateUpdated TIMESTAMP,
dateCreated TIMESTAMP
);


CREATE TABLE wishlists(
id SERIAL PRIMARY KEY,   
event_id BIGINT REFERENCES events (id),
name TEXT,
description TEXT,
dateUpdated TIMESTAMP,
dateCreated TIMESTAMP
);


CREATE TABLE members(
id SERIAL PRIMARY KEY,   
user_id BIGINT REFERENCES users (id),
wishlist_id INTEGER REFERENCES wishlists(id),
blind BOOLEAN,
owner BOOLEAN,
dateUpdated TIMESTAMP,
dateCreated TIMESTAMP
);


CREATE TABLE items(
id SERIAL PRIMARY KEY, 
member_id BIGINT REFERENCES members (id),
wishlist_id INTEGER REFERENCES wishlists(id),
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
item_id BIGINT REFERENCES items (id),
member_id BIGINT REFERENCES members (id),
quantity INTEGER,
purchased BOOLEAN,
dateUpdated TIMESTAMP,
dateCreated TIMESTAMP
);

