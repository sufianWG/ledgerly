"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, FieldError, Form, Input, Label, Switch, TextField } from "@heroui/react";
import { FiUploadCloud, FiX } from "react-icons/fi";
import { authClient } from "@/lib/auth-client";
import { showToast } from "@/lib/toast";
import { uploadImage } from "@/lib/uploadImage";
import { CiLock } from "react-icons/ci";

const categories = ["Personal Growth", "Career", "Relationships", "Mindset", "Mistakes Learned"];
const tones = ["Motivational", "Sad", "Realization", "Gratitude"];

const AddLessonForm = () => {
    const { data: session } = authClient.useSession();
    const user = session?.user;
    const router = useRouter();

    const [description, setDescription] = useState("");
    const [isPublic, setIsPublic] = useState(true);
    const [accessLevel, setAccessLevel] = useState("Free");
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const wordCount = description.trim() ? description.trim().split(/\s+/).length : 0;
    const readingTime = Math.max(1, Math.ceil(wordCount / 200));

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    }

    const handleRemoveImage = () => {
        setImageFile(null);
        setImagePreview("");
    }

    const onSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const { title, category, tone } = Object.fromEntries(formData.entries());
        // console.log("lesson form values:", { title, category, tone, description, isPublic, accessLevel });

        if (!description.trim()) {
            return showToast.error("Please write the full lesson description");
        }
        if (!category) {
            return showToast.error("Please select a category");
        }
        if (!tone) {
            return showToast.error("Please select an emotional tone");
        }

        setIsSubmitting(true);
        try {
            let imageUrl = "";
            if (imageFile) {
                imageUrl = await uploadImage(imageFile);
            }

            const { data: tokenData } = await authClient.token();
            const token = tokenData?.token;
            // console.log(token);
            const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/lessons`, {
                method: "POST",
                headers: {
                    "content-type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    title,
                    description,
                    category,
                    emotionalTone: tone,
                    image: imageUrl,
                    visibility: isPublic ? "Public" : "Private",
                    accessLevel,
                    readingTime
                })
            });
            const result = await res.json();
            console.log("create lesson result:", result);

            if (res.ok && result.success) {
                showToast.success("Lesson published successfully");
                router.push("/dashboard/user/my-lessons");
            } else {
                showToast.error(result.message || "Failed to publish lesson");
            }
        } catch (error) {
            showToast.error("Something went wrong, please try again");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-3xl">
            <p className="text-dll-accent text-xs font-semibold uppercase tracking-[0.14em] mb-2">Share Your Wisdom</p>
            <h2 className="font-serif text-2xl font-semibold text-dll-heading mb-2">Write a new life lesson</h2>
            <p className="text-sm text-dll-muted mb-8">Take your time. The details you add here help others find and connect with your story.</p>

            <Form className="space-y-6" onSubmit={onSubmit}>
                <div className="bg-dll-surface rounded-2xl p-6 border border-dll-border">
                    <TextField isRequired name="title" type="text" maxLength={100}>
                        <Label className="block text-sm font-semibold text-dll-heading mb-2">Lesson Title <span className="text-dll-error">*</span></Label>
                        <Input placeholder="e.g. How Failure Became My Greatest Teacher" className="w-full rounded-xl border border-dll-border bg-transparent px-4 py-2.5 text-dll-text focus:outline-none focus:border-dll-accent"></Input>
                        <FieldError className="text-xs text-dll-error"></FieldError>
                    </TextField>
                </div>

                <div className="bg-dll-surface rounded-2xl p-6 border border-dll-border">
                    <label className="block text-sm font-semibold text-dll-heading mb-2">Full Description / Story / Insight <span className="text-dll-error">*</span></label>
                    <textarea
                        rows={8}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Tell the full story — what happened, what you felt, and what it taught you."
                        className="w-full rounded-xl border border-dll-border bg-transparent px-4 py-2.5 text-dll-text resize-none leading-relaxed focus:outline-none focus:border-dll-accent"
                    ></textarea>
                    <div className="flex items-center justify-between mt-1.5 text-xs text-dll-muted">
                        <span>~{readingTime} min read</span>
                        <span>{wordCount} words</span>
                    </div>
                </div>

                <div className="bg-dll-surface rounded-2xl p-6 border border-dll-border grid sm:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-semibold text-dll-heading mb-2">Category <span className="text-dll-error">*</span></label>
                        <select name="category" defaultValue="" className="w-full rounded-xl border border-dll-border bg-transparent px-4 py-2.5 text-dll-text focus:outline-none focus:border-dll-accent">
                            <option value="" disabled>Select a category</option>
                            {categories.map((c) => <option key={c} value={c} className="text-dll-surface">{c}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-dll-heading mb-2">Emotional Tone <span className="text-dll-error">*</span></label>
                        <select name="tone" defaultValue="" className="w-full rounded-xl border border-dll-border bg-transparent px-4 py-2.5 text-dll-text focus:outline-none focus:border-dll-accent">
                            <option value="" disabled>Select a tone</option>
                            {tones.map((t) => <option key={t} value={t} className="text-dll-surface">{t}</option>)}
                        </select>
                    </div>
                </div>

                <div className="bg-dll-surface rounded-2xl p-6 border border-dll-border">
                    <label className="block text-sm font-semibold text-dll-heading mb-1">Featured Image <span className="text-dll-muted font-normal">(optional)</span></label>
                    <p className="text-xs text-dll-muted mb-4">A calm, relevant photo helps your lesson stand out in Public Lessons.</p>

                    {imagePreview ? (
                        <div>
                            <img src={imagePreview} alt="Preview" className="w-full max-h-56 object-cover rounded-xl mb-3"></img>
                            <Button onPress={handleRemoveImage} className="text-xs font-semibold text-dll-error flex items-center gap-1">
                                <FiX></FiX> Remove image
                            </Button>
                        </div>
                    ) : (
                        <label className="border-2 border-dashed border-dll-border rounded-xl p-8 text-center flex flex-col items-center cursor-pointer hover:border-dll-accent transition">
                            <FiUploadCloud size={28} className="text-dll-accent mb-2"></FiUploadCloud>
                            <span className="text-sm font-medium text-dll-heading">Click to upload an image</span>
                            <span className="text-xs text-dll-muted mt-1">PNG, JPG up to 5MB</span>
                            <input type="file" accept="image/*" onChange={handleImageChange} className="hidden"></input>
                        </label>
                    )}
                </div>

                <div className="bg-dll-surface rounded-2xl p-6 border border-dll-border flex items-center justify-between">
                    <div>
                        <label className="block text-sm font-semibold text-dll-heading mb-1">Visibility</label>
                        <p className="text-xs text-dll-muted">{isPublic ? "Public — anyone can find and read this lesson." : "Private — only visible to you."}</p>
                    </div>
                    <Switch size="md" isSelected={isPublic} onChange={setIsPublic}>
                        <Switch.Content>
                            <Switch.Control>
                                <Switch.Thumb></Switch.Thumb>
                            </Switch.Control>
                        </Switch.Content>
                    </Switch>
                </div>

                <div className="bg-dll-surface rounded-2xl p-6 border border-dll-border">
                    <label className="block text-sm font-semibold text-dll-heading mb-3">Access Level</label>
                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={() => setAccessLevel("Free")}
                            className={`flex-1 text-center px-4 py-3 rounded-xl border text-sm font-semibold transition ${accessLevel === "Free" ? "bg-dll-primary border-dll-primary text-white" : "border-dll-border text-dll-text"}`}
                        >
                            Free — visible to everyone
                        </button>
                        <button
                            type="button"
                            disabled={!user?.isPremium}
                            onClick={() => setAccessLevel("Premium")}
                            className={`flex-1 text-center px-4 py-3 rounded-xl border text-sm font-semibold transition flex gap-2 items-center ${accessLevel === "Premium" ? "bg-dll-accent border-dll-accent text-white" : "border-dll-border text-dll-text"} ${!user?.isPremium ? "opacity-50 cursor-not-allowed" : ""}`}
                        >
                            <CiLock size={16} ></CiLock> Premium — Premium members only
                        </button>
                    </div>
                    {!user?.isPremium &&
                        <p className="text-xs text-dll-muted mt-3">You&apos;re on the Free plan, so new lessons default to Free access. Upgrade to Premium to unlock this option.</p>
                    }
                </div>

                <Button type="submit" isDisabled={isSubmitting} className="w-full sm:w-auto sm:px-10 bg-dll-accent text-white font-semibold rounded-xl py-3.5 disabled:opacity-60">
                    {isSubmitting ? "Publishing..." : "Publish Lesson"}
                </Button>
            </Form>
        </div>
    );
};

export default AddLessonForm;
