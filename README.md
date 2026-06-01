# 🛒 ShopKart – Full-Stack E-Commerce Project

A modern electronics e-commerce platform built using React, FastAPI, SQLite, and JWT Authentication. ShopKart provides a complete online shopping experience with product browsing, category filtering, cart management, order tracking, and an admin dashboard for product management.A premium electronics e-commerce platform built with **React + FastAPI + SQLite**.


## 🚀 Project Highlights
Full-stack web application
JWT-based user authentication & authorization
Role-based Admin Dashboard
Product search, filtering, and management
Shopping cart and order management system
RESTful API architecture using FastAPI
Responsive UI built with React and Tailwind CSS
SQLite database integration
Deployable on Vercel and Render

## Tech Stack
| Layer | Technology |
|-------|-----------|
| Frontend | React 18, React Router, Tailwind CSS, Axios |
| Backend | FastAPI (Python) |
| Database | SQLite (zero-config, file-based) |
| Auth | JWT Tokens |
| Deployment | Vercel (frontend) + Render (backend) |

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ (for frontend)
- Python 3.10+ (for backend)

---

### Backend Setup

```bash
cd backend

# Install dependencies
pip install -r requirements.txt

# Start the server
uvicorn main:app --reload --port 8000
```

Backend runs at: **http://localhost:8000**  
API Docs at: **http://localhost:8000/docs**

---

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start the dev server
npm run dev
```

Frontend runs at: **http://localhost:5173**

---

## 🔑 Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@shopkart.com | admin123 |
| User | Register a new account | — |

---

## 📁 Project Structure

```
shopkart/
├── backend/
│   ├── main.py          # FastAPI app, routes, DB logic
│   └── requirements.txt
└── frontend/
    ├── src/
    │   ├── pages/       # Home, Products, Cart, Login, Admin, Orders
    │   ├── components/  # Navbar, ProductCard, Footer
    │   ├── context/     # AuthContext, CartContext
    │   ├── api.js       # Axios instance
    │   └── App.jsx      # Router
    ├── package.json
    ├── tailwind.config.js
    └── vite.config.js
```

---

## ✅ Features

### User Side
- 🏠 Home page with hero banner, categories, featured products
- 🛍️ Product listing with search, category filter, price filter
- 📦 Product detail page with quantity selector
- 🛒 Cart with quantity update, remove, order summary
- 👤 Register / Login with JWT
- 📋 Order history
- 📱 Fully responsive (mobile + desktop)

### Admin Side
- 📊 Dashboard with stats
- ➕ Add / Edit / Delete products
- 👁️ View all orders with customer details

---

## 🗄️ Database Schema

```
users      → id, name, email, password, is_admin
products   → id, name, description, price, original_price, category, image, stock, rating
cart       → id, user_id, product_id, quantity
orders     → id, user_id, total, status, created_at
order_items→ id, order_id, product_id, quantity, price
```

---

## 🌐 Deployment

### Frontend → Vercel
```bash
cd frontend
npm run build
# Connect GitHub repo to Vercel, set root to /frontend
```

### Backend → Render
- Create new Web Service on Render
- Set start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
- Add environment variable: `SECRET_KEY=your_secret_here`

## 🔮 Future Enhancements

Payment Gateway Integration (Razorpay/Stripe)
Wishlist Functionality
Product Reviews & Ratings
Email Notifications
Product Recommendations
Inventory Analytics Dashboard
Multi-Vendor Support


## 👨‍💻 Author

Harjas Suneja

Built as a full-stack web development project to demonstrate expertise in React, FastAPI, Database Management, REST APIs, Authentication, and Modern UI Development.