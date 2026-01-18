import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function JDGenerator() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null); // { variant_a, variant_b }
    const [activeVariant, setActiveVariant] = useState('A'); // 'A' or 'B'
    const [experienceOpen, setExperienceOpen] = useState(false);

    const [formData, setFormData] = useState({
        title: '',
        industry: '',
        skills: '',
        experience: 'Mid-Senior',
        location: '',
        companyCulture: 'Professional and inclusive' // Hidden default or added to UI
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        if (e) e.preventDefault();
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
                employerId: user._id,
                jobTitle: formData.title,
                industry: formData.industry,
                experienceLevel: formData.experience,
                location: formData.location,
                companyCulture: formData.companyCulture,
                specialRequirements: "None",
                keySkills: formData.skills.split(',').map(s => s.trim()).filter(s => s)
            };

            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:4001/api';
            const response = await fetch(`${apiUrl}/job-description/generate-ab`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) throw new Error('Failed to generate JD');
            const data = await response.json();

            // Map backend response format to frontend state expectation
            if (data.versions && data.versions.length >= 2) {
                setResult({
                    variant_a: data.versions[0].jdText,
                    variant_b: data.versions[1].jdText
                });
                setActiveVariant('A'); // Reset to A on new generation
            } else {
                setResult(data);
            }

        } catch (err) {
            console.error(err);
            // Mock fallback
            setResult({
                variant_a: `Job Title: ${formData.title}\n\nWe are looking for a ${formData.experience} professional to join our team in ${formData.location || 'Remote'}.\n\nKey Responsibilities:\n- Lead innovative projects.\n- Collaborate with cross-functional teams.\n\nRequired Skills:\n- ${formData.skills}`,
                variant_b: `Make an impact as our new ${formData.title}!\n\nLocation: ${formData.location || 'Remote'}\nLevel: ${formData.experience}\n\nWhy Join Us?\nWe are a dynamic team pushing boundaries in ${formData.industry || 'Tech'}.\n\nWhat you bring:\n- Proficiency in ${formData.skills}\n- A passion for excellence.`
            });
            setActiveVariant('A');
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = () => {
        const text = activeVariant === 'A' ? result?.variant_a : result?.variant_b;
        if (text) {
            navigator.clipboard.writeText(text);
            alert('Copied to clipboard!');
        }
    };

    // Helper to format displayed text
    const getDisplayedText = () => {
        if (!result) return "";
        return activeVariant === 'A' ? result.variant_a : result.variant_b;
    };

    return (
        <div className="bg-background-dark font-sans h-screen flex flex-col overflow-hidden text-ivory antialiased selection:bg-primary/30 selection:text-primary">

            {/* Header */}
            <header className="flex items-center justify-between shrink-0 border-b border-white/5 bg-background-dark/80 backdrop-blur-md px-8 py-4 z-50">
                <div className="flex items-center gap-6">
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="flex items-center gap-3 group cursor-pointer hover:bg-white/5 pr-4 py-1.5 rounded-full transition-colors"
                    >
                        <div className="size-9 rounded-full bg-surface-dark flex items-center justify-center text-ivory-dim border border-white/10 group-hover:border-primary/50 group-hover:text-primary transition-all duration-300">
                            <span className="material-symbols-outlined text-xl group-hover:-translate-x-0.5 transition-transform">arrow_back</span>
                        </div>
                        <span className="text-xs font-bold tracking-widest uppercase text-ivory/80 font-mono group-hover:text-primary transition-colors">Back to Dashboard</span>
                    </button>
                </div>

                <div className="flex items-center gap-4">
                    {result && (
                        <div className="flex items-center gap-2 mr-4 bg-surface-dark/50 rounded-full px-3 py-1 border border-white/5">
                            <span className="size-1.5 rounded-full bg-green-500 animate-pulse"></span>
                            <span className="text-[10px] font-mono text-ivory-dim">GENERATED</span>
                        </div>
                    )}
                    <button
                        onClick={copyToClipboard}
                        disabled={!result}
                        className="h-9 px-5 rounded-full bg-ivory text-background-dark text-xs font-bold tracking-wide hover:bg-white transition-colors shadow-[0_0_20px_rgba(255,255,255,0.1)] uppercase disabled:opacity-50 disabled:cursor-not-allowed">
                        Copy to Clipboard
                    </button>
                </div>
            </header>

            <main className="flex flex-1 overflow-hidden relative">

                {/* Sidebar Input Panel */}
                <aside className="w-full md:w-[480px] flex flex-col border-r border-white/5 bg-background-dark z-20 shadow-[10px_0_30px_-10px_rgba(0,0,0,0.5)]">
                    <div className="flex-1 overflow-y-auto custom-scrollbar">
                        <div className="p-8 md:p-10 space-y-12">

                            <div className="flex items-center justify-between mb-8">
                                <span className="font-mono text-xs text-primary">01 / 02</span>
                                <div className="h-px bg-white/10 flex-1 mx-4 relative">
                                    <div className="absolute inset-y-0 left-0 bg-primary w-1/2 shadow-[0_0_8px_rgba(0,229,188,0.5)]"></div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <h1 className="font-serif text-3xl md:text-4xl text-ivory leading-tight font-medium">Define the <span className="italic text-primary">Role</span>.</h1>
                                <p className="text-ivory-dim font-light text-sm leading-relaxed max-w-sm">Craft the voice and requirements. How should this position feel to the candidate?</p>
                            </div>

                            <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
                                {/* Job Title Input */}
                                <div className="space-y-4">
                                    <label className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-ivory-dim/50 block">Role Title</label>
                                    <div className="relative group">
                                        <input
                                            name="title"
                                            value={formData.title}
                                            onChange={handleChange}
                                            required
                                            className="w-full bg-transparent border-b border-white/20 text-xl font-sans text-ivory py-3 px-0 placeholder:text-white/10 placeholder:font-sans focus:border-primary focus:ring-0 focus:outline-none transition-colors"
                                            placeholder="e.g. Senior Frontend Engineer"
                                        />
                                    </div>
                                </div>

                                {/* Industry Input */}
                                <div className="space-y-4">
                                    <label className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-ivory-dim/50 block">Industry</label>
                                    <div className="relative group">
                                        <input
                                            name="industry"
                                            value={formData.industry}
                                            onChange={handleChange}
                                            className="w-full bg-transparent border-b border-white/20 text-xl font-sans text-ivory py-3 px-0 placeholder:text-white/10 placeholder:font-sans focus:border-primary focus:ring-0 focus:outline-none transition-colors"
                                            placeholder="e.g. Fintech, Healthcare"
                                        />
                                    </div>
                                </div>

                                {/* Experience Custom Dropdown */}
                                <div className="space-y-4">
                                    <label className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-ivory-dim/50 block mb-4">Experience Level</label>
                                    <div className="flex items-center justify-between group relative z-50">
                                        <div className="flex flex-col">
                                            <span className="text-sm font-medium text-ivory tracking-wide mb-1">{formData.experience}</span>
                                            <span className="text-xs text-ivory-dim/50 font-sans italic">Intern to Executive</span>
                                        </div>
                                        <div className="relative w-48 group/dropdown">
                                            <button
                                                className="w-full bg-surface-dark border border-white/10 rounded-sm px-4 py-2 text-xs text-ivory flex items-center justify-between hover:border-primary/50 transition-colors focus:outline-none"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    setExperienceOpen(!experienceOpen);
                                                }}
                                            >
                                                <span>{formData.experience}</span>
                                                <span className="material-symbols-outlined text-[16px] text-ivory-dim">expand_more</span>
                                            </button>

                                            {experienceOpen && (
                                                <div className="absolute top-full right-0 mt-2 w-full bg-surface-dark border border-white/10 rounded-sm shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)] py-1 z-50 animate-in fade-in zoom-in-95 duration-200">
                                                    {['Internship', 'Junior', 'Mid-Senior', 'Lead/Principal', 'Executive'].map((level) => (
                                                        <button
                                                            key={level}
                                                            onClick={() => {
                                                                setFormData({ ...formData, experience: level });
                                                                setExperienceOpen(false);
                                                            }}
                                                            className={`w-full text-left px-4 py-2 text-xs hover:bg-white/5 hover:text-primary transition-colors ${formData.experience === level ? 'text-primary bg-white/5' : 'text-ivory-dim'}`}
                                                        >
                                                            {level}
                                                        </button>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    {/* Interaction overlay for closing */}
                                    {experienceOpen && <div className="fixed inset-0 z-40" onClick={() => setExperienceOpen(false)}></div>}
                                </div>

                                {/* Location Input */}
                                <div className="space-y-4">
                                    <label className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-ivory-dim/50 block">Location</label>
                                    <div className="relative group">
                                        <span className="material-symbols-outlined absolute left-0 top-1/2 -translate-y-1/2 text-ivory-dim/40 group-focus-within:text-primary transition-colors text-xl">location_on</span>
                                        <input
                                            name="location"
                                            value={formData.location}
                                            onChange={handleChange}
                                            className="w-full bg-transparent border-b border-white/20 text-lg font-serif text-ivory py-2 pl-8 pr-0 placeholder:text-white/10 placeholder:font-serif focus:border-primary focus:ring-0 focus:outline-none transition-colors"
                                            placeholder="e.g. San Francisco or Remote"
                                        />
                                    </div>
                                </div>


                                {/* Skills Input */}
                                <div className="space-y-4">
                                    <label className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-ivory-dim/50 block">Key Skills (Comma Separated)</label>
                                    <div className="relative group">
                                        <input
                                            name="skills"
                                            value={formData.skills}
                                            onChange={handleChange}
                                            required
                                            className="w-full bg-transparent border-b border-white/20 text-lg font-serif text-ivory py-2 px-0 placeholder:text-white/10 placeholder:font-serif focus:border-primary focus:ring-0 focus:outline-none transition-colors"
                                            placeholder="e.g. React, Node.js, Design Systems"
                                        />
                                    </div>
                                </div>
                            </form>

                        </div>
                    </div>

                    {/* Generate Button Footer */}
                    <div className="p-6 md:p-8 border-t border-white/5 bg-background-dark/95 backdrop-blur z-20">
                        <button
                            onClick={handleSubmit}
                            disabled={loading}
                            className="w-full group relative flex items-center justify-center gap-3 h-14 bg-ivory text-background-dark font-bold hover:bg-primary hover:text-background-dark transition-all shadow-[0_0_30px_rgba(255,255,240,0.1)] hover:shadow-[0_0_30px_rgba(0,229,188,0.4)] overflow-hidden rounded-sm disabled:opacity-50 disabled:cursor-not-allowed">
                            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></span>
                            <span className="material-symbols-outlined text-xl">{loading ? 'hourglass_empty' : 'auto_awesome'}</span>
                            <span className="uppercase tracking-widest text-xs">{loading ? 'Composing...' : 'Compose Document'}</span>
                        </button>
                    </div>
                </aside>


                {/* Main Content / Results Area */}
                <section className="flex-1 bg-surface-lighter overflow-y-auto relative flex justify-center items-start pt-12 pb-32 perspective-1000">

                    {/* Empty State / Welcome */}
                    {!result && !loading && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center opacity-30 pointer-events-none">
                            <span className="material-symbols-outlined text-6xl mb-4">edit_note</span>
                            <p className="font-serif text-xl italic">Ready to compose your masterpiece.</p>
                        </div>
                    )}


                    {result && (
                        <div className="relative w-full max-w-[800px] min-h-[1000px] bg-paper bg-paper-texture shadow-paper text-ivory transition-all duration-500 transform border border-white/5 p-16 sm:p-20 animation-fade-in">
                            <div className="max-w-[620px] mx-auto space-y-10">

                                {/* Header of Document */}
                                <header className="border-b border-white/10 pb-10 mb-10 text-center">
                                    <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-primary mb-6 flex justify-center items-center gap-4">
                                        <span className="h-px w-8 bg-primary/30"></span>
                                        {formData.industry || 'General'}
                                        <span className="h-px w-8 bg-primary/30"></span>
                                    </div>
                                    <h1 className="font-serif text-4xl md:text-5xl text-ivory mb-6 font-medium tracking-tight">{formData.title}</h1>
                                    <div className="flex justify-center gap-8 text-xs font-mono text-ivory-dim uppercase tracking-wider">
                                        <span>{formData.location || 'Remote'}</span>
                                        <span>•</span>
                                        <span>Full-time</span>
                                        <span>•</span>
                                        <span>{formData.experience}</span>
                                    </div>
                                </header>

                                {/* Content Body */}
                                <div className="prose prose-invert prose-lg max-w-none font-serif text-ivory/80 leading-loose whitespace-pre-wrap">
                                    {getDisplayedText()}
                                </div>

                                {/* Signoff */}
                                <div className="mt-16 pt-8 border-t border-white/5 flex justify-between items-end">
                                    <div className="h-20 w-32 opacity-20 bg-[url('https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Signature_sample.svg/1200px-Signature_sample.svg.png')] bg-contain bg-no-repeat bg-center grayscale invert"></div>
                                    <div className="font-mono text-[10px] text-ivory-dim/40 uppercase tracking-[0.2em]">Generated by Unified Talent</div>
                                </div>

                            </div>
                        </div>
                    )}

                    {/* Version Switcher - Floating on Right */}
                    {result && (
                        <div className="fixed right-8 top-32 flex flex-col items-end gap-6 z-30 hidden xl:flex perspective-500">

                            {/* Active Variant Indicator */}
                            <div className="relative group cursor-pointer transition-transform hover:-translate-x-2" onClick={() => setActiveVariant(activeVariant)}>
                                <div className="absolute -right-2 top-0 bottom-0 w-1 bg-primary/20 rounded-r-sm blur-[1px]"></div>
                                <div className="w-16 h-20 bg-surface-dark border border-primary/40 rounded-sm shadow-[0_5px_15px_rgba(0,0,0,0.5)] flex flex-col items-center justify-between p-2 z-10 relative">
                                    <span className="font-mono text-[10px] text-primary">v.{activeVariant === 'A' ? '01' : '02'}</span>
                                    <span className="h-px w-4 bg-white/10"></span>
                                    <span className="material-symbols-outlined text-primary text-sm">edit_document</span>
                                </div>
                                <div className="absolute right-20 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                    <span className="bg-background-dark text-ivory text-xs px-3 py-1.5 rounded-sm border border-white/10 shadow-xl font-mono">Current Draft</span>
                                </div>
                            </div>

                            {/* Inactive Variant Button */}
                            <div className="relative group cursor-pointer transition-transform hover:-translate-x-2 opacity-60 hover:opacity-100" onClick={() => setActiveVariant(activeVariant === 'A' ? 'B' : 'A')}>
                                <div className="w-16 h-20 bg-surface-dark border border-white/10 rounded-sm shadow-[0_5px_15px_rgba(0,0,0,0.5)] flex flex-col items-center justify-between p-2 transform rotate-2">
                                    <span className="font-mono text-[10px] text-ivory-dim">v.{activeVariant === 'A' ? '02' : '01'}</span>
                                    <span className="h-px w-4 bg-white/10"></span>
                                    <span className="font-serif italic text-[10px] text-ivory-dim">Switch</span>
                                </div>
                                <div className="absolute right-20 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                    <span className="bg-background-dark text-ivory-dim text-xs px-3 py-1.5 rounded-sm border border-white/10 shadow-xl font-mono">View Version {activeVariant === 'A' ? 'B' : 'A'}</span>
                                </div>
                            </div>

                        </div>
                    )}
                </section>
            </main>
        </div>
    );
}
