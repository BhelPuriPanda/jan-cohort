import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';

export default function Signup() {
  const navigate = useNavigate();
  const [role, setRole] = useState('employee');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const indicatorRef = useRef(null);

  useEffect(() => {
    // Animate the toggle pill sliding
    if (indicatorRef.current) {
      if (role === 'employee') {
        indicatorRef.current.style.transform = 'translateX(0)';
      } else {
        indicatorRef.current.style.transform = 'translateX(100%)';
      }
    }
  }, [role]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Combine first and last name for backend
      const fullName = `${firstName} ${lastName}`.trim();
      
      const response = await authAPI.signup(fullName, email, password, role);
      
      // Store user data in localStorage
      localStorage.setItem('user', JSON.stringify({
        email: response.email,
        role: response.role,
      }));
      
      // Navigate to Login after successful signup
      navigate('/login');
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#0a0a0a] flex items-center justify-center p-4 md:p-8 font-sans relative overflow-hidden">
      
      {/* Background Ambient Glows */}
      <div className="fixed inset-0 pointer-events-none">
         <div className="absolute top-[-20%] left-[-10%] w-[60vw] h-[60vw] bg-teal-900/10 blur-[120px] rounded-full"></div>
         <div className="absolute bottom-[-20%] right-[-10%] w-[60vw] h-[60vw] bg-purple-900/10 blur-[120px] rounded-full"></div>
      </div>

      {/* --- THE MAIN CARD --- */}
      <main className="w-full max-w-5xl h-[850px] bg-white rounded-[2.5rem] shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2 relative z-10 animate-reveal">
        
        {/* LEFT SIDE: Visual (Different Image for Variety) */}
        <div className="relative w-full h-full hidden md:block overflow-hidden bg-black">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60 z-10"></div>
          
          {/* Brand Logo Overlay */}
          <div className="absolute top-10 left-0 right-0 z-20 flex justify-center">
             <span className="font-display font-bold text-4xl text-white tracking-tighter">C.</span>
          </div>

          <img 
            src="https://images.unsplash.com/photo-1614728263952-84ea256f9679?q=80&w=1908&auto=format&fit=crop" 
            alt="Future of Work" 
            className="w-full h-full object-cover opacity-90 hover:scale-105 transition-transform duration-[2s]"
          />
          
          {/* Bottom text overlay */}
          <div className="absolute bottom-12 left-12 right-12 z-20 text-white">
            <p className="text-sm font-mono uppercase tracking-widest opacity-70 mb-2">Join the Future</p>
            <h2 className="text-3xl font-display font-medium leading-tight">
              Unlock the full potential <br/> of your workforce.
            </h2>
          </div>
        </div>

        {/* RIGHT SIDE: Signup Form */}
        <div className="relative w-full h-full flex flex-col justify-center px-8 sm:px-16 lg:px-20 bg-white text-black">
          
          {/* Mobile Back Button */}
          <button 
             onClick={() => navigate('/')} 
             className="absolute top-8 left-8 text-gray-400 hover:text-black transition-colors md:hidden"
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </button>

          <div className="max-w-md w-full mx-auto">
            
            <h1 className="text-4xl font-display font-medium text-black mb-2">Create Account</h1>
            <p className="text-sm text-gray-500 mb-8">
              Already have an account? <button onClick={() => navigate('/login')} className="text-black font-semibold underline decoration-gray-300 hover:decoration-black underline-offset-4 transition-all">Log in</button>
            </p>

            {/* --- ROLE TOGGLE --- */}
            <div className="mb-8 p-1 bg-gray-100 rounded-full relative flex cursor-pointer">
              <div 
                ref={indicatorRef}
                className="absolute top-1 bottom-1 left-0 w-1/2 bg-white rounded-full shadow-sm transition-transform duration-300 ease-[0.2,1,0.3,1]"
              ></div>
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

            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* Name Fields (Grid) */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wide text-gray-900 ml-1">First Name</label>
                  <input 
                    type="text" 
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full px-6 py-4 rounded-2xl bg-white border border-gray-200 text-black placeholder-gray-400 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all"
                    placeholder="John"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wide text-gray-900 ml-1">Last Name</label>
                  <input 
                    type="text" 
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full px-6 py-4 rounded-2xl bg-white border border-gray-200 text-black placeholder-gray-400 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all"
                    placeholder="Doe"
                    required
                  />
                </div>
              </div>

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
                <label className="text-xs font-bold uppercase tracking-wide text-gray-900 ml-1">Password</label>
                <div className="relative">
                  <input 
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-6 py-4 rounded-2xl bg-white border border-gray-200 text-black placeholder-gray-400 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all pr-12"
                    placeholder="Create a password"
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
              <div className="flex items-center gap-3 ml-1 pt-2">
                 <div className="relative flex items-center">
                   <input type="checkbox" id="terms" required className="peer w-5 h-5 border-2 border-gray-300 rounded checked:bg-black checked:border-black transition-colors appearance-none cursor-pointer"/>
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
                {loading ? 'Creating Account...' : 'Create Account'}
              </button>

            </form>

          </div>
        </div>

      </main>
    </div>
  );
}