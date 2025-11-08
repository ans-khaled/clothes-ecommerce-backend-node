# E-commerce Backend (Node.js)

**Description**  
A production-oriented E-commerce backend built with Node.js. Features a modular folder structure, RESTful routes for products, categories, cart, orders, users, and admin seeding. Demonstrates skills in backend development, API testing with Postman, authentication & authorization using JWT, file uploads, and security best practices.


---

## ⚙️ Key Features & Skills Demonstrated

- **Node.js (Express)** for RESTful API endpoints.
- **Modular architecture** — controllers, models, routes, middleware separated for maintainability.
- **Authentication & Authorization** using **JWT** (login, protected routes, admin middleware).
- **File uploads** for product images (handled by `upload-middleware.js`).
- **Database connectivity** via `database/db.js` (MongoDB or your RDBMS connection).
- **Seed admin** script (`seed-admin.js`) to create an initial admin user.
- **API testing & documentation** with **Postman** (collections, environments, tests).
- **Security best practices**: password hashing, input validation, CORS, Helmet, rate limiting recommendations.
- **Error handling middleware** (centralized responses and status codes).
- **Clean code & naming conventions** — readable, reusable functions and clear route/controller separation.

---

## 🔐 Security & Best Practices

- **JWT** for stateless auth: access tokens used to protect routes. Refresh token strategy recommended for production.
- **Password hashing** (bcrypt) before saving users.
- **Authorization middleware** (`admin-middleware.js`) to restrict admin endpoints.
- **Validation & sanitization** of input (use `express-validator` or similar).
- **Protect HTTP headers** with `helmet`.
- **Enable CORS** with appropriate origins only.
- **Rate limiting** (e.g., `express-rate-limit`) to limit brute-force attempts.
- **Never commit `.env`** — uses environment variables for secrets (JWT_SECRET, DB_URL).

---

## 🔌 Environment Variables (example `.env`)

PORT=5000
DB_URI=mongodb://localhost:27017/ecommerce
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRES_IN=7d
ADMIN_EMAIL=admin@example.com

ADMIN_PASSWORD=ChangeMe123!


---

🧪 Postman — How I Tested

Included Postman collection: endpoints grouped by resource (Auth, Users, Products, Orders, Cart).
Tests written for status codes, token validation, and response structure.

---

## 🚀 How to Run Locally

```bash
# install deps
npm install

# set env variables (create .env file)
# run DB server (e.g., mongod for MongoDB)

# seed admin (if provided)
node controllers/seed-admin.js

# start
npm run dev         # or npm start

---

API Endpoints (overview)

Base: http://localhost:5000/api

Auth & Users

POST /api/users/register — register new user

POST /api/users/login — login, receive JWT

GET /api/users/profile — get user profile (auth)

Products & Categories

GET /api/products — list products

GET /api/products/:id — product details

POST /api/products — create product (admin + file upload)

PUT /api/products/:id — update product (admin)

DELETE /api/products/:id — delete product (admin)

GET /api/categories — list categories

POST /api/categories — create category (admin)

Cart & Orders

POST /api/cart — add item to cart (auth)

GET /api/cart — view cart (auth)

POST /api/orders — place order (auth)

GET /api/orders — list user's orders (auth)

GET /api/orders/all — admin: view all orders

Contact & FAQ

POST /api/contact — submit contact/message

GET /api/faq — list frequently asked questions

Use Authorization: Bearer <token> header for protected routes.

