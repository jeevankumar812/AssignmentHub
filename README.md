# 📘 AssignmentHub – MERN Stack Project
---

## 🧭 Project Overview

**AssignmentHub** streamlines the assignment submission and verification process within academic institutions. It enables **students** to register and submit assignments, while **faculty** can validate submissions, track progress, and ensure students meet submission criteria before generating a "No Due" certificate.

Developed by **K Jeevan Kumar** as a 6th semester project for **Cloud Computing (BCS601)**.

---

## 📸 Project Screenshots

> Screenshots should be stored inside `client/src/assets/screenshots/`

| Description                   | Screenshot Preview                                |
|------------------------------|---------------------------------------------------|
| Student Registration Page    | ![Student Register](./client/src/assets/screenshots/student-register.png) |
| Assignment Upload Interface  | ![Upload Assignment](./client/src/assets/screenshots/assignment-upload.png) |
| Faculty Login Page           | ![Faculty Login](./client/src/assets/screenshots/faculty-login.png) |
| Faculty Dashboard            | ![Faculty Dashboard](./client/src/assets/screenshots/faculty-dashboard.png) |

---

## 📌 Table of Contents

| Section                          | Link                                      |
|----------------------------------|-------------------------------------------|
| 🚀 Features                      | [Click here](#-features)                  |
| 🔧 Technologies Used             | [Click here](#-technologies-used)         |
| 🏗️ Folder Structure             | [Click here](#-folder-structure)          |
| 🧪 How to Run Locally            | [Click here](#-how-to-run-locally)        |
| 📄 API Routes Overview           | [Click here](#-api-endpoints-overview)    |
| 👨‍💻 Author                      | [Click here](#-author)                    |

---

## 🚀 Features

### 👨‍🎓 Student Module

- Register/login using **USN**, **name**, and **password**
- Upload assignments for **Cloud Computing (BCS601)** only
- View submission status: *Pending*, *Held*, or *Completed*
- Download No Due Certificate once all tasks are accepted

### 👩‍🏫 Faculty Module

- Login using pre-configured subject credentials
- View list of submitted assignments
- Verify submissions:
  - ✅ **Mark as Completed**
  - ⏸️ **Hold Submission** if incorrect
- View real-time **assignment completion count**

---

## 🔧 Technologies Used

### Frontend

- React.js
- TailwindCSS
- React Router
- Axios
- Toastify

### Backend

- Node.js
- Express.js
- MongoDB (Mongoose)
- JWT Authentication
- Multer (File Upload)
- Bcrypt (Password Hashing)

---

## 🏗️ Folder Structure

