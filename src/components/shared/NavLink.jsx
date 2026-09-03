"use client"

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NavLink = ({ href, children, className, setOpen }) => {
    const currentPath = usePathname()

    const isActive = currentPath === href;

    return (
        <Link href={href} className={`${isActive ? "text-base font-bold text-dll-primary border-b-3 border-dll-primary transition-colors duration-500 ease-in-out" : className}`} onClick={() => setOpen(false)}>
            {children}
        </Link>
    );
};

export default NavLink;
