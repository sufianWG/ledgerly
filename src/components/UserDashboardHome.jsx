"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { showToast } from "@/lib/toast";
import LoadingSpinner from "@/components/shared/LoadingSpinner";

const UserDashboardHome = () => {
    const { data: session } = authClient.useSession();
    const user = session?.user;

    const [lessons, setLessons] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMyLessons = async () => {
            try {
                const { data: tokenData } = await authClient.token();
                const token = tokenData?.token;

                const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/my-lessons`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const result = await res.json();
                setLessons(result.lessons || []);
            } catch (error) {
                console.error("fetchMyLessons error:", error);
                showToast.error("Could not reach the server, please try again");
            } finally {
                setLoading(false);
            }
        }
        fetchMyLessons();
    }, []);

    if (loading) {
        return <LoadingSpinner></LoadingSpinner>;
    }

    // simple stats, just counting from the lessons we already fetched
    let totalLikes = 0;
    let totalSaves = 0;
    for (const lesson of lessons) {
        totalLikes = totalLikes + (lesson.likes?.length || 0);
        totalSaves = totalSaves + (lesson.savesCount || 0);
    }

    const recentLessons = lessons.slice(0, 5);

    return (
        <div>
            <p className="text-xs text-dll-muted">Dashboard</p>
            <h1 className="font-serif text-xl font-semibold text-dll-heading mb-1">Welcome back, {user?.name?.split(" ")[0]}</h1>
            <p className="text-sm text-dll-muted mb-6">Here&apos;s a quick look at your activity.</p>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <div className="bg-dll-surface rounded-2xl p-5 border border-dll-border">
                    <p className="font-serif text-xl font-semibold text-dll-heading">{lessons.length}</p>
                    <p className="text-xs text-dll-muted mt-1">Total Lessons</p>
                </div>
                <div className="bg-dll-surface rounded-2xl p-5 border border-dll-border">
                    <p className="font-serif text-xl font-semibold text-dll-accent">{totalLikes}</p>
                    <p className="text-xs text-dll-muted mt-1">Total Likes Received</p>
                </div>
                <div className="bg-dll-surface rounded-2xl p-5 border border-dll-border">
                    <p className="font-serif text-xl font-semibold text-dll-primary">{totalSaves}</p>
                    <p className="text-xs text-dll-muted mt-1">Total Saves Received</p>
                </div>
                <div className="bg-dll-surface rounded-2xl p-5 border border-dll-border">
                    <p className="font-serif text-xl font-semibold text-dll-heading">{user?.isPremium ? "Premium" : "Free"}</p>
                    <p className="text-xs text-dll-muted mt-1">Current Plan</p>
                </div>
            </div>

            <div className="bg-dll-surface rounded-2xl border border-dll-border p-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="font-serif text-lg font-semibold text-dll-heading">Recent Lessons</h2>
                    <Link href="/dashboard/user/my-lessons" className="text-sm text-dll-accent font-semibold">View all</Link>
                </div>

                {recentLessons.length === 0 &&
                    <p className="text-sm text-dll-muted">You haven&apos;t written any lessons yet.</p>
                }

                <div className="space-y-3">
                    {recentLessons.map((lesson) => (
                        <div key={lesson._id} className="flex items-center justify-between border-b border-dll-border last:border-0 pb-3 last:pb-0">
                            <div>
                                <p className="text-sm font-semibold text-dll-heading">{lesson.title}</p>
                                <p className="text-xs text-dll-muted">{lesson.category} · {new Date(lesson.createdAt).toLocaleDateString()}</p>
                            </div>
                            <span className="text-xs text-dll-muted">{lesson.likes?.length || 0} likes</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default UserDashboardHome;
