# 🗄️ Database Setup Instructions & NestJS Local Backend Guide

This project includes a **real full-stack e-commerce architecture**. 
It runs live in the AI Studio environment with Express + Multer + Local JSON DB persistence, and also provides a **complete NestJS + PostgreSQL/MySQL backend** in the `/nestjs-backend` folder.

---

## 📌 1. Database SQL DDL Script (`schema.sql`)

Run the following standard SQL script in your local **PostgreSQL** or **MySQL / MariaDB** client (pgAdmin, DBeaver, MySQL Workbench, or `psql` / `mysql` terminal):

```sql
-- 1. Create Database
CREATE DATABASE atelier_ecommerce;

-- Connect to database
\c atelier_ecommerce; -- for PostgreSQL
-- USE atelier_ecommerce; -- for MySQL

-- 2. Users Table (Admin & Customer Roles)
CREATE TABLE users (
    id VARCHAR(64) PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(32) NOT NULL DEFAULT 'customer', -- 'admin' or 'customer'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Seed Initial Default Admin and Customer Accounts
INSERT INTO users (id, email, password, name, role) VALUES
('u-admin-1', 'admin@atelier.com', 'admin123', 'Atelier Director (Admin)', 'admin'),
('u-customer-1', 'customer@atelier.com', 'user123', 'Clara Vance', 'customer');

-- 3. Categories Table
CREATE TABLE categories (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL,
    slug VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Seed Default Categories
INSERT INTO categories (id, name, slug, description) VALUES
('cat-1', 'Outerwear', 'outerwear', 'Architectural coats, trenchcoats, and jackets'),
('cat-2', 'Knitwear', 'knitwear', 'Heavyweight alpaca, cashmere, and merino knits'),
('cat-3', 'Tailored Suits', 'tailored-suits', 'Structured virgin wool pants and silk garments'),
('cat-4', 'Footwear', 'footwear', 'Goodyear welt boots and Italian leather footwear'),
('cat-5', 'Leather Goods', 'leather-goods', 'Handcrafted nappa leather bags and small accessories'),
('cat-6', 'Accessories', 'accessories', 'Japanese acetate eyewear and fine jewelry');

-- 4. Products Table
CREATE TABLE products (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    subtitle TEXT,
    price DECIMAL(10,2) NOT NULL,
    original_price DECIMAL(10,2),
    category_id VARCHAR(64) REFERENCES categories(id) ON DELETE SET NULL,
    category_name VARCHAR(255) NOT NULL,
    description TEXT,
    composition TEXT,
    care_instructions TEXT,
    rating DECIMAL(3,2) DEFAULT 5.0,
    reviews_count INT DEFAULT 0,
    in_stock BOOLEAN DEFAULT TRUE,
    is_new_arrival BOOLEAN DEFAULT FALSE,
    is_bestseller BOOLEAN DEFAULT FALSE,
    sustainability_badge VARCHAR(255),
    images JSON NOT NULL, -- Stores array of image URLs saved in /public/uploads
    colors JSON NOT NULL,
    sizes JSON NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. Orders Table
CREATE TABLE orders (
    id VARCHAR(64) PRIMARY KEY,
    customer_name VARCHAR(255) NOT NULL,
    customer_email VARCHAR(255) NOT NULL,
    address TEXT NOT NULL,
    city VARCHAR(100) NOT NULL,
    country VARCHAR(100) NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL,
    shipping_fee DECIMAL(10,2) DEFAULT 0,
    discount_amount DECIMAL(10,2) DEFAULT 0,
    total_amount DECIMAL(10,2) NOT NULL,
    payment_method VARCHAR(50) DEFAULT 'card',
    gift_wrap BOOLEAN DEFAULT FALSE,
    status VARCHAR(50) DEFAULT 'Pending', -- 'Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 6. Order Items Table
CREATE TABLE order_items (
    id SERIAL PRIMARY KEY,
    order_id VARCHAR(64) REFERENCES orders(id) ON DELETE CASCADE,
    product_id VARCHAR(64) REFERENCES products(id) ON DELETE SET NULL,
    product_name VARCHAR(255) NOT NULL,
    image VARCHAR(512) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    quantity INT NOT NULL,
    color VARCHAR(100),
    size VARCHAR(50)
);

-- Indexes for maximum query performance
CREATE INDEX idx_products_category ON products(category_name);
CREATE INDEX idx_orders_customer ON orders(customer_email);
CREATE INDEX idx_orders_status ON orders(status);
```

---

## 🚀 2. How to Run PostgreSQL Database Locally via Docker

If you have Docker installed on your computer, launch PostgreSQL in 1 command:

```bash
docker run --name atelier-postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=atelier_ecommerce -p 5432:5432 -d postgres:15
```

---

## ⚡ 3. How to Run NestJS Backend Locally

1. Open your local terminal in the `/nestjs-backend` directory:
   ```bash
   cd nestjs-backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file inside `/nestjs-backend/.env`:
   ```env
   PORT=3000
   DB_HOST=localhost
   DB_PORT=5432
   DB_USER=postgres
   DB_PASSWORD=postgres
   DB_NAME=atelier_ecommerce
   JWT_SECRET=atelier_super_secret_key_2026
   ```

4. Start NestJS in watch mode:
   ```bash
   npm run start:dev
   ```

5. The NestJS backend will listen at `http://localhost:3000` and handle image file uploads directly inside `/public/uploads`!

---

## 📂 Local Product Image Upload Directory Structure

When an Admin uploads images via the Admin Panel, images are saved directly inside:
```
project-root/
 └── public/
      └── uploads/
           ├── product-1722238491-128938.jpg
           ├── product-1722238510-982123.jpg
           └── ...
```
These images are publicly accessible via the local web route `/uploads/<filename>`.
