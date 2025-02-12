# Backend code

The following is all about the backend of this web app. From the database, to specifics about the API.

# Endpoints
An end point in **BOLD** specifies it's implemented.

## Authentication
**POST /auth/register → Create a new user  
POST /auth/login → Authenticate a user and generate a session token  
POST /auth/logout → Invalidate the session token**  

## Users
GET /users/:id → Get user profile  
PUT /users/:id → Update user profile  
DELETE /users/:id → Delete a user account  

GET /users/:id/categories → Get categories a user is interested in  
POST /users/:id/categories/:categoryId → Assign a category to a user  
DELETE /users/:id/categories/:categoryId → Remove a category from a user  

## Categories
GET /categories → Get all categories

should these be an admin thing only?  
POST /categories → Create a new category  
GET /categories/:id → Get category details  
PUT /categories/:id → Update category details   
DELETE /categories/:id → Delete a category  

## Wishlists

**POST /wishlists/ → Create a wishlist (also creates a membership)  
GET /wishlists/ → Get list of wishlists (where user is a member)   
GET /wishlists/:id → Get wishlist details (must be member)   
PUT /wishlists/:id → Update wishlist (provide desired attributes to edit, must be the owner)  
DELETE /wishlists/:id → Delete wishlist (must be the owner)**      

GET /wishlists/:id/items → Get all items in a wishlist (and contributions)    
POST /wishlists/:id/items → Add an item to a wishlist  

GET /wishlists/:id/members → Get all members in a specific event   
POST /wishlists/:id/members → Add a member to an event   
PUT /wishlists/:id/members → Update a member’s status (blind/owner)     
DELETE /wishlists/:id/members → Remove a member from wishlist  

##  Events
GET /events → Get all events (for member)   
POST /events → Create a new event (makes you owner)  

GET /events/:id → Get event details  
PUT /events/:id → Update event  
DELETE /events/:id → Delete event

GET /events/:id/wishlists → Get wishlists for an event

GET /events/:id/members → Get all members in a specific event   
POST /events/:id/members → Add a member to an event   
DELETE /events/:id/members → Remove a member from event  


## Items

GET /items/:id → Get item details  
PUT /items/:id → Update an item  
DELETE /items/:id → Remove an item  

## Contributions

GET /items/:id/contributions → Get contributions for an item  
POST /items/:id/contributions → Add a contribution to an item  
PUT /contributions/:id → Update a contribution (mark as purchased, etc.)  
DELETE /contributions/:id → Remove a contribution  

# Database

![Screenshot of database UML.](4P02-Database-UML.png)

