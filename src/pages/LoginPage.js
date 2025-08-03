import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../auth/cognitoUtils';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { role } = await login(email, password);

      if (role === 'clinic_user') {
        navigate('/dashboard', { state: { role: 'clinic_user' } });
      } else if (role === 'internal_staff') {
        navigate('/dashboard', { state: { role: 'internal_staff' } });
      } else {
        setErr('Unauthorized role');
      }
    } catch (error) {
      setErr('Login failed: ' + error.message);
    }
  };

  return (
    <div>
      <h2>Login to MediSys</h2>
      <form onSubmit={handleSubmit}>
        <input type="email" placeholder="Email" onChange={e => setEmail(e.target.value)} required />
        <input type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} required />
        <button type="submit">Login</button>
      </form>
      {err && <p style={{ color: 'red' }}>{err}</p>}
    </div>
  );
}

export default LoginPage;
