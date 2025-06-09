const express = require('express');
const bcrypt = require('bcryptjs');
const Student = require('../models/Student'); 
const router = express.Router();

// 📌 Student Registration
router.post('/register', async (req, res) => {
  const { name, usn, email, password } = req.body;

  try {
    if (!name || !usn || !email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const existingStudent = await Student.findOne({ $or: [{ usn }, { email }] });
    if (existingStudent) {
      return res.status(400).json({ error: 'USN or Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newStudent = new Student({ name, usn, email, password: hashedPassword });

    await newStudent.save();
    res.status(201).json({ message: 'Student registered successfully' });

  } catch (error) {
    console.error('Error registering student:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// 📌 Student Login
router.post('/login', async (req, res) => {
  const { usn, password } = req.body;

  try {
    const student = await Student.findOne({ usn });
    if (!student) {
      return res.status(400).json({ error: 'Invalid USN or Password' });
    }

    const isMatch = await bcrypt.compare(password, student.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid USN or Password' });
    }

    res.status(200).json({ message: 'Login successful', student });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// 📌 Check if Student is Already Registered
router.get('/check/:usn', async (req, res) => {
  try {
    const student = await Student.findOne({ usn });
    res.json({ exists: !!student });
  } catch (error) {
    console.error('Error checking student:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// 📌 Fetch Registered Students (Faculty Dashboard)
router.get('/list', async (req, res) => {
  try {
    const students = await Student.find({}, 'name usn email status'); // ✅ Include status
    res.status(200).json(students);
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// 📌 Update Student Status
router.post('/update/:id', async (req, res) => {
  const { status } = req.body;

  if (!['Pending', 'Completed', 'Hold'].includes(status)) {
    return res.status(400).json({ error: 'Invalid status' });
  }

  try {
    const student = await Student.findByIdAndUpdate(req.params.id, { status }, { new: true });

    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    res.json({ message: 'Status updated successfully', student });
  } catch (error) {
    console.error('Error updating student status:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
