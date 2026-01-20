import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, CheckCircle, AlertCircle, FileText, Loader } from 'lucide-react';

export default function CompatibilityModal({ job, isOpen, onClose }) {
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);

    if (!isOpen || !job) return null;

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
            setError(null);
            setResult(null);
        }
    };

    // --- SKILL MATCHING LOGIC ---
    const SKILL_ALIASES = {
        'js': 'javascript',
        'ts': 'typescript',
        'reactjs': 'react',
        'react.js': 'react',
        'node': 'node.js',
        'nodejs': 'node.js',
        'vuejs': 'vue',
        'vue.js': 'vue',
        'angularjs': 'angular',
        'golang': 'go',
        'c#': 'csharp',
        'c++': 'cpp',
        'net': 'dotnet',
        '.net': 'dotnet',
        'aws': 'amazonwebservices',
        'mongo': 'mongodb'
    };

    const normalize = (skill) => {
        if (!skill) return '';
        // Remove spaces, dots (except Node.js case ideally, but keep simple), special chars
        // We want to keep + for C++ and # for C#
        let s = skill.toString().toLowerCase().trim().replace(/[^a-z0-9+#]/g, '');
        return SKILL_ALIASES[s] || s;
    };

    const analyzeCompatibility = async () => {
        if (!file) return;

        setLoading(true);
        setError(null);

        const formData = new FormData();
        formData.append('resume', file);

        try {
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

            // 1. Parse Resume
            const response = await fetch(`${apiUrl}/resume/parse`, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) throw new Error('Failed to parse resume');
            const data = await response.json();

            if (!data.success || !data.parsed) throw new Error('Invalid resume data');

            // 2. Client-side Compatibility Logic using Smart Matching
            const resumeSkills = data.parsed.skills?.value || [];
            const jobSkills = job.skills || [];

            // Normalize
            const normResume = resumeSkills.map(s => ({ original: s, norm: normalize(s) }));
            const normJob = jobSkills.map(s => ({ original: s, norm: normalize(s) }));

            // Advanced Matching
            const matches = [];
            const missing = [];

            normJob.forEach(jobSkill => {
                const isMatch = normResume.some(resumeSkill => {
                    // 1. Exact alias match
                    if (resumeSkill.norm === jobSkill.norm) return true;
                    // 2. Substring match (e.g. "React Native" matches "React")
                    // Note: Be careful of false positives (e.g. "Java" matching "JavaScript")
                    // So we only allow containment if string length is > 3 to avoid "C" matching "CSS"
                    if (jobSkill.norm.includes(resumeSkill.norm) && resumeSkill.norm.length > 3) return true;
                    if (resumeSkill.norm.includes(jobSkill.norm) && jobSkill.norm.length > 3) return true;
                    return false;
                });

                if (isMatch) {
                    matches.push(jobSkill.original);
                } else {
                    missing.push(jobSkill.original);
                }
            });


            // Calculate Score
            // Base score: (matches / total_required) * 100
            let score = Math.round((matches.length / (jobSkills.length || 1)) * 100);

            // Cap at 100
            score = Math.min(100, score);

            // Minimum score of 20 just for having a resume and processing it
            score = Math.max(20, score);

            setResult({
                score,
                matches,
                missing,
                resumeSkills
            });

        } catch (err) {
            console.error(err);
            setError("Analysis failed. Please try a different PDF.");
        } finally {
            setLoading(false);
        }
    };

    const getScoreColor = (score) => {
        if (score >= 80) return 'text-teal-400';
        if (score >= 50) return 'text-yellow-400';
        return 'text-red-400';
    };

    const handleClose = () => {
        setFile(null);
        setResult(null);
        setError(null);
        onClose();
    };

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={handleClose}
                    className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                />

                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="relative w-full max-w-lg bg-[#111] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
                >
                    {/* Header */}
                    <div className="p-6 border-b border-white/5 flex justify-between items-center bg-[#161616]">
                        <div>
                            <h2 className="text-lg font-bold text-white">Compatibility Check</h2>
                            <p className="text-xs text-gray-400">Position: {job.title}</p>
                        </div>
                        <button onClick={handleClose} className="text-gray-400 hover:text-white transition-colors">
                            <X size={20} />
                        </button>
                    </div>

                    <div className="p-6 flex-1 overflow-y-auto custom-scrollbar">

                        {!result && !loading && (
                            <div className="flex flex-col items-center justify-center py-8 space-y-6">
                                <div className="w-full h-32 border-2 border-dashed border-white/10 rounded-xl flex flex-col items-center justify-center bg-white/5 hover:bg-white/10 transition-colors relative group cursor-pointer">
                                    <input
                                        type="file"
                                        accept=".pdf"
                                        onChange={handleFileChange}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    />
                                    <Upload className="text-gray-400 mb-2 group-hover:text-teal-400 transition-colors" />
                                    <p className="text-sm text-gray-300 font-medium">
                                        {file ? file.name : "Upload Resume (PDF)"}
                                    </p>
                                </div>

                                <button
                                    onClick={analyzeCompatibility}
                                    disabled={!file}
                                    className="w-full py-3 bg-teal-500 hover:bg-teal-400 disabled:opacity-50 disabled:cursor-not-allowed text-black font-bold rounded-lg transition-all"
                                >
                                    Analyze Match
                                </button>
                            </div>
                        )}

                        {loading && (
                            <div className="flex flex-col items-center justify-center py-12 space-y-4">
                                <Loader className="animate-spin text-teal-500" size={40} />
                                <p className="text-sm text-gray-400 animate-pulse">Scanning skills & analyzing gaps...</p>
                            </div>
                        )}

                        {result && (
                            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

                                {/* Score Section */}
                                <div className="flex flex-col items-center">
                                    <div className={`text-6xl font-bold font-sans mb-1 ${getScoreColor(result.score)}`}>
                                        {result.score}%
                                    </div>
                                    <span className="text-xs text-gray-500 uppercase tracking-widest font-mono">Match Score</span>
                                </div>

                                {/* Analysis Grid */}
                                <div className="space-y-6">

                                    {/* Good Points */}
                                    <div>
                                        <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                                            <CheckCircle size={16} className="text-teal-400" />
                                            Matching Skills
                                        </h3>
                                        {result.matches.length > 0 ? (
                                            <div className="flex flex-wrap gap-2">
                                                {result.matches.map(skill => (
                                                    <span key={skill} className="px-2.5 py-1 bg-teal-500/10 text-teal-300 border border-teal-500/20 rounded-md text-xs">
                                                        {skill}
                                                    </span>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="text-xs text-gray-500 italic">No direct skill matches found.</p>
                                        )}
                                    </div>

                                    {/* Bad Points / Gaps */}
                                    <div>
                                        <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                                            <AlertCircle size={16} className="text-red-400" />
                                            Missing Requirements
                                        </h3>
                                        {result.missing.length > 0 ? (
                                            <div className="flex flex-wrap gap-2">
                                                {result.missing.map(skill => (
                                                    <span key={skill} className="px-2.5 py-1 bg-red-500/10 text-red-300 border border-red-500/20 rounded-md text-xs">
                                                        {skill}
                                                    </span>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="text-xs text-gray-500 italic">No missing critical skills detected.</p>
                                        )}
                                    </div>

                                </div>

                                <div className="pt-6 border-t border-white/5">
                                    <button onClick={handleClose} className="w-full py-3 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-colors text-sm font-medium">
                                        Close Report
                                    </button>
                                </div>
                            </div>
                        )}

                        {error && (
                            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-200 text-sm flex items-center gap-2 mt-4">
                                <AlertCircle size={16} /> {error}
                            </div>
                        )}

                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
