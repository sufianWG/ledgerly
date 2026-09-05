"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Switch } from "@heroui/react";
import { FiSearch, FiEye, FiTrash2 } from "react-icons/fi";
import { authClient } from "@/lib/auth-client";
import { showToast } from "@/lib/toast";
import LoadingSpinner from "@/components/shared/LoadingSpinner";

const ManageLessons = () => {
    const [lessons, setLessons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [visibilityFilter, setVisibilityFilter] = useState("All");
    const [deleteTarget, setDeleteTarget] = useState(null);

    const fetchLessons = async () => {
        try {
            const { data: tokenData } = await authClient.token();
            const token = tokenData?.token;

            const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/admin/lessons`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const result = await res.json();
            // console.log("all lessons fetched:", result);
            setLessons(result.lessons || []);
        } catch (error) {
            // console.error("fetchLessons error:", error);
            showToast.error("Could not reach the server, please try again");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchLessons();
    }, []);

    // shudhu title diye search kortesi, r visibility diye filter
    const filteredLessons = lessons
        .filter((lesson) => lesson.title?.toLowerCase().includes(search.toLowerCase()))
        .filter((lesson) => visibilityFilter === "All" || lesson.visibility === visibilityFilter);

    const toggleFeatured = async (lessonId, isFeatured) => {
        try {
            const { data: tokenData } = await authClient.token();
            const token = tokenData?.token;

            const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/lessons/${lessonId}`, {
                method: "PATCH",
                headers: {
                    "content-type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ isFeatured })
            });
            const result = await res.json();

            if (res.ok && result.success) {
                showToast.success(isFeatured ? "Lesson featured" : "Lesson unfeatured");
                fetchLessons();
            } else {
                showToast.error("Could not update this lesson");
            }
        } catch (error) {
            console.error("toggleFeatured error:", error);
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

            if (res.ok && result.success) {
                showToast.success("Lesson deleted");
                fetchLessons();
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
            <p className="text-xs text-dll-muted">Dashboard</p>
            <h1 className="font-serif text-xl font-semibold text-dll-heading mb-1">Manage Lessons</h1>
            <p className="text-sm text-dll-muted mb-6">Every lesson on Ledgerly, public and private.</p>

            <div className="bg-dll-surface rounded-2xl border border-dll-border p-5 mb-6 flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="relative flex-1 max-w-sm">
                    <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-dll-muted" size={16}></FiSearch>
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search lessons by title..."
                        className="w-full pl-10 pr-3 py-2 rounded-xl border border-dll-border bg-transparent text-sm text-dll-text focus:outline-none focus:border-dll-accent"
                    ></input>
                </div>
                <select value={visibilityFilter} onChange={(e) => setVisibilityFilter(e.target.value)} className="rounded-xl border border-dll-border bg-transparent px-3 py-2 text-sm text-dll-text">
                    <option value="All">Visibility: All</option>
                    <option value="Public">Public</option>
                    <option value="Private">Private</option>
                </select>
            </div>

            <div className="bg-dll-surface rounded-2xl border border-dll-border overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[900px]">
                        <thead>
                            <tr className="border-b border-dll-border bg-dll-surface-alt">
                                <th className="text-left py-3 px-6 text-xs font-semibold text-dll-muted uppercase">Lesson</th>
                                <th className="text-left py-3 px-4 text-xs font-semibold text-dll-muted uppercase">Creator</th>
                                <th className="text-left py-3 px-4 text-xs font-semibold text-dll-muted uppercase">Visibility</th>
                                <th className="text-left py-3 px-4 text-xs font-semibold text-dll-muted uppercase">Featured</th>
                                <th className="text-right py-3 px-6 text-xs font-semibold text-dll-muted uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-dll-border">
                            {filteredLessons.length === 0 &&
                                <tr>
                                    <td colSpan={5} className="text-center py-10 text-sm text-dll-muted">No lessons found</td>
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
                                    <td className="py-3 px-4">
                                        <p className="text-sm text-dll-text truncate max-w-[180px]">{lesson.creatorName}</p>
                                        <p className="text-xs text-dll-muted truncate max-w-[180px]">{lesson.creatorEmail}</p>
                                    </td>
                                    <td className="py-3 px-4">
                                        <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${lesson.visibility === "Public" ? "bg-dll-success/10 text-dll-success" : "bg-dll-muted/10 text-dll-muted"}`}>
                                            {lesson.visibility}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4">
                                        <Switch
                                            size="sm"
                                            isSelected={lesson.isFeatured || false}
                                            onChange={(checked) => toggleFeatured(lesson._id, checked)}
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

export default ManageLessons;
