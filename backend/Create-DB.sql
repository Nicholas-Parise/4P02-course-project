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
password TEXT NOT NULL,
email TEXT UNIQUE NOT NULL,
displayName TEXT,
picture TEXT,
datecreated TIMESTAMP,
dateupdated TIMESTAMP
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
user_id INTEGER REFERENCES users (id),
category_id INTEGER REFERENCES categories (id),
created TIMESTAMP
);


CREATE TABLE events(
id SERIAL PRIMARY KEY, 
user_id INTEGER REFERENCES users(id),
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
event_id INTEGER REFERENCES events (id),
name TEXT,
description TEXT,
image TEXT,
dateUpdated TIMESTAMP,
dateCreated TIMESTAMP
);

CREATE TABLE members(
id SERIAL PRIMARY KEY,   
user_id INTEGER REFERENCES users (id),
wishlists_id INTEGER REFERENCES wishlists (id),
blind BOOLEAN,
owner BOOLEAN,
dateUpdated TIMESTAMP,
dateCreated TIMESTAMP
);


CREATE TABLE items(
id SERIAL PRIMARY KEY, 
member_id INTEGER REFERENCES members (id),
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
item_id INTEGER REFERENCES items (id),
member_id INTEGER REFERENCES members (id),
quantity INTEGER,
purchased BOOLEAN,
dateUpdated TIMESTAMP,
dateCreated TIMESTAMP
);

