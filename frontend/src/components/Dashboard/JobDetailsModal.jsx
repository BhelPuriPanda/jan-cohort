import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, DollarSign, Briefcase, Clock, Building, Globe } from 'lucide-react';

export default function JobDetailsModal({ job, isOpen, onClose }) {
    if (!isOpen || !job) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
                {/* Backdrop */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                />

                {/* Modal Content */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="relative w-full max-w-3xl max-h-[90vh] bg-[#111] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col"
                >
                    {/* Header */}
                    <div className="p-6 border-b border-white/5 flex justify-between items-start bg-[#161616]">
                        <div>
                            <h2 className="text-2xl font-bold text-white mb-2">{job.title}</h2>
                            <div className="flex items-center gap-2 text-gray-400">
                                <Building size={16} className="text-teal-500" />
                                <span className="font-medium text-white/80">{job.company}</span>
                                {job.isRemote && (
                                    <span className="bg-purple-500/10 text-purple-400 text-xs px-2 py-0.5 rounded border border-purple-500/20 ml-2">
                                        Remote
                                    </span>
                                )}
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-white/10 rounded-full transition-colors text-gray-400 hover:text-white"
                        >
                            <X size={24} />
                        </button>
                    </div>

                    {/* Scrollable Content */}
                    <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                        {/* Quick Stats */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                            <div className="bg-white/5 p-3 rounded-lg border border-white/5">
                                <div className="flex items-center gap-2 text-gray-400 text-xs mb-1">
                                    <MapPin size={14} /> Location
                                </div>
                                <div className="text-sm font-medium text-white truncate">{job.location}</div>
                            </div>
                            <div className="bg-white/5 p-3 rounded-lg border border-white/5">
                                <div className="flex items-center gap-2 text-gray-400 text-xs mb-1">
                                    <DollarSign size={14} /> Salary
                                </div>
                                <div className="text-sm font-medium text-white">
                                    {job.salary?.min && job.salary?.max
                                        ? `$${(job.salary.min / 1000).toFixed(0)}k - ${(job.salary.max / 1000).toFixed(0)}k`
                                        : 'Competitive'}
                                </div>
                            </div>
                            <div className="bg-white/5 p-3 rounded-lg border border-white/5">
                                <div className="flex items-center gap-2 text-gray-400 text-xs mb-1">
                                    <Briefcase size={14} /> Type
                                </div>
                                <div className="text-sm font-medium text-white">{job.type}</div>
                            </div>
                            <div className="bg-white/5 p-3 rounded-lg border border-white/5">
                                <div className="flex items-center gap-2 text-gray-400 text-xs mb-1">
                                    <Clock size={14} /> Posted
                                </div>
                                <div className="text-sm font-medium text-white">
                                    {new Date(job.postedAt || job.createdAt).toLocaleDateString()}
                                </div>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="space-y-6">
                            <section>
                                <h3 className="text-lg font-bold text-white mb-3">About the Role</h3>
                                <div className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                                    {job.description}
                                </div>
                            </section>

                            {/* Skills */}
                            {job.skills && job.skills.length > 0 && (
                                <section>
                                    <h3 className="text-sm font-mono uppercase tracking-widest text-gray-500 mb-3">Required Skills</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {job.skills.map((skill, index) => (
                                            <span key={index} className="px-3 py-1 bg-teal-500/10 text-teal-300 border border-teal-500/20 rounded-full text-sm">
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </section>
                            )}
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="p-6 border-t border-white/5 bg-[#161616] flex justify-end gap-4">
                        <button
                            onClick={onClose}
                            className="px-6 py-2.5 rounded-lg border border-white/10 text-gray-300 hover:bg-white/5 hover:text-white transition-colors"
                        >
                            Close
                        </button>
                        <button
                            onClick={() => alert('Application submitted!')}
                            className="px-8 py-2.5 rounded-lg bg-teal-500 hover:bg-teal-400 text-black font-bold shadow-lg shadow-teal-500/20 transition-all transform hover:-translate-y-0.5"
                        >
                            Apply Now
                        </button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
