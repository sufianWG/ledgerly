"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Button, FieldError, Form, Input, Label, TextField } from "@heroui/react";
import { FiShield } from "react-icons/fi";
import { FaEye } from "react-icons/fa";
import { IoMdEyeOff } from "react-icons/io";
import { CiLock } from "react-icons/ci";
import { authClient } from "@/lib/auth-client";
import { showToast } from "@/lib/toast";
import { setInitialPassword } from "@/lib/actions/password";

const validateNewPassword = (value) => {
    if (value.length < 6) {
        return "Password must be at least 6 characters long";
    }
    if (!/[A-Z]/.test(value)) {
        return "Password must contain at least one uppercase letter";
    }
    if (!/[a-z]/.test(value)) {
        return "Password must contain at least one lowercase letter";
    }
    return null;
};

const AdminProfile = () => {
    const { data: session, refetch } = authClient.useSession();
    const user = session?.user;

    const [isSaving, setIsSaving] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const [hasPassword, setHasPassword] = useState(null);

    useEffect(() => {
        // google diye account banano thakle "credential" provider linked thakbe na,
        // tar mane already kono password set nai
        const checkPasswordStatus = async () => {
            const { data } = await authClient.listAccounts();
            // console.log(data)
            const hasCredential = data?.some((account) => account.providerId === "credential");
            setHasPassword(!!hasCredential);
        }
        checkPasswordStatus();
    }, []);

    const onSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const { name, image } = Object.fromEntries(formData.entries());
        // console.log("updating admin profile:", { name, image });

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

    const onChangePassword = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const { currentPassword, newPassword, confirmPassword } = Object.fromEntries(formData.entries());
        // console.log("changing admin password");

        if (newPassword !== confirmPassword) {
            showToast.error("New password and confirm password do not match");
            return;
        }

        setIsChangingPassword(true);

        // google diye admin account banano hoyeche, ekhono password set kora nai - tai eibar current password lagbe na 1st time password change korar jonno
        if (!hasPassword) {
            const result = await setInitialPassword(newPassword);
            setIsChangingPassword(false);

            if (result.success) {
                showToast.success("Password set successfully");
                setHasPassword(true);
                e.currentTarget.reset();
            } else {
                showToast.error(result.message);
            }
            return;
        }

        const { error } = await authClient.changePassword({
            currentPassword,
            newPassword,
            revokeOtherSessions: true
        });
        setIsChangingPassword(false);

        if (error) {
            showToast.error(error.message || "Could not update password, please try again");
        } else {
            showToast.success("Password updated successfully");
            e.currentTarget.reset();
        }
    };

    return (
        <div>
            <p className="text-xs text-dll-muted">Dashboard</p>
            <h1 className="font-serif text-xl font-semibold text-dll-heading mb-6">My Profile</h1>

            <div className="bg-dll-surface rounded-2xl border border-dll-border p-6 flex flex-col sm:flex-row items-center sm:items-start gap-6">
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
                        <span className="flex items-center gap-1 text-xs font-semibold text-dll-primary">
                            <FiShield></FiShield> Admin
                        </span>
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

            {hasPassword !== null &&
            <div className="bg-dll-surface rounded-2xl border border-dll-border p-6 mt-6">
                <h2 className="font-serif text-lg font-semibold text-dll-heading mb-4">Change Password</h2>

                {hasPassword === false &&
                    <p className="text-xs text-dll-muted bg-dll-surface-alt rounded-xl px-3 py-2 mb-4 max-w-md">You signed up with Google, so no password is set yet. Set one below to also be able to log in with email and password.</p>
                }

                <Form className="flex flex-col gap-4 max-w-md" onSubmit={onChangePassword}>
                    {hasPassword &&
                        <TextField isRequired name="currentPassword" type={isVisible ? "text" : "password"}>
                            <Label className="text-xs font-medium text-dll-text mb-1 block">Current Password</Label>
                            <div className="relative">
                                <CiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-dll-muted pointer-events-none"></CiLock>
                                <Input placeholder="••••••••" className="w-full rounded-xl border border-dll-border bg-transparent pl-10 pr-11 py-2 text-sm text-dll-text focus:outline-none focus:border-dll-accent"></Input>
                                <Button
                                    isIconOnly
                                    size="sm"
                                    variant="ghost"
                                    aria-label={isVisible ? "Hide password" : "Show password"}
                                    onPress={() => setIsVisible(!isVisible)}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 text-dll-muted"
                                >
                                    {isVisible ? <FaEye size={16}></FaEye> : <IoMdEyeOff size={16}></IoMdEyeOff>}
                                </Button>
                            </div>
                            <FieldError className="text-xs text-dll-error"></FieldError>
                        </TextField>
                    }

                    <TextField isRequired name="newPassword" type={isVisible ? "text" : "password"} validate={validateNewPassword}>
                        <Label className="text-xs font-medium text-dll-text mb-1 block">New Password</Label>
                        <div className="relative">
                            <CiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-dll-muted pointer-events-none"></CiLock>
                            <Input placeholder="Create a new password" className="w-full rounded-xl border border-dll-border bg-transparent pl-10 pr-11 py-2 text-sm text-dll-text focus:outline-none focus:border-dll-accent"></Input>
                            <Button
                                isIconOnly
                                size="sm"
                                variant="ghost"
                                aria-label={isVisible ? "Hide password" : "Show password"}
                                onPress={() => setIsVisible(!isVisible)}
                                className="absolute right-2 top-1/2 -translate-y-1/2 text-dll-muted"
                            >
                                {isVisible ? <FaEye size={16}></FaEye> : <IoMdEyeOff size={16}></IoMdEyeOff>}
                            </Button>
                        </div>
                        <FieldError className="text-xs text-dll-error"></FieldError>
                        <p className="text-xs text-dll-muted">At least 6 characters, with an uppercase and a lowercase letter.</p>
                    </TextField>

                    <TextField isRequired name="confirmPassword" type={isVisible ? "text" : "password"}>
                        <Label className="text-xs font-medium text-dll-text mb-1 block">Confirm New Password</Label>
                        <div className="relative">
                            <CiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-dll-muted pointer-events-none"></CiLock>
                            <Input placeholder="Re-type new password" className="w-full rounded-xl border border-dll-border bg-transparent pl-10 pr-11 py-2 text-sm text-dll-text focus:outline-none focus:border-dll-accent"></Input>
                            <Button
                                isIconOnly
                                size="sm"
                                variant="ghost"
                                aria-label={isVisible ? "Hide password" : "Show password"}
                                onPress={() => setIsVisible(!isVisible)}
                                className="absolute right-2 top-1/2 -translate-y-1/2 text-dll-muted"
                            >
                                {isVisible ? <FaEye size={16}></FaEye> : <IoMdEyeOff size={16}></IoMdEyeOff>}
                            </Button>
                        </div>
                        <FieldError className="text-xs text-dll-error"></FieldError>
                    </TextField>

                    <Button type="submit" isDisabled={isChangingPassword} className="self-start bg-dll-primary text-white text-sm font-semibold px-5 py-2 rounded-xl">
                        {isChangingPassword ? "Updating..." : "Update Password"}
                    </Button>
                </Form>
            </div>
            }
        </div>
    );
};

export default AdminProfile;
