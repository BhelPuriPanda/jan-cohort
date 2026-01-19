import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jobsAPI } from '../services/api';
import Loading from '../components/ui/Loading';

export default function PostJob() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const [formData, setFormData] = useState({
        title: '',
        company: '',
        location: '',
        type: 'Full-time',
        isRemote: false,
        salaryMin: '',
        salaryMax: '',
        experienceLevel: 0,
        skills: '',
        description: ''
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const userStr = localStorage.getItem('user');
            const user = userStr ? JSON.parse(userStr) : null;

            if (!user?._id) {
                alert("Please log in to post a job.");
                navigate('/login');
                return;
            }

            const payload = {
                employerId: user._id,
                ...formData,
                salaryMin: Number(formData.salaryMin),
                salaryMax: Number(formData.salaryMax),
                experienceLevel: Number(formData.experienceLevel),
                skills: formData.skills.split(',').map(s => s.trim()).filter(Boolean)
            };

            await jobsAPI.create(payload);
            alert('Job posted successfully!');
            navigate('/dashboard');
        } catch (err) {
            console.error(err);
            setError(err.message || "Failed to post job");
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <Loading message="Posting your job..." />;

    return (
        <div className="min-h-screen bg-black text-white font-sans p-8">
            <div className="max-w-3xl mx-auto">
                <header className="mb-10 border-b border-white/10 pb-6">
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="flex items-center gap-2 text-sm text-gray-400 hover:text-teal-400 transition-colors mb-4"
                    >
                        ← Back to Dashboard
                    </button>
                    <h1 className="text-3xl font-display font-bold">Post a New Opportunity</h1>
                    <p className="text-gray-400 mt-2">Find your next star employee.</p>
                </header>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-200 p-4 rounded-lg mb-8">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-8 bg-[#111] p-8 rounded-2xl border border-white/5">

                    {/* Basic Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300">Job Title</label>
                            <input
                                required
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                className="w-full bg-black border border-white/10 rounded-lg p-3 text-white focus:border-teal-500 focus:outline-none transition-colors"
                                placeholder="e.g. Senior React Developer"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300">Company Name</label>
                            <input
                                required
                                name="company"
                                value={formData.company}
                                onChange={handleChange}
                                className="w-full bg-black border border-white/10 rounded-lg p-3 text-white focus:border-teal-500 focus:outline-none transition-colors"
                                placeholder="e.g. Acme Corp"
                            />
                        </div>
                    </div>

                    {/* Location & Type */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300">Location</label>
                            <input
                                required
                                name="location"
                                value={formData.location}
                                onChange={handleChange}
                                className="w-full bg-black border border-white/10 rounded-lg p-3 text-white focus:border-teal-500 focus:outline-none transition-colors"
                                placeholder="e.g. New York, NY"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300">Job Type</label>
                            <select
                                name="type"
                                value={formData.type}
                                onChange={handleChange}
                                className="w-full bg-black border border-white/10 rounded-lg p-3 text-white focus:border-teal-500 focus:outline-none transition-colors"
                            >
                                <option value="Full-time">Full-time</option>
                                <option value="Part-time">Part-time</option>
                                <option value="Contract">Contract</option>
                                <option value="Internship">Internship</option>
                                <option value="Freelance">Freelance</option>
                            </select>
                        </div>
                    </div>

                    {/* Remote Toggle */}
                    <div className="flex items-center gap-3">
                        <input
                            type="checkbox"
                            name="isRemote"
                            id="isRemote"
                            checked={formData.isRemote}
                            onChange={handleChange}
                            className="w-5 h-5 rounded border-gray-600 text-teal-600 focus:ring-teal-500 bg-black"
                        />
                        <label htmlFor="isRemote" className="text-sm text-gray-300 cursor-pointer select-none">
                            This is a remote position
                        </label>
                    </div>

                    <div className="h-px bg-white/5 my-4"></div>

                    {/* Salary & Experience */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300">Min Salary (Annual)</label>
                            <div className="relative">
                                <span className="absolute left-3 top-3 text-gray-500">$</span>
                                <input
                                    type="number"
                                    name="salaryMin"
                                    value={formData.salaryMin}
                                    onChange={handleChange}
                                    className="w-full bg-black border border-white/10 rounded-lg p-3 pl-8 text-white focus:border-teal-500 focus:outline-none transition-colors"
                                    placeholder="80000"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300">Max Salary (Annual)</label>
                            <div className="relative">
                                <span className="absolute left-3 top-3 text-gray-500">$</span>
                                <input
                                    type="number"
                                    name="salaryMax"
                                    value={formData.salaryMax}
                                    onChange={handleChange}
                                    className="w-full bg-black border border-white/10 rounded-lg p-3 pl-8 text-white focus:border-teal-500 focus:outline-none transition-colors"
                                    placeholder="120000"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300">Experience (Years)</label>
                            <input
                                type="number"
                                name="experienceLevel"
                                value={formData.experienceLevel}
                                onChange={handleChange}
                                className="w-full bg-black border border-white/10 rounded-lg p-3 text-white focus:border-teal-500 focus:outline-none transition-colors"
                                placeholder="2"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300">Required Skills (Comma separated)</label>
                        <input
                            name="skills"
                            value={formData.skills}
                            onChange={handleChange}
                            className="w-full bg-black border border-white/10 rounded-lg p-3 text-white focus:border-teal-500 focus:outline-none transition-colors"
                            placeholder="React, Node.js, TypeScript..."
                        />
                    </div>

                    <div className="h-px bg-white/5 my-4"></div>

                    {/* Description */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300">Job Description</label>
                        <textarea
                            required
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows={10}
                            className="w-full bg-black border border-white/10 rounded-lg p-3 text-white focus:border-teal-500 focus:outline-none transition-colors font-mono text-sm leading-relaxed"
                            placeholder="Describe the role, responsibilities, and requirements..."
                        />
                    </div>

                    {/* Submit Action */}
                    <div className="flex justify-end pt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-8 py-3 bg-teal-500 hover:bg-teal-400 text-black font-bold rounded-lg transition-all shadow-[0_0_20px_rgba(20,184,166,0.2)] hover:shadow-[0_0_30px_rgba(20,184,166,0.4)] disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Posting...' : 'Post Job'}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
}
