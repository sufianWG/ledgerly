"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Switch } from "@heroui/react";
import { FiSearch, FiEye, FiEdit2, FiTrash2, FiPlus } from "react-icons/fi";
import { authClient } from "@/lib/auth-client";
import { showToast } from "@/lib/toast";
import LoadingSpinner from "@/components/shared/LoadingSpinner";

const categories = ["Personal Growth", "Career", "Relationships", "Mindset", "Mistakes Learned"];

const MyLessons = () => {
    const { data: session } = authClient.useSession();
    const user = session?.user;

    const [lessons, setLessons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const [categoryFilter, setCategoryFilter] = useState("All");
    const [sortBy, setSortBy] = useState("newest");
    const [deleteTarget, setDeleteTarget] = useState(null);

    const fetchMyLessons = async () => {
        setLoading(true);
        try {
            const { data: tokenData } = await authClient.token();
            const token = tokenData?.token;

            const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/my-lessons`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const result = await res.json();
            // console.log("my lessons fetched:", result);
            setLessons(result.lessons || []);
        } catch (error) {
            console.error("fetchMyLessons error:", error);
            showToast.error("Could not reach the server, please make sure it's running and try again");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (user) {
            fetchMyLessons();
        }
    }, [user]);

    // bangla comment: search, status, category diye filter kore, tarpor sort kore
    const filteredLessons = lessons
        .filter((lesson) => lesson.title?.toLowerCase().includes(search.toLowerCase()))
        .filter((lesson) => statusFilter === "All" || lesson.visibility === statusFilter)
        .filter((lesson) => categoryFilter === "All" || lesson.category === categoryFilter)
        .sort((a, b) => {
            if (sortBy === "mostLiked") return (b.likes?.length || 0) - (a.likes?.length || 0);
            if (sortBy === "mostSaved") return (b.savesCount || 0) - (a.savesCount || 0);
            return new Date(b.createdAt) - new Date(a.createdAt);
        });

    const stats = {
        total: lessons.length,
        public: lessons.filter((l) => l.visibility === "Public").length,
        private: lessons.filter((l) => l.visibility === "Private").length,
        totalLikes: lessons.reduce((sum, l) => sum + (l.likes?.length || 0), 0)
    }

    const toggleField = async (lessonId, field, value) => {
        try {
            const { data: tokenData } = await authClient.token();
            const token = tokenData?.token;

            const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/lessons/${lessonId}`, {
                method: "PATCH",
                headers: {
                    "content-type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ [field]: value })
            });
            const result = await res.json();
            if (res.ok && result.success) {
                setLessons((prev) => prev.map((l) => l._id === lessonId ? { ...l, [field]: value } : l));
            } else {
                showToast.error("Could not update the lesson");
            }
        } catch (error) {
            console.error("toggleField error:", error);
            showToast.error("Could not reach the server, please try again");
        }
    }

    const confirmDelete = async () => {
        if (!deleteTarget) return;
        try {
            const { data: tokenData } = await authClient.token();
            const token = tokenData?.token;

            const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/lessons/${deleteTarget._id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` }
            });
            const result = await res.json();
            console.log("delete lesson result:", result);

            if (res.ok && result.success) {
                showToast.success("Lesson deleted");
                setLessons((prev) => prev.filter((l) => l._id !== deleteTarget._id));
            } else {
                showToast.error("Could not delete the lesson");
            }
        } catch (error) {
            console.error("confirmDelete error:", error);
            showToast.error("Could not reach the server, please try again");
        }
        setDeleteTarget(null);
    }

    if (loading) {
        return <LoadingSpinner></LoadingSpinner>;
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <p className="text-xs text-dll-muted">Dashboard</p>
                    <h1 className="font-serif text-xl font-semibold text-dll-heading">My Lessons</h1>
                </div>
                <Link href="/dashboard/user/add-lesson" className="hidden sm:inline-flex items-center gap-2 bg-dll-accent text-white px-4 py-2.5 rounded-full text-sm font-semibold">
                    <FiPlus size={15}></FiPlus> Add Lesson
                </Link>
            </div>

            <div className="grid sm:grid-cols-4 gap-4 mb-6">
                <div className="bg-dll-surface rounded-2xl p-5 border border-dll-border">
                    <p className="font-serif text-xl font-semibold text-dll-heading">{stats.total}</p>
                    <p className="text-xs text-dll-muted mt-1">Total Lessons</p>
                </div>
                <div className="bg-dll-surface rounded-2xl p-5 border border-dll-border">
                    <p className="font-serif text-xl font-semibold text-dll-success">{stats.public}</p>
                    <p className="text-xs text-dll-muted mt-1">Public</p>
                </div>
                <div className="bg-dll-surface rounded-2xl p-5 border border-dll-border">
                    <p className="font-serif text-xl font-semibold text-dll-muted">{stats.private}</p>
                    <p className="text-xs text-dll-muted mt-1">Private</p>
                </div>
                <div className="bg-dll-surface rounded-2xl p-5 border border-dll-border">
                    <p className="font-serif text-xl font-semibold text-dll-accent">{stats.totalLikes}</p>
                    <p className="text-xs text-dll-muted mt-1">Total Likes</p>
                </div>
            </div>

            <div className="bg-dll-surface rounded-2xl border border-dll-border p-5 mb-6 flex flex-col lg:flex-row lg:items-center gap-4">
                <div className="relative flex-1 max-w-sm">
                    <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-dll-muted" size={16}></FiSearch>
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search your lessons..."
                        className="w-full pl-10 pr-3 py-2 rounded-xl border border-dll-border bg-transparent text-sm text-dll-text focus:outline-none focus:border-dll-accent"
                    ></input>
                </div>
                <div className="flex items-center gap-3 flex-wrap">
                    <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="rounded-xl border border-dll-border bg-transparent px-3 py-2 text-sm text-dll-text">
                        <option value="All">Status: All</option>
                        <option value="Public">Public</option>
                        <option value="Private">Private</option>
                    </select>
                    <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="rounded-xl border border-dll-border bg-transparent px-3 py-2 text-sm text-dll-text">
                        <option value="All">Category: All</option>
                        {categories.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="rounded-xl border border-dll-border bg-transparent px-3 py-2 text-sm text-dll-text">
                        <option value="newest">Sort: Newest</option>
                        <option value="mostLiked">Sort: Most Liked</option>
                        <option value="mostSaved">Sort: Most Saved</option>
                    </select>
                </div>
            </div>

            <div className="bg-dll-surface rounded-2xl border border-dll-border overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[900px]">
                        <thead>
                            <tr className="border-b border-dll-border bg-dll-surface-alt">
                                <th className="text-left py-3 px-6 text-xs font-semibold text-dll-muted uppercase">Lesson</th>
                                <th className="text-left py-3 px-4 text-xs font-semibold text-dll-muted uppercase">Created</th>
                                <th className="text-left py-3 px-4 text-xs font-semibold text-dll-muted uppercase">Likes</th>
                                <th className="text-left py-3 px-4 text-xs font-semibold text-dll-muted uppercase">Saves</th>
                                <th className="text-left py-3 px-4 text-xs font-semibold text-dll-muted uppercase">Public</th>
                                <th className="text-left py-3 px-4 text-xs font-semibold text-dll-muted uppercase">Premium Access</th>
                                <th className="text-right py-3 px-6 text-xs font-semibold text-dll-muted uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-dll-border">
                            {filteredLessons.length === 0 &&
                                <tr>
                                    <td colSpan={7} className="text-center py-10 text-sm text-dll-muted">No lessons found</td>
                                </tr>
                            }
                            {filteredLessons.map((lesson) => (
                                <tr key={lesson._id} className="hover:bg-dll-surface-alt/50">
                                    <td className="py-3 px-6">
                                        <div className="min-w-0">
                                            <p className="text-sm font-semibold text-dll-heading truncate max-w-[220px]">{lesson.title}</p>
                                            <span className="inline-block mt-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-dll-primary/10 text-dll-primary">{lesson.category}</span>
                                        </div>
                                    </td>
                                    <td className="py-3 px-4 text-sm text-dll-muted">{new Date(lesson.createdAt).toLocaleDateString()}</td>
                                    <td className="py-3 px-4 text-sm text-dll-text">{lesson.likes?.length || 0}</td>
                                    <td className="py-3 px-4 text-sm text-dll-text">{lesson.savesCount || 0}</td>
                                    <td className="py-3 px-4">
                                        <Switch
                                            size="sm"
                                            isSelected={lesson.visibility === "Public"}
                                            onChange={(checked) => toggleField(lesson._id, "visibility", checked ? "Public" : "Private")}
                                        >
                                            <Switch.Content>
                                                <Switch.Control>
                                                    <Switch.Thumb></Switch.Thumb>
                                                </Switch.Control>
                                            </Switch.Content>
                                        </Switch>
                                    </td>
                                    <td className="py-3 px-4">
                                        <Switch
                                            size="sm"
                                            isSelected={lesson.accessLevel === "Premium"}
                                            isDisabled={!user?.isPremium}
                                            onChange={(checked) => toggleField(lesson._id, "accessLevel", checked ? "Premium" : "Free")}
                                        >
                                            <Switch.Content>
                                                <Switch.Control>
                                                    <Switch.Thumb></Switch.Thumb>
                                                </Switch.Control>
                                            </Switch.Content>
                                        </Switch>
                                    </td>
                                    <td className="py-3 px-6">
                                        <div className="flex items-center justify-end gap-2">
                                            <Link href={`/public-lessons/${lesson._id}`} className="w-8 h-8 rounded-lg border border-dll-border flex items-center justify-center text-dll-muted hover:text-dll-text">
                                                <FiEye size={14}></FiEye>
                                            </Link>
                                            <Link href={`/dashboard/user/update-lesson/${lesson._id}`} className="w-8 h-8 rounded-lg border border-dll-border flex items-center justify-center text-dll-muted hover:text-dll-accent">
                                                <FiEdit2 size={14}></FiEdit2>
                                            </Link>
                                            <button onClick={() => setDeleteTarget(lesson)} className="w-8 h-8 rounded-lg border border-dll-border flex items-center justify-center text-dll-muted hover:text-dll-error">
                                                <FiTrash2 size={14}></FiTrash2>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {deleteTarget &&
                <div className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm flex items-center justify-center px-6" onClick={() => setDeleteTarget(null)}>
                    <div className="bg-dll-surface rounded-2xl border border-dll-border w-full max-w-sm p-7 text-center" onClick={(e) => e.stopPropagation()}>
                        <h3 className="font-serif text-lg font-semibold text-dll-heading mb-2">Delete this lesson?</h3>
                        <p className="text-sm text-dll-muted mb-6">&quot;{deleteTarget.title}&quot; will be permanently removed. This action cannot be undone.</p>
                        <div className="flex gap-3">
                            <button onClick={() => setDeleteTarget(null)} className="flex-1 rounded-xl py-2.5 text-sm font-semibold border border-dll-border text-dll-text">Cancel</button>
                            <button onClick={confirmDelete} className="flex-1 rounded-xl py-2.5 text-sm font-semibold text-white bg-dll-error">Delete Permanently</button>
                        </div>
                    </div>
                </div>
            }
        </div>
    );
};

export default MyLessons;
