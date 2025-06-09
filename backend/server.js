const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const bcrypt = require("bcryptjs");

const app = express();
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// MongoDB Connection
mongoose
  .connect("mongodb://localhost:27017/nodueDB")
  .then(() => console.log("Connected to MongoDB ✅"))
  .catch((err) => console.error("MongoDB Connection Error ❌", err));

// Define Student Schema
const studentSchema = new mongoose.Schema({
  name: String,
  usn: { type: String, unique: true },
  password: String,
  email: String,
  pdf: {
    filename: String,
    path: String,
  },
  status: { type: String, default: "Pending" },
});

const Student = mongoose.model("Student", studentSchema);

// Student Registration Route
app.post("/students/register", async (req, res) => {
  try {
    const { name, usn, password, email } = req.body;
    const existingStudent = await Student.findOne({ usn });

    if (existingStudent) {
      return res
        .status(400)
        .json({ success: false, message: "USN already registered ❌" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newStudent = new Student({
      name,
      usn,
      password: hashedPassword,
      email,
    });

    await newStudent.save();
    res.json({ success: true, message: "Student registered successfully ✅" });
  } catch (error) {
    console.error("Registration Error ❌", error);
    res
      .status(500)
      .json({ success: false, message: "Server error during registration" });
  }
});

// Student Login Route
app.post("/students/login", async (req, res) => {
  try {
    const { usn, password } = req.body;
    const student = await Student.findOne({ usn });

    if (!student)
      return res.status(400).json({ success: false, message: "USN not found ❌" });

    const isMatch = await bcrypt.compare(password, student.password);

    if (!isMatch)
      return res.status(401).json({ success: false, message: "Incorrect password ❌" });

    res.json({ success: true, message: "Login successful ✅", student });
  } catch (error) {
    console.error("Login Error ❌", error);
    res
      .status(500)
      .json({ success: false, message: "Server error during login" });
  }
});

// Multer Storage for PDF Uploads
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

// PDF Upload Route
app.post("/upload", upload.single("pdf"), async (req, res) => {
  try {
    if (!req.file)
      return res
        .status(400)
        .json({ success: false, message: "No file uploaded ❌" });

    const { usn } = req.body;
    const updatedStudent = await Student.findOneAndUpdate(
      { usn },
      {
        pdf: { filename: req.file.filename, path: req.file.path },
        status: "Pending",
      },
      { new: true }
    );

    res.json({
      success: true,
      message: "PDF uploaded successfully ✅",
      updatedStudent,
    });
  } catch (error) {
    console.error("File Upload Error ❌", error);
    res
      .status(500)
      .json({ success: false, message: "Error uploading file" });
  }
});

// Update Student Status
app.post("/students/update/:id", async (req, res) => {
  try {
    const { status } = req.body;
    const updatedStudent = await Student.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    res.json({ success: true, message: "Status updated ✅", updatedStudent });
  } catch (error) {
    console.error("Status Update Error ❌", error);
    res
      .status(500)
      .json({ success: false, message: "Error updating status" });
  }
});

// Fetch All Students with PDFs and Status
app.get("/students/list", async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (error) {
    console.error("Error fetching students ❌", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch students" });
  }
});

// Handle Invalid Routes
app.use((req, res) => {
  res.status(404).json({ message: "Route Not Found ❌" });
});

// Start Server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} 🚀`);
});
