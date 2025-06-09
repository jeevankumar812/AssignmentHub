router.put("/students/:id/approve", async (req, res) => {
    try {
      const student = await Student.findById(req.params.id);
  
      if (!student) {
        return res.status(404).json({ error: "Student not found" });
      }
  
      // ✅ Toggle Approval Status
      student.approvedByFaculty = !student.approvedByFaculty;
      await student.save();
  
      res.status(200).json({ message: "Approval status updated", student });
    } catch (error) {
      console.error("Error updating approval status:", error);
      res.status(500).json({ error: "Server error" });
    }
  });
  