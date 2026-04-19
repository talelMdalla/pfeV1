import express from 'express';
import Certification from '../models/Certification';

const router = express.Router();

// Get all certifications
router.get('/', async (req, res) => {
  try {
    const certifications = await Certification.find().populate('user');
    res.json(certifications);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch certifications' });
  }
});

// Issue certification
router.post('/', async (req, res) => {
  try {
    const certification = new Certification(req.body);
    await certification.save();
    res.status(201).json(certification);
  } catch (error) {
    res.status(500).json({ error: 'Failed to issue certification' });
  }
});

export default router;