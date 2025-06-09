const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  usn: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  status: { type: String, enum: ['Pending', 'Completed', 'Hold'], default: 'Pending' } // ✅ Added status
});

const Student = mongoose.model('Student', studentSchema);
module.exports = Student;
