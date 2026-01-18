import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, DollarSign, Briefcase, Clock, Filter, Grid, List, Heart, X, CheckCircle, ChevronDown, Bell, LogOut, Info, User, FileText, FilePlus } from 'lucide-react';
import { generateJobs } from '../../utils/mockData';

// --- CUSTOM HOOK: Debounce ---
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

// --- SUB-COMPONENT: Match Score Ring ---
const MatchRing = ({ score }) => {
  const radius = 18;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  // Color logic based on score
  const color = score > 90 ? 'text-teal-400' : score > 75 ? 'text-blue-400' : 'text-yellow-400';

  return (
    <div className="relative w-12 h-12 flex items-center justify-center">
      <svg className="transform -rotate-90 w-12 h-12">
        <circle cx="24" cy="24" r={radius} stroke="currentColor" strokeWidth="3" fill="transparent" className="text-white/10" />
        <circle cx="24" cy="24" r={radius} stroke="currentColor" strokeWidth="3" fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className={`${color} transition-all duration-1000 ease-out`}
          strokeLinecap="round"
        />
      </svg>
      <span className="absolute text-[10px] font-bold text-white">{score}%</span>
    </div>
  );
};

// --- MAIN DASHBOARD ---
export default function JobDashboard() {
  const navigate = useNavigate();
  // State
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [allJobs, setAllJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [savedJobs, setSavedJobs] = useState(() => {
    const saved = localStorage.getItem('claritySavedJobs');
    return saved ? JSON.parse(saved) : [];
  });

  // User State for Header
  const [user, setUser] = useState(null);
  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (e) {
        console.error('Error parsing user data:', e);
      }
    }
  }, []);

  const getUserInitials = () => {
    if (user?.name) return user.name.charAt(0).toUpperCase();
    if (user?.email) return user.email.charAt(0).toUpperCase();
    return 'U';
  };

  const getUserDisplayName = () => {
    if (user?.name) return user.name;
    if (user?.email) return user.email.split('@')[0];
    return 'User';
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  // Filters State
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 300);

  const [filters, setFilters] = useState({
    minSalary: 0,
    maxExperience: 10,
    jobTypes: [], // ['Full-time', 'Remote']
    locations: [],
    sortBy: 'match' // 'match', 'salary', 'date'
  });

  // 1. Load Data (Simulated API)
  useEffect(() => {
    setTimeout(() => {
      setAllJobs(generateJobs(60));
      setLoading(false);
    }, 800);
  }, []);

  // 2. Persist Saved Jobs
  useEffect(() => {
    localStorage.setItem('claritySavedJobs', JSON.stringify(savedJobs));
  }, [savedJobs]);

  const toggleSave = (id) => {
    setSavedJobs(prev => prev.includes(id) ? prev.filter(j => j !== id) : [...prev, id]);
  };

  // 3. Filter & Sort Logic (The Core Brain)
  const filteredJobs = useMemo(() => {
    let result = allJobs.filter(job => {
      // Search
      const matchesSearch = job.title.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        job.company.toLowerCase().includes(debouncedSearch.toLowerCase());

      // Salary (Annual)
      const matchesSalary = job.salary >= filters.minSalary;

      // Experience
      const matchesExp = job.experience <= filters.maxExperience;

      // Job Type
      const matchesType = filters.jobTypes.length === 0 ||
        (filters.jobTypes.includes('Remote') && job.isRemote) ||
        filters.jobTypes.includes(job.type);

      return matchesSearch && matchesSalary && matchesExp && matchesType;
    });

    // Sorting
    return result.sort((a, b) => {
      if (filters.sortBy === 'salary') return b.salary - a.salary;
      if (filters.sortBy === 'date') return new Date(b.postedDate) - new Date(a.postedDate);
      return b.matchScore - a.matchScore; // Default: Match Score
    });
  }, [allJobs, debouncedSearch, filters]);

  // --- RENDER HELPERS ---

  const FilterSection = () => (
    <div className="space-y-8">
      {/* Experience Slider */}
      <div>
        <div className="flex justify-between mb-2">
          <h3 className="text-sm font-mono uppercase tracking-widest text-gray-400">Max Experience</h3>
          <span className="text-teal-400 font-bold">{filters.maxExperience} Years</span>
        </div>
        <input
          type="range" min="0" max="20"
          value={filters.maxExperience}
          onChange={(e) => setFilters({ ...filters, maxExperience: Number(e.target.value) })}
          className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-teal-500"
        />
      </div>

      {/* Salary Slider */}
      <div>
        <div className="flex justify-between mb-2">
          <h3 className="text-sm font-mono uppercase tracking-widest text-gray-400">Min Salary</h3>
          <span className="text-teal-400 font-bold">${(filters.minSalary / 1000).toFixed(0)}k+</span>
        </div>
        <input
          type="range" min="0" max="200000" step="10000"
          value={filters.minSalary}
          onChange={(e) => setFilters({ ...filters, minSalary: Number(e.target.value) })}
          className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-teal-500"
        />
      </div>

      {/* Job Type Tags */}
      <div>
        <h3 className="text-sm font-mono uppercase tracking-widest text-gray-400 mb-4">Job Type</h3>
        <div className="flex flex-wrap gap-2">
          {['Full-time', 'Contract', 'Part-time', 'Remote'].map(type => (
            <button
              key={type}
              onClick={() => {
                const newTypes = filters.jobTypes.includes(type)
                  ? filters.jobTypes.filter(t => t !== type)
                  : [...filters.jobTypes, type];
                setFilters({ ...filters, jobTypes: newTypes });
              }}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${filters.jobTypes.includes(type)
                ? 'bg-teal-500/20 border-teal-500 text-teal-300'
                : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/30'
                }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans selection:bg-teal-500 selection:text-black relative overflow-x-hidden">

      {/* Background Ambient Glows */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-teal-900/10 blur-[100px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-purple-900/10 blur-[100px] rounded-full"></div>
      </div>

      {/* --- HEADER --- */}
      <header className="sticky top-0 z-40 bg-black/60 backdrop-blur-md border-b border-white/5 px-6 py-4 transition-all duration-300">
        <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <h1 className="text-2xl font-display font-bold tracking-tighter">
            Clarity<span className="text-teal-500">Jobs.</span>
          </h1>

          <div className="flex-1 max-w-xl w-full relative group">
            <Search className="absolute left-4 top-3.5 text-gray-500 w-5 h-5 group-focus-within:text-teal-400 transition-colors" />
            <input
              type="text"
              placeholder="Search by role, company, or stack..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-full py-3 pl-12 pr-4 text-sm focus:outline-none focus:border-teal-500/50 transition-all"
            />
          </div>

          <div className="flex items-center gap-4">

            {/* Role-Based Quick Actions */}
            {user?.role === 'employer' && (
              <button
                onClick={() => navigate('/jd-generator')}
                className="hidden md:flex items-center gap-2 bg-teal-500/10 text-teal-400 border border-teal-500/20 px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-teal-500/20 transition-all"
              >
                <FilePlus size={14} />
                Generate JD
              </button>
            )}

            {user?.role === 'employee' && (
              <button
                onClick={() => navigate('/resume-parser')}
                className="hidden md:flex items-center gap-2 bg-purple-500/10 text-purple-400 border border-purple-500/20 px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-purple-500/20 transition-all"
              >
                <FileText size={14} />
                Optimize Resume
              </button>
            )}

            {/* Notifications Icon */}
            <button className="relative p-2 text-gray-400 hover:text-white transition-colors">
              <Bell className="w-5 h-5" />
            </button>

            {/* User Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-2 hover:bg-white/5 p-1.5 rounded-full transition-colors outline-none"
              >
                {user ? (
                  <>
                    <div className="w-10 h-10 rounded-full border border-gray-700 bg-gradient-to-br from-teal-500/20 to-teal-600/20 flex items-center justify-center overflow-hidden">
                      {user.email ? (
                        <span className="text-sm font-semibold text-teal-400">{getUserInitials()}</span>
                      ) : (
                        <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                          <span className="text-xs text-white">{getUserInitials()}</span>
                        </div>
                      )}
                    </div>
                    <span className="hidden lg:block text-sm text-gray-400 font-sans">{getUserDisplayName()}</span>
                    <ChevronDown size={14} className={`text-gray-500 transition-transform duration-300 ${showProfileMenu ? 'rotate-180' : ''}`} />
                  </>
                ) : (
                  <div className="w-10 h-10 rounded-full border border-gray-700 bg-gray-800 flex items-center justify-center">
                    <span className="text-xs text-gray-500">U</span>
                  </div>
                )}
              </button>

              <AnimatePresence>
                {showProfileMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 top-full mt-2 w-48 bg-[#111] border border-white/10 rounded-xl shadow-xl shadow-black/50 overflow-hidden z-50 backdrop-blur-xl"
                  >
                    <div className="p-1 space-y-0.5">
                      <div className="px-3 py-2 border-b border-white/5 mb-1">
                        <p className="text-xs text-gray-500 uppercase tracking-wider">Signed in as</p>
                        <p className="text-sm text-white font-medium truncate">{user?.name || user?.email || 'Guest'}</p>
                      </div>

                      <button className="flex items-center gap-3 w-full px-3 py-2 text-sm text-gray-300 hover:bg-white/5 hover:text-white rounded-lg transition-colors text-left group">
                        <Info size={16} className="text-gray-500 group-hover:text-teal-400 transition-colors" />
                        About
                      </button>

                      <div className="h-px bg-white/5 my-1" />

                      <button onClick={handleLogout} className="flex items-center gap-3 w-full px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded-lg transition-colors text-left group">
                        <LogOut size={16} className="text-red-400/70 group-hover:text-red-400 transition-colors" />
                        Logout
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </header>

      {/* --- CONTROLS BAR (Search, Sort, View) --- */}
      <div className="relative z-10 pt-8 px-6 max-w-[1600px] mx-auto flex flex-col md:flex-row items-center justify-between gap-4">

        {/* Left: Title Context */}
        <div className="flex-1">
          <h2 className="text-xl text-gray-400 font-light">
            Find your next <span className="text-teal-400 font-bold">opportunity</span>
          </h2>
        </div>

        <div className="flex items-center gap-4 w-full md:w-auto justify-end">

          {/* View Toggle */}
          <div className="hidden md:flex bg-white/5 p-1 rounded-lg border border-white/5">
            <button onClick={() => setViewMode('grid')} className={`p-2 rounded ${viewMode === 'grid' ? 'bg-white/10 text-white' : 'text-gray-500'}`}>
              <Grid size={18} />
            </button>
            <button onClick={() => setViewMode('list')} className={`p-2 rounded ${viewMode === 'list' ? 'bg-white/10 text-white' : 'text-gray-500'}`}>
              <List size={18} />
            </button>
          </div>

          {/* Sort Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowSortMenu(!showSortMenu)}
              className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-lg py-2.5 px-4 text-sm hover:bg-white/10 transition-colors min-w-[160px] justify-between"
            >
              <span className="text-gray-300">
                {filters.sortBy === 'match' && 'Sort by Match'}
                {filters.sortBy === 'salary' && 'Sort by Salary'}
                {filters.sortBy === 'date' && 'Sort by Date'}
              </span>
              <ChevronDown size={14} className={`text-gray-500 transition-transform duration-300 ${showSortMenu ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
              {showSortMenu && (
                <motion.div
                  initial={{ opacity: 0, y: 5, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 5, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-full mt-2 w-full bg-[#111] border border-white/10 rounded-xl shadow-xl shadow-black/50 overflow-hidden z-50 backdrop-blur-xl"
                >
                  <div className="p-1 space-y-0.5">
                    {[
                      { value: 'match', label: 'Match Score' },
                      { value: 'salary', label: 'Salary (High-Low)' },
                      { value: 'date', label: 'Date Posted' }
                    ].map((option) => (
                      <button
                        key={option.value}
                        onClick={() => {
                          setFilters({ ...filters, sortBy: option.value });
                          setShowSortMenu(false);
                        }}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center justify-between group ${filters.sortBy === option.value
                          ? 'bg-teal-500/10 text-teal-400'
                          : 'text-gray-400 hover:bg-white/5 hover:text-white'
                          }`}
                      >
                        {option.label}
                        {filters.sortBy === option.value && (
                          <CheckCircle size={14} className="text-teal-400" />
                        )}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Mobile Filter Toggle */}
          <button
            onClick={() => setShowMobileFilters(true)}
            className="md:hidden p-2 text-gray-300 hover:text-white"
          >
            <Filter />
          </button>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-4 py-8 flex gap-8">

        {/* --- SIDEBAR (Desktop) --- */}
        <aside className="hidden md:block w-72 shrink-0 sticky top-32 h-fit max-h-[calc(100vh-100px)] overflow-y-auto custom-scrollbar bg-[#111]/80 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl shadow-black/50">
          <div className="flex items-center gap-3 mb-8 pb-4 border-b border-white/5">
            <div className="p-2 bg-teal-500/10 rounded-lg text-teal-400">
              <Filter size={20} />
            </div>
            <span className="text-sm font-display font-bold tracking-wide">SMART FILTERS</span>
          </div>
          <FilterSection />
        </aside>

        {/* --- MOBILE DRAWER --- */}
        <AnimatePresence>
          {showMobileFilters && (
            <>
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                onClick={() => setShowMobileFilters(false)}
                className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 md:hidden"
              />
              <motion.div
                initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
                className="fixed right-0 top-0 h-full w-80 bg-[#0F0F0F] z-50 p-6 border-l border-white/10 shadow-2xl overflow-y-auto"
              >
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-xl font-display font-bold">Filters</h2>
                  <button onClick={() => setShowMobileFilters(false)}><X /></button>
                </div>
                <FilterSection />
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* --- MAIN GRID --- */}
        <main className="flex-1 min-h-[500px]">

          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-gray-400 font-light">
              Showing <span className="text-white font-bold">{filteredJobs.length}</span> opportunities
            </h2>
            {filters.jobTypes.length > 0 && (
              <button
                onClick={() => setFilters({ ...filters, jobTypes: [] })}
                className="text-xs text-red-400 hover:underline"
              >
                Clear Filters
              </button>
            )}
          </div>

          {loading ? (
            // SKELETON LOADING
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="h-64 rounded-2xl bg-white/5 animate-pulse" />
              ))}
            </div>
          ) : (
            <motion.div
              layout
              className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}
            >
              <AnimatePresence>
                {filteredJobs.map((job) => (
                  <JobCard
                    key={job.id}
                    job={job}
                    viewMode={viewMode}
                    isSaved={savedJobs.includes(job.id)}
                    onSave={() => toggleSave(job.id)}
                  />
                ))}
              </AnimatePresence>
            </motion.div>
          )}

          {filteredJobs.length === 0 && !loading && (
            <div className="text-center py-20">
              <div className="inline-block p-4 rounded-full bg-white/5 mb-4 text-gray-500">
                <Search size={32} />
              </div>
              <h3 className="text-xl font-medium text-white">No matches found</h3>
              <p className="text-gray-500 mt-2">Try adjusting your filters or salary range.</p>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}

// --- JOB CARD COMPONENT ---
const JobCard = ({ job, viewMode, isSaved, onSave }) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      className={`
        group relative bg-[#0A0A0A] border border-white/5 hover:border-teal-500/30 
        rounded-2xl p-6 transition-all duration-300 hover:shadow-[0_0_30px_rgba(45,212,191,0.05)]
        ${viewMode === 'list' ? 'flex items-center gap-6' : 'flex flex-col'}
      `}
    >
      {/* Top Section: Score & Save */}
      <div className={`flex justify-between items-start ${viewMode === 'list' ? 'order-3 ml-auto' : 'w-full mb-4'}`}>
        <div className="flex flex-col items-center">
          <MatchRing score={job.matchScore} />
          <span className="text-[10px] text-gray-500 uppercase mt-1">Match</span>
        </div>
        <button
          onClick={(e) => { e.stopPropagation(); onSave(); }}
          className="p-2 rounded-full hover:bg-white/10 transition-colors"
        >
          <Heart size={20} className={isSaved ? "fill-red-500 text-red-500" : "text-gray-500"} />
        </button>
      </div>

      {/* Main Info */}
      <div className={`${viewMode === 'list' ? 'flex-1' : ''}`}>
        <div className="flex items-center gap-2 mb-1">
          <h3 className="text-lg font-bold text-white group-hover:text-teal-400 transition-colors">{job.title}</h3>
          {job.isRemote && (
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-purple-500/10 text-purple-400 border border-purple-500/20">REMOTE</span>
          )}
        </div>
        <p className="text-gray-400 text-sm mb-4">{job.company}</p>

        {/* Metadata Badges */}
        <div className="flex flex-wrap gap-3 text-xs text-gray-500 mb-4">
          <div className="flex items-center gap-1">
            <MapPin size={14} /> {job.location}
          </div>
          <div className="flex items-center gap-1">
            <DollarSign size={14} /> {(job.salary / 1000).toFixed(0)}k/yr
          </div>
          <div className="flex items-center gap-1">
            <Briefcase size={14} /> {job.experience}y exp
          </div>
          <div className="flex items-center gap-1">
            <Clock size={14} /> 2d ago
          </div>
        </div>

        {/* Skills */}
        <div className="flex flex-wrap gap-2 mb-6">
          {job.skills.map(skill => (
            <span key={skill} className="px-2 py-1 rounded bg-white/5 border border-white/5 text-[10px] text-gray-400 group-hover:border-white/20 transition-colors">
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* Footer Action */}
      <div className={`${viewMode === 'list' ? 'hidden' : 'mt-auto pt-4 border-t border-white/5 w-full'}`}>
        <button className="w-full py-3 rounded-lg bg-white/5 hover:bg-teal-500 hover:text-black font-medium text-sm transition-all duration-300 flex items-center justify-center gap-2 group/btn">
          Quick Apply
          <ArrowUpRight className="w-4 h-4 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
        </button>
      </div>
    </motion.div>
  );
};

// Simple Arrow Component helper
const ArrowUpRight = ({ className }) => (
  <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M7 17L17 7" /><path d="M7 7h10v10" />
  </svg>
);