"use client"
import { Button } from "@heroui/react";
import Link from "next/link";

const AvatarMenu = ({ user, handleSignIn, handleSignOut }) => {
    return (
        <div className="absolute right-0 top-full z-[100] w-56 pt-2">
            <div className="overflow-hidden rounded-lg border border-dll-border bg-dll-surface p-2 shadow-lg">
                {user &&
                    <div className="px-4 py-2 mb-1 border-b border-dll-border">
                        <p className="text-sm font-semibold text-dll-heading truncate">{user.name}</p>
                        <p className="text-xs text-dll-muted truncate">{user.email}</p>
                    </div>
                }
                <Link href="/dashboard/profile" className="block rounded-md px-4 py-2 text-sm text-dll-text hover:bg-dll-surface-alt hover:text-dll-primary">
                    My Profile
                </Link>
                <Link href="/dashboard" className="block rounded-md px-4 py-2 text-sm text-dll-text hover:bg-dll-surface-alt hover:text-dll-primary">
                    Dashboard
                </Link>
                <div className="my-1 border-t border-dll-border"></div>
                {user ?
                    <Button onClick={handleSignOut} className="w-full rounded-md px-4 py-2 text-left text-sm bg-dll-error-bg text-dll-error hover:bg-dll-error hover:text-white">
                        Log Out
                    </Button>
                    :
                    <Button onClick={handleSignIn} className="w-full rounded-md px-4 py-2 text-left text-sm bg-dll-primary text-white hover:bg-dll-primary-hover">
                        Log In
                    </Button>
                }
            </div>
        </div>
    );
};

export default AvatarMenu;
