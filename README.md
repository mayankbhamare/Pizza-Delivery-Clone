# PizzaXpress

A full-stack, responsive web application that allows users to custom-build their perfect pizza, place orders, and track them in real-time. It features secure authentication, payment gateway integration, and a comprehensive admin interface to manage inventory and orders.

## Features

- JWT Authentication
- Email Verification
- Password Reset
- Role-Based Authorization
- Custom Pizza Builder
- Razorpay Payment Integration
- Order Tracking
- Admin Dashboard
- Inventory Management
- Responsive Design

## Tech Stack

| Category | Technology |
|---|---|
| **Frontend** | React.js (Vite), React Router, Context API, Vanilla CSS |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB, Mongoose |
| **Authentication**| JWT, bcrypt.js |
| **Payments** | Razorpay |
| **Emails** | Nodemailer |

## Screenshots

<!-- Add Home Page Screenshot Here -->
<!-- Add Login/Registration Screenshot Here -->
<!-- Add Pizza Builder Screenshot Here -->
<!-- Add Order Summary/Payment Screenshot Here -->
<!-- Add Admin Dashboard Screenshot Here -->

## Installation

### Prerequisites
- Node.js (v16+)
- MongoDB (Local or Atlas)
- Razorpay Account (for test keys)

### Setup Steps
```bash
# 1. Clone the repository
git clone https://github.com/YOUR_USERNAME/PizzaDeliveryApp.git
cd PizzaDeliveryApp

# 2. Start Backend
cd server
npm install
npm run dev

# 3. Start Frontend (in a new terminal)
cd ../client
npm install
npm run dev
```

## Environment Variables

**Backend (`server/.env`)**
- `PORT`
- `MONGO_URI`
- `JWT_SECRET`
- `EMAIL_USER`
- `EMAIL_PASS`
- `RAZORPAY_KEY_ID`
- `RAZORPAY_KEY_SECRET`
- `CLIENT_URL`

**Frontend (`client/.env`)**
- `VITE_API_BASE_URL`

## Folder Structure

```text
PizzaDeliveryApp/
├── client/                 # Frontend React Application
│   ├── src/                # Source code (components, pages, context)
│   └── package.json        # Frontend dependencies
│
└── server/                 # Backend Node/Express API
    ├── controllers/        # Business logic
    ├── models/             # Mongoose schemas
    ├── routes/             # API endpoints
    └── server.js           # Application entry point
```

## Future Improvements

- Integrate Google/Facebook OAuth for social login.
- Implement real-time order tracking using WebSockets (Socket.io).
- Add user reviews and rating systems.
- Include visual revenue analytics in the admin dashboard.

