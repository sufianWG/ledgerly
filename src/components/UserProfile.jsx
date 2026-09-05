"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Button, FieldError, Form, Input, Label, TextField } from "@heroui/react";
import { HiSparkles } from "react-icons/hi2";
import { authClient } from "@/lib/auth-client";
import { showToast } from "@/lib/toast";
import LessonCard from "@/components/LessonCard";
import LoadingSpinner from "@/components/shared/LoadingSpinner";

const UserProfile = () => {
    const { data: session, refetch } = authClient.useSession();
    const user = session?.user;

    const [lessons, setLessons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

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
            } finally {
                setLoading(false);
            }
        }
        fetchMyLessons();
    }, []);

    const onSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const { name, image } = Object.fromEntries(formData.entries());
        // console.log("updating profile:", { name, image });

        setIsSaving(true);
        const { error } = await authClient.updateUser({ 
            name, 
            image: image || undefined 
        });
        setIsSaving(false);

        if (error) {
            showToast.error(error.message || "Could not update profile, please try again");
        } else {
            showToast.success("Profile updated successfully");
            refetch();
        }
    };

    // ei user er nijer public lesson gula filter kore ber kora, my-lessons theke
    const publicLessons = lessons.filter((lesson) => lesson.visibility === "Public");

    return (
        <div>
            <p className="text-xs text-dll-muted">Dashboard</p>
            <h1 className="font-serif text-xl font-semibold text-dll-heading mb-6">My Profile</h1>

            <div className="bg-dll-surface rounded-2xl border border-dll-border p-6 mb-8 flex flex-col sm:flex-row items-center sm:items-start gap-6">
                <Image
                    src={user?.image || "https://i.pravatar.cc/150"}
                    alt={user?.name}
                    width={80}
                    height={80}
                    className="rounded-full object-cover"
                ></Image>

                <div className="flex-1 w-full">
                    <div className="flex items-center gap-2 mb-1">
                        <p className="font-serif text-lg font-semibold text-dll-heading">{user?.name}</p>
                        {user?.isPremium &&
                            <span className="flex items-center gap-1 text-xs font-semibold text-dll-accent">
                                <HiSparkles></HiSparkles> Premium
                            </span>
                        }
                    </div>
                    <p className="text-sm text-dll-muted mb-5">{user?.email}</p>

                    <Form className="flex flex-col sm:flex-row gap-3" onSubmit={onSubmit}>
                        <TextField name="name" defaultValue={user?.name} className="flex-1">
                            <Label className="text-xs font-medium text-dll-text mb-1 block">Name</Label>
                            <Input className="w-full rounded-xl border border-dll-border bg-transparent px-3 py-2 text-sm text-dll-text focus:outline-none focus:border-dll-accent"></Input>
                            <FieldError className="text-xs text-dll-error"></FieldError>
                        </TextField>
                        <TextField name="image" defaultValue={user?.image || ""} className="flex-1">
                            <Label className="text-xs font-medium text-dll-text mb-1 block">Photo URL</Label>
                            <Input placeholder="https://..." className="w-full rounded-xl border border-dll-border bg-transparent px-3 py-2 text-sm text-dll-text focus:outline-none focus:border-dll-accent"></Input>
                        </TextField>
                        <Button type="submit" isDisabled={isSaving} className="self-end bg-dll-primary text-white text-sm font-semibold px-5 py-2 rounded-xl">
                            {isSaving ? "Saving..." : "Save"}
                        </Button>
                    </Form>
                </div>
            </div>

            <h2 className="font-serif text-lg font-semibold text-dll-heading mb-4">My Public Lessons</h2>

            {loading ? (
                <LoadingSpinner></LoadingSpinner>
            ) : publicLessons.length === 0 ? (
                <p className="text-sm text-dll-muted">You don&apos;t have any public lessons yet.</p>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-7">
                    {publicLessons.map((lesson) => (
                        <LessonCard key={lesson._id} lesson={lesson} isLocked={false}></LessonCard>
                    ))}
                </div>
            )}
        </div>
    );
};

export default UserProfile;
