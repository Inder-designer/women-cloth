# Surkh-E-Punjab API Documentation

## Overview
Backend API for Surkh-E-Punjab Women's Clothing E-commerce Store built with Node.js, Express, MongoDB, and Passport.js.

## Features
- ✅ User authentication with Passport.js (Local Strategy)
- ✅ Session management with MongoDB store
- ✅ JWT token-based authentication
- ✅ Product management with slugify
- ✅ Image upload with Multer
- ✅ Shopping cart functionality
- ✅ Wishlist management
- ✅ Order processing
- ✅ Product reviews and ratings
- ✅ Role-based access control (User/Admin)
- ✅ CORS enabled for frontend integration

## Setup Instructions

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Create Environment File
Create a `.env` file in the backend directory:
```bash
cp .env.example .env
```

Edit `.env` with your configuration:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/surkh-e-punjab
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=7d
SESSION_SECRET=your_session_secret_key_here
FRONTEND_URL=http://localhost:3000
```

### 3. Create Upload Directory
```bash
mkdir uploads
```

### 4. Start MongoDB
Make sure MongoDB is running on your system:
```bash
# Windows
net start MongoDB

# Mac/Linux
sudo systemctl start mongod
```

### 5. Run the Server
```bash
# Development mode with nodemon
npm run dev

# Production mode
npm start
```

Server will run on `http://localhost:5000`

## API Endpoints

### Authentication Routes (`/api/auth`)
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user (Protected)

### User Routes (`/api/users`)
- `GET /api/users/profile` - Get user profile (Protected)
- `PUT /api/users/profile` - Update profile (Protected)
- `PUT /api/users/change-password` - Change password (Protected)
- `PUT /api/users/settings` - Update settings (Protected)
- `POST /api/users/avatar` - Upload avatar (Protected)
- `GET /api/users` - Get all users (Admin only)

### Product Routes (`/api/products`)
- `GET /api/products` - Get all products with filters
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (Admin only)
- `PUT /api/products/:id` - Update product (Admin only)
- `DELETE /api/products/:id` - Delete product (Admin only)

### Category Routes (`/api/categories`)
- `GET /api/categories` - Get all categories
- `GET /api/categories/:slug` - Get category by slug
- `POST /api/categories` - Create category (Admin only)

### Cart Routes (`/api/cart`)
- `GET /api/cart` - Get user cart (Protected)
- `POST /api/cart/items` - Add item to cart (Protected)
- `PUT /api/cart/items/:itemId` - Update cart item (Protected)
- `DELETE /api/cart/items/:itemId` - Remove item from cart (Protected)
- `DELETE /api/cart` - Clear cart (Protected)

### Wishlist Routes (`/api/wishlist`)
- `GET /api/wishlist` - Get wishlist (Protected)
- `POST /api/wishlist/:productId` - Add to wishlist (Protected)
- `DELETE /api/wishlist/:productId` - Remove from wishlist (Protected)
- `DELETE /api/wishlist` - Clear wishlist (Protected)

### Order Routes (`/api/orders`)
- `GET /api/orders` - Get user orders (Protected)
- `GET /api/orders/:id` - Get single order (Protected)
- `POST /api/orders` - Create order (Protected)
- `PUT /api/orders/:id/cancel` - Cancel order (Protected)
- `GET /api/orders/admin/all` - Get all orders (Admin only)
- `PUT /api/orders/:id/status` - Update order status (Admin only)

### Review Routes (`/api/reviews`)
- `GET /api/reviews/product/:productId` - Get product reviews
- `POST /api/reviews` - Create review (Protected)
- `PUT /api/reviews/:id` - Update review (Protected)
- `DELETE /api/reviews/:id` - Delete review (Protected)
- `PUT /api/reviews/:id/helpful` - Mark review helpful (Protected)

## Request Examples

### Register User
```bash
POST /api/auth/register
Content-Type: application/json

{
  "firstName": "Priya",
  "lastName": "Kaur",
  "email": "priya@example.com",
  "password": "password123",
  "phone": "+919876543210"
}
```

### Login
```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "priya@example.com",
  "password": "password123"
}
```

### Add to Cart
```bash
POST /api/cart/items
Authorization: Bearer <token>
Content-Type: application/json

{
  "productId": "product_id_here",
  "quantity": 1,
  "size": "M",
  "color": "Red"
}
```

### Create Order
```bash
POST /api/orders
Authorization: Bearer <token>
Content-Type: application/json

{
  "shippingAddress": {
    "firstName": "Priya",
    "lastName": "Kaur",
    "email": "priya@example.com",
    "phone": "+919876543210",
    "street": "123 Main Street",
    "city": "Amritsar",
    "state": "Punjab",
    "pincode": "143001",
    "country": "India"
  },
  "paymentMethod": "cod"
}
```

## Response Format
All API responses follow this format:
```json
{
  "success": true/false,
  "message": "Response message",
  "data": {
    // Response data
  }
}
```

## Error Handling
Errors are returned with appropriate HTTP status codes:
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Internal Server Error

## Technologies Used
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **Passport.js** - Authentication
- **JWT** - Token-based auth
- **Bcrypt** - Password hashing
- **Multer** - File uploads
- **Slugify** - URL-friendly strings
- **Validator** - Input validation
- **CORS** - Cross-origin requests

## Security Features
- Password hashing with bcrypt
- JWT token authentication
- Session management
- HTTP-only cookies
- Input validation
- Role-based access control

## Next Steps
1. Connect frontend to API endpoints
2. Add more payment gateways
3. Implement email notifications
4. Add SMS notifications with Twilio
5. Set up admin dashboard
6. Add analytics and reporting

## Support
For issues or questions, please contact the development team.
