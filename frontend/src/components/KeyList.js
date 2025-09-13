import React from 'react';

export default function KeyList({ keys, refresh, password }) {
  const handleRevoke = async (name) => {
    await fetch('http://localhost:3000/revoke-key', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', password },
      body: JSON.stringify({ name }),
    });
    refresh();
  };

  return (
    <div className="bg-white p-4 rounded shadow mb-4">
      <h2 className="font-bold mb-2">Active Keys</h2>
      {keys.length === 0 && <p>No active keys.</p>}
      <ul>
        {keys.map((key) => (
          <li key={key.name} className="flex justify-between mb-1">
            <span>{key.name} {key.expiresAt ? `(Expires: ${new Date(key.expiresAt).toLocaleDateString()})` : ''}</span>
            <button onClick={() => handleRevoke(key.name)} className="bg-red-500 text-white px-2 rounded">Revoke</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
