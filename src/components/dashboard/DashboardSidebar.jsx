"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiGrid, FiPlusCircle, FiBookOpen, FiHeart, FiUser, FiCreditCard } from "react-icons/fi";

const sidebarSections = [
    {
        label: "Overview",
        links: [
            { label: "Dashboard Home", path: "/dashboard", icon: FiGrid },
        ]
    },
    {
        label: "My Lessons",
        links: [
            { label: "Add Lesson", path: "/dashboard/add-lesson", icon: FiPlusCircle },
            { label: "My Lessons", path: "/dashboard/my-lessons", icon: FiBookOpen },
            { label: "My Favorites", path: "/dashboard/my-favorites", icon: FiHeart },
        ]
    },
    {
        label: "Account",
        links: [
            { label: "Profile", path: "/dashboard/profile", icon: FiUser },
            { label: "Pricing / Upgrade", path: "/pricing", icon: FiCreditCard },
        ]
    }
];

const DashboardSidebar = ({ onLinkClick }) => {
    const pathname = usePathname();
    // console.log("current pathname:", pathname);

    return (
        <nav className="flex-1 px-4 py-6 space-y-5 overflow-y-auto">
            {sidebarSections.map((section) => (
                <div key={section.label}>
                    <p className="px-3 mb-2 text-[11px] font-semibold uppercase tracking-wide text-dll-muted">{section.label}</p>
                    <div className="space-y-1">
                        {section.links.map((link) => {
                            const isActive = pathname === link.path;
                            const Icon = link.icon;
                            return (
                                <Link
                                    key={link.path}
                                    href={link.path}
                                    onClick={onLinkClick}
                                    className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition ${isActive ? "bg-dll-primary text-white" : "text-dll-muted hover:bg-dll-surface-alt hover:text-dll-text"}`}
                                >
                                    <Icon size={17}></Icon>
                                    {link.label}
                                </Link>
                            );
                        })}
                    </div>
                </div>
            ))}
        </nav>
    );
};

export default DashboardSidebar;
