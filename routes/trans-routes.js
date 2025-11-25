import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import store from '../lib/store.js';

const router = express.Router();

// POST /v1/api/transactions - create a transaction (persistent)
router.post('/', async (req, res) => {
  try {
    const { card_id, user_id, amount, status, cardholder_name } = req.body || {};
    if (!card_id || !user_id || amount == null) {
      return res.status(400).json({ message: 'card_id, user_id and amount are required' });
    }

    // ensure user exists
    const user = await store.getUserById(user_id);
    if (!user) return res.status(404).json({ message: 'user not found' });

    const tx = {
      id: uuidv4(),
      card_id,
      user_id,
      amount: Number(amount),
      status: status || 'pending',
      cardholder_name: cardholder_name || null,
      created_at: new Date().toISOString(),
    };

    await store.createTransaction(tx);
    res.status(201).json({ message: 'transaction created', transaction: tx });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'internal error' });
  }
});

// GET /v1/api/transactions/user/:userId - get transactions for a user (persistent)
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const transactions = await store.getTransactionsByUser(userId);
    res.json({ userId, transactions });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'internal error' });
  }
});

export default router;
