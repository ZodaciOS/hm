import React, { useState } from 'react';

function App() {
  const [key, setKey] = useState('');
  const [message, setMessage] = useState('');

  async function test() {
    const res = await fetch('http://localhost:5000/api/validate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key })
    });
    const data = await res.json();
    setMessage(data.message);
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h2>Test Key</h2>
      <input value={key} onChange={e => setKey(e.target.value)} placeholder="Enter key" />
      <button onClick={test}>Validate</button>
      {message && <p>{message}</p>}
    </div>
  );
}

export default App;