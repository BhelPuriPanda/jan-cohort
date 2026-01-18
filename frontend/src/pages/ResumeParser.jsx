import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

export default function ResumeParser() {
    const navigate = useNavigate();
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);
    const [scanning, setScanning] = useState(false);

    // Initial load animation for "System Online"
    useEffect(() => {
        // Any init logic
    }, []);

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const selected = e.target.files[0];
            if (selected.type === 'application/pdf') {
                setFile(selected);
                setError(null);
                // Auto upload on select for smoother UX? Or wait for button.
                // Let's wait for button to match "Commit" style or auto-scan.
                // Let's do auto-scan to impress.
                handleParse(selected);
            } else {
                setError("Protocol Mismatch: PDF Required.");
            }
        }
    };

    const handleParse = async (selectedFile) => {
        setLoading(true);
        setScanning(true);
        setError(null);

        const formData = new FormData();
        formData.append('resume', selectedFile);

        try {
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:4001/api';

            // Artificial delay for specific "Scanner" animation feel
            await new Promise(r => setTimeout(r, 2000));

            const response = await fetch(`${apiUrl}/resume/parse`, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) throw new Error('Parsing Sequence Failed');

            const data = await response.json();
            if (data.success && data.parsed) {
                setResult(data.parsed);
            } else {
                throw new Error('Invalid Data Structure');
            }
        } catch (err) {
            console.error(err);
            setError(err.message || 'System Error');
        } finally {
            setLoading(false);
            setScanning(false);
        }
    };

    const reset = () => {
        setFile(null);
        setResult(null);
        setError(null);
    };

    const calculateScore = (data) => {
        if (!data) return "0%";
        // Default weights if confidence is missing
        const nameConf = data.name?.confidence || 0;
        const emailConf = data.email?.confidence || 0;
        const phoneConf = data.phone?.confidence || 0;
        const skillsConf = data.skills?.confidence || 0;
        const expConf = data.experience?.confidence || 0;
        const projConf = data.projects?.confidence || 0;
        const eduConf = data.education?.confidence || 0;

        // Weighted Average could be better, but simple average for now
        // Key Identifiers (Name, Email, Phone) = 30%
        // Content (Skills, Exp, Proj, Edu) = 70%

        const identityScore = (nameConf + emailConf + phoneConf) / 3;
        const contentScore = (skillsConf + expConf + projConf + eduConf) / 4;

        const total = (identityScore * 0.3) + (contentScore * 0.7);
        return Math.round(total * 100) + "%";
    };

    const score = calculateScore(result);

    return (
        <div className="bg-[#0F1115] font-sans h-screen flex overflow-hidden text-[#F4F4F2] antialiased selection:bg-[#2EF2C8] selection:text-[#0F1115]">

            {/* Main Content */}
            <main className="flex-1 flex relative h-full">

                {/* Background Decor */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 overflow-hidden">
                    <div className="absolute right-[-5%] top-[10%] text-[40vh] font-bold text-[#A1A6B3] opacity-[0.03] select-none leading-none tracking-tighter mix-blend-overlay">
                        {score}
                    </div>
                </div>

                {/* Left Panel: Scanner / ID Card */}
                <section className="w-7/12 relative flex flex-col items-center h-full z-10">
                    <div className="absolute inset-0 z-0 opacity-10 pointer-events-none" style={{ backgroundImage: `radial-gradient(#2EF2C8 1px, transparent 1px)`, backgroundSize: '40px 40px' }}></div>

                    <div className="flex-1 w-full overflow-y-auto p-12 custom-scrollbar flex flex-col items-center relative z-10">
                        {/* Back to Dashboard Button */}
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="absolute top-8 left-8 flex items-center gap-2 text-[#A1A6B3] hover:text-[#2EF2C8] transition-colors z-50 text-xs font-mono uppercase tracking-wider"
                        >
                            <span className="material-symbols-outlined text-lg">arrow_back</span>
                            Back to Dashboard
                        </button>

                        <AnimatePresence mode="wait">
                            {!file ? (
                                /* Upload State */
                                <motion.div
                                    key="upload"
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
                                    className="relative w-full max-w-[500px] h-[600px] border-2 border-dashed border-[#2EF2C8]/30 rounded-sm bg-[#2EF2C8]/5 flex flex-col items-center justify-center gap-6 group hover:border-[#2EF2C8]/60 hover:bg-[#2EF2C8]/10 transition-all cursor-pointer my-auto"
                                >
                                    <input
                                        type="file"
                                        accept=".pdf"
                                        onChange={handleFileChange}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                                    />
                                    <div className="size-20 rounded-full bg-[#0F1115] border border-[#2EF2C8] shadow-[0_0_20px_rgba(46,242,200,0.2)] flex items-center justify-center group-hover:scale-110 transition-transform">
                                        <span className="material-symbols-outlined text-[#2EF2C8] text-4xl">upload_file</span>
                                    </div>
                                    <div className="text-center space-y-2">
                                        <h3 className="font-mono text-lg text-[#F4F4F2] tracking-widest uppercase">Initiate Upload</h3>
                                        <p className="text-[#A1A6B3] text-xs font-mono">Drag PDF or Click to Scan</p>
                                    </div>
                                </motion.div>
                            ) : (
                                /* Scanned / Result State */
                                <motion.div
                                    key="result"
                                    initial={{ opacity: 0, rotateX: 20 }}
                                    animate={{ opacity: 1, rotateX: 0 }}
                                    className="relative z-10 w-full max-w-[600px] my-10"
                                >
                                    <div className="absolute -top-12 left-0 right-0 flex justify-center">
                                        <button onClick={reset} className="text-[#A1A6B3] hover:text-[#F4F4F2] text-xs font-mono flex items-center gap-2 transition-colors">
                                            <span className="material-symbols-outlined text-sm">refresh</span>
                                            Scan Another
                                        </button>
                                    </div>

                                    {/* Scanner Line Animation if loading */}
                                    {loading && (
                                        <motion.div
                                            initial={{ top: "0%" }}
                                            animate={{ top: "100%" }}
                                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                            className="absolute inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[#2EF2C8] to-transparent z-50 shadow-[0_0_15px_#2EF2C8]"
                                        ></motion.div>
                                    )}

                                    <div className={`bg-white/95 text-gray-900 p-12 shadow-[0_0_50px_rgba(0,0,0,0.5)] min-h-[500px] h-auto transition-all duration-500 relative overflow-hidden font-serif ${loading ? 'blur-sm opacity-80' : ''}`}>
                                        {/* Mock Paper Content - mapped from result if available */}
                                        {result ? (
                                            <>
                                                <h1 className="text-4xl font-bold mb-1 font-sans text-gray-900 tracking-tight">{result.name?.value || "Unknown Subject"}</h1>
                                                <p className="mb-10 text-gray-600 font-sans text-sm border-b border-gray-300 pb-6">
                                                    {result.email?.value || "No Email"} | {result.phone?.value || "No Phone"}
                                                </p>

                                                <div className="mb-8">
                                                    <h3 className="font-bold font-sans uppercase text-xs tracking-wider mb-2 text-gray-800 flex items-center gap-2">
                                                        <span className="w-2 h-2 bg-[#2EF2C8] rounded-full"></span>
                                                        Extracted Skills
                                                    </h3>
                                                    <div className="flex flex-wrap gap-2 font-sans text-xs text-gray-600">
                                                        {result.skills?.value?.map((skill, i) => (
                                                            <span key={i} className="bg-gray-100 px-3 py-1 rounded-sm border border-gray-200">{skill}</span>
                                                        )) || <span className="italic opacity-50">No skills detected</span>}
                                                    </div>
                                                </div>

                                                {/* Experience Preview */}
                                                {result.experience?.value && (
                                                    <div className="mb-6">
                                                        <h3 className="font-bold font-sans uppercase text-xs tracking-wider mb-2 text-gray-800 border-b border-gray-200 pb-1">Experience</h3>
                                                        <div className="text-xs text-gray-600 leading-relaxed whitespace-pre-line">
                                                            {result.experience.value}
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Projects Preview */}
                                                {result.projects?.value && (
                                                    <div className="mb-6">
                                                        <h3 className="font-bold font-sans uppercase text-xs tracking-wider mb-2 text-gray-800 border-b border-gray-200 pb-1">Projects</h3>
                                                        <div className="text-xs text-gray-600 leading-relaxed whitespace-pre-line">
                                                            {result.projects.value}
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Education Preview */}
                                                {result.education?.value && (
                                                    <div className="mb-6">
                                                        <h3 className="font-bold font-sans uppercase text-xs tracking-wider mb-2 text-gray-800 border-b border-gray-200 pb-1">Education</h3>
                                                        <div className="text-xs text-gray-600 leading-relaxed whitespace-pre-line">
                                                            {result.education.value}
                                                        </div>
                                                    </div>
                                                )}

                                                <div className="absolute top-[20px] right-[20px] opacity-10">
                                                    <span className="material-symbols-outlined text-6xl">fingerprint</span>
                                                </div>
                                            </>
                                        ) : (
                                            <div className="h-full flex items-center justify-center">
                                                <p className="font-mono text-xs uppercase animate-pulse">Scanning Document Sequence...</p>
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </section>

                {/* Right Panel: Extraction Dashboard */}
                {result && (
                    <section className="w-5/12 bg-[rgba(24,27,34,0.6)] backdrop-blur-xl relative shadow-[-20px_0_40px_-10px_rgba(0,0,0,0.8)] z-20 flex flex-col border-l border-[#2EF2C8]/10 h-full animate-in slide-in-from-right duration-700">
                        <div className="p-8 pb-4 border-b border-[#2EF2C8]/10 bg-[#0F1115]/30">
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <h2 className="text-2xl font-light text-[#F4F4F2] mb-1 tracking-wide font-sans">Profile Extraction</h2>
                                    <div className="flex items-center gap-3 text-[10px] text-[#A1A6B3] font-mono uppercase tracking-wider">
                                        <span className="flex items-center gap-1.5 px-2 py-0.5 rounded border border-[#2EF2C8]/20 bg-[#2EF2C8]/5">
                                            <span className="w-1.5 h-1.5 rounded-full bg-[#2EF2C8] animate-pulse"></span> Live
                                        </span>
                                        <span className="text-[#2EF2C8]">ID: {Math.random().toString(36).substr(2, 6).toUpperCase()}</span>
                                    </div>
                                </div>
                                <div className="flex flex-col items-end gap-2">
                                    <div className="flex items-center gap-2 px-3 py-1 bg-[#2EF2C8]/10 border border-[#2EF2C8]/30 rounded-full">
                                        <span className="text-[10px] font-mono text-[#2EF2C8]/80 uppercase tracking-widest">Confidence</span>
                                        <span className="text-sm font-bold text-[#2EF2C8]">{score}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto p-8 space-y-10 no-scrollbar relative custom-scrollbar pb-10">
                            {/* Identity Matrix */}
                            <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-xs font-mono text-[#A1A6B3] uppercase tracking-widest flex items-center gap-2">
                                        <span className="material-symbols-outlined text-[14px] text-[#2EF2C8]">fingerprint</span> Identity Matrix
                                    </h3>
                                    <span className="text-[10px] bg-[#2EF2C8]/10 text-[#2EF2C8] px-2 py-0.5 rounded border border-[#2EF2C8]/20 shadow-[0_0_10px_rgba(46,242,200,0.1)]">VERIFIED</span>
                                </div>
                                <div className="space-y-6 pl-2">
                                    <div className="relative group">
                                        <input
                                            readOnly
                                            value={result.name?.value || ""}
                                            className="w-full bg-transparent border-b border-white/10 text-lg text-[#F4F4F2] py-2 focus:border-[#2EF2C8] focus:outline-none transition-colors"
                                        />
                                        <span className="text-[10px] text-[#2EF2C8] uppercase tracking-wider block mt-1">Full Name</span>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="relative group">
                                            <input
                                                readOnly
                                                value={result.email?.value || ""}
                                                className="w-full bg-transparent border-b border-white/10 text-sm text-[#F4F4F2] py-2 focus:border-[#2EF2C8] focus:outline-none transition-colors"
                                            />
                                            <span className="text-[10px] text-[#2EF2C8] uppercase tracking-wider block mt-1">Email Address</span>
                                        </div>
                                        <div className="relative group">
                                            <input
                                                readOnly
                                                value={result.phone?.value || ""}
                                                className="w-full bg-transparent border-b border-white/10 text-sm text-[#F4F4F2] py-2 focus:border-[#2EF2C8] focus:outline-none transition-colors"
                                            />
                                            <span className="text-[10px] text-[#2EF2C8] uppercase tracking-wider block mt-1">Phone Number</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Competency Matrix */}
                            <div className="space-y-4">
                                <h3 className="text-xs font-mono text-[#A1A6B3] uppercase tracking-widest flex items-center gap-2">
                                    <span className="material-symbols-outlined text-[14px] text-[#2EF2C8]">auto_graph</span> Competency Matrix
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {result.skills?.value?.map((skill, i) => (
                                        <div key={i} className="flex items-center gap-3 bg-[#0F1115] border border-[#2EF2C8]/30 pl-3 pr-2 py-1.5 rounded-sm shadow-[0_0_10px_rgba(46,242,200,0.05)] hover:shadow-[0_0_15px_rgba(46,242,200,0.15)] transition-all cursor-default hover:bg-[#181B22]">
                                            <span className="text-xs font-light text-[#F4F4F2]">{skill}</span>
                                            <div className="h-4 w-px bg-white/10"></div>
                                            <span className="text-[10px] font-mono text-[#2EF2C8]">{(result.skills.confidence * 100).toFixed(0)}%</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Experience Module (Expanded) */}
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-xs font-mono text-[#A1A6B3] uppercase tracking-widest flex items-center gap-2">
                                        <span className="material-symbols-outlined text-[14px] text-[#2EF2C8]">history_edu</span> Experience Log
                                    </h3>
                                    <span className={`text-[10px] px-2 py-0.5 rounded border ${result.experience?.value ? 'text-[#2EF2C8] bg-[#2EF2C8]/10 border-[#2EF2C8]/20' : 'text-red-400 bg-red-400/10 border-red-400/20'}`}>
                                        {(result.experience?.confidence * 100).toFixed(0)}% MATCH
                                    </span>
                                </div>
                                <div className="bg-[#181B22] border border-white/5 p-4 rounded-sm">
                                    <textarea
                                        readOnly
                                        className="w-full bg-transparent text-xs text-[#A1A6B3] font-mono leading-relaxed resize-none focus:outline-none custom-scrollbar"
                                        rows={6}
                                        value={result.experience?.value || "No experience data extracted."}
                                    />
                                </div>
                            </div>

                            {/* Projects Module */}
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-xs font-mono text-[#A1A6B3] uppercase tracking-widest flex items-center gap-2">
                                        <span className="material-symbols-outlined text-[14px] text-[#2EF2C8]">rocket_launch</span> Project Nodes
                                    </h3>
                                    <span className={`text-[10px] px-2 py-0.5 rounded border ${result.projects?.value ? 'text-[#2EF2C8] bg-[#2EF2C8]/10 border-[#2EF2C8]/20' : 'text-gray-500 bg-gray-500/10 border-gray-500/20'}`}>
                                        {(result.projects?.confidence * 100).toFixed(0)}% MATCH
                                    </span>
                                </div>
                                <div className="bg-[#181B22] border border-white/5 p-4 rounded-sm">
                                    <textarea
                                        readOnly
                                        className="w-full bg-transparent text-xs text-[#A1A6B3] font-mono leading-relaxed resize-none focus:outline-none custom-scrollbar"
                                        rows={4}
                                        value={result.projects?.value || "No project data extracted."}
                                    />
                                </div>
                            </div>

                            {/* Education Module */}
                            <div className="space-y-4 pb-20">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-xs font-mono text-[#A1A6B3] uppercase tracking-widest flex items-center gap-2">
                                        <span className="material-symbols-outlined text-[14px] text-[#2EF2C8]">school</span> Academic Data
                                    </h3>
                                    <span className={`text-[10px] px-2 py-0.5 rounded border ${result.education?.value ? 'text-[#2EF2C8] bg-[#2EF2C8]/10 border-[#2EF2C8]/20' : 'text-gray-500 bg-gray-500/10 border-gray-500/20'}`}>
                                        {(result.education?.confidence * 100).toFixed(0)}% MATCH
                                    </span>
                                </div>
                                <div className="bg-[#181B22] border border-white/5 p-4 rounded-sm">
                                    <textarea
                                        readOnly
                                        className="w-full bg-transparent text-xs text-[#A1A6B3] font-mono leading-relaxed resize-none focus:outline-none custom-scrollbar"
                                        rows={2}
                                        value={result.education?.value || "No education data extracted."}
                                    />
                                </div>
                            </div>
                        </div>

                    </section>
                )}
            </main>
        </div>
    );
}
