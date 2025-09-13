require('dotenv').config();
const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

const app = express();
app.use(cors());
app.use(express.json());

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || '12345678';

const limiter = rateLimit({ windowMs: 15*60*1000, max: 100 });
app.use(limiter);

let keys = [];
let revokedKeys = [];

function authMiddleware(req, res, next) {
  const { password } = req.headers;
  if (password !== ADMIN_PASSWORD) return res.status(401).json({ error: 'Unauthorized' });
  next();
}

app.get('/', (req, res) => res.send('Key system backend running!'));

app.post('/test-key', (req, res) => {
  const { key } = req.body;
  const keyObj = keys.find(k => k.name === key && !k.used && (!k.expiresAt || new Date(k.expiresAt) > new Date()));
  if (keyObj) { keyObj.used = true; res.json({ message: 'hello there' }); }
  else { res.json({ message: 'shut up' }); }
});

app.post('/create-key', authMiddleware, (req, res) => {
  const { name, durationDays } = req.body;
  if (!name) return res.status(400).json({ error: 'Key name required' });
  let expiresAt = null;
  if (durationDays) expiresAt = new Date(Date.now() + durationDays*24*60*60*1000);
  keys.push({ name, used: false, expiresAt });
  res.json({ message: 'Key created', key: { name, expiresAt } });
});

app.post('/revoke-key', authMiddleware, (req, res) => {
  const { name } = req.body;
  const index = keys.findIndex(k => k.name === name);
  if (index === -1) return res.status(404).json({ error: 'Key not found' });
  revokedKeys.push(keys[index]);
  keys.splice(index,1);
  res.json({ message: 'Key revoked' });
});

app.post('/recover-key', authMiddleware, (req, res) => {
  const { name } = req.body;
  const index = revokedKeys.findIndex(k => k.name === name);
  if (index === -1) return res.status(404).json({ error: 'Key not found' });
  keys.push(revokedKeys[index]);
  revokedKeys.splice(index,1);
  res.json({ message: 'Key recovered' });
});

app.post('/extend-key', authMiddleware, (req,res)=>{
  const { name, days } = req.body;
  const keyObj = keys.find(k=>k.name===name);
  if(!keyObj) return res.status(404).json({error:'Key not found'});
  if(!days) return res.status(400).json({error:'Days required'});
  keyObj.expiresAt = keyObj.expiresAt ? new Date(keyObj.expiresAt.getTime()+days*24*60*60*1000) : new Date(Date.now()+days*24*60*60*1000);
  res.json({message:'Key extended', key:keyObj});
});

app.post('/shorten-key', authMiddleware, (req,res)=>{
  const { name, days } = req.body;
  const keyObj = keys.find(k=>k.name===name);
  if(!keyObj) return res.status(404).json({error:'Key not found'});
  if(!days) return res.status(400).json({error:'Days required'});
  keyObj.expiresAt = keyObj.expiresAt ? new Date(keyObj.expiresAt.getTime()-days*24*60*60*1000) : new Date(Date.now()-days*24*60*60*1000);
  res.json({message:'Key shortened', key:keyObj});
});

app.get('/keys', authMiddleware, (req,res)=>res.json({keys}));
app.get('/revoked-keys', authMiddleware, (req,res)=>res.json({revokedKeys}));

const PORT = process.env.PORT || 3000;
app.listen(PORT,()=>console.log(`Backend running on port ${PORT}`));