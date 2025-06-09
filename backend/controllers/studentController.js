// backend/controllers/studentController.js
const Student = require("../models/studentModel");

// Register student
const registerStudent = async (req, res) => {
  const { name, usn } = req.body;

  try {
    const newStudent = new Student({ name, usn });
    await newStudent.save();
    res.status(201).json({ message: "Student registered successfully", student: newStudent });
  } catch (err) {
    res.status(500).json({ error: "Error registering student" });
  }
};

// Get all students
const getAllStudents = async (req, res) => {
  try {
    const students = await Student.find();
    res.status(200).json(students);
  } catch (err) {
    res.status(500).json({ error: "Error fetching students" });
  }
};

module.exports = { registerStudent, getAllStudents };
