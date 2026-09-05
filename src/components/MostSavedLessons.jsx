import Link from "next/link";
import LessonCard from "@/components/LessonCard";
import { getUserSession } from "@/lib/core/session";

const MostSavedLessons = async () => {
    let lessons = [];
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/lessons?sort=mostSaved&limit=3`, { cache: "no-store" });
        const result = await res.json();
        lessons = result.lessons || [];
    } catch (error) {
        console.error("MostSavedLessons fetch error:", error);
    }

    if (lessons.length === 0) {
        return null;
    }

    const user = await getUserSession();

    return (
        <div className="py-20 px-6 lg:px-10 bg-dll-background">
            <div className="max-w-6xl mx-auto">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
                    <div>
                        <p className="text-dll-accent text-xs font-semibold uppercase tracking-[0.14em] mb-2">Most Saved</p>
                        <h2 className="font-serif text-[32px] font-semibold text-dll-heading leading-tight">Wisdom People Keep Coming Back To</h2>
                    </div>
                    <Link href="/public-lessons?sort=mostSaved" className="text-sm font-semibold text-dll-accent">Explore more →</Link>
                </div>

                <div className="grid md:grid-cols-3 gap-7">
                    {lessons.map((lesson) => {
                        const isLocked = lesson.accessLevel === "Premium" && !user?.isPremium && lesson.creatorEmail !== user?.email && user?.role !== "admin";
                        return <LessonCard key={lesson._id} lesson={lesson} isLocked={isLocked}></LessonCard>;
                    })}
                </div>
            </div>
        </div>
    );
};

export default MostSavedLessons;
