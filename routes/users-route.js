import express from 'express';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import store from '../lib/store.js';

const router = express.Router();

// POST /v1/api/users - create a user (persistent)
router.post('/', async (req, res) => {
  try {
    const { firstname, lastname, email, DOB, password } = req.body || {};
    if (!firstname || !lastname || !email || !password) {
      return res.status(400).json({ message: 'firstname, lastname, email and password are required' });
    }

    const existing = await store.getUserByEmail(email);
    if (existing) return res.status(409).json({ message: 'email already registered' });

    const hashed = await bcrypt.hash(password, 10);
    const user = {
      id: uuidv4(),
      firstname,
      lastname,
      email,
      DOB: DOB || null,
      password: hashed,
      created_at: new Date().toISOString(),
    };

    await store.createUser(user);
    // Do not return password
    const { password: _p, ...publicUser } = user;
    res.status(201).json({ message: 'user created', user: publicUser });
  } catch (err) {
    if (err && err.code === 'EEXISTS') return res.status(409).json({ message: 'email already exists' });
    console.error(err);
    res.status(500).json({ message: 'internal error' });
  }
});

// GET /v1/api/users/:id - fetch a user (persistent)
router.get('/:id', async (req, res) => {
  try {
    const user = await store.getUserById(req.params.id);
    if (!user) return res.status(404).json({ message: 'user not found' });
    const { password, ...publicUser } = user;
    res.json(publicUser);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'internal error' });
  }
});

export default router;
