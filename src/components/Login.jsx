"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button, FieldError, Form, Input, Label, Separator, TextField } from "@heroui/react";
import { FaEye } from "react-icons/fa";
import { IoMdEyeOff } from "react-icons/io";
import { HiOutlineMail } from "react-icons/hi";
import { CiLock } from "react-icons/ci";
import { FcGoogle } from "react-icons/fc";
import { authClient } from "@/lib/auth-client";
import { showToast } from "@/lib/toast";

const Login = ({ redirectTo = "/" }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();

    const onSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const { email, password } = Object.fromEntries(formData.entries());
        // console.log("logging in:", email);

        setIsSubmitting(true);
        const { error } = await authClient.signIn.email({
            email,
            password,
            callbackURL: redirectTo,
            rememberMe: true
        });
        setIsSubmitting(false);

        if (error) {
            showToast.error(error.message || "Login failed, please check your credentials");
        } else {
            showToast.success("Logged in successfully");
            router.push(redirectTo);
        }
    };

    const handleGoogleSignIn = async () => {
        const { error } = await authClient.signIn.social({
            provider: "google",
            callbackURL: redirectTo
        });
        if (error) {
            showToast.error("Google sign in failed, please try again");
        }
    };

    return (
        <main className="bg-dll-background">
            <div className="grid lg:min-h-[calc(100vh-73px)] lg:grid-cols-2">
                <section className="hidden lg:flex flex-col justify-between p-14 bg-gradient-to-br from-dll-primary via-dll-primary to-dll-secondary text-white">
                    <p className="font-serif text-xl font-semibold">Digital Life Lessons</p>
                    <div className="max-w-md">
                        <p className="font-serif text-5xl text-white/50 leading-none mb-2">&ldquo;</p>
                        <p className="font-serif text-[26px] leading-snug mb-4">
                            Every login is a chance to add one more page to a story worth remembering.
                        </p>
                    </div>
                    <p className="text-white/60 text-sm">Join a community that turns hard-earned experience into wisdom worth keeping.</p>
                </section>

                <section className="flex items-center justify-center px-6 py-16 sm:px-12">
                    <div className="w-full max-w-sm">
                        <p className="text-dll-accent text-xs font-semibold uppercase tracking-[0.14em] mb-3">Welcome back</p>
                        <h1 className="font-serif text-dll-heading text-3xl font-semibold mb-2">Log in to continue</h1>
                        <p className="text-dll-muted text-sm mb-8">Pick up where you left off, or discover something new today.</p>

                        <Button
                            onPress={handleGoogleSignIn}
                            className="w-full flex items-center justify-center gap-3 rounded-xl border border-dll-border py-3 mb-6 text-sm font-medium text-dll-text bg-dll-surface-alt hover:bg-dll-surface-elevated"
                        >
                            <FcGoogle size={18}></FcGoogle> Continue with Google
                        </Button>

                        <div className="flex items-center gap-4 mb-6">
                            <Separator className="flex-1"></Separator>
                            <span className="text-xs text-dll-muted uppercase tracking-wide">or</span>
                            <Separator className="flex-1"></Separator>
                        </div>

                        <Form className="flex flex-col gap-5" onSubmit={onSubmit}>
                            <TextField
                                isRequired
                                name="email"
                                type="email"
                                validate={(value) => {
                                    if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)) {
                                        return "Please enter a valid email address";
                                    }
                                    return null;
                                }}
                            >
                                <Label className="text-sm font-medium text-dll-text">Email address</Label>
                                <div className="relative">
                                    <HiOutlineMail className="absolute left-4 top-1/2 -translate-y-1/2 text-dll-muted pointer-events-none"></HiOutlineMail>
                                    <Input placeholder="you@example.com" className="rounded-xl border border-dll-border bg-transparent pl-11 py-2.5 w-full text-dll-text focus:outline-none focus:border-dll-accent"></Input>
                                </div>
                                <FieldError className="text-xs text-dll-error"></FieldError>
                            </TextField>

                            <TextField
                                isRequired
                                name="password"
                                type={isVisible ? "text" : "password"}
                                validate={(value) => {
                                    if (value.length < 6) {
                                        return "Password must be at least 6 characters";
                                    }
                                    return null;
                                }}
                            >
                                <Label className="text-sm font-medium text-dll-text">Password</Label>
                                <div className="relative">
                                    <CiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-dll-muted pointer-events-none"></CiLock>
                                    <Input placeholder="Input your passowrd" className="rounded-xl border border-dll-border bg-transparent pl-11 pr-11 py-2.5 w-full text-dll-text focus:outline-none focus:border-dll-accent"></Input>
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

                            <Button
                                type="submit"
                                isDisabled={isSubmitting}
                                className="w-full bg-dll-primary text-white font-semibold rounded-xl py-3 hover:bg-dll-primary-hover disabled:opacity-60"
                            >
                                {isSubmitting ? "Logging in..." : "Log In"}
                            </Button>
                        </Form>

                        <p className="text-center text-sm text-dll-muted mt-8">
                            Don&apos;t have an account?{" "}
                            <Link href={`/register?redirect=${encodeURIComponent(redirectTo)}`} className="text-dll-accent font-semibold hover:underline">Create one free</Link>
                        </p>
                    </div>
                </section>
            </div>
        </main>
    );
};

export default Login;
