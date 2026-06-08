# 🛒 ShopEase

A full-stack MERN E-Commerce platform that supports both buyers and sellers with complete shopping, product management, order tracking, wishlist, cart, and checkout functionality.

## 🚀 Features

### Buyer Features

* User Registration & Login
* Browse Products
* Search Products
* Product Details Page
* Wishlist Management
* Shopping Cart
* Address Management
* Checkout Flow
* Order Tracking
* Profile Management

### Seller Features

* Become a Seller
* Add New Products
* Manage Product Listings
* View Customer Orders
* Revenue Dashboard

### General Features

* JWT Authentication
* Role-Based Access Control
* Responsive Design
* Secure Password Hashing
* RESTful APIs
* MongoDB Database Integration

---

## 🛠 Tech Stack

### Frontend

* React.js
* Vite
* Tailwind CSS
* React Router DOM
* Context API

### Backend

* Node.js
* Express.js
* MongoDB Atlas
* Mongoose
* Nodemailer

---

## 📂 Project Structure

```bash
ShopEase
│
├── backend
│   ├── controllers
│   ├── mail
│   ├── models
│   ├── routes
│   ├── utils
│   ├── .env
│   ├── app.js
│   └── package.json
│
├── frontend
│   ├── public
│   ├── src
│   ├── .env
│   ├── vite.config.js
│   └── package.json
│
└── README.md
```

---

## ⚙️ Installation

### Clone the Repository

```bash
git clone https://github.com/nagakumar-yanamadala/Shop-Ease.git
cd shopease
```

---

## Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file inside the backend folder:

```env
MONGO_URI=your_mongodb_connection_string

MAIL_USER=your_email@gmail.com

MAIL_PASS=your_app_password

FRONTEND_URL=http://localhost:5173

SESSION_SECRET=your_session_secret
```

Start the backend server:

```bash
npm start
```

---

## Frontend Setup

```bash
cd frontend
npm install
```

Create a `.env` file inside the frontend folder:

```env
VITE_API_URL=http://localhost:3000
```

Start the frontend:

```bash
npm run dev
```

---

## Application URLs

Frontend:

```text
http://localhost:5173
```

Backend:

```text
http://localhost:3000
```

---

## 📸 Screens Included

* Login & Registration
* Home Page
* Product Listing
* Product Details
* Wishlist
* Cart
* Checkout
* Orders
* User Profile
* Seller Dashboard
* Product Management
* Order Management

---

## 🔒 Security Features

* Password Hashing with bcrypt
* JWT Authentication
* Protected Routes
* Role-Based Authorization
* Session Management

---

## 🎯 Future Improvements

* Razorpay Integration
* Stripe Integration
* Product Reviews & Ratings
* Cloudinary Image Uploads
* Seller Analytics
* Real-Time Notifications
* Advanced Filtering & Search
* Admin Dashboard

---

## 👨‍💻 Author

**Nagakumar Yanamadala**

GitHub: https://github.com/nagakumar-yanamadala

LinkedIn: https://www.linkedin.com/in/nagakumar-yanamadala/

---

## ⭐ If you like this project

Give this repository a star and feel free to contribute.
