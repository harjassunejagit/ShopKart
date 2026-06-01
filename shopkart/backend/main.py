from itertools import count

from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel
from typing import Optional, List
import sqlite3
import hashlib
import jwt
import datetime
import os

app = FastAPI(title="ShopKart API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

SECRET_KEY = "shopkart_secret_key_2024"
DB_PATH = "shopkart.db"
security = HTTPBearer(auto_error=False)

# ─── Database Setup ───────────────────────────────────────────────────────────

def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db()
    c = conn.cursor()

    c.execute('''CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT UNIQUE NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        is_admin INTEGER DEFAULT 0,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )''')

    c.execute('''CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        description TEXT,
        price REAL NOT NULL,
        original_price REAL,
        category TEXT NOT NULL,
        image TEXT NOT NULL,
        stock INTEGER DEFAULT 100,
        rating REAL DEFAULT 4.0,
        reviews INTEGER DEFAULT 0,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )''')

    c.execute('''CREATE TABLE IF NOT EXISTS cart (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        product_id INTEGER NOT NULL,
        quantity INTEGER DEFAULT 1,
        FOREIGN KEY (user_id) REFERENCES users(id),
        FOREIGN KEY (product_id) REFERENCES products(id)
    )''')

    c.execute('''CREATE TABLE IF NOT EXISTS orders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        total REAL NOT NULL,
        status TEXT DEFAULT 'pending',
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id)
    )''')

    c.execute('''CREATE TABLE IF NOT EXISTS order_items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        order_id INTEGER NOT NULL,
        product_id INTEGER NOT NULL,
        quantity INTEGER NOT NULL,
        price REAL NOT NULL,
        FOREIGN KEY (order_id) REFERENCES orders(id),
        FOREIGN KEY (product_id) REFERENCES products(id)
    )''')

    # Seed admin user
    admin_pw = hashlib.sha256("admin123".encode()).hexdigest()
    c.execute("INSERT OR IGNORE INTO users (name, email, password, is_admin) VALUES (?, ?, ?, ?)",
              ("Admin", "admin@shopkart.com", admin_pw, 1))

    # Seed products
    products = [
        ("iPhone 15 Pro", "Apple's flagship smartphone with A17 Pro chip, titanium design, and pro camera system.", 79999, 89999, "Mobile", "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400", 50, 4.8, 2341),
        ("Samsung Galaxy S24", "Android powerhouse with Snapdragon 8 Gen 3, 50MP camera, 7 years of updates.", 59999, 74999, "Mobile", "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400", 80, 4.6, 1892),
        ("MacBook Air M3", "Ultra-thin laptop with M3 chip, 18-hour battery life, and stunning Liquid Retina display.", 114999, 129999, "Laptop", "https://images.unsplash.com/photo-1611186871525-6bba81de04b4?w=400", 30, 4.9, 987),
        ("Sony WH-1000XM5", "Industry-leading noise cancelling headphones with 30-hour battery and crystal clear calls.", 24999, 34999, "Audio", "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=400", 120, 4.7, 3210),
        ("iPad Pro 12.9", "Most advanced iPad ever with M2 chip, Liquid Retina XDR display, and Apple Pencil support.", 89999, 99999, "Tablet", "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400", 45, 4.8, 654),
        ("Dell XPS 15", "Premium Windows laptop with OLED display, 13th Gen Intel Core i9, and RTX 4070.", 149999, 169999, "Laptop", "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=400", 25, 4.5, 432),
        ("AirPods Pro 2", "Active noise cancellation, Adaptive Audio, and up to 30 hours of battery with case.", 19999, 26900, "Audio", "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=400", 200, 4.7, 5678),
        ("OnePlus 12", "Flagship killer with Snapdragon 8 Gen 3, Hasselblad cameras, and 100W fast charging.", 52999, 64999, "Mobile", "https://images.unsplash.com/photo-1585060544812-6b45742d762f?w=400", 60, 4.4, 876),
        ("Samsung 4K Monitor", "27-inch 4K UHD monitor with 144Hz refresh rate, HDR600, and USB-C connectivity.", 39999, 49999, "Monitor", "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400", 35, 4.6, 345),
        ("Logitech MX Master 3", "Advanced wireless mouse with MagSpeed scroll, ergonomic design, and multi-device support.", 7999, 9999, "Accessories", "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400", 150, 4.8, 2109),
        ("Kindle Paperwhite","Waterproof e-reader with 6.8-inch display, adjustable warm light, and 10-week battery.",11999,14999,"Tablet","https://images.unsplash.com/photo-1592434134753-a70baf7979d1?w=400",90,4.6,1543),
        ("Bose SoundLink Max", "Portable Bluetooth speaker with 20-hour battery, waterproof design, and clear sound.", 17999, 22999, "Audio", "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400", 70, 4.5, 789),
    ]
    count = c.execute(
    "SELECT COUNT(*) FROM products"
    ).fetchone()[0]

    if count == 0:
     for p in products:
        c.execute(
            "INSERT INTO products (name, description, price, original_price, category, image, stock, rating, reviews) VALUES (?,?,?,?,?,?,?,?,?)",
            p
        )
    conn.commit()
    conn.close()

init_db()

# ─── Auth Helpers ─────────────────────────────────────────────────────────────

def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()

def create_token(user_id: int, is_admin: bool) -> str:
    payload = {
        "user_id": user_id,
        "is_admin": is_admin,
        "exp": datetime.datetime.utcnow() + datetime.timedelta(days=7)
    }
    return jwt.encode(payload, SECRET_KEY, algorithm="HS256")

def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    if not credentials:
        raise HTTPException(status_code=401, detail="Not authenticated")
    try:
        payload = jwt.decode(credentials.credentials, SECRET_KEY, algorithms=["HS256"])
        return payload
    except:
        raise HTTPException(status_code=401, detail="Invalid token")

def get_optional_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    if not credentials:
        return None
    try:
        payload = jwt.decode(credentials.credentials, SECRET_KEY, algorithms=["HS256"])
        return payload
    except:
        return None

# ─── Models ───────────────────────────────────────────────────────────────────

class UserRegister(BaseModel):
    name: str
    email: str
    password: str

class UserLogin(BaseModel):
    email: str
    password: str

class ProductCreate(BaseModel):
    name: str
    description: str
    price: float
    original_price: Optional[float] = None
    category: str
    image: str
    stock: Optional[int] = 100
    rating: Optional[float] = 4.0

class CartAdd(BaseModel):
    product_id: int
    quantity: int = 1

# ─── Auth Routes ──────────────────────────────────────────────────────────────

@app.post("/auth/register")
def register(user: UserRegister):
    conn = get_db()
    c = conn.cursor()
    existing = c.execute("SELECT id FROM users WHERE email = ?", (user.email,)).fetchone()
    if existing:
        conn.close()
        raise HTTPException(status_code=400, detail="Email already registered")
    pw = hash_password(user.password)
    c.execute("INSERT INTO users (name, email, password) VALUES (?, ?, ?)", (user.name, user.email, pw))
    user_id = c.lastrowid
    conn.commit()
    conn.close()
    token = create_token(user_id, False)
    return {"token": token, "user": {"id": user_id, "name": user.name, "email": user.email, "is_admin": False}}

@app.post("/auth/login")
def login(user: UserLogin):
    conn = get_db()
    c = conn.cursor()
    pw = hash_password(user.password)
    row = c.execute("SELECT * FROM users WHERE email = ? AND password = ?", (user.email, pw)).fetchone()
    conn.close()
    if not row:
        raise HTTPException(status_code=401, detail="Invalid email or password")
    token = create_token(row["id"], bool(row["is_admin"]))
    return {"token": token, "user": {"id": row["id"], "name": row["name"], "email": row["email"], "is_admin": bool(row["is_admin"])}}

# ─── Product Routes ───────────────────────────────────────────────────────────

@app.get("/products")
def get_products(search: str = "", category: str = "", min_price: float = 0, max_price: float = 999999):
    conn = get_db()
    c = conn.cursor()
    query = "SELECT * FROM products WHERE price >= ? AND price <= ?"
    params = [min_price, max_price]
    if search:
        query += " AND (name LIKE ? OR description LIKE ?)"
        params += [f"%{search}%", f"%{search}%"]
    if category:
        query += " AND category = ?"
        params.append(category)
    rows = c.execute(query, params).fetchall()
    conn.close()
    return [dict(r) for r in rows]

@app.get("/products/categories")
def get_categories():
    conn = get_db()
    c = conn.cursor()
    rows = c.execute("SELECT DISTINCT category FROM products").fetchall()
    conn.close()
    return [r["category"] for r in rows]

@app.get("/products/{product_id}")
def get_product(product_id: int):
    conn = get_db()
    c = conn.cursor()
    row = c.execute("SELECT * FROM products WHERE id = ?", (product_id,)).fetchone()
    conn.close()
    if not row:
        raise HTTPException(status_code=404, detail="Product not found")
    return dict(row)

@app.post("/products")
def create_product(product: ProductCreate, user=Depends(get_current_user)):
    if not user.get("is_admin"):
        raise HTTPException(status_code=403, detail="Admin only")
    conn = get_db()
    c = conn.cursor()
    c.execute("INSERT INTO products (name, description, price, original_price, category, image, stock, rating) VALUES (?,?,?,?,?,?,?,?)",
              (product.name, product.description, product.price, product.original_price, product.category, product.image, product.stock, product.rating))
    pid = c.lastrowid
    conn.commit()
    conn.close()
    return {"id": pid, "message": "Product created"}

@app.put("/products/{product_id}")
def update_product(product_id: int, product: ProductCreate, user=Depends(get_current_user)):
    if not user.get("is_admin"):
        raise HTTPException(status_code=403, detail="Admin only")
    conn = get_db()
    c = conn.cursor()
    c.execute("UPDATE products SET name=?, description=?, price=?, original_price=?, category=?, image=?, stock=?, rating=? WHERE id=?",
              (product.name, product.description, product.price, product.original_price, product.category, product.image, product.stock, product.rating, product_id))
    conn.commit()
    conn.close()
    return {"message": "Product updated"}

@app.delete("/products/{product_id}")
def delete_product(product_id: int, user=Depends(get_current_user)):
    if not user.get("is_admin"):
        raise HTTPException(status_code=403, detail="Admin only")
    conn = get_db()
    c = conn.cursor()
    c.execute("DELETE FROM products WHERE id = ?", (product_id,))
    conn.commit()
    conn.close()
    return {"message": "Product deleted"}

# ─── Cart Routes ──────────────────────────────────────────────────────────────

@app.get("/cart")
def get_cart(user=Depends(get_current_user)):
    conn = get_db()
    c = conn.cursor()
    rows = c.execute("""
        SELECT cart.id, cart.quantity, products.*
        FROM cart JOIN products ON cart.product_id = products.id
        WHERE cart.user_id = ?
    """, (user["user_id"],)).fetchall()
    conn.close()
    items = []
    for r in rows:
        d = dict(r)
        d["cart_id"] = d.pop("id")
        items.append(d)
    return items

@app.post("/cart")
def add_to_cart(item: CartAdd, user=Depends(get_current_user)):
    conn = get_db()
    c = conn.cursor()
    existing = c.execute("SELECT id, quantity FROM cart WHERE user_id = ? AND product_id = ?",
                         (user["user_id"], item.product_id)).fetchone()
    if existing:
        c.execute("UPDATE cart SET quantity = quantity + ? WHERE id = ?", (item.quantity, existing["id"]))
    else:
        c.execute("INSERT INTO cart (user_id, product_id, quantity) VALUES (?, ?, ?)",
                  (user["user_id"], item.product_id, item.quantity))
    conn.commit()
    conn.close()
    return {"message": "Added to cart"}

@app.put("/cart/{cart_id}")
def update_cart(cart_id: int, quantity: int, user=Depends(get_current_user)):
    conn = get_db()
    c = conn.cursor()
    if quantity <= 0:
        c.execute("DELETE FROM cart WHERE id = ? AND user_id = ?", (cart_id, user["user_id"]))
    else:
        c.execute("UPDATE cart SET quantity = ? WHERE id = ? AND user_id = ?", (quantity, cart_id, user["user_id"]))
    conn.commit()
    conn.close()
    return {"message": "Cart updated"}

@app.delete("/cart/{cart_id}")
def remove_from_cart(cart_id: int, user=Depends(get_current_user)):
    conn = get_db()
    c = conn.cursor()
    c.execute("DELETE FROM cart WHERE id = ? AND user_id = ?", (cart_id, user["user_id"]))
    conn.commit()
    conn.close()
    return {"message": "Removed from cart"}

@app.delete("/cart")
def clear_cart(user=Depends(get_current_user)):
    conn = get_db()
    c = conn.cursor()
    c.execute("DELETE FROM cart WHERE user_id = ?", (user["user_id"],))
    conn.commit()
    conn.close()
    return {"message": "Cart cleared"}

# ─── Order Routes ─────────────────────────────────────────────────────────────

@app.post("/orders")
def place_order(user=Depends(get_current_user)):
    conn = get_db()
    c = conn.cursor()
    cart_items = c.execute("""
        SELECT cart.quantity, products.price, products.id
        FROM cart JOIN products ON cart.product_id = products.id
        WHERE cart.user_id = ?
    """, (user["user_id"],)).fetchall()
    if not cart_items:
        conn.close()
        raise HTTPException(status_code=400, detail="Cart is empty")
    total = sum(item["price"] * item["quantity"] for item in cart_items)
    c.execute("INSERT INTO orders (user_id, total) VALUES (?, ?)", (user["user_id"], total))
    order_id = c.lastrowid
    for item in cart_items:
        c.execute("INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?,?,?,?)",
                  (order_id, item["id"], item["quantity"], item["price"]))
    c.execute("DELETE FROM cart WHERE user_id = ?", (user["user_id"],))
    conn.commit()
    conn.close()
    return {"order_id": order_id, "total": total, "message": "Order placed successfully"}

@app.get("/orders")
def get_orders(user=Depends(get_current_user)):
    conn = get_db()
    c = conn.cursor()
    if user.get("is_admin"):
        rows = c.execute("""
            SELECT orders.*, users.name as user_name, users.email
            FROM orders JOIN users ON orders.user_id = users.id
            ORDER BY orders.created_at DESC
        """).fetchall()
    else:
        rows = c.execute("SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC", (user["user_id"],)).fetchall()
    conn.close()
    return [dict(r) for r in rows]

@app.get("/")
def root():
    return {"message": "ShopKart API is running!", "docs": "/docs"}
