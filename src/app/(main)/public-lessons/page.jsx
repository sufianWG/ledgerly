"use client";

import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { showToast } from "@/lib/toast";
import LessonCard from "@/components/LessonCard";
import LoadingSpinner from "@/components/shared/LoadingSpinner";

const PublicLessonsPage = () => {
    const { data: session } = authClient.useSession();
    const user = session?.user;

    const [lessons, setLessons] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLessons = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/lessons`);
                const result = await res.json();
                // console.log("public lessons fetched:", result);
                setLessons(result.lessons || []);
            } catch (error) {
                console.error("fetchLessons error:", error);
                showToast.error("Could not reach the server, please try again");
            } finally {
                setLoading(false);
            }
        }
        fetchLessons();
    }, []);

    if (loading) {
        return <LoadingSpinner></LoadingSpinner>;
    }

    return (
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-12">
            <p className="text-dll-accent text-xs font-semibold uppercase tracking-[0.14em] mb-3">The Library</p>
            <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-dll-heading mb-3">Browse Life Lessons</h1>
            <p className="text-dll-muted text-sm max-w-xl mb-10">Lessons shared by real people, on everything from heartbreak to career pivots.</p>

            {lessons.length === 0 &&
                <p className="text-sm text-dll-muted">No lessons published yet — be the first to share one.</p>
            }

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-7">
                {lessons.map((lesson) => {
                    const isLocked = lesson.accessLevel === "Premium" && !user?.isPremium && lesson.creatorEmail !== user?.email;
                    return <LessonCard key={lesson._id} lesson={lesson} isLocked={isLocked}></LessonCard>;
                })}
            </div>
        </div>
    );
};

export default PublicLessonsPage;
