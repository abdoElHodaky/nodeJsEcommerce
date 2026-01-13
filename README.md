# Node.js E-commerce Platform

A full-featured e-commerce web application built with Node.js, Express, and MySQL, featuring real-time functionality with Socket.IO.

## 🚀 Features

- **Multi-user System**: Support for customers, shop owners, and administrators
- **Real-time Communication**: Socket.IO integration for live updates
- **Product Management**: Complete CRUD operations for products and categories
- **Shopping Cart**: Session-based cart management
- **Order Processing**: Full order lifecycle management
- **Admin Dashboard**: Administrative interface for system management
- **Responsive Design**: Bootstrap-powered responsive UI
- **Security**: Input validation, session management, and CSRF protection

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Client Side   │    │   Server Side   │    │   Database      │
│                 │    │                 │    │                 │
│  ┌───────────┐  │    │  ┌───────────┐  │    │  ┌───────────┐  │
│  │ Bootstrap │  │    │  │ Express   │  │    │  │   MySQL   │  │
│  │    UI     │  │    │  │  Router   │  │    │  │ Database  │  │
│  └───────────┘  │    │  └───────────┘  │    │  └───────────┘  │
│  ┌───────────┐  │    │  ┌───────────┐  │    │  ┌───────────┐  │
│  │ Socket.IO │◄─┼────┼─►│ Socket.IO │  │    │  │   Knex    │  │
│  │  Client   │  │    │  │  Server   │  │    │  │   ORM     │  │
│  └───────────┘  │    │  └───────────┘  │    │  └───────────┘  │
│  ┌───────────┐  │    │  ┌───────────┐  │    │                 │
│  │   EJS     │  │    │  │   EJS     │  │    │                 │
│  │Templates  │  │    │  │ Renderer  │  │    │                 │
│  └───────────┘  │    │  └───────────┘  │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 📋 Table of Contents

- [Features](#-features)
- [Architecture](#️-architecture)
- [Installation](#-installation)
- [Configuration](#️-configuration)
- [Usage](#-usage)
- [API Endpoints](#-api-endpoints)
- [Database Schema](#️-database-schema)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License](#-license)

## 🛠️ Installation

### Prerequisites

- Node.js (v16.12.0 or higher)
- MySQL (v5.7 or higher)
- npm or yarn package manager

### Setup Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/abdoElHodaky/nodeJsEcommerce.git
   cd nodeJsEcommerce
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Database setup**
   ```bash
   # Create MySQL database
   mysql -u root -p
   CREATE DATABASE ecommerce;
   
   # Import database schema
   mysql -u root -p ecommerce < e.sql
   ```

4. **Configure database connection**
   ```bash
   # Edit knex.js with your database credentials
   cp knex.js.example knex.js
   ```

## ⚙️ Configuration

### Database Configuration (knex.js)

```javascript
module.exports = {
  development: {
    client: 'mysql',
    connection: {
      host: 'localhost',
      user: 'your_username',
      password: 'your_password',
      database: 'ecommerce'
    }
  }
};
```

### Environment Variables

Create a `.env` file in the root directory:

```env
PORT=3000
NODE_ENV=development
SESSION_SECRET=your_session_secret
DB_HOST=localhost
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=ecommerce
```

## 🚀 Usage

### Development Mode

```bash
npm start
```

The application will be available at `http://localhost:3000`

### Production Deployment

```bash
# Using PM2
npm install -g pm2
pm2 start app.js --name "ecommerce"

# Using Docker
docker build -t nodejs-ecommerce .
docker run -p 3000:3000 nodejs-ecommerce
```

## 📡 API Endpoints

### Authentication
- `POST /login` - User login
- `POST /register` - User registration
- `GET /logout` - User logout

### Products
- `GET /products` - List all products
- `GET /products/:id` - Get product details
- `POST /products` - Create new product (Admin)
- `PUT /products/:id` - Update product (Admin)
- `DELETE /products/:id` - Delete product (Admin)

### Shopping Cart
- `POST /cart/add` - Add item to cart
- `GET /cart` - View cart contents
- `PUT /cart/update` - Update cart item
- `DELETE /cart/remove` - Remove item from cart

### Orders
- `POST /orders` - Create new order
- `GET /orders` - List user orders
- `GET /orders/:id` - Get order details

### Admin Routes
- `GET /admin` - Admin dashboard
- `GET /admin/users` - Manage users
- `GET /admin/orders` - Manage orders
- `GET /admin/products` - Manage products

## 🗄️ Database Schema

### Core Tables

```sql
-- Users and Authentication
adms (admID, Name, Password, Email, type)
clients (clientID, Name, Password, Email, Phone, Address)
owners (ownerID, Name, Password, Email, Phone, Address)

-- Products and Inventory
products (productID, Name, Description, Price, Stock, CategoryID)
categories (categoryID, Name, Description)
shops (shopID, Name, ownerID, Address, Phone)

-- Orders and Transactions
orders (orderID, clientID, Total, Status, CreatedAt)
order_items (orderItemID, orderID, productID, Quantity, Price)
bill (billID, orderID, Amount, PaymentMethod, Status)

-- Shopping Cart
cart (cartID, clientID, productID, Quantity, AddedAt)
```

## 🐳 Deployment

### Docker Deployment

```dockerfile
FROM node:16.12.0-alpine

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
EXPOSE 3000

CMD ["npm", "start"]
```

### Heroku Deployment

```bash
# Install Heroku CLI
heroku create your-app-name
heroku addons:create cleardb:ignite
heroku config:set NODE_ENV=production
git push heroku master
```

### Environment-specific Configurations

- **Development**: Local MySQL, debug logging enabled
- **Staging**: Cloud database, limited logging
- **Production**: Optimized for performance, error tracking

## 🔧 Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MySQL with Knex.js ORM
- **Frontend**: EJS templating, Bootstrap 3
- **Real-time**: Socket.IO
- **Security**: Helmet, express-validator
- **Session Management**: express-session
- **File Upload**: Multer

## 🧪 Testing

```bash
# Run tests (when implemented)
npm test

# Run linting
npm run lint

# Check security vulnerabilities
npm audit
```

## 📊 Performance Monitoring

- **Response Time**: Monitor API endpoint performance
- **Database Queries**: Optimize with proper indexing
- **Memory Usage**: Track Node.js memory consumption
- **Error Tracking**: Implement error logging and monitoring

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

[![License: The Unlicense](https://img.shields.io/badge/license-The%20Unlicense-blue.svg)](http://unlicense.org/)

This project is released under The Unlicense - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Abdo El Hodaky**
- GitHub: [@abdoElHodaky](https://github.com/abdoElHodaky)
- LinkedIn: [Connect with me](https://linkedin.com/in/abdoelhodaky)

## 🔗 Links

- **Live Demo**: [https://nodejse-commerce.herokuapp.com/](https://nodejse-commerce.herokuapp.com/)
- **Documentation**: [Wiki](https://github.com/abdoElHodaky/nodeJsEcommerce/wiki)
- **Issues**: [Bug Reports](https://github.com/abdoElHodaky/nodeJsEcommerce/issues)

---

⭐ **Star this repository if you found it helpful!**
