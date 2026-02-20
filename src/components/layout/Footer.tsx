export default function Footer() {
    const links = {
        Product: [
            { label: 'How It Works', href: '#how-it-works' },
            { label: 'Features', href: '#features' },
            { label: 'Pricing', href: '#pricing' },
            { label: 'FAQ', href: '#faq' },
        ],
        Company: [
            { label: 'About', href: '#' },
            { label: 'Blog', href: '#' },
            { label: 'Careers', href: '#' },
        ],
        Legal: [
            { label: 'Privacy', href: '#' },
            { label: 'Terms', href: '#' },
            { label: 'Security', href: '#security' },
        ],
    };

    return (
        <footer className="border-t border-border-subtle pt-16 pb-8">
            <div className="section-container">
                <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
                    {/* Logo + tagline */}
                    <div className="lg:col-span-2">
                        <a href="#" className="flex items-center gap-2 mb-4">
                            <div className="w-8 h-8 rounded-lg bg-gradient-accent flex items-center justify-center text-bg-deep font-bold text-sm">
                                A
                            </div>
                            <span className="font-display font-bold text-lg text-text-primary tracking-tight">
                                AgentHost
                            </span>
                        </a>
                        <p className="text-sm text-text-muted max-w-xs leading-relaxed">
                            Your personal AI agent, on your phone, in 15 minutes. Built on OpenClaw.
                        </p>
                        {/* Social icons */}
                        <div className="flex gap-3 mt-6">
                            {['𝕏', 'gh', 'in'].map((icon) => (
                                <a
                                    key={icon}
                                    href="#"
                                    className="w-8 h-8 rounded-lg border border-border-subtle flex items-center justify-center text-xs text-text-muted hover:text-accent hover:border-accent/30 transition-all"
                                >
                                    {icon}
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Link columns */}
                    {Object.entries(links).map(([category, items]) => (
                        <div key={category}>
                            <h4 className="font-display font-semibold text-sm text-text-primary mb-4">{category}</h4>
                            <ul className="space-y-3">
                                {items.map((link) => (
                                    <li key={link.label}>
                                        <a
                                            href={link.href}
                                            className="text-sm text-text-muted hover:text-accent transition-colors"
                                        >
                                            {link.label}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Bottom bar */}
                <div className="border-t border-border-subtle pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-xs text-text-muted">
                        © {new Date().getFullYear()} AgentHost. All rights reserved.
                    </p>
                    <p className="text-xs text-text-muted">
                        Powered by <a href="#" className="text-accent hover:underline">OpenClaw</a>
                    </p>
                </div>
            </div>
        </footer>
    );
}
