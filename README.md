# Task Manager Website

A modern, responsive, and interactive Task Manager Web Application built using React, TypeScript, Express, Node.js, and MongoDB. The application allows users to create, manage, organize, and track their daily tasks seamlessly in real time.

This project demonstrates RESTful API integration, state management, CRUD operations, database schema design, cross-origin resource sharing (CORS), and responsive web design to provide a smooth and productive user experience.

---

## Features

- Live task creation, updates, and deletion (CRUD)
- Priority tagging and task status tracking
- Real-time interaction between React frontend and Express backend
- Responsive and attractive user interface

### Task Management
- Interactive Task Creation
- Real-Time Task List Preview
- Dynamic Task Status Updates (Pending / Completed)
- Priority Labeling (Low, Medium, High)

### Data Management
- RESTful API Communication
- MongoDB Database Persistence
- Express Route Controllers
- Type-Safe TypeScript Interfaces

### User Interface & Experience
- Clean and Modern Layout
- Responsive Grid & Flexbox Layouts
- Instant State Updates
- Fast and Lightweight Performance

---

## System Architecture

### Frontend
- React
- TypeScript
- HTML5 / CSS3
- Axios / Fetch API

### Backend
- Node.js
- Express.js
- TypeScript
- Mongoose (MongoDB ODM)

### Database
- MongoDB / MongoDB Atlas

---

## Core Functional Modules

### Task Module
- Native Task Creation Form
- Real-Time Task Rendering
- Status & Priority Updates

### API & Backend Module
- Express Route Routing (`/api/tasks`)
- Mongoose Task Schema
- CORS Integration for Seamless Frontend Communication

### UI & Layout Module
- Dynamic Task Card Rendering
- Responsive Layout Engine
- Clean Visual Feedback

---

## Functional Workflow

1. **Task Creation:**
   - User inputs task title & details $\rightarrow$ Submits form $\rightarrow$ Frontend triggers POST request $\rightarrow$ Backend stores task in MongoDB $\rightarrow$ UI updates dynamically.

2. **Task Processing & Management:**
   - Frontend requests task list via GET request $\rightarrow$ Express fetches from MongoDB $\rightarrow$ React renders interactive task cards.

---

## Technologies Used

### Frontend
- React.js
- TypeScript
- HTML5 & CSS3

### Backend
- Node.js
- Express.js
- TypeScript
- Mongoose / MongoDB

### Tools & Deployment
- Visual Studio Code
- Git & GitHub
- ts-node / nodemon
- Vercel (Frontend Deployment)
- Render (Backend Deployment)

---

## Testing

The application was tested for:
- Backend REST API Endpoints (GET, POST, PUT, DELETE)
- MongoDB Database Connectivity & Schema Validation
- CORS Configuration & Frontend-to-Backend Communication
- UI Responsiveness & State Management
- Cross-Browser Compatibility

---

## Challenges Faced

- **CORS Configuration:** Resolving cross-origin requests between independent React and Express ports during local development and deployment.
- **TypeScript Alignment:** Setting up smooth TypeScript configurations across two distinct subdirectories (`frontend` and `backend`).
- **Deployment Root Setup:** Configuring monorepo root directories properly on cloud platforms like Render and Vercel.

---

## Learning Outcomes

This project provided hands-on experience in:
- Building end-to-end full-stack MERN architecture with TypeScript.
- Express route, middleware, and controller design patterns.
- MongoDB data modeling using Mongoose ODM.
- Managing asynchronous state and HTTP requests in React.
- Version control, Git/GitHub workflows, and full-stack cloud deployment.

---

## Future Enhancements

- User Authentication & Authorization (JWT)
- Drag-and-Drop Kanban Board Interface
- Task Due Date Notifications & Email Reminders
- Task Filtering, Sorting, and Search Functionality
- Dark / Light Mode Theme Toggle

---

## Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/Harshalaj123/Task_manager.git


### 2. Navigate to Project Directory
cd Task_manager

### 3. Start the Backend Server
cd backend
npm install
npx ts-node src/app.ts

### 4. Start the Frontend Application (in a new terminal)
cd frontend
npm install
npm run dev
---

