import { useState } from 'react';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Login attempted with:', { email, password, rememberMe });
    alert('Login successful! (This would navigate to dashboard)');
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
        <div className="absolute inset-0 bg-gradient-to-r from-blue-700/70 to-purple-700/70" />
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col lg:flex-row items-center justify-between px-6 py-12 lg:px-16">
        {/* Left Text */}
        <div className="w-full lg:w-1/2 mb-12 lg:mb-0 text-black max-w-2xl">
          <h1 className="text-6xl lg:text-5xl font-bold mb-6 leading-tight">
            Welcome to MediSys
          </h1>
          <p className="text-lg lg:text-xl font-light opacity-90">
            Streamline the way your clinics submit and manage diagnostic reports securely and efficiently. Trusted by healthcare professionals.
          </p>
        </div>

        {/* Right Form */}
        <div className="w-full max-w-md">
          <div className="bg-white rounded-xl shadow-xl p-8">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-1">Login</h2>
              <p className="text-gray-600 text-sm">Please login to your account.</p>
            </div>

            <form className="space-y-5" onSubmit={handleSubmit}>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="mail@gmail.com"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="Enter your password"
                  required
                />
              </div>

              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center">
                  <input
                    id="remember"
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="mr-2"
                  />
                  <label htmlFor="remember" className="text-gray-700">Remember me</label>
                </div>
                <button type="button" className="text-blue-600 hover:underline">
                  Forgot your password?
                </button>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-700 text-white py-2.5 rounded-lg hover:bg-blue-800 transition"
              >
                LOGIN
              </button>
            </form>

            <div className="mt-6 text-center text-sm text-gray-500">
              Don’t have an account?{' '}
              <a href="/register" className="text-blue-600 hover:underline">
                Sign up here
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

export default LoginPage;
