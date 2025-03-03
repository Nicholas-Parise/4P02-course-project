# Backend code

The following is all about the backend of this web app. From the database, to specifics about the API.

# Endpoints
An end point in **BOLD** specifies it's implemented.

## Authentication
**POST /auth/register → Create a new user  
POST /auth/login → Authenticate a user and generate a session token  
POST /auth/logout → Invalidate the session token**  

## Users
**GET /users → Get logged in user profile
PUT /users → Update logged in user profile  
DELETE /users → Delete logged in user account  
GET /users/:id → Get specific user profile**  

**GET /users/categories → Get categories from logged in user    
GET /users/:id/categories → Get categories from specific user  
POST /users/categories/:categoryId → Assign a category from logged in user  
DELETE /users/categories/:categoryId → Remove a category from logged in user**  

## Categories
**GET /categories → Get all categories   
GET /categories/:id → Get category details  
POST /categories → Create a new category**  

should these be admin only?  
PUT /categories/:id → Update category details   
DELETE /categories/:id → Delete a category  

## Wishlists

**POST /wishlists/ → Create a wishlist (also creates a membership)  
GET /wishlists/ → Get list of wishlists (where user is a member)   
GET /wishlists/:id → Get wishlist details (must be member)   
PUT /wishlists/:id → Update wishlist (provide desired attributes to edit, must be the owner)  
DELETE /wishlists/:id → Delete wishlist (must be the owner)**          

**GET /wishlists/:id/members → Get all members in a specific wishlist   
POST /wishlists/:id/members → Add a member to an wishlist    
DELETE /wishlists/:id/members → Remove a member from wishlist  
PUT /wishlists/:id/members → Update a member’s status (blind/owner)**    

**GET /wishlists/:id/items → Get all items in a wishlist (and contributions)**

##  Events
**GET /events → Get all events (for member)   
POST /events → Create a new event (makes you owner)  
GET /events/:id → Get event details  
PUT /events/:id → Update event  
DELETE /events/:id → Delete event**

**GET /events/:id/wishlists → Get wishlists for an event  
GET /events/:id/members → Get all members in a specific event   
POST /events/:id/members → Add a member to an event   
DELETE /events/:id/members → Remove a member from event    
PUT /events/:id/members → Update a member’s status (blind/owner)**

## Items

**GET /items/:id → Get item details  
PUT /items/:id → Update an item  
DELETE /items/:id → Remove an item  
POST /items -> create an item (given wishlists_id)**
  
## Contributions
**GET /contributions → Get all contributions from logged in user  
GET /contributions/wishlists/:id → Get all contributions from wishlist  
GET /contributions/items/:id → Get contributions for an item  
POST /contributions → Add a contribution (given item_id)  
PUT /contributions/:id → Update a contribution (mark as purchased, etc.)  
DELETE /contributions/:id → Remove a contribution**  

# Database

![Screenshot of database UML.](4P02-Database-UML.png)

