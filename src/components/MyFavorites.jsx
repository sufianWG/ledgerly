"use client";

import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { showToast } from "@/lib/toast";
import LessonCard from "@/components/LessonCard";
import LoadingSpinner from "@/components/shared/LoadingSpinner";

const MyFavorites = () => {
    const [lessons, setLessons] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFavorites = async () => {
            try {
                const { data: tokenData } = await authClient.token();
                const token = tokenData?.token;

                const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/favorites`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const result = await res.json();
                // console.log("my favorites fetched:", result);
                setLessons(result.lessons || []);
            } catch (error) {
                console.error("fetchFavorites error:", error);
                showToast.error("Could not reach the server, please try again");
            } finally {
                setLoading(false);
            }
        }
        fetchFavorites();
    }, []);

    if (loading) {
        return <LoadingSpinner></LoadingSpinner>;
    }

    return (
        <div>
            <p className="text-xs text-dll-muted">Dashboard</p>
            <h1 className="font-serif text-xl font-semibold text-dll-heading mb-1">My Favorites</h1>
            <p className="text-sm text-dll-muted mb-6">Lessons you&apos;ve saved to read again later.</p>

            {lessons.length === 0 &&
                <p className="text-sm text-dll-muted">You haven&apos;t saved any lessons yet. Go to Public Lessons and tap Save on one you like.</p>
            }

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-7">
                {lessons.map((lesson) => (
                    <LessonCard key={lesson._id} lesson={lesson} isLocked={false}></LessonCard>
                ))}
            </div>
        </div>
    );
};

export default MyFavorites;
