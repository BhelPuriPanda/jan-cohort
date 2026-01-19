import React from 'react';

const Loading = ({ message = "Loading..." }) => {
    return (
        <div className="flex flex-col items-center justify-center p-8 space-y-4">
            <div className="relative size-12">
                <div className="absolute inset-0 rounded-full border-4 border-white/10"></div>
                <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
            </div>
            <p className="font-mono text-xs text-ivory-dim uppercase tracking-widest animate-pulse">
                {message}
            </p>
        </div>
    );
};

export default Loading;
