import React, { useState, useEffect } from 'react';
import KeyList from './KeyList';
import RevokedList from './RevokedList';
import TestKey from './TestKey';
import { createKey } from '../api/api';

export default function Dashboard() {
  const [keys, setKeys] = useState([]);
  const [revokedKeys, setRevokedKeys] = useState([]);
  const [newKeyName, setNewKeyName] = useState('');
  const [newKeyDuration, setNewKeyDuration] = useState('');

  const PASSWORD = '12345678';

  const fetchKeys = async () => {
    const res = await fetch('http://localhost:3000/keys', { headers: { password: PASSWORD } });
    const data = await res.json();
    setKeys(data.keys);
    const revokedRes = await fetch('http://localhost:3000/revoked-keys', { headers: { password: PASSWORD } });
    const revokedData = await revokedRes.json();
    setRevokedKeys(revokedData.revokedKeys);
  };

  const handleCreateKey = async () => {
    if (!newKeyName) return alert('Key name required');
    await createKey(newKeyName, parseInt(newKeyDuration), PASSWORD);
    setNewKeyName('');
    setNewKeyDuration('');
    fetchKeys();
  };

  useEffect(() => { fetchKeys(); }, []);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>

      <div className="bg-white p-4 rounded shadow mb-4">
        <h2 className="font-bold mb-2">Create Key</h2>
        <input
          type="text"
          placeholder="Key Name"
          value={newKeyName}
          onChange={(e) => setNewKeyName(e.target.value)}
          className="border p-2 rounded mr-2"
        />
        <input
          type="number"
          placeholder="Duration (days)"
          value={newKeyDuration}
          onChange={(e) => setNewKeyDuration(e.target.value)}
          className="border p-2 rounded mr-2 w-32"
        />
        <button onClick={handleCreateKey} className="bg-green-500 text-white px-3 py-1 rounded">Create</button>
      </div>

      <KeyList keys={keys} refresh={fetchKeys} password={PASSWORD} />
      <RevokedList keys={revokedKeys} refresh={fetchKeys} password={PASSWORD} />
      <TestKey />
    </div>
  );
}
