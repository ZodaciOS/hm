import React, { useState } from 'react';

export default function TestKey() {
  const [key, setKey] = useState('');
  const [result, setResult] = useState('');

  const handleTest = async () => {
    const res = await fetch('http://localhost:3000/test-key', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key }),
    });
    const data = await res.json();
    setResult(data.message);
  };

  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="font-bold mb-2">Test Key</h2>
      <input
        type="text"
        value={key}
        onChange={(e) => setKey(e.target.value)}
        placeholder="Enter key"
        className="border p-2 rounded mr-2"
      />
      <button onClick={handleTest} className="bg-purple-500 text-white px-3 py-1 rounded">Test</button>
      {result && <p className="mt-2">Result: {result}</p>}
    </div>
  );
}
