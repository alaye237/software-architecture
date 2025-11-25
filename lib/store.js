import { promises as fs } from 'fs';
import { join } from 'path';

const dataDir = join(process.cwd(), 'data');
const usersFile = join(dataDir, 'users.json');
const txFile = join(dataDir, 'transactions.json');

async function ensureFiles() {
  try {
    await fs.mkdir(dataDir, { recursive: true });
    await fs.access(usersFile).catch(() => fs.writeFile(usersFile, '[]'));
    await fs.access(txFile).catch(() => fs.writeFile(txFile, '[]'));
  } catch (err) {
    throw err;
  }
}

async function readJson(file) {
  const raw = await fs.readFile(file, 'utf8');
  return JSON.parse(raw || '[]');
}

async function writeJson(file, data) {
  const tmp = file + '.tmp';
  await fs.writeFile(tmp, JSON.stringify(data, null, 2));
  await fs.rename(tmp, file);
}

export async function createUser(user) {
  await ensureFiles();
  const users = await readJson(usersFile);
  if (users.find(u => u.email === user.email)) {
    const e = new Error('Email already exists');
    e.code = 'EEXISTS';
    throw e;
  }
  users.push(user);
  await writeJson(usersFile, users);
  return user;
}

export async function getUserById(id) {
  await ensureFiles();
  const users = await readJson(usersFile);
  return users.find(u => u.id === id) || null;
}

export async function getUserByEmail(email) {
  await ensureFiles();
  const users = await readJson(usersFile);
  return users.find(u => u.email === email) || null;
}

export async function createTransaction(tx) {
  await ensureFiles();
  const txs = await readJson(txFile);
  txs.push(tx);
  await writeJson(txFile, txs);
  return tx;
}

export async function getTransactionsByUser(userId) {
  await ensureFiles();
  const txs = await readJson(txFile);
  return txs.filter(t => t.user_id === userId);
}

export default {
  createUser,
  getUserById,
  getUserByEmail,
  createTransaction,
  getTransactionsByUser,
};
