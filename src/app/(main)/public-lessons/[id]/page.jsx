"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Button, Modal } from "@heroui/react";
import { FiLock, FiHeart, FiBookmark, FiFlag } from "react-icons/fi";
import { authClient } from "@/lib/auth-client";
import { showToast } from "@/lib/toast";
import LoadingSpinner from "@/components/shared/LoadingSpinner";

const LessonDetailsPage = () => {
    const { id } = useParams();
    // console.log(id)
    const { data: session } = authClient.useSession();
    const user = session?.user;
    const [lesson, setLesson] = useState(null);
    const [errorMessage, setErrorMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const [showReportModal, setShowReportModal] = useState(false);
    const [reportReason, setReportReason] = useState("Spam");
    const [reportDetails, setReportDetails] = useState("");
    const [isReporting, setIsReporting] = useState(false);

    useEffect(() => {
        const fetchLesson = async () => {
            try {
                const { data: tokenData } = await authClient.token();
                const token = tokenData?.token;

                const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/lessons/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const result = await res.json();
                // console.log("lesson details fetched:", result);

                if (!res.ok) {
                    setErrorMessage(result.message || "Could not load this lesson");
                } else {
                    setLesson(result);
                }
            } catch (error) {
                console.error("fetchLesson error:", error);
                setErrorMessage("Could not reach the server, please try again");
            } finally {
                setLoading(false);
            }
        }
        fetchLesson();
    }, [id]);

    const handleToggleLike = async () => {
        // optimistic update - aage thekei UI change kore dei, tarpor server call kori
        const alreadyLiked = lesson.likes?.includes(user?.email);
        setLesson((prev) => ({
            ...prev,
            likes: alreadyLiked
                ? prev.likes.filter((email) => email !== user?.email)
                : [...(prev.likes || []), user?.email]
        }));

        try {
            const { data: tokenData } = await authClient.token();
            const token = tokenData?.token;

            const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/lessons/${id}/like`, {
                method: "PATCH",
                headers: { Authorization: `Bearer ${token}` }
            });
            const result = await res.json();
            // console.log("like toggle result:", result);
            if (!res.ok) {
                showToast.error("Could not update like, please try again");
            }
        } catch (error) {
            // console.error("handleToggleLike error:", error);
            showToast.error("Could not reach the server, please try again");
        }
    }

    const handleToggleFavorite = async () => {
        // ekhane like er moto optimistic update na kore, server theke reply asha porjonto wait kori
        // karon isFavorited ekta simple true/false state, ei choto feature e eto tara-tari hote hobe na
        try {
            const { data: tokenData } = await authClient.token();
            const token = tokenData?.token;

            const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/lessons/${id}/favorite`, {
                method: "PATCH",
                headers: { Authorization: `Bearer ${token}` }
            });
            const result = await res.json();
            // console.log("favorite toggle result:", result);

            if (res.ok && result.success) {
                setLesson((prev) => ({ ...prev, isFavorited: result.favorited }));
                showToast.success(result.favorited ? "Saved to your favorites" : "Removed from favorites");
            } else {
                showToast.error("Could not update favorites, please try again");
            }
        } catch (error) {
            console.error("handleToggleFavorite error:", error);
            showToast.error("Could not reach the server, please try again");
        }
    }

    const handleReportSubmit = async () => {
        setIsReporting(true);
        try {
            const { data: tokenData } = await authClient.token();
            const token = tokenData?.token;

            const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/lessons/${id}/report`, {
                method: "POST",
                headers: {
                    "content-type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ reason: reportReason, details: reportDetails })
            });
            const result = await res.json();
            // console.log("report submit result:", result);

            if (res.ok && result.success) {
                showToast.success(result.message);
                setShowReportModal(false);
                setReportDetails("");
            } else {
                showToast.error(result.message || "Could not submit the report");
            }
        } catch (error) {
            // console.error("handleReportSubmit error:", error);
            showToast.error("Could not reach the server, please try again");
        }
        setIsReporting(false);
    }

    if (loading) {
        return <LoadingSpinner></LoadingSpinner>;
    }

    if (errorMessage) {
        return (
            <div className="max-w-2xl mx-auto px-6 py-24 text-center">
                <p className="text-sm text-dll-error">{errorMessage}</p>
                <Link href="/public-lessons" className="text-sm text-dll-accent font-semibold hover:underline mt-4 inline-block">Back to Public Lessons</Link>
            </div>
        );
    }

    if (lesson.locked) {
        return (
            <div className="max-w-2xl mx-auto px-6 py-24 text-center">
                <div className="w-14 h-14 rounded-full bg-dll-accent/15 flex items-center justify-center mx-auto mb-4">
                    <FiLock size={22} className="text-dll-accent"></FiLock>
                </div>
                <h1 className="font-serif text-2xl font-semibold text-dll-heading mb-2">{lesson.title}</h1>
                <p className="text-sm text-dll-muted mb-6">This is a Premium lesson. Upgrade your plan to read the full story.</p>
                <Link href="/pricing" className="bg-dll-accent text-white text-sm font-semibold px-6 py-3 rounded-full">Upgrade to Premium</Link>
            </div>
        );
    }

    return (
        <div>
            <div className="max-w-3xl mx-auto px-6 pt-8">
                <div className="flex items-center gap-2 text-sm text-dll-muted">
                    <Link href="/" className="hover:text-dll-accent transition">Home</Link>
                    <span>/</span>
                    <Link href="/public-lessons" className="hover:text-dll-accent transition">Public Lessons</Link>
                    <span>/</span>
                    <span className="text-dll-heading">{lesson.category}</span>
                </div>
            </div>

            <header className="max-w-3xl mx-auto px-6 pt-8 pb-6">
                <div className="flex items-center gap-2.5 mb-5">
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-dll-primary/10 text-dll-primary">{lesson.category}</span>
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-dll-surface-alt text-dll-heading">{lesson.emotionalTone}</span>
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full text-white ${lesson.accessLevel === "Premium" ? "bg-dll-accent" : "bg-dll-primary"}`}>{lesson.accessLevel}</span>
                </div>

                <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold text-dll-heading leading-tight mb-6">
                    {lesson.title}
                </h1>

                <div className="flex flex-wrap items-center gap-4 py-5 border-y border-dll-border">
                    <Image src={lesson.creatorImage || "https://i.pravatar.cc/100"} alt={lesson.creatorName} width={48} height={48} className="rounded-full object-cover"></Image>
                    <div>
                        <p className="text-sm font-semibold text-dll-heading leading-none mb-1">{lesson.creatorName}</p>
                        <p className="text-xs text-dll-muted">{new Date(lesson.createdAt).toLocaleDateString()} · {lesson.readingTime} min read</p>
                    </div>
                </div>
            </header>

            {lesson.image &&
                <div className="max-w-4xl mx-auto px-6 mb-10">
                    <div className="relative w-full h-[280px] sm:h-[420px] rounded-2xl overflow-hidden">
                        <Image src={lesson.image} alt={lesson.title} fill className="object-cover"></Image>
                    </div>
                </div>
            }

            <section className="max-w-3xl mx-auto px-6 pb-16">
                <div className="text-lg leading-[1.85] text-dll-text whitespace-pre-line">
                    {lesson.description}
                </div>

                <div className="mt-12 bg-dll-surface-alt rounded-2xl p-6">
                    <p className="text-dll-accent text-xs font-semibold uppercase tracking-[0.14em] mb-4">Lesson Details</p>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
                        <div>
                            <p className="text-xs text-dll-muted mb-1">Created</p>
                            <p className="text-sm font-medium text-dll-heading">{new Date(lesson.createdAt).toLocaleDateString()}</p>
                        </div>
                        <div>
                            <p className="text-xs text-dll-muted mb-1">Last Updated</p>
                            <p className="text-sm font-medium text-dll-heading">{new Date(lesson.updatedAt).toLocaleDateString()}</p>
                        </div>
                        <div>
                            <p className="text-xs text-dll-muted mb-1">Visibility</p>
                            <p className="text-sm font-medium text-dll-heading">{lesson.visibility}</p>
                        </div>
                        <div>
                            <p className="text-xs text-dll-muted mb-1">Reading Time</p>
                            <p className="text-sm font-medium text-dll-heading">{lesson.readingTime} min read</p>
                        </div>
                    </div>
                </div>

                <div className="mt-8 flex items-center gap-3">
                    <button
                        onClick={handleToggleLike}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl border transition ${lesson.likes?.includes(user?.email) ? "bg-dll-error-bg border-dll-error text-dll-error" : "border-dll-border text-dll-muted hover:text-dll-text"}`}
                    >
                        <FiHeart size={16} className={lesson.likes?.includes(user?.email) ? "fill-current" : ""}></FiHeart>
                        <span className="text-sm font-semibold">{lesson.likes?.length || 0}</span>
                        <span className="text-xs">Likes</span>
                    </button>

                    <button
                        onClick={handleToggleFavorite}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl border transition ${lesson.isFavorited ? "bg-dll-warning-bg border-dll-warning text-dll-warning" : "border-dll-border text-dll-muted hover:text-dll-text"}`}
                    >
                        <FiBookmark size={16} className={lesson.isFavorited ? "fill-current" : ""}></FiBookmark>
                        <span className="text-sm font-semibold">{lesson.isFavorited ? "Saved" : "Save"}</span>
                    </button>

                    {user?.email !== lesson.creatorEmail &&
                        <button
                            onClick={() => setShowReportModal(true)}
                            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl border border-dll-border text-dll-muted hover:text-dll-error transition ml-auto"
                        >
                            <FiFlag size={16}></FiFlag>
                            <span className="text-xs">Report</span>
                        </button>
                    }
                </div>
            </section>

            <Modal isOpen={showReportModal} onOpenChange={setShowReportModal}>
                <Modal.Backdrop>
                    <Modal.Container size="sm" className={"shadow"}>
                        <Modal.Dialog className="bg-dll-background shadow rounded-md">
                            <Modal.Header>
                                <Modal.Heading className="text-dll-accent">Report this lesson</Modal.Heading>
                                <Modal.CloseTrigger></Modal.CloseTrigger>
                            </Modal.Header>
                            <Modal.Body>
                                <p className="text-sm text-dll-muted mb-5">Tell us what&apos;s wrong, our team will review it.</p>

                                <label className="text-xs font-medium text-dll-text mb-1 block">Reason</label>
                                <select
                                    value={reportReason}
                                    onChange={(e) => setReportReason(e.target.value)}
                                    className="w-full rounded-xl border border-dll-border bg-transparent px-3 py-2 text-sm text-dll-text mb-4"
                                >
                                    <option value="Spam">Spam</option>
                                    <option value="Inappropriate Content">Inappropriate Content</option>
                                    <option value="Misleading Information">Misleading Information</option>
                                    <option value="Other">Other</option>
                                </select>

                                <label className="text-xs font-medium text-dll-text mb-1 block">Details (optional)</label>
                                <textarea
                                    value={reportDetails}
                                    onChange={(e) => setReportDetails(e.target.value)}
                                    rows={3}
                                    placeholder="Add any extra context..."
                                    className="w-full rounded-xl border border-dll-border bg-transparent px-3 py-2 text-sm text-dll-text resize-none"
                                ></textarea>
                            </Modal.Body>
                            <Modal.Footer>
                                <Button onPress={() => setShowReportModal(false)} className="flex-1 rounded-xl py-2.5 text-sm font-semibold border border-dll-border text-dll-text bg-dll-primary text-dll-surface">Cancel</Button>
                                <Button onPress={handleReportSubmit} isDisabled={isReporting} className="flex-1 rounded-xl py-2.5 text-sm font-semibold text-white bg-dll-error disabled:opacity-60">
                                    {isReporting ? "Submitting..." : "Submit Report"}
                                </Button>
                            </Modal.Footer>
                        </Modal.Dialog>
                    </Modal.Container>
                </Modal.Backdrop>
            </Modal>
        </div>
    );
};

export default LessonDetailsPage;
