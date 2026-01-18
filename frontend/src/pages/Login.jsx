import { useEffect, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { authAPI } from '../services/api';

export default function Login() {
  const navigator = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/jobs";
  const [role, setRole] = useState('employee');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Ref for the toggle animation
  const indicatorRef = useRef(null);

  useEffect(() => {
    // Clear any existing session to ensure clean login
    localStorage.removeItem('user');

    // Animate the toggle pill sliding
    if (indicatorRef.current) {
      if (role === 'employee') {
        indicatorRef.current.style.transform = 'translateX(0)';
        indicatorRef.current.style.width = '50%';
      } else {
        indicatorRef.current.style.transform = 'translateX(100%)';
        indicatorRef.current.style.width = '50%';
      }
    }
  }, [role]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authAPI.login(email, password, role);
      console.log('Login response:', response);
      localStorage.setItem('user', JSON.stringify({
        _id: response._id,
        email: response.email,
        role: response.role
      }));
      navigator(from, { replace: true });
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#0a0a0a] flex items-center justify-center p-4 md:p-8 font-sans relative overflow-hidden">

      {/* Background Ambient Glows (Matches your site theme) */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[60vw] h-[60vw] bg-teal-900/10 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[60vw] h-[60vw] bg-purple-900/10 blur-[120px] rounded-full"></div>
      </div>

      {/* --- THE MAIN CARD --- */}
      <main className="w-full max-w-5xl h-[750px] bg-white rounded-[2.5rem] shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2 relative z-10 animate-reveal">

        {/* LEFT SIDE: Visual  */}
        <div className="relative w-full h-full hidden md:block overflow-hidden bg-black">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60 z-10"></div>

          {/* Brand Logo Overlay */}
          <div className="absolute top-10 left-0 right-0 z-20 flex justify-center">
            <span className="font-display font-bold text-4xl text-white tracking-tighter">C.</span>
          </div>

          <img
            // High-quality Unsplash image matching your "VR Red/Blue" reference
            src="https://images.unsplash.com/photo-1622979135225-d2ba269fb1bd?q=80&w=2000&auto=format&fit=crop"
            alt="Immersive Experience"
            className="w-full h-full object-cover opacity-90 hover:scale-105 transition-transform duration-[2s]"
          />

          {/* Bottom text overlay */}
          <div className="absolute bottom-12 left-12 right-12 z-20 text-white">
            <p className="text-sm font-mono uppercase tracking-widest opacity-70 mb-2">Clarity Intelligence</p>
            <h2 className="text-3xl font-display font-medium leading-tight">
              See the unseen in your <br /> hiring data.
            </h2>
          </div>
        </div>

        {/* RIGHT SIDE: Login Form */}
        <div className="relative w-full h-full flex flex-col justify-center px-8 sm:px-16 lg:px-20 bg-white text-black">

          {/* Mobile Back Button */}
          <button
            onClick={() => navigate('/')}
            className="absolute top-8 left-8 text-gray-400 hover:text-black transition-colors md:hidden"
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </button>

          <div className="max-w-md w-full mx-auto">

            <h1 className="text-4xl font-display font-medium text-black mb-2">Log in</h1>
            <p className="text-sm text-gray-500 mb-10">
              Don't have an account? <button onClick={() => navigate('/signup')} className="text-black font-semibold underline decoration-gray-300 hover:decoration-black underline-offset-4 transition-all">Create an Account</button>
            </p>

            {/* --- ROLE TOGGLE --- */}
            <div className="mb-8 p-1 bg-gray-100 rounded-full relative flex cursor-pointer">
              {/* Sliding Background */}
              <div
                ref={indicatorRef}
                className="absolute top-1 bottom-1 left-0 w-1/2 bg-white rounded-full shadow-sm transition-transform duration-300 ease-[0.2,1,0.3,1]"
              ></div>

              {/* Buttons */}
              <button
                onClick={() => setRole('employee')}
                className={`relative z-10 w-1/2 py-2.5 text-xs font-mono uppercase tracking-widest transition-colors duration-300 ${role === 'employee' ? 'text-black font-bold' : 'text-gray-500 hover:text-gray-700'}`}
              >
                Employee
              </button>
              <button
                onClick={() => setRole('recruiter')}
                className={`relative z-10 w-1/2 py-2.5 text-xs font-mono uppercase tracking-widest transition-colors duration-300 ${role === 'recruiter' ? 'text-black font-bold' : 'text-gray-500 hover:text-gray-700'}`}
              >
                Recruiter
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">

              {/* Email Input */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wide text-gray-900 ml-1">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-6 py-4 rounded-2xl bg-white border border-gray-200 text-black placeholder-gray-400 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all"
                  placeholder="john@example.com"
                  required
                />
              </div>

              {/* Password Input */}
              <div className="space-y-2 relative">
                <div className="flex justify-between ml-1">
                  <label className="text-xs font-bold uppercase tracking-wide text-gray-900">Password</label>
                  <a href="#" className="text-xs text-gray-500 hover:text-black transition-colors">Forgot Password?</a>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-6 py-4 rounded-2xl bg-white border border-gray-200 text-black placeholder-gray-400 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all pr-12"
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black transition-colors"
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      {showPassword ? 'visibility_off' : 'visibility'}
                    </span>
                  </button>
                </div>
              </div>

              {/* Terms Checkbox */}
              <div className="flex items-center gap-3 ml-1">
                <div className="relative flex items-center">
                  <input type="checkbox" id="terms" className="peer w-5 h-5 border-2 border-gray-300 rounded checked:bg-black checked:border-black transition-colors appearance-none cursor-pointer" />
                  <span className="material-symbols-outlined absolute text-white text-sm pointer-events-none opacity-0 peer-checked:opacity-100 left-0.5">check</span>
                </div>
                <label htmlFor="terms" className="text-xs text-gray-600 cursor-pointer select-none">
                  I agree to the <a href="#" className="font-bold text-black hover:underline">Terms & Conditions</a>
                </label>
              </div>

              {/* Error message */}
              {error && (
                <div className="text-red-500 text-sm font-mono">{error}</div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-black text-white rounded-full font-medium hover:bg-gray-800 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 shadow-lg shadow-black/20 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Logging in...' : 'Log in'}
              </button>

            </form>

          </div>
        </div>

      </main>
    </div>
  );
}