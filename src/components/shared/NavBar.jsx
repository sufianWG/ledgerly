"use client";

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Avatar } from '@heroui/react';
import { FaBars, FaXmark } from 'react-icons/fa6';
import { HiSparkles } from 'react-icons/hi2';
import Logo from '@/assets/ledgerly-wt-light.png';
import NavLink from './NavLink';
import AvatarMenu from './AvatarMenu';
import { authClient } from '@/lib/auth-client';
import { showToast } from '@/lib/toast';

const NavBar = () => {
    const [avatarMenuOpen, setAvatarMenuOpen] = useState(false);
    const [open, setOpen] = useState(false);
    const { data: session } = authClient.useSession();
    const router = useRouter();
    const user = session?.user;

    const handleSignIn = () => {
        router.push('/login');
    }

    const handleSignOut = async () => {
        const { error } = await authClient.signOut();
        if (!error) {
            showToast.success("Logged out successfully");
            router.push('/login');
        } else {
            showToast.error("Something went wrong while logging out");
        }
    }

    const navItems = [
        { label: 'Home', path: '/' },
        { label: 'Public Lessons', path: '/public-lessons' },
    ];

    if (user) {
        navItems.push({ label: 'Add Lesson', path: '/dashboard/add-lesson' });
        navItems.push({ label: 'My Lessons', path: '/dashboard/my-lessons' });
        if (!user.isPremium) {
            navItems.push({ label: 'Pricing', path: '/pricing' });
        }
    }

    return (
        <div className="relative w-full bg-dll-surface text-dll-text shadow-md z-50 sticky top-0 backdrop-blur-md">
            <nav className="relative container mx-auto py-4 px-6 flex items-center justify-between gap-3">
                <Link href="/" className="logo">
                    <Image src={Logo} alt="Digital Life Lessons" width={140} height={40} priority ></Image>
                </Link>
                <div className={`z-[60] navitems absolute left-1/2 top-full w-screen -translate-x-1/2 flex flex-col items-start gap-3 bg-dll-surface px-6 py-4 shadow-lg transition-all duration-300 ease-in-out lg:static lg:w-auto lg:translate-x-0 lg:flex-row lg:items-center lg:gap-6 lg:bg-transparent lg:p-0 lg:shadow-none ${open ? "visible translate-y-0 opacity-100" : "invisible -translate-y-2 opacity-0 lg:visible lg:translate-y-0 lg:opacity-100"}`}>
                    {navItems.map((navItem, ind) => (
                        <NavLink key={ind} href={navItem.path} className="lg:mx-2 text-dll-text hover:text-dll-primary" setOpen={setOpen}>
                            {navItem.label}
                        </NavLink>
                    ))}
                    {user?.isPremium &&
                        <span className="flex items-center gap-1 text-xs font-semibold text-dll-accent">
                            <HiSparkles ></HiSparkles> Premium
                        </span>
                    }
                </div>
                <div className='rightitems flex gap-3 items-center'>
                    {user ? (
                        <div className='relative' onMouseEnter={() => setAvatarMenuOpen(true)} onMouseLeave={() => setAvatarMenuOpen(false)}>
                            <Avatar size="md">
                                <Avatar.Image
                                    src={user?.image}
                                    alt={user?.name}
                                    referrerPolicy="no-referrer"
                                ></Avatar.Image>
                                <Avatar.Fallback>{user?.name?.charAt(0)}</Avatar.Fallback>
                            </Avatar>
                            {avatarMenuOpen && <AvatarMenu user={user} handleSignIn={handleSignIn} handleSignOut={handleSignOut} ></AvatarMenu>}
                        </div>
                    ) : (
                        <div className="hidden sm:flex items-center gap-2">
                            <Link href="/login" className="px-4 py-2 text-sm font-medium text-dll-text hover:text-dll-primary transition">
                                Log In
                            </Link>
                            <Link href="/register" className="px-4 py-2 text-sm font-medium rounded-full bg-dll-primary text-white hover:bg-dll-primary-hover transition">
                                Sign Up
                            </Link>
                        </div>
                    )}
                    <button className="lg:hidden" onClick={() => setOpen(!open)}>
                        {open ? <FaXmark size={22} ></FaXmark> : <FaBars size={22} ></FaBars>}
                    </button>
                </div>
            </nav>
        </div>
    );
};

export default NavBar;
