# Backend code

The following is all about the backend of this web app. From the database, to specifics about the API.

# Endpoints
An end point in **BOLD** specifies it's implemented.

## Authentication
**POST /auth/register → Create a new user  
POST /auth/login → Authenticate a user and generate a session token  
POST /auth/logout → Invalidate the session token**  

## Users
**GET /users → Get logged in user profile and categories   
PUT /users → Update logged in user profile  
DELETE /users → Delete logged in user account  
GET /users/:id → Get specific user profile**  

**POST /users/categories/:categoryId → Assign a category to logged in user  
POST /users/categories → Assign an array of categories to logged in user  
Put /users/categories/:categoryId → updates a users love or hate value  
Put /users/categories → updates an array of categories to logged in user  
DELETE /users/categories/:categoryId → Remove a category from logged in user  
DELETE /users/categories → Remove an array of categories from logged in user**  

## Categories
**GET /categories → Get all categories   
GET /categories/:id → Get category details  
POST /categories → Create a new category**  

## Wishlists

**POST /wishlists/ → Create a wishlist (also creates a membership)  
GET /wishlists/ → Get list of wishlists (where user is a member)   
GET /wishlists/:id → Get wishlist details (must be member)   
PUT /wishlists/:id → Update wishlist (provide desired attributes to edit, must be the owner)  
DELETE /wishlists/:id → Delete wishlist (must be the owner)**          

**GET /wishlists/:id/members → Get all members in a specific wishlist   
POST /wishlists/:id/members → Add a member to an wishlist    
DELETE /wishlists/:id/members → Remove a member from wishlist  
PUT /wishlists/:id/members → Update a members status (blind/owner)  
POST /wishlists/members → make logged in user a member of the wishlist given the share_token**    

**POST /wishlists/:id/duplicate → Duplicate the wishlist   
GET /wishlists/:id/items → Get all items in a wishlist (and contributions)   
GET /wishlists/share/:token → get the shared wishlist  
POST /wishlists/share → share the wishlist to email, if user exists membership added. else send email**

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
PUT /events/:id/members → Update a members status (blind/owner)**

## Items

**GET /items/:id → Get item details  
PUT /items/:id → Update a single item  
PUT /items → Update an array of items  
DELETE /items/:id → Remove an item  
POST /items -> create an item (given wishlists_id)**
  
## Contributions
**GET /contributions → Get all contributions from logged in user  
GET /contributions/wishlists/:id → Get all contributions from wishlist  
GET /contributions/items/:id → Get contributions for an item  
POST /contributions → Add a contribution (given item_id)  
PUT /contributions/:id → Update a contribution (mark as purchased, etc.)  
DELETE /contributions/:id → Remove a contribution**  

## Notifications
**GET /notifications → Get all notifications from logged in user  
PUT /notifications/:id → Edit a notifications (ex: is_read)   
DELETE /notifications/:id → Delete a notifications**  

# Database

![Screenshot of database UML.](database/4P02-Database-UML.png)

