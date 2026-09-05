"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button, Modal, Switch } from "@heroui/react";
import { FiEye, FiTrash2 } from "react-icons/fi";
import { authClient } from "@/lib/auth-client";
import { showToast } from "@/lib/toast";
import LoadingSpinner from "@/components/shared/LoadingSpinner";

const ReportedLessons = () => {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deleteTarget, setDeleteTarget] = useState(null);

    const fetchReports = async () => {
        try {
            const { data: tokenData } = await authClient.token();
            const token = tokenData?.token;

            const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/admin/reports`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const result = await res.json();
            // console.log("reports fetched:", result);
            setReports(result.reports || []);
        } catch (error) {
            // console.error("fetchReports error:", error);
            showToast.error("Could not reach the server, please try again");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchReports();
    }, []);

    const toggleStatus = async (reportId, isResolved) => {
        try {
            const { data: tokenData } = await authClient.token();
            const token = tokenData?.token;
            const status = isResolved ? "Resolved" : "Pending";

            const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/admin/reports/${reportId}/status`, {
                method: "PATCH",
                headers: {
                    "content-type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ status })
            });
            const result = await res.json();

            if (res.ok && result.success) {
                showToast.success(result.message);
                fetchReports();
            } else {
                showToast.error("Could not update this report");
            }
        } catch (error) {
            // console.error("toggleStatus error:", error);
            showToast.error("Could not reach the server, please try again");
        }
    }

    const confirmDelete = async () => {
        if (!deleteTarget) return;
        try {
            const { data: tokenData } = await authClient.token();
            const token = tokenData?.token;

            const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/lessons/${deleteTarget.lessonId}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` }
            });
            const result = await res.json();

            if (res.ok && result.success) {
                showToast.success("Lesson deleted");
                fetchReports();
            } else {
                showToast.error("Could not delete the lesson");
            }
        } catch (error) {
            // console.error("confirmDelete error:", error);
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
            <h1 className="font-serif text-xl font-semibold text-dll-heading mb-1">Reported Lessons</h1>
            <p className="text-sm text-dll-muted mb-6">Lessons users have flagged, along with the reason.</p>

            <div className="bg-dll-surface rounded-2xl border border-dll-border overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[900px]">
                        <thead>
                            <tr className="border-b border-dll-border bg-dll-surface-alt">
                                <th className="text-left py-3 px-6 text-xs font-semibold text-dll-muted uppercase">Lesson</th>
                                <th className="text-left py-3 px-4 text-xs font-semibold text-dll-muted uppercase">Reported By</th>
                                <th className="text-left py-3 px-4 text-xs font-semibold text-dll-muted uppercase">Reason</th>
                                <th className="text-left py-3 px-4 text-xs font-semibold text-dll-muted uppercase">Resolved</th>
                                <th className="text-right py-3 px-6 text-xs font-semibold text-dll-muted uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-dll-border">
                            {reports.length === 0 &&
                                <tr>
                                    <td colSpan={5} className="text-center py-10 text-sm text-dll-muted">No reports yet</td>
                                </tr>
                            }
                            {reports.map((report) => (
                                <tr key={report._id} className="hover:bg-dll-surface-alt/50">
                                    <td className="py-3 px-6">
                                        <p className="text-sm font-semibold text-dll-heading truncate max-w-[220px]">{report.lessonTitle}</p>
                                    </td>
                                    <td className="py-3 px-4">
                                        <p className="text-sm text-dll-text truncate max-w-[180px]">{report.reporterName}</p>
                                        <p className="text-xs text-dll-muted truncate max-w-[180px]">{report.reporterEmail}</p>
                                    </td>
                                    <td className="py-3 px-4">
                                        <span className="inline-block text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-dll-warning-bg text-dll-warning">{report.reason}</span>
                                        {report.details &&
                                            <p className="text-xs text-dll-muted mt-1 max-w-[220px] truncate">{report.details}</p>
                                        }
                                    </td>
                                    <td className="py-3 px-4">
                                        <Switch
                                            size="sm"
                                            isSelected={report.status === "Resolved"}
                                            onChange={(checked) => toggleStatus(report._id, checked)}
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
                                            <Link href={`/public-lessons/${report.lessonId}`} className="w-8 h-8 rounded-lg border border-dll-border flex items-center justify-center text-dll-muted hover:text-dll-text">
                                                <FiEye size={14}></FiEye>
                                            </Link>
                                            <button onClick={() => setDeleteTarget(report)} className="w-8 h-8 rounded-lg border border-dll-border flex items-center justify-center text-dll-muted hover:text-dll-error">
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

            <Modal isOpen={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
                <Modal.Backdrop>
                    <Modal.Container size="sm">
                        <Modal.Dialog>
                            <Modal.Header>
                                <Modal.Heading>Delete this lesson?</Modal.Heading>
                                <Modal.CloseTrigger></Modal.CloseTrigger>
                            </Modal.Header>
                            <Modal.Body>
                                <p className="text-sm text-dll-muted">&quot;{deleteTarget?.lessonTitle}&quot; will be permanently removed, along with any reports on it. This action cannot be undone.</p>
                            </Modal.Body>
                            <Modal.Footer>
                                <Button onPress={() => setDeleteTarget(null)} className="flex-1 rounded-xl py-2.5 text-sm font-semibold border border-dll-border text-dll-text">Cancel</Button>
                                <Button onPress={confirmDelete} className="flex-1 rounded-xl py-2.5 text-sm font-semibold text-white bg-dll-error">Delete Permanently</Button>
                            </Modal.Footer>
                        </Modal.Dialog>
                    </Modal.Container>
                </Modal.Backdrop>
            </Modal>
        </div>
    );
};

export default ReportedLessons;
