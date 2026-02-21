import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

interface SessionData {
    status: string;
    customer_email: string | null;
    subscription_status: string | null;
}

export default function SuccessPage() {
    const navigate = useNavigate();
    const [sessionId, setSessionId] = useState<string | null>(null);
    const [session, setSession] = useState<SessionData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const id = params.get('session_id');
        setSessionId(id);

        if (!id) {
            setLoading(false);
            setError('No session ID found. Please complete checkout first.');
            return;
        }

        fetch(`/api/checkout-session/${id}`)
            .then((res) => {
                if (!res.ok) throw new Error('Session not found');
                return res.json();
            })
            .then((data) => setSession(data))
            .catch(() => setError('Could not verify payment session.'))
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-bg-deep p-4">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center"
                >
                    <div className="w-12 h-12 mx-auto mb-4 border-4 border-accent border-t-transparent rounded-full animate-spin" />
                    <p className="text-text-secondary">Verifying your payment...</p>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-bg-deep p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-md w-full text-center"
            >
                <div className="glass-card p-8 rounded-2xl">
                    {error ? (
                        <>
                            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-yellow-500/20 flex items-center justify-center">
                                <svg className="w-10 h-10 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h1 className="font-display font-bold text-2xl text-text-primary mb-3">
                                Verification Issue
                            </h1>
                            <p className="text-text-secondary mb-6">{error}</p>
                            <button
                                onClick={() => navigate('/')}
                                className="btn-primary justify-center"
                            >
                                Return to Home
                            </button>
                        </>
                    ) : (
                        <>
                            {/* Success Icon */}
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                                className="w-20 h-20 mx-auto mb-6 rounded-full bg-success/20 flex items-center justify-center"
                            >
                                <svg className="w-10 h-10 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </motion.div>

                            <h1 className="font-display font-bold text-3xl text-text-primary mb-3">
                                Payment Successful!
                            </h1>

                            <p className="text-text-secondary mb-6">
                                Thank you for subscribing! Your payment has been processed successfully.
                            </p>

                            {session?.customer_email && (
                                <p className="text-sm text-text-secondary mb-2">
                                    Confirmation sent to <span className="font-semibold text-text-primary">{session.customer_email}</span>
                                </p>
                            )}

                            {/* CTA */}
                            <button
                                onClick={() => navigate(`/wizard/${crypto.randomUUID()}`)}
                                className="btn-primary justify-center w-full"
                            >
                                Get Started with Setup
                            </button>

                            {/* Next Steps */}
                            <div className="mt-8 pt-6 border-t border-border-subtle text-left">
                                <h3 className="font-semibold text-text-primary mb-3 text-sm">What's Next?</h3>
                                <ul className="space-y-2 text-xs text-text-secondary">
                                    <li className="flex items-start gap-2">
                                        <span className="text-accent mt-0.5">&#10003;</span>
                                        Check your email for a receipt and welcome message
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-accent mt-0.5">&#10003;</span>
                                        Complete the onboarding wizard to set up your agent
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-accent mt-0.5">&#10003;</span>
                                        Start chatting with your AI agent immediately
                                    </li>
                                </ul>
                            </div>
                        </>
                    )}
                </div>
            </motion.div>
        </div>
    );
}
