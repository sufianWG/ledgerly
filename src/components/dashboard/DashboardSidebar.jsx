"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiGrid, FiPlusCircle, FiBookOpen, FiHeart, FiUser, FiCreditCard, FiUsers, FiFlag } from "react-icons/fi";

const userSections = [
    {
        label: "Overview",
        links: [
            { label: "Dashboard Home", path: "/dashboard/user", icon: FiGrid },
        ]
    },
    {
        label: "My Lessons",
        links: [
            { label: "Add Lesson", path: "/dashboard/user/add-lesson", icon: FiPlusCircle },
            { label: "My Lessons", path: "/dashboard/user/my-lessons", icon: FiBookOpen },
            { label: "My Favorites", path: "/dashboard/user/my-favorites", icon: FiHeart },
        ]
    },
    {
        label: "Account",
        links: [
            { label: "Profile", path: "/dashboard/user/profile", icon: FiUser },
            { label: "Pricing / Upgrade", path: "/pricing", icon: FiCreditCard },
        ]
    }
];

// admin er route link user er theke completely alada, tai role onujayi alada section map
const adminSections = [
    {
        label: "Overview",
        links: [
            { label: "Dashboard Home", path: "/dashboard/admin", icon: FiGrid },
        ]
    },
    {
        label: "Manage",
        links: [
            { label: "Manage Users", path: "/dashboard/admin/users", icon: FiUsers },
            { label: "Manage Lessons", path: "/dashboard/admin/lessons", icon: FiBookOpen },
            { label: "Reported Lessons", path: "/dashboard/admin/reported-lessons", icon: FiFlag },
        ]
    },
    {
        label: "Account",
        links: [
            { label: "Profile", path: "/dashboard/admin/profile", icon: FiUser },
        ]
    }
];

const DashboardSidebar = ({ role, onLinkClick }) => {
    const pathname = usePathname();
    // console.log("sidebar role:", role, "pathname:", pathname);

    const sidebarSections = role === "admin" ? adminSections : userSections;

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
