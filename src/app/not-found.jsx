"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FiSearch, FiHome } from "react-icons/fi";
import Logo from "@/assets/ledgerly-wt.png";

const NotFound = () => {
    const [query, setQuery] = useState("");
    const router = useRouter();

    const handleSearch = (e) => {
        e.preventDefault();
        router.push(`/public-lessons?search=${encodeURIComponent(query)}`);
    };

    return (
        <div className="min-h-screen flex flex-col bg-dll-background">
            <div className="px-6 lg:px-10 py-7">
                <Link href="/" className="inline-flex items-center gap-2.5">
                    <Image src={Logo} alt="Digital Life Lessons" width={130} height={36} ></Image>
                </Link>
            </div>

            <main className="flex-1 flex items-center justify-center px-6 py-16">
                <div className="max-w-xl w-full text-center">
                    <p className="font-serif text-dll-accent text-[90px] sm:text-[110px] font-semibold leading-none mb-2">404</p>
                    <p className="text-dll-accent text-xs font-semibold uppercase tracking-[0.14em] mb-3">Page Not Found</p>
                    <h1 className="font-serif text-dll-heading text-[26px] sm:text-[32px] font-semibold mb-4 leading-tight">
                        This page didn&apos;t make it into the book.
                    </h1>
                    <p className="text-dll-muted text-[15px] max-w-md mx-auto mb-9 leading-relaxed">
                        The lesson you&apos;re looking for may have been moved, renamed, or perhaps it was never written at all.
                    </p>

                    <form onSubmit={handleSearch} className="relative max-w-md mx-auto mb-8">
                        <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-dll-muted" size={16} ></FiSearch>
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Search for a lesson instead..."
                            className="w-full pl-11 pr-4 py-2.5 rounded-full border border-dll-border bg-transparent text-dll-text text-sm focus:outline-none focus:border-dll-accent"
                        />
                    </form>

                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 bg-dll-accent text-white px-7 py-3 rounded-full font-semibold text-sm hover:opacity-90 transition"
                    >
                        <FiHome size={16} ></FiHome> Back to Home
                    </Link>
                </div>
            </main>
        </div>
    );
};

export default NotFound;
