## 📘 AssignmentHub</h1>

## MERN Stack-Based Assignment Submission & Verification System
  Developed for <strong>Cloud Computing (BCS601)</strong> – VI Semester <br />
  Built by <strong>K Jeevan Kumar</strong> (USN: 4AL22CS067)


## 📌 Project Overview

**AssignmentHub** is a simple and efficient web application built using the **MERN Stack** that allows students to submit assignments and faculty members to verify those submissions.

The system ensures seamless communication between students and faculty by allowing:
- 🧑‍🎓 Students to upload their assignment PDFs
- 👩‍🏫 Faculty to review, verify, or hold assignments and track completion counts

> 🎯 Focus: Assignment flow management for **Cloud Computing (BCS601)**  
> 🧾 Files: PDF uploads only  
> 👥 Users: Student & Faculty modules

---

## 🖼️ Screenshots

| Page | Preview |
|------|---------|
| Student Registration | ![Student Register](./client/src/assets/screenshots/student-register.png) |
| Upload Assignment | ![Upload Assignment](./client/src/assets/screenshots/assignment-upload.png) |
| Faculty Login | ![Faculty Login](./client/src/assets/screenshots/faculty-login.png) |
| Faculty Dashboard | ![Faculty Dashboard](./client/src/assets/screenshots/faculty-dashboard.png) |

---

## 📑 Table of Contents

- [📌 Project Overview](#-project-overview)
- [🖼️ Screenshots](#-screenshots)
- [🚀 Features](#-features)
- [🔧 Tech Stack](#-tech-stack)
- [📁 Folder Structure](#-folder-structure)
- [⚙️ Installation & Run Guide](#️-installation--run-guide)


---

## 🚀 Features

### 👨‍🎓 Student Module

- Register & login using **USN**, **Name**, and **Password**
- Upload a single assignment file for **BCS601 (Cloud Computing)**
- View status of the assignment:  
  - 🕒 Pending  
  - ✅ Completed  
  - ⏸️ Held

### 👩‍🏫 Faculty Module

- Login with secure subject password
- View all uploaded assignments
- Preview submitted PDF files
- Mark assignments as:  
  - ✅ Completed  
  - ⏸️ Hold (rejected or needs resubmission)
- View live count of completed submissions

---

## 🔧 Tech Stack

### Frontend

- React.js  
- TailwindCSS  
- React Router  
- Axios  
- React Toastify

### Backend

- Node.js  
- Express.js  
- MongoDB (Mongoose)  
- JWT for authentication  
- Bcrypt for password encryption  
- Multer for file uploads (PDF)

---

## 📁 Folder Structure

```bash
AssignmentHub/
├── client/
│   ├── src/
│   │   ├── pages/
│   │   ├── components/
│   │   ├── services/
│   │   ├── context/
│   │   └── assets/screenshots/
│   └── public/
│
├── server/
│   ├── models/
│   ├── routes/
│   ├── controllers/
│   ├── middleware/
│   ├── uploads/         # Stores uploaded PDFs
│   └── config/
│
├── .env
├── package.json
└── README.md
```
## 🧪 Installation & Setup Guide

Follow these steps to install and run **AssignmentHub** locally.

---

### ⚙️ Prerequisites

- Node.js (v14+)
- MongoDB (local or cloud)
- Git

---

### 📥 Step 1 : Clone the Repository

```bash
git clone https://github.com/jeevankumar812/AssignmentHub.git
cd AssignmentHub
```

### 📥 Step 2 : Backend Setup
```bash
cd backend
npm install
```
### 📥 Step 3 : Setup Environment Variables
```bash
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
FACULTY_PASSWORD=your_faculty_password
```

### 📥 Step 4 : Start Backend Server
```bash
npm run server.js
```
**Backend will run at http://localhost:5000**

### 📥 Step 5 : Frontend Setup
```bash
cd client
npm install
npm run dev
```
**Frontend will run at http://localhost:5173**
---
