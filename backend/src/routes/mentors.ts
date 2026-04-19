import express from 'express';
import Mentor from '../models/Mentor';

const router = express.Router();

// Get all mentors
router.get('/', async (req, res) => {
  try {
    const mentors = await Mentor.find().populate('user');
    res.json(mentors);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch mentors' });
  }
});

// Assign mentor to student
router.post('/assign', async (req, res) => {
  try {
    const { studentId, mentorId } = req.body;
    // Logic to assign mentor
    res.json({ message: 'Mentor assigned successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to assign mentor' });
  }
});

export default router;