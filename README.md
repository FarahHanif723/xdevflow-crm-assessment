# XDevFlow CRM System

A modern, full-stack Customer Relationship Management (CRM) system built with React.js, Node.js, Express.js, and MongoDB. Features role-based access control, activity timeline, dark/light mode, and responsive design.


## Live Demo

- Frontend: [Coming Soon - Vercel]
- Backend: [Coming Soon - Render]

## Test Credentials

### Admin Account
- Email: farah123@gmail.com
- Password: farah&123
- Access: Full access — Dashboard, Leads (CRUD), Admin Panel, User Role Management

### Manager Account
- Email: manager123@gmail.com
- Password: manager&123
- Access: Dashboard, Leads (Add, Edit, Delete, View), Activity Timeline

### User Account
 Email: user123@gmail.com
 Password: user&123
 Access: Dashboard, Leads (View Only), Activity Timeline

Note: You can also register your own account. First registered user automatically becomes Admin.

## Features

### Core Features
- JWT Authentication — Secure login/register with encrypted passwords
- Lead Management (CRUD) — Create, Read, Update, Delete leads
- Dashboard Analytics — Real-time stats (Total, New, Contacted, Qualified, Won, Lost)
- Search & Filter — Search by name, filter by status
- Dark / Light Mode — Toggle with persistent preference

### Bonus Features
- Role-Based Access Control — Admin, Manager, User roles with distinct permissions
- Activity Timeline — Complete history of all changes made to each lead
- Admin Panel — Manage all users and change their roles
- Responsive Design — Works on mobile, tablet, and desktop
- Clean Architecture — MVC pattern with separated controllers, models, routes

## Tech Stack

### Frontend
- React.js: UI Framework
- Tailwind CSS: Styling & Responsive Design
- React Router DOM: Client-side Routing
- Axios: API Calls
- React Hot Toast: Notifications
- React Icons: Icon Library
- Vite: Build Tool

### Backend
- Node.js: Runtime Environment
- Express.js: Web Framework
- MongoDB: NoSQL Database
- Mongoose: MongoDB ODM
- JWT: Authentication
- Bcrypt.js: Password Hashing
- CORS: Cross-Origin Requests
- Dotenv: Environment Variables


## Project Structure
xdevflow-crm-assessment/
├── client/                      
│   ├── src/
│   │   ├── components/         
│   │   ├── pages/              
│   │   ├── hooks/              
│   │   ├── utils/              
│   │   └── styles/             
│   ├── .env                    
│   └── package.json
├── server/                      
│   ├── controllers/            
│   ├── models/                 
│   ├── routes/                 
│   ├── middleware/             
│   └── server.js               
├── .gitignore
└── README.md

## Local Setup
 ## Prerequisites
Node.js v18+
MongoDB (local) or MongoDB Atlas account
Git

## 1. Clone the Repository
git clone [https://github.com/FarahHanif723/xdevflow-crm-assessment.git](https://github.com/FarahHanif723/xdevflow-crm-assessment.git)
cd xdevflow-crm-assessment
## 2. Backend Setup
## cd server
## npm install
## node server.js
## 3. Frontend Setup
cd ../client
## npm install
Start the frontend development server:
## npm run dev
License
This project was built as part of the XDevFlow Internship Assessment.
