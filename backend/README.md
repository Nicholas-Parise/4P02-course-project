# Backend code

The following is all about the backend of this web app. From the database, to specifics about the API.

# Endpoints

## NOTE 
Not all these endpoints are active, these are just the enpoints I'm working towards  

## Authentication
POST /auth/register → Create a new user  
POST /auth/login → Authenticate a user and generate a session token  
POST /auth/logout → Invalidate the session token  

## Users
GET /users/:id → Get user profile  
PUT /users/:id → Update user profile  
DELETE /users/:id → Delete a user account  

GET /users/:id/categories → Get categories a user is interested in  
POST /users/:id/categories/:categoryId → Assign a category to a user  
DELETE /users/:id/categories/:categoryId → Remove a category from a user  

## Categories & User Preferences
GET /categories → Get all categories  
POST /categories → Create a new category  
GET /categories/:id → Get category details  
PUT /categories/:id → Update category details  
DELETE /categories/:id → Delete a category  

## Wishlists
GET /wishlists/:id → Get wishlist details  
PUT /wishlists/:id → Update wishlist  
DELETE /wishlists/:id → Delete wishlist  

GET /wishlists/events/:id → Get wishlists for an event  
POST /wishlists/events/:id → Create a wishlist under an event  
POST /wishlists/ → Create a wishlist without an event  

GET /wishlists/:id/items → Get all items in a wishlist  
POST /wishlists/:id/items → Add an item to a wishlist  

##  Events
GET /events → Get all events  
POST /events → Create a new event  

GET /events/:id → Get event details  
PUT /events/:id → Update event  
DELETE /events/:id → Delete event  

GET /events/:id/members → Get members of an event  
POST /events/:id/members → Add a member to an event  

## Members

PUT /members/:id → Update a member’s status (blind/owner)  
DELETE /members/:id → Remove a member  

## Items

GET /items/:id → Get item details  
PUT /items/:id → Update an item  
DELETE /items/:id → Remove an item  

## Contributions

GET /contributions/items/:id/ → Get contributions for an item  
POST /contributions/items/:id/ → Add a contribution to an item  
PUT /contributions/:id → Update a contribution (mark as purchased, etc.)  
DELETE /contributions/:id → Remove a contribution  

# Database

![Screenshot of database UML.](4P02-Database-UML.png)

