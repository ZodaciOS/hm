import React from 'react';

export default function RevokedList({ keys, refresh, password }) {
  const handleRecover = async (name) => {
    await fetch('http://localhost:3000/recover-key', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', password },
      body: JSON.stringify({ name }),
    });
    refresh();
  };

  return (
    <div className="bg-white p-4 rounded shadow mb-4">
      <h2 className="font-bold mb-2">Revoked Keys</h2>
      {keys.length === 0 && <p>No revoked keys.</p>}
      <ul>
        {keys.map((key) => (
          <li key={key.name} className="flex justify-between mb-1">
            <span>{key.name}</span>
            <button onClick={() => handleRecover(key.name)} className="bg-blue-500 text-white px-2 rounded">Recover</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
