import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, FileText, CheckCircle, AlertCircle, Loader2, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function ResumeParser() {
    const navigate = useNavigate();
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);
    const [dragActive, setDragActive] = useState(false);

    // Handle drag events
    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    // Handle drop
    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFile(e.dataTransfer.files[0]);
        }
    };

    // Handle manual selection
    const handleChange = (e) => {
        e.preventDefault();
        if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0]);
        }
    };

    const handleFile = (selectedFile) => {
        if (selectedFile.type === 'application/pdf') {
            setFile(selectedFile);
            setError(null);
        } else {
            setError('Please upload a PDF file.');
        }
    };

    const handleSubmit = async () => {
        if (!file) return;

        setLoading(true);
        setError(null);
        const formData = new FormData();
        formData.append('resume', file);

        try {
            // Use the VITE_API_URL from env or default to localhost
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:4001/api';
            const response = await fetch(`${apiUrl}/resume/parse`, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) throw new Error('Failed to parse resume');

            const data = await response.json();
            setResult(data);
        } catch (err) {
            console.error(err);
            setError('Error parsing resume. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white font-sans selection:bg-teal-500 selection:text-black relative overflow-x-hidden p-6">

            {/* Background Ambient Glows */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-teal-900/10 blur-[100px] rounded-full"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-purple-900/10 blur-[100px] rounded-full"></div>
            </div>

            <div className="relative z-10 max-w-4xl mx-auto">
                <button
                    onClick={() => navigate('/dashboard')}
                    className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8 group"
                >
                    <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                    Back to Dashboard
                </button>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-xl"
                >
                    <h1 className="text-3xl font-display font-bold mb-2">Resume <span className="text-teal-400">Optimizer</span></h1>
                    <p className="text-gray-400 mb-8">Upload your resume to get AI-powered insights and match scoring.</p>

                    {!result ? (
                        <div className="space-y-6">
                            <div
                                className={`relative border-2 border-dashed rounded-xl p-10 flex flex-col items-center justify-center transition-all ${dragActive ? 'border-teal-500 bg-teal-500/10' : 'border-white/10 hover:border-white/20 hover:bg-white/5'
                                    }`}
                                onDragEnter={handleDrag}
                                onDragLeave={handleDrag}
                                onDragOver={handleDrag}
                                onDrop={handleDrop}
                            >
                                <input
                                    type="file"
                                    accept=".pdf"
                                    onChange={handleChange}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                />

                                {file ? (
                                    <div className="flex flex-col items-center text-center">
                                        <FileText size={48} className="text-teal-400 mb-4" />
                                        <p className="text-lg font-medium text-white">{file.name}</p>
                                        <p className="text-sm text-gray-400 mt-1">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                                        <button onClick={(e) => { e.preventDefault(); setFile(null); }} className="mt-4 text-xs text-red-400 hover:text-red-300 underline z-10 relative">Remove file</button>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center text-center pointer-events-none">
                                        <Upload size={48} className="text-gray-500 mb-4" />
                                        <p className="text-lg font-medium text-white">Drag & drop your resume here</p>
                                        <p className="text-sm text-gray-500 mt-1">or click to browse (PDF only)</p>
                                    </div>
                                )}
                            </div>

                            {error && (
                                <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg flex items-center gap-3">
                                    <AlertCircle size={20} />
                                    {error}
                                </div>
                            )}

                            <button
                                onClick={handleSubmit}
                                disabled={!file || loading}
                                className="w-full py-4 bg-teal-500 hover:bg-teal-400 text-black font-bold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {loading ? <Loader2 className="animate-spin" /> : 'Analyze Resume'}
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="flex items-center justify-between bg-green-500/10 border border-green-500/20 p-4 rounded-xl text-green-400">
                                <span className="flex items-center gap-2 font-medium"><CheckCircle size={20} /> Analysis Complete</span>
                                <button onClick={() => setResult(null)} className="text-sm hover:underline">Analyze another</button>
                            </div>

                            {/* Result Display - Customize based on actual API response structure */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="bg-black/40 rounded-xl p-6 border border-white/10">
                                    <h3 className="text-lg font-semibold mb-4 text-teal-400">Overview</h3>
                                    <pre className="text-xs text-gray-300 overflow-auto max-h-[400px] whitespace-pre-wrap font-mono bg-black/50 p-4 rounded-lg">
                                        {JSON.stringify(result, null, 2)}
                                    </pre>
                                </div>
                                <div className="bg-black/40 rounded-xl p-6 border border-white/10">
                                    <h3 className="text-lg font-semibold mb-4 text-teal-400">Preview</h3>
                                    {/* Placeholder for extracted text/fields visualization */}
                                    <p className="text-gray-400 italic">Structured data visualization will appear here.</p>
                                </div>
                            </div>
                        </div>
                    )}
                </motion.div>
            </div>
        </div>
    );
}
