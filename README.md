# devConnects Backend

Backend service powering **devConnects**, a full-stack developer networking platform that enables secure authentication, real-time communication, AI-powered profile enhancements, and premium membership workflows.

The backend is built with **Node.js**, **Express.js**, and **MongoDB**, and is deployed on **AWS EC2** using **PM2** and **NGINX**.

> Frontend Repository: https://github.com/Abhay-Kumar-Pandey03/devConnects-frontend

---

# Features

## Authentication & Authorization

- JWT-based authentication
- Secure password hashing using bcrypt
- Protected routes with middleware
- Role-based authorization
- Cookie-based session management

---

## AI-Powered Features

### AI Profile Generator

Generate professional developer profile summaries using the **Google Gemini API**.

- Creates polished "About Me" sections
- Improves profile quality
- Uses prompt-based content generation

---

### AI Developer Compatibility

An intelligent compatibility engine that combines deterministic logic with LLM-powered semantic analysis.

Pipeline:

- Normalize skills
- Exact skill matching
- Static semantic mappings
- Cached similarity lookup
- Google Gemini semantic validation
- Compatibility score generation

This hybrid approach improves recommendation quality while minimizing unnecessary AI requests.

---

## Developer Networking

- Send connection requests
- Accept or reject requests
- View connections
- Personalized developer feed
- Match score for each developer

---

## Real-Time Chat

- One-to-one messaging
- Socket.IO
- Authenticated WebSocket connections
- Online/offline user handling

---

## Premium Membership

- Razorpay integration (Sandbox)
- Premium subscription workflow
- Secure payment verification
- Membership upgrades

---

## Email Notifications

Amazon SES integration

- Welcome emails
- Connection reminders
- Premium notifications

> Amazon SES is currently configured in Sandbox Mode.

---

## Admin APIs

- User management
- Premium user statistics
- Connection analytics
- Administrative endpoints

---

# Tech Stack

### Backend

- Node.js
- Express.js

### Database

- MongoDB
- Mongoose

### Authentication

- JWT
- bcrypt

### AI

- Google Gemini API

### Real-Time

- Socket.IO

### Payments

- Razorpay

### Email

- Amazon SES

### Deployment

- AWS EC2
- PM2
- NGINX

---

# API Highlights

Authentication

- Register
- Login
- Logout

Profile

- View Profile
- Edit Profile
- AI Profile Generation

Connections

- Send Request
- Accept Request
- Reject Request
- View Connections

Chat

- Real-time Messaging

Premium

- Create Order
- Verify Payment

Admin

- Dashboard APIs

---

# Project Highlights

- Secure JWT Authentication
- AI-powered profile generation
- Semantic developer compatibility scoring
- Real-time WebSocket chat
- Razorpay payment integration
- Amazon SES email automation
- AWS production deployment
- Scalable modular backend architecture

---

# Deployment

Production deployment includes:

- AWS EC2
- PM2 Process Manager
- NGINX Reverse Proxy
- MongoDB Atlas
- Environment-based configuration

---

# Environment Variables

Create a `.env` file in the root directory and configure the following variables:

```env
PORT=7777

MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/devconnects

JWT_SECRET=your_jwt_secret

GEMINI_API_KEY=your_gemini_api_key

RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxx
RAZORPAY_SECRET=your_razorpay_secret

AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_REGION=ap-south-1

SES_EMAIL=example@domain.com

CLIENT_URL=http://localhost:5173
```

---

# Installation

```bash
git clone https://github.com/Abhay-Kumar-Pandey03/devConnects

cd devConnects

npm install

npm run dev
```

---

# Future Improvements

- AI-powered skill recommendations
- AI-assisted chat replies
- Resume analysis
- Vector search for developer discovery
- AI interview preparation
- Team recommendation engine

---

# License

This project is intended for educational and portfolio purposes.