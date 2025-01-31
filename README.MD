# Tipsy

**Tipsy** is a full-stack liquor ordering web-based platform built using the MERN stack (MongoDB, Express.js, React.js, Node.js). This project incorporates multiple security measures to ensure a secure and user-friendly experience.

---

## **Features**

### **Frontend**
- Built with React.js for a seamless user interface.
- Implements user-centric design principles for easy navigation and accessibility.
- Secure HTTPS communication using `mkcert`.

### **Backend**
- Powered by Node.js with Express.js for API handling.
- MongoDB for robust and scalable data storage.
- Secured API endpoints with authentication and rate-limiting.

### **Key Functionalities**
- **User Registration and Login** with Multi-Factor Authentication (MFA) and CAPTCHA.
- **Role-Based Access Control (RBAC)** for user and admin functionalities.
- **Product Management**: Add, update, delete, and view products.
- **Cart and Order Management**: Add to cart, manage cart, and process orders.
- **Review and Rating System**: Users can leave reviews and rate products.
- **Secure API Communication**: HTTPS secured for all endpoints.
- **Activity Logging**: Admin can view all user activities for security audits.

---

## **APIs**

### **User APIs**
- `POST /api/user/create`: Register a new user.
- `POST /api/user/login`: User login.
- `POST /api/user/verify_login_otp`: Verify login OTP.
- `GET /api/user/activity_logs`: Fetch activity logs.
- `GET /api/user/profile/:id`: Get user profile by ID.
- `DELETE /api/user/delete_account/:id`: Delete user account.
- `PUT /api/user/update/:id`: Update user profile.

### **Product APIs**
- `POST /api/product/create`: Add a new product.
- `GET /api/product/get_all_products`: Fetch all products.
- `GET /api/product/get_single_product/:id`: Fetch product by ID.
- `PUT /api/product/update_product/:id`: Update product by ID.
- `DELETE /api/product/delete_product/:id`: Delete product by ID.

### **Order APIs**
- `POST /api/order/create`: Create an order.
- `GET /api/order/user`: Get user orders.
- `GET /api/order/get`: Get all orders (Admin).
- `PUT /api/order/update/:id`: Update order by ID.
- `PUT /api/order/status`: Update order status.

### **Cart APIs**
- `POST /api/cart/addToCart`: Add product to cart.
- `GET /api/cart/getCartByUserID/:id`: Get cart by user ID.
- `PUT /api/cart/updateCart/:id`: Update cart item.
- `DELETE /api/cart/removeFromCart/:id`: Remove item from cart.

### **Review and Rating APIs**
- `POST /api/review/addReview`: Add a review.
- `GET /api/review/getReviewsByUserID/:id`: Get reviews by user ID.
- `GET /api/review/getReviewsByProductID/:id`: Get reviews by product ID.

---

## **Security Measures Implemented**
1. **Password Security**
   - Enforced strong password policies.
   - Passwords stored using bcrypt hashing with salt.
2. **Multi-Factor Authentication (MFA)**
   - OTP-based authentication for login.
3. **CAPTCHA Integration**
   - Prevents automated attacks.
4. **Brute-Force Prevention**
   - Rate-limiting applied to critical routes.
5. **Role-Based Access Control (RBAC)**
   - Restricted admin routes.
6. **HTTPS Communication**
   - SSL certificates generated using `mkcert`.
7. **Input Sanitization**
   - Prevents XSS attacks.
8. **Secure Session Management**
   - Sessions managed securely with cookies.
9. **Activity Logging**
   - Logs user activities for admin review.
10. **Helmet.js**
    - Sets secure HTTP headers.

---

## **Setup Instructions**

### **1. Clone the Repository**
```bash
git clone https://github.com/nwj002/Tipsy.V.1.git

cd tipsy

## **Backend Setup**

1. Navigate to the `backend` folder:
   ```bash
   cd backend

2. Install the required dependencies 
```bash
npm install

3. Create a .env file in the backend folder with the following content:
```bash
PORT=5000
MONGO_URI=<your-mongodb-connection-uri>
JWT_SECRET=<your-jwt-secret>
RECAPTCHA_SECRET_KEY=<your-recaptcha-secret>

Start the backend server:
```bash
npm start

## **Frontend Setup**

1. Navigate to the `frontend` folder:
   ```bash
   cd frontend

2. Install the required dependencies 
```bash
npm install

3. Create a .env file in the frontend folder with the following content:
```bash
HTTPS=true
SSL_CRT_FILE=./certs/localhost.pem
SSL_KEY_FILE=./certs/localhost-key.pem
REACT_APP_BACKEND_URL=https://localhost:5000

Start the frontend server:
```bash
npm start