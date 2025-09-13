import React, { useState } from 'react';
export default function Login({onLogin}) {
  const [password,setPassword] = useState('');
  return (
    <div>
      <input type='password' value={password} onChange={e=>setPassword(e.target.value)} placeholder='Password'/>
      <button onClick={()=>{if(password==='12345678') onLogin()}}>Login</button>
    </div>
  );
}