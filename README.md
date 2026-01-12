# devConnects

Backend service for **devConnects**, a full-stack application focused on real-time communication, secure authentication, and premium user flows.

This service handles authentication, real-time chat, payments, email notifications, and admin functionality.

## Features
- JWT-based authentication and authorization
- One-to-one real-time chat using WebSockets
- Connection request system (send / accept / reject)
- Premium user flow with Razorpay (**sandbox mode**)
- Email notifications using Amazon SES (**sandbox mode, limited recipients**)
- Admin dashboard APIs (users, connections, premium stats)
- Role-based access control (User / Premium / Admin)

## Real-Time Communication
- Socket-based one-to-one chat
- Authenticated socket connections
- Online/offline user handling

## Email & Payments
- Emails are sent via **Amazon SES (sandbox environment)**
- Payment flow implemented using **Razorpay test keys**
- No real money transactions

## Deployment
The backend is deployed on an **AWS EC2 instance**, managed using **PM2**, and served behind **Nginx** as a reverse proxy
