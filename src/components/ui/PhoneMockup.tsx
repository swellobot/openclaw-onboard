import { ReactNode } from 'react';

interface PhoneMockupProps {
    children: ReactNode;
    className?: string;
}

export default function PhoneMockup({ children, className = '' }: PhoneMockupProps) {
    return (
        <div className={`relative mx-auto ${className}`} style={{ maxWidth: 340 }}>
            {/* Phone frame */}
            <div className="relative bg-bg-deep rounded-[2.5rem] border-2 border-border-visible p-2 shadow-elevated">
                {/* Notch */}
                <div className="absolute top-2 left-1/2 -translate-x-1/2 w-28 h-6 bg-bg-deep rounded-b-2xl z-10 flex items-center justify-center">
                    <div className="w-16 h-4 bg-border-subtle rounded-full" />
                </div>

                {/* Screen */}
                <div className="bg-bg-surface rounded-[2rem] overflow-hidden min-h-[420px]">
                    {/* Status bar */}
                    <div className="flex items-center justify-between px-6 pt-8 pb-2 text-xs text-text-muted">
                        <span>9:41</span>
                        <div className="flex items-center gap-1">
                            <svg width="16" height="12" viewBox="0 0 16 12" fill="currentColor" className="opacity-60">
                                <rect x="0" y="8" width="3" height="4" rx="0.5" />
                                <rect x="4.5" y="5" width="3" height="7" rx="0.5" />
                                <rect x="9" y="2" width="3" height="10" rx="0.5" />
                                <rect x="13.5" y="0" width="2.5" height="12" rx="0.5" />
                            </svg>
                            <svg width="20" height="10" viewBox="0 0 20 10" fill="currentColor" className="opacity-60">
                                <rect x="0" y="0" width="17" height="10" rx="2" stroke="currentColor" strokeWidth="1" fill="none" />
                                <rect x="1.5" y="1.5" width="10" height="7" rx="1" fill="currentColor" />
                                <rect x="18" y="3" width="2" height="4" rx="0.5" />
                            </svg>
                        </div>
                    </div>

                    {/* Chat header */}
                    <div className="flex items-center gap-3 px-4 py-3 border-b border-border-subtle">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent to-amber-600 flex items-center justify-center text-sm">
                            ✨
                        </div>
                        <div>
                            <div className="text-sm font-semibold text-text-primary">Nova</div>
                            <div className="text-xs text-success">Online</div>
                        </div>
                    </div>

                    {/* Chat content */}
                    <div className="p-4 flex flex-col" style={{ minHeight: 300 }}>
                        {children}
                    </div>
                </div>
            </div>

            {/* Home indicator */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 w-32 h-1 bg-border-visible rounded-full" />
        </div>
    );
}
