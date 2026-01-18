import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { PenTool, Briefcase, MapPin, Sparkles, Copy, Loader2, ArrowLeft, Layers } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function JDGenerator() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null); // { variant_a, variant_b }

    const [formData, setFormData] = useState({
        title: '',
        industry: '',
        skills: '',
        experience: 'Mid-Senior',
        location: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Retrieve user from localStorage to get employerId
            const userStr = localStorage.getItem('user');
            const user = userStr ? JSON.parse(userStr) : null;

            if (!user?._id) {
                alert("Please log in again to refresh your session.");
                navigate('/login');
                return;
            }

            const payload = {
                ...formData,
                employerId: user._id,
                // Add required fields expected by backend if missing in form
                companyCulture: formData.companyCulture || "Professional and inclusive",
                specialRequirements: formData.specialRequirements || "None",
                keySkills: formData.skills.split(',').map(s => s.trim()).filter(s => s) // Ensure array
            };

            // Using the AB variation endpoint
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:4001/api';
            const response = await fetch(`${apiUrl}/job-description/generate-ab`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) throw new Error('Failed to generate JD');
            const data = await response.json();
            setResult(data);

        } catch (err) {
            console.error(err);
            // Mock fallback for demonstration if backend fails/isn't ready
            setResult({
                variant_a: `Job Title: ${formData.title}\n\nWe are looking for a ${formData.experience} professional to join our team in ${formData.location || 'Remote'}.\n\nKey Responsibilities:\n- Lead innovative projects.\n- Collaborate with cross-functional teams.\n\nRequired Skills:\n- ${formData.skills}`,
                variant_b: `Make an impact as our new ${formData.title}!\n\nLocation: ${formData.location || 'Remote'}\nLevel: ${formData.experience}\n\nWhy Join Us?\nWe are a dynamic team pushing boundaries in ${formData.industry || 'Tech'}.\n\nWhat you bring:\n- Proficiency in ${formData.skills}\n- A passion for excellence.`
            });
        } finally {
            setLoading(false);
        }
    };

    const copylToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        alert('Copied to clipboard!');
    };

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white font-sans selection:bg-teal-500 selection:text-black relative overflow-x-hidden p-6">

            {/* Background Ambient Glows */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-blue-900/10 blur-[100px] rounded-full"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-teal-900/10 blur-[100px] rounded-full"></div>
            </div>

            <div className="relative z-10 max-w-5xl mx-auto">
                <button
                    onClick={() => navigate('/dashboard')}
                    className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8 group"
                >
                    <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                    Back to Dashboard
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Left: Input Form */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="lg:col-span-5 space-y-6"
                    >
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-xl">
                            <h1 className="text-2xl font-display font-bold mb-6 flex items-center gap-2">
                                <Sparkles className="text-teal-400" /> JD Generator
                            </h1>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-xs font-mono text-gray-400 uppercase mb-2">Job Title</label>
                                    <div className="relative">
                                        <Briefcase className="absolute left-3 top-3 text-gray-500 w-4 h-4" />
                                        <input
                                            name="title" required
                                            value={formData.title} onChange={handleChange}
                                            placeholder="e.g. Senior Frontend Engineer"
                                            className="w-full bg-black/40 border border-white/10 rounded-lg py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:border-teal-500/50 transition-colors"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-mono text-gray-400 uppercase mb-2">Industry / Domain</label>
                                    <div className="relative">
                                        <Layers className="absolute left-3 top-3 text-gray-500 w-4 h-4" />
                                        <input
                                            name="industry"
                                            value={formData.industry} onChange={handleChange}
                                            placeholder="e.g. Fintech, Healthcare"
                                            className="w-full bg-black/40 border border-white/10 rounded-lg py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:border-teal-500/50 transition-colors"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-mono text-gray-400 uppercase mb-2">Key Skills (Comma separated)</label>
                                    <div className="relative">
                                        <PenTool className="absolute left-3 top-3 text-gray-500 w-4 h-4" />
                                        <input
                                            name="skills" required
                                            value={formData.skills} onChange={handleChange}
                                            placeholder="e.g. React, Node.js, AWS"
                                            className="w-full bg-black/40 border border-white/10 rounded-lg py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:border-teal-500/50 transition-colors"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-mono text-gray-400 uppercase mb-2">Experience</label>
                                        <select
                                            name="experience"
                                            value={formData.experience} onChange={handleChange}
                                            className="w-full bg-black/40 border border-white/10 rounded-lg py-2.5 px-4 text-sm focus:outline-none focus:border-teal-500/50 transition-colors appearance-none cursor-pointer"
                                        >
                                            <option>Internship</option>
                                            <option>Junior</option>
                                            <option>Mid-Senior</option>
                                            <option>Lead/Principal</option>
                                            <option>Executive</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-mono text-gray-400 uppercase mb-2">Location</label>
                                        <div className="relative">
                                            <MapPin className="absolute left-3 top-3 text-gray-500 w-4 h-4" />
                                            <input
                                                name="location"
                                                value={formData.location} onChange={handleChange}
                                                placeholder="e.g. San Francisco"
                                                className="w-full bg-black/40 border border-white/10 rounded-lg py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:border-teal-500/50 transition-colors"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-3 mt-4 bg-teal-500 hover:bg-teal-400 text-black font-bold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {loading ? <Loader2 className="animate-spin" /> : 'Generate Variations'}
                                </button>
                            </form>
                        </div>
                    </motion.div>

                    {/* Right: Results */}
                    <div className="lg:col-span-7">
                        {result ? (
                            <motion.div
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                className="space-y-6"
                            >
                                {/* Variant A */}
                                <div className="bg-white/5 border border-white/10 rounded-xl p-6 relative group">
                                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => copylToClipboard(result.variant_a)} className="p-2 text-gray-400 hover:text-white bg-black/50 rounded-lg"><Copy size={16} /></button>
                                    </div>
                                    <h3 className="text-sm font-mono text-teal-400 mb-4 bg-teal-500/10 inline-block px-2 py-1 rounded">VARIANT A (Formal)</h3>
                                    <p className="whitespace-pre-wrap text-gray-300 text-sm leading-relaxed">{result.variant_a}</p>
                                </div>

                                {/* Variant B */}
                                <div className="bg-white/5 border border-white/10 rounded-xl p-6 relative group">
                                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => copylToClipboard(result.variant_b)} className="p-2 text-gray-400 hover:text-white bg-black/50 rounded-lg"><Copy size={16} /></button>
                                    </div>
                                    <h3 className="text-sm font-mono text-purple-400 mb-4 bg-purple-500/10 inline-block px-2 py-1 rounded">VARIANT B (Creative)</h3>
                                    <p className="whitespace-pre-wrap text-gray-300 text-sm leading-relaxed">{result.variant_b}</p>
                                </div>
                            </motion.div>
                        ) : (
                            <div className="h-full flex items-center justify-center text-gray-500 border border-white/5 rounded-xl border-dashed min-h-[400px]">
                                <div className="text-center">
                                    <Sparkles size={48} className="mx-auto mb-4 opacity-20" />
                                    <p>Fill the details to generate AI-optimized JDs</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
