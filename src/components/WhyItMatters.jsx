"use client";

import { motion } from "motion/react";
import { FiBookOpen, FiTrendingUp, FiUsers, FiCompass } from "react-icons/fi";

const benefits = [
    { icon: FiBookOpen, title: "Preserve Your Wisdom", description: "Capture and organize the insights that matter most before they slip away." },
    { icon: FiTrendingUp, title: "Accelerate Growth", description: "Learn from others' experiences and skip struggles that were already solved." },
    { icon: FiUsers, title: "Build Connections", description: "Share your story and meet others walking a similar path in life." },
    { icon: FiCompass, title: "Find Clarity", description: "Reflection often reveals the answer was already within you." },
];

const WhyItMatters = () => {
    return (
        <div className="py-20 px-6 lg:px-10 bg-dll-background">
            <div className="max-w-6xl mx-auto">
                <div className="text-center max-w-2xl mx-auto mb-14">
                    <p className="text-dll-accent text-xs font-semibold uppercase tracking-[0.14em] mb-3">The Philosophy</p>
                    <h2 className="font-serif text-[32px] font-semibold text-dll-heading mb-4">Why Learning From Life Matters</h2>
                    <p className="text-dll-muted text-[16px]">People forget valuable lessons over time. This is the place they don&apos;t have to.</p>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {benefits.map((benefit, index) => (
                        <motion.div
                            key={benefit.title}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.4, delay: index * 0.08 }}
                            className="bg-dll-surface rounded-2xl p-7 border border-dll-border"
                        >
                            <div className="w-12 h-12 rounded-xl bg-dll-accent/15 flex items-center justify-center mb-5 text-dll-accent">
                                <benefit.icon size={22}></benefit.icon>
                            </div>
                            <h3 className="font-serif text-lg font-semibold text-dll-heading mb-2.5">{benefit.title}</h3>
                            <p className="text-sm text-dll-muted leading-relaxed">{benefit.description}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default WhyItMatters;
