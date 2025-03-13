# Api documentation
this file contains documentation for all API endpoints provided in this project

## Admin
```http
GET /api/admin/dashboard
^^^ get stats displayed on the home dashboard page
```

## Auth

```
POST /api/auth/login
^^^ authenticate user and return a token along with user details

GET /api/auth/logout
^^^ log out the user by clearing the authentication token cookie

GET /api/auth/me
^^^ retrieve the currently logged-in user's information

POST /api/auth/register
^^^ register a new user with the provided details
```

## Book
```
POST /api/books
^^^ add a new book with image upload (admin only)

GET /api/books
^^^ retrieve all books or filter books based on query parameters

GET /api/books/:id
^^^ retrieve a specific book by its ID

PATCH /api/books/:id/image
^^^ update the image of a specific book (admin only)

DELETE /api/books/:id
^^^ delete a specific book by its ID (admin only)

PATCH /api/books/:id
^^^ update the details of a specific book (admin only)
```

## Cart
```
GET /api/cart
^^^ retrieve the current user's cart items (requires authentication)

POST /api/cart
^^^ add a book to the cart for the authenticated user (requires authentication)

DELETE /api/cart/:id
^^^ remove a specific book from the cart by its ID for the authenticated user (requires authentication)

DELETE /api/cart
^^^ clear all items from the cart (not implemented yet)
```

## Orders
```
GET /api/orders
^^^ retrieve all orders (requires authentication)

GET /api/orders/:id
^^^ retrieve a specific order by its ID (requires authentication)

PATCH /api/orders/:id
^^^ update a specific order by its ID (requires authentication and admin privileges)
```

## Reviews
```
POST /api/reviews
^^^ add a new review for a book (requires authentication)

GET /api/reviews/:id
^^^ retrieve all reviews for a specific book by its ID (public access, no authentication required)

PATCH /api/reviews/:id
^^^ update a specific review by its ID (requires authentication)

DELETE /api/reviews/:id
^^^ delete a specific review by its ID (requires authentication and admin privileges)
```


## Users
```
GET /api/users
^^^ retrieve all users with optional filters (requires authentication and admin privileges)

PATCH /api/users/:id
^^^ update a specific user's details by their ID (requires authentication)

PATCH /api/users/:id/password
^^^ update a specific user's password by their ID (requires authentication)

PATCH /api/users/:id/image
^^^ update a specific user's profile image by their ID (requires authentication)
```