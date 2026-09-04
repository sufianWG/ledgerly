"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Avatar } from "@heroui/react";
import { FiMenu, FiX } from "react-icons/fi";
import Logo from "@/assets/ledgerly-wt-light.png";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import AvatarMenu from "@/components/shared/AvatarMenu";
import { authClient } from "@/lib/auth-client";
import { showToast } from "@/lib/toast";

export default function DashboardLayout({ children }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [avatarMenuOpen, setAvatarMenuOpen] = useState(false);
    const { data: session } = authClient.useSession();
    const router = useRouter();
    const user = session?.user;
    // console.log("dashboard user", user);
    const avatarRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (avatarRef.current && !avatarRef.current.contains(e.target)) {
                setAvatarMenuOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSignOut = async () => {
        const { error } = await authClient.signOut();
        if (!error) {
            showToast.success("Logged out successfully");
            router.push("/login");
        } else {
            showToast.error("Something went wrong while logging out");
        }
    }

    return (
        <div className="flex min-h-screen bg-dll-background">
            {/* mobile e sidebar overlay hisebe dekhabe, desktop e always visible */}
            <aside className={`fixed lg:static inset-y-0 left-0 z-40 w-64 shrink-0 border-r border-dll-border bg-dll-surface flex flex-col transition-transform duration-300 lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
                <Link href="/" className="flex items-center gap-2.5 px-6 h-[76px] border-b border-dll-border shrink-0">
                    <Image src={Logo} alt="Digital Life Lessons" width={130} height={36}></Image>
                </Link>
                <DashboardSidebar onLinkClick={() => setSidebarOpen(false)}></DashboardSidebar>
            </aside>

            {sidebarOpen &&
                <div className="fixed inset-0 z-30 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)}></div>
            }

            <div className="flex-1 min-w-0">
                <header className="sticky top-0 z-20 bg-dll-background/90 backdrop-blur-md border-b border-dll-border">
                    <div className="flex items-center justify-between h-[76px] px-6 lg:px-10">
                        <button className="lg:hidden text-dll-text" onClick={() => setSidebarOpen(true)}>
                            <FiMenu size={22}></FiMenu>
                        </button>

                        <div ref={avatarRef} className="relative ml-auto">
                            <button onClick={() => setAvatarMenuOpen((prev) => !prev)}>
                                <Avatar size="md">
                                    <Avatar.Image
                                        src={user?.image}
                                        alt={user?.name}
                                        referrerPolicy="no-referrer"
                                    ></Avatar.Image>
                                    <Avatar.Fallback>{user?.name?.charAt(0)}</Avatar.Fallback>
                                </Avatar>
                            </button>
                            {avatarMenuOpen && <AvatarMenu user={user} handleSignOut={handleSignOut}></AvatarMenu>}
                        </div>
                    </div>
                </header>

                <main className="px-6 lg:px-10 py-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
