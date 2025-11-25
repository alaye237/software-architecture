import express from 'express';

const router = express.Router();

// POST /v1/api/auth/login - simple login stub
router.post('/login', (req, res) => {
  const { email } = req.body || {};
  res.json({ message: 'login successful (stub)', token: 'stub-token', email });
});

export default router;
