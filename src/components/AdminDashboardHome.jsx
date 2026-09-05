"use client";

import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { showToast } from "@/lib/toast";
import LoadingSpinner from "@/components/shared/LoadingSpinner";

const AdminDashboardHome = () => {
    const { data: session } = authClient.useSession();
    const user = session?.user;

    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const { data: tokenData } = await authClient.token();
                const token = tokenData?.token;

                const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/admin/stats`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const result = await res.json();
                setStats(result);
            } catch (error) {
                console.error("fetchStats error:", error);
                showToast.error("Could not reach the server, please try again");
            } finally {
                setLoading(false);
            }
        }
        fetchStats();
    }, []);
    // console.log("stats", stats);
    
    if (loading) {
        return <LoadingSpinner></LoadingSpinner>;
    }

    const recentUsers = stats?.recentUsers || [];
    // console.log("recentUsers :", recentUsers)

    return (
        <div>
            <p className="text-xs text-dll-muted">Dashboard</p>
            <h1 className="font-serif text-xl font-semibold text-dll-heading mb-1">Welcome back, {user?.name?.split(" ")[0]}</h1>
            <p className="text-sm text-dll-muted mb-6">Here&apos;s how Ledgerly is doing right now.</p>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <div className="bg-dll-surface rounded-2xl p-5 border border-dll-border">
                    <p className="font-serif text-xl font-semibold text-dll-heading">{stats?.totalUsers || 0}</p>
                    <p className="text-xs text-dll-muted mt-1">Total Users</p>
                </div>
                <div className="bg-dll-surface rounded-2xl p-5 border border-dll-border">
                    <p className="font-serif text-xl font-semibold text-dll-accent">{stats?.premiumUsers || 0}</p>
                    <p className="text-xs text-dll-muted mt-1">Premium Users</p>
                </div>
                <div className="bg-dll-surface rounded-2xl p-5 border border-dll-border">
                    <p className="font-serif text-xl font-semibold text-dll-primary">{stats?.totalLessons || 0}</p>
                    <p className="text-xs text-dll-muted mt-1">Total Lessons</p>
                </div>
                <div className="bg-dll-surface rounded-2xl p-5 border border-dll-border">
                    <p className="font-serif text-xl font-semibold text-dll-heading">{stats?.publicLessons || 0}</p>
                    <p className="text-xs text-dll-muted mt-1">Public Lessons</p>
                </div>
            </div>

            <div className="bg-dll-surface rounded-2xl border border-dll-border p-6">
                <h2 className="font-serif text-lg font-semibold text-dll-heading mb-4">Recently Joined Users</h2>

                {recentUsers.length === 0 &&
                    <p className="text-sm text-dll-muted">No users found yet.</p>
                }

                <div className="space-y-3">
                    {recentUsers.map((recentUser) => (
                        <div key={recentUser._id} className="flex items-center justify-between border-b border-dll-border last:border-0 pb-3 last:pb-0">
                            <div>
                                <p className="text-sm font-semibold text-dll-heading">{recentUser.name}</p>
                                <p className="text-xs text-dll-muted">{recentUser.email}</p>
                            </div>
                            <span className="text-xs text-dll-muted">{recentUser.isPremium ? "Premium" : "Free"}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboardHome;
