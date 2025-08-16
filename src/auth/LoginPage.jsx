// src/LoginPage.jsx (JS, not TS)
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../services/authApi'; // Adjust path as needed

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  function validate() {
    const e = {};
    if (!email.trim()) e.email = 'Email is required';
    else if (!emailRegex.test(email)) e.email = 'Enter a valid email';
    if (!password) e.password = 'Password is required';
    else if (password.length < 8) e.password = 'Minimum 8 characters';
    return e;
  }

  async function handleSubmit(ev) {
    ev.preventDefault();
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length) return;

    setSubmitting(true);
    try {
      // placeholder until Cognito: this returns { idToken, accessToken, refreshToken, role }
      const res = await authApi.login(email, password, rememberMe);
      localStorage.setItem('idToken', res.idToken);
      localStorage.setItem('role', res.role || 'clinic_user');
      if (rememberMe) localStorage.setItem('refreshToken', res.refreshToken);
      navigate('/dashboard');
    } catch (err) {
      setErrors({ form: err.message || 'Invalid credentials' });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="h-screen relative overflow-hidden bg-gradient-to-br from-blue-500 via-blue-300 to-blue-100">
      <div className="relative z-10 min-h-screen flex flex-col lg:flex-row items-center justify-between px-6 py-12 lg:px-16">
        <div className="w-full lg:w-1/2 mb-12 lg:mb-0 text-black max-w-2xl">
          <h1 className="text-6xl lg:text-5xl font-bold mb-6 leading-tight">Welcome to MediSys</h1>
          <p className="text-lg lg:text-xl font-light opacity-90">
            Streamlined diagnostic report submission for clinics.
          </p>
        </div>

        <div className="w-full max-w-md">
          <div className="bg-white rounded-xl shadow-xl p-8">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-1">Login</h2>
              <p className="text-gray-600 text-sm">Use your clinic or staff account.</p>
            </div>

            {errors.form && (
              <div className="mb-4 text-sm text-red-700 bg-red-50 border border-red-200 p-2 rounded">
                {errors.form}
              </div>
            )}

            <form className="space-y-5" onSubmit={handleSubmit} noValidate>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                  className={`w-full px-4 py-2.5 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none ${
                    errors.email ? 'border-red-400' : 'border-gray-300'
                  }`} placeholder="mail@gmail.com" autoComplete="username" required
                  aria-invalid={!!errors.email} aria-describedby="email-error"
                />
                {errors.email && <div id="email-error" className="mt-1 text-xs text-red-600">{errors.email}</div>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input
                  type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                  className={`w-full px-4 py-2.5 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none ${
                    errors.password ? 'border-red-400' : 'border-gray-300'
                  }`} placeholder="Enter your password" autoComplete="current-password" required
                  aria-invalid={!!errors.password} aria-describedby="password-error"
                />
                {errors.password && <div id="password-error" className="mt-1 text-xs text-red-600">{errors.password}</div>}
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center">
                  <input id="remember" type="checkbox" checked={rememberMe}
                         onChange={(e) => setRememberMe(e.target.checked)} className="mr-2"/>
                  <span className="text-gray-700">Remember me</span>
                </label>
                <button type="button" className="text-blue-600 hover:underline">Forgot password?</button>
              </div>

              <button
                type="submit" disabled={submitting}
                className={`w-full text-white py-2.5 rounded-lg transition ${
                  submitting ? 'bg-blue-300 cursor-not-allowed' : 'bg-blue-700 hover:bg-blue-800'
                }`}
              >
                {submitting ? 'Signing in…' : 'LOGIN'}
              </button>
            </form>

            <div className="mt-6 text-center text-sm text-gray-500">
              Don’t have an account?{' '}
              <a href="/register" className="text-blue-600 hover:underline">Sign up here</a>
            </div>

            <div className="mt-4 text-center text-xs text-gray-400">
              © {new Date().getFullYear()} MediSys
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
