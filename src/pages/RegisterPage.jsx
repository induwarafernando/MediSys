import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function RegisterPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('clinic_user');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert('Passwords do not match.');
      return;
    }

    console.log('Registering with:', { email, password, role });
    alert(`Registration successful as ${role}! (Redirecting to login...)`);
    navigate('/login');
  };

  return (
    <div className="h-screen relative overflow-hidden">
      {/* Background Image with Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: 'url("https://minamedical.com.au/wpv1/wp-content/uploads/2020/12/our-team.jpg")'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-purple-700/80 to-blue-700/80" />
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col lg:flex-row items-center justify-between px-6 py-12 lg:px-16">
        {/* Left Text */}
        <div className="w-full lg:w-1/2 mb-12 lg:mb-0 text-white max-w-2xl">
          <h1 className="text-5xl font-bold mb-6 leading-tight">
            Create your MediSys account
          </h1>
          <p className="text-xl font-light opacity-90">
            Get started as a clinic partner or internal staff and manage diagnostic reports securely and efficiently.
          </p>
        </div>

        {/* Right Form */}
        <div className="w-full max-w-md">
          <div className="bg-white rounded-xl shadow-xl p-8">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-1">Register</h2>
              <p className="text-gray-600 text-sm">Create a new account below.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <select
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                >
                  <option value="clinic_user">Clinic User</option>
                  <option value="internal_staff">Internal Staff</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input
                  type="password"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                <input
                  type="password"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-green-600 text-white py-2.5 rounded-lg hover:bg-green-700 transition"
              >
                Create account
              </button>
            </form>

            <div className="mt-6 text-center text-sm text-gray-500">
              Already have an account?{' '}
              <a href="/login" className="text-blue-600 hover:underline">
                Sign in
              </a>
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

export default RegisterPage;
