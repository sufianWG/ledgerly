"use client";

import { useEffect, useState } from "react";
import { FiSearch, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { authClient } from "@/lib/auth-client";
import { showToast } from "@/lib/toast";
import LessonCard from "@/components/LessonCard";
import LoadingSpinner from "@/components/shared/LoadingSpinner";

const categories = ["All Categories", "Personal Growth", "Career", "Relationships", "Mindset", "Mistakes Learned"];
const tones = ["All Tones", "Motivational", "Sad", "Realization", "Gratitude"];

const PublicLessonsPage = () => {
    const { data: session } = authClient.useSession();
    const user = session?.user;
    // console.log(user);

    const [lessons, setLessons] = useState([]);
    const [pagination, setPagination] = useState(null);
    const [initialLoading, setInitialLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("All Categories");
    const [tone, setTone] = useState("All Tones");
    const [sort, setSort] = useState("newest");
    const [page, setPage] = useState(1);

    // search, category, tone, sort - jekono ekta change hole page 1 e ferot jabe
    useEffect(() => {
        setPage(1);
    }, [search, category, tone, sort]);

    useEffect(() => {
        const fetchLessons = async () => {
            try {
                const categoryParam = category === "All Categories" ? "" : category;
                const toneParam = tone === "All Tones" ? "" : tone;
                const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/lessons?search=${encodeURIComponent(search)}&category=${encodeURIComponent(categoryParam)}&tone=${encodeURIComponent(toneParam)}&sort=${sort}&page=${page}&limit=6`);
                const result = await res.json();
                // console.log("public lessons fetched:", result);
                setLessons(result.lessons || []);
                setPagination(result.pagination || null);
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
    }, [search, category, tone, sort, page]);

    if (initialLoading) {
        return <LoadingSpinner></LoadingSpinner>;
    }

    return (
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-12">
            <p className="text-dll-accent text-xs font-semibold uppercase tracking-[0.14em] mb-3">The Library</p>
            <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-dll-heading mb-3">Browse Life Lessons</h1>
            <p className="text-dll-muted text-sm max-w-xl mb-8">Lessons shared by real people, on everything from heartbreak to career pivots.</p>

            <div className="flex flex-col lg:flex-row lg:items-center gap-4 mb-6">
                <div className="relative flex-1 max-w-md">
                    <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-dll-muted" size={16}></FiSearch>
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search lessons by title or keyword..."
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-dll-border bg-transparent text-sm text-dll-text focus:outline-none focus:border-dll-accent"
                    ></input>
                </div>
                <div className="flex items-center gap-3">
                    <select value={sort} onChange={(e) => setSort(e.target.value)} className="rounded-xl border border-dll-border bg-transparent px-3 py-2.5 text-sm text-dll-text min-w-[150px]">
                        <option value="newest">Sort: Newest</option>
                        <option value="mostSaved">Sort: Most Saved</option>
                    </select>
                    <select value={tone} onChange={(e) => setTone(e.target.value)} className="rounded-xl border border-dll-border bg-transparent px-3 py-2.5 text-sm text-dll-text min-w-[140px]">
                        {tones.map((t) => <option key={t} value={t}>{t === "All Tones" ? t : `Tone: ${t}`}</option>)}
                    </select>
                </div>
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

            {pagination && lessons.length > 0 &&
                <p className="text-sm text-dll-muted mb-4">
                    Showing <span className="font-semibold text-dll-heading">{(pagination.currentPage - 1) * pagination.limit + 1}–{(pagination.currentPage - 1) * pagination.limit + lessons.length}</span> of <span className="font-semibold text-dll-heading">{pagination.totalLessons}</span> lessons
                </p>
            }

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-7">
                {lessons.map((lesson) => {
                    // admin er jonno kono lock nai, shob kichu admin dekhte parbe
                    const isLocked = lesson.accessLevel === "Premium" && !user?.isPremium && lesson.creatorEmail !== user?.email && user?.role !== "admin";
                    return <LessonCard key={lesson._id} lesson={lesson} isLocked={isLocked}></LessonCard>;
                })}
            </div>

            {pagination && pagination.totalPages > 1 &&
                <div className="flex items-center justify-center gap-2 mt-12">
                    <button
                        onClick={() => setPage((p) => p - 1)}
                        disabled={!pagination.previousPageStatus}
                        className="w-9 h-9 rounded-lg border border-dll-border flex items-center justify-center text-dll-muted disabled:opacity-40 disabled:cursor-not-allowed hover:text-dll-text"
                    >
                        <FiChevronLeft size={16}></FiChevronLeft>
                    </button>

                    {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((pageNum) => (
                        <button
                            key={pageNum}
                            onClick={() => setPage(pageNum)}
                            className={`w-9 h-9 rounded-lg border text-sm font-semibold transition ${pageNum === pagination.currentPage ? "bg-dll-primary border-dll-primary text-white" : "border-dll-border text-dll-muted hover:text-dll-text"}`}
                        >
                            {pageNum}
                        </button>
                    ))}

                    <button
                        onClick={() => setPage((p) => p + 1)}
                        disabled={!pagination.nextPageStatus}
                        className="w-9 h-9 rounded-lg border border-dll-border flex items-center justify-center text-dll-muted disabled:opacity-40 disabled:cursor-not-allowed hover:text-dll-text"
                    >
                        <FiChevronRight size={16}></FiChevronRight>
                    </button>
                </div>
            }
        </div>
    );
};

export default PublicLessonsPage;
