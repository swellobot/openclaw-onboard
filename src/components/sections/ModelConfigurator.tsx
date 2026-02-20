import { useState } from 'react';
import { motion } from 'framer-motion';
import { models, AIModel } from '../../lib/data/models';
import ScrollReveal from '../animations/ScrollReveal';

function RadarChart({ model }: { model: AIModel }) {
    const caps = model.capabilities;
    const labels = ['Reasoning', 'Speed', 'Creativity', 'Breadth', 'Multimodal'];
    const values = [caps.reasoning, caps.speed, caps.creativity, caps.breadth, caps.multimodal];
    const cx = 120, cy = 120, r = 90;
    const angleStep = (2 * Math.PI) / 5;

    const getPoint = (index: number, value: number) => {
        const angle = angleStep * index - Math.PI / 2;
        const dist = (value / 100) * r;
        return { x: cx + dist * Math.cos(angle), y: cy + dist * Math.sin(angle) };
    };

    const gridLevels = [25, 50, 75, 100];
    const dataPoints = values.map((v, i) => getPoint(i, v));
    const pathD = dataPoints.map((p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `L ${p.x} ${p.y}`)).join(' ') + ' Z';

    return (
        <svg viewBox="0 0 240 240" className="w-full max-w-[280px] mx-auto">
            {/* Grid */}
            {gridLevels.map((level) => {
                const pts = Array.from({ length: 5 }, (_, i) => getPoint(i, level));
                const d = pts.map((p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `L ${p.x} ${p.y}`)).join(' ') + ' Z';
                return <path key={level} d={d} fill="none" stroke="rgba(63,63,70,0.3)" strokeWidth="0.5" />;
            })}

            {/* Axis lines */}
            {Array.from({ length: 5 }, (_, i) => {
                const p = getPoint(i, 100);
                return <line key={i} x1={cx} y1={cy} x2={p.x} y2={p.y} stroke="rgba(63,63,70,0.2)" strokeWidth="0.5" />;
            })}

            {/* Data shape */}
            <motion.path
                d={pathD}
                fill="rgba(245, 158, 11, 0.12)"
                stroke="#f59e0b"
                strokeWidth="2"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                style={{ transformOrigin: `${cx}px ${cy}px` }}
            />

            {/* Data points */}
            {dataPoints.map((p, i) => (
                <motion.circle
                    key={i}
                    cx={p.x}
                    cy={p.y}
                    r="4"
                    fill="#f59e0b"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2 + i * 0.1 }}
                />
            ))}

            {/* Labels */}
            {labels.map((label, i) => {
                const p = getPoint(i, 118);
                return (
                    <text
                        key={i}
                        x={p.x}
                        y={p.y}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        className="fill-text-secondary text-[10px]"
                        style={{ fontFamily: 'Satoshi, sans-serif' }}
                    >
                        {label}
                    </text>
                );
            })}
        </svg>
    );
}

export default function ModelConfigurator() {
    const [selectedId, setSelectedId] = useState('opus-45');
    const selected = models.find((m) => m.id === selectedId)!;

    return (
        <section id="models" className="py-section relative">
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border-subtle to-transparent" />
            </div>

            <div className="section-container relative z-10">
                <ScrollReveal className="text-center mb-16">
                    <p className="text-accent font-medium text-sm uppercase tracking-widest mb-4">Agent Brain</p>
                    <h2 className="text-section font-display font-bold text-text-primary mb-4">
                        Configure your agent's brain.
                    </h2>
                    <p className="text-subtitle text-text-secondary max-w-2xl mx-auto">
                        Pick the engine. Not write code. Choose the AI model that matches how you work.
                    </p>
                </ScrollReveal>

                <div className="grid lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
                    {/* Model selector */}
                    <ScrollReveal direction="left" className="space-y-3">
                        {models.map((model) => (
                            <motion.button
                                key={model.id}
                                onClick={() => setSelectedId(model.id)}
                                whileHover={{ scale: 1.01 }}
                                whileTap={{ scale: 0.99 }}
                                className={`
                  w-full text-left p-4 rounded-xl border transition-all duration-200
                  ${selectedId === model.id
                                        ? 'bg-accent/10 border-accent/40 shadow-glow-sm'
                                        : 'bg-bg-elevated border-border-subtle hover:border-border-visible'
                                    }
                `}
                            >
                                <div className="flex items-center justify-between mb-1">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-3 h-3 rounded-full border-2 ${selectedId === model.id ? 'border-accent bg-accent' : 'border-border-visible'
                                            }`} />
                                        <span className="font-display font-semibold text-text-primary">{model.name}</span>
                                    </div>
                                    <span className="text-xs text-text-muted font-mono">{model.estimatedCost}</span>
                                </div>
                                <p className="text-xs text-text-secondary ml-6">{model.description}</p>
                                {model.tier !== 'starter' && model.tier !== 'pro' && (
                                    <span className="ml-6 mt-1 inline-block text-[10px] px-2 py-0.5 rounded bg-accent/15 text-accent font-medium">
                                        Enterprise
                                    </span>
                                )}
                            </motion.button>
                        ))}
                    </ScrollReveal>

                    {/* Radar chart + info */}
                    <ScrollReveal direction="right" className="flex flex-col items-center justify-center">
                        <div className="glass-card p-6 w-full">
                            <div className="text-center mb-4">
                                <h3 className="font-display font-semibold text-text-primary text-lg">{selected.name}</h3>
                                <p className="text-xs text-text-muted">{selected.provider}</p>
                            </div>
                            <RadarChart model={selected} />
                            <div className="mt-4 text-center">
                                <div className="text-sm text-text-secondary">Estimated monthly cost</div>
                                <div className="text-2xl font-display font-bold text-accent mt-1">{selected.estimatedCost}</div>
                            </div>
                        </div>
                    </ScrollReveal>
                </div>

                {/* Speed ↔ Intelligence slider visual */}
                <ScrollReveal className="mt-12 max-w-lg mx-auto">
                    <div className="glass-card p-6">
                        <div className="flex items-center justify-between text-xs text-text-muted mb-3">
                            <span>⚡ Speed</span>
                            <span>🧠 Intelligence</span>
                        </div>
                        <div className="relative h-2 bg-bg-hover rounded-full overflow-hidden">
                            <motion.div
                                className="absolute top-0 left-0 h-full bg-gradient-accent rounded-full"
                                animate={{ width: `${selected.capabilities.reasoning}%` }}
                                transition={{ duration: 0.4 }}
                            />
                        </div>
                        <p className="text-center text-xs text-text-muted mt-3">
                            Available on Enterprise plan · <a href="#pricing" className="text-accent hover:underline">See pricing →</a>
                        </p>
                    </div>
                </ScrollReveal>
            </div>
        </section>
    );
}
