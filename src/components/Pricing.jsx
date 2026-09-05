"use client";

import { FiCheck, FiX } from "react-icons/fi";
import { HiSparkles } from "react-icons/hi2";
import { authClient } from "@/lib/auth-client";

const comparisonRows = [
    { feature: "Number of lessons you can create", free: "Up to 10", premium: "Unlimited" },
    { feature: "Create Premium-access lessons", free: false, premium: true },
    { feature: "Access Premium content from other members", free: false, premium: true },
    { feature: "Priority listing in Public Lessons", free: false, premium: true },
    { feature: "Community badge / verified status", free: false, premium: true },
    { feature: "Like, save & comment on lessons", free: true, premium: true },
    { feature: "Browse all Free public lessons", free: true, premium: true },
];

const Pricing = () => {
    const { data: session } = authClient.useSession();
    const user = session?.user;

    return (
        <div className="max-w-5xl mx-auto px-6 lg:px-10 py-16">
            <div className="text-center max-w-xl mx-auto mb-12">
                <p className="text-dll-accent text-xs font-semibold uppercase tracking-[0.14em] mb-3">Lifetime Access</p>
                <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-dll-heading mb-4">Unlock every lesson, every deeper story.</h1>
                <p className="text-dll-muted text-sm">One payment. Lifetime access. No subscriptions, no recurring charges.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-7 mb-16">
                <div className="bg-dll-surface rounded-3xl p-8 border border-dll-border">
                    <p className="text-xs font-semibold uppercase tracking-wide text-dll-muted mb-2">Current Plan</p>
                    <h2 className="font-serif text-xl font-semibold text-dll-heading mb-1">Free</h2>
                    <p className="text-sm text-dll-muted mb-6">For casual readers and writers just getting started.</p>
                    <p className="font-serif text-3xl font-semibold text-dll-heading mb-6">৳0</p>
                    <button disabled className="w-full rounded-xl py-3 font-semibold text-sm border border-dll-border text-dll-muted cursor-not-allowed">
                        {user?.isPremium ? "Free Plan" : "Your Current Plan"}
                    </button>
                </div>

                <div className="relative bg-dll-primary rounded-3xl p-8 text-white overflow-hidden">
                    <p className="text-xs font-semibold uppercase tracking-wide text-dll-accent mb-2">Lifetime Access</p>
                    <h2 className="font-serif text-xl font-semibold flex items-center gap-2 mb-1">
                        Premium <HiSparkles className="text-dll-accent"></HiSparkles>
                    </h2>
                    <p className="text-sm text-white/70 mb-6">For readers and writers who want it all, once and for good.</p>
                    <p className="font-serif text-3xl font-semibold mb-6">৳1500 <span className="text-sm font-normal text-white/60">one-time</span></p>

                    {user?.isPremium ? (
                        <button disabled className="w-full rounded-xl py-3 font-semibold text-sm bg-white/20 cursor-not-allowed">
                            Your Current Plan
                        </button>
                    ) : (
                        <form action="/api/checkout_sessions" method="POST">
                            <button type="submit" className="w-full rounded-xl py-3 font-semibold text-sm bg-dll-accent text-white">
                                Upgrade to Premium
                            </button>
                        </form>
                    )}
                </div>
            </div>

            <div className="bg-dll-surface rounded-3xl border border-dll-border overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[500px]">
                        <thead>
                            <tr className="border-b border-dll-border">
                                <th className="text-left py-4 px-6 text-xs font-semibold text-dll-muted uppercase">Feature</th>
                                <th className="py-4 px-6 text-center text-sm font-semibold text-dll-heading">Free</th>
                                <th className="py-4 px-6 text-center text-sm font-semibold text-dll-accent">Premium</th>
                            </tr>
                        </thead>
                        <tbody>
                            {comparisonRows.map((row) => (
                                <tr key={row.feature} className="border-b border-dll-border last:border-0">
                                    <td className="py-4 px-6 text-sm text-dll-text">{row.feature}</td>
                                    <td className="py-4 px-6 text-center">
                                        {typeof row.free === "string" ? (
                                            <span className="text-sm text-dll-muted">{row.free}</span>
                                        ) : row.free ? (
                                            <FiCheck className="mx-auto text-dll-success"></FiCheck>
                                        ) : (
                                            <FiX className="mx-auto text-dll-muted"></FiX>
                                        )}
                                    </td>
                                    <td className="py-4 px-6 text-center">
                                        {typeof row.premium === "string" ? (
                                            <span className="text-sm font-semibold text-dll-accent">{row.premium}</span>
                                        ) : row.premium ? (
                                            <FiCheck className="mx-auto text-dll-accent"></FiCheck>
                                        ) : (
                                            <FiX className="mx-auto text-dll-muted"></FiX>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Pricing;
