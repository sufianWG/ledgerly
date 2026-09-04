"use client";

import { useEffect, useState } from "react";
import { FiSearch } from "react-icons/fi";
import { authClient } from "@/lib/auth-client";
import { showToast } from "@/lib/toast";
import LessonCard from "@/components/LessonCard";
import LoadingSpinner from "@/components/shared/LoadingSpinner";

const categories = ["All Categories", "Personal Growth", "Career", "Relationships", "Mindset", "Mistakes Learned"];

const PublicLessonsPage = () => {
    const { data: session } = authClient.useSession();
    const user = session?.user;
    // console.log(user);

    const [lessons, setLessons] = useState([]);
    const [initialLoading, setInitialLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("All Categories");

    useEffect(() => {
        const fetchLessons = async () => {
            try {
                const categoryParam = category === "All Categories" ? "" : category;
                const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/lessons?search=${encodeURIComponent(search)}&category=${encodeURIComponent(categoryParam)}`);
                const result = await res.json();
                // console.log("public lessons fetched:", result);
                setLessons(result.lessons || []);
            } catch (error) {
                console.error("fetchLessons error:", error);
                showToast.error("Could not reach the server, please try again");
            } finally {
                setInitialLoading(false);
            }
        }

        // typing er por 400ms wait kore search kore, protibar keystroke e na kore
        const debounceTimer = setTimeout(fetchLessons, 400);
        return () => clearTimeout(debounceTimer);
    }, [search, category]);

    if (initialLoading) {
        return <LoadingSpinner></LoadingSpinner>;
    }

    return (
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-12">
            <p className="text-dll-accent text-xs font-semibold uppercase tracking-[0.14em] mb-3">The Library</p>
            <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-dll-heading mb-3">Browse Life Lessons</h1>
            <p className="text-dll-muted text-sm max-w-xl mb-8">Lessons shared by real people, on everything from heartbreak to career pivots.</p>

            <div className="relative max-w-md mb-8">
                <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-dll-muted" size={16}></FiSearch>
                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search lessons by title or keyword..."
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-dll-border bg-transparent text-sm text-dll-text focus:outline-none focus:border-dll-accent"
                ></input>
            </div>

            <div className="flex items-center gap-2.5 overflow-x-auto pb-1 mb-8">
                {categories.map((c) => (
                    <button
                        key={c}
                        onClick={() => setCategory(c)}
                        className={`text-sm font-medium px-3.5 py-1.5 rounded-full border whitespace-nowrap transition ${category === c ? "bg-dll-primary border-dll-primary text-white" : "border-dll-border text-dll-muted hover:text-dll-text"}`}
                    >
                        {c}
                    </button>
                ))}
            </div>

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
