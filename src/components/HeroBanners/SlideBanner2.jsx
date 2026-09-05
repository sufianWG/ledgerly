import Image from "next/image";
import Link from "next/link";
import { FiUsers } from "react-icons/fi";

const SlideBanner2 = () => {
    return (
        <div className="relative overflow-hidden bg-gradient-to-br from-dll-secondary/10 via-dll-background to-dll-background">
            <div className="absolute bottom-0 left-1/4 w-[300px] h-[300px] rounded-full bg-dll-primary/10 blur-3xl"></div>

            <div className="relative max-w-7xl mx-auto px-6 lg:px-10 pt-16 pb-20 lg:pt-24 lg:pb-24 grid lg:grid-cols-2 gap-14 items-center">
                <div className="relative h-[340px] lg:h-[380px] order-2 lg:order-1">
                    <div className="absolute top-0 left-4 w-44 rotate-[-6deg] rounded-2xl overflow-hidden border border-dll-border shadow-lg">
                        <Image src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=400&h=480&fit=crop" alt="" width={176} height={220} className="w-full h-[220px] object-cover"></Image>
                    </div>
                    <div className="absolute top-6 right-0 w-48 rotate-[5deg] rounded-2xl overflow-hidden border border-dll-border shadow-lg">
                        <Image src="https://images.unsplash.com/photo-1521119989659-a83eee488004?w=400&h=480&fit=crop" alt="" width={192} height={240} className="w-full h-[240px] object-cover"></Image>
                    </div>
                    <div className="hidden md:flex absolute bottom-2 left-10 bg-dll-primary text-white rounded-2xl shadow-lg px-5 py-4 items-center gap-3">
                        <FiUsers size={20}></FiUsers>
                        <div>
                            <p className="text-sm font-bold leading-none">9,800+</p>
                            <p className="text-[11px] text-white/70">real stories shared</p>
                        </div>
                    </div>
                </div>

                <div className="order-1 lg:order-2">
                    <span className="inline-flex items-center gap-2 bg-dll-surface border border-dll-border text-dll-text text-xs font-medium px-4 py-1.5 rounded-full mb-7">
                        <span className="w-1.5 h-1.5 rounded-full bg-dll-accent"></span>
                        A wall of real, unfiltered stories
                    </span>

                    <h1 className="font-serif text-dll-heading text-[32px] sm:text-[40px] lg:text-[46px] leading-[1.12] font-semibold mb-6">
                        You are not the only one who&apos;s been <span className="italic text-dll-accent">there.</span>
                    </h1>

                    <p className="text-dll-muted text-[16px] leading-relaxed max-w-md mb-9">
                        Behind every lesson is a person who lived it first. Read what they wish someone had told them — and add your own when you&apos;re ready.
                    </p>

                    <div className="flex flex-wrap items-center gap-4">
                        <Link href="/public-lessons" className="bg-dll-accent text-white px-7 py-3 rounded-full font-semibold text-sm hover:opacity-90 transition">
                            Read Real Stories
                        </Link>
                        <Link href="/register" className="border border-dll-border text-dll-text px-7 py-3 rounded-full font-semibold text-sm hover:bg-dll-surface-alt transition">
                            Join the Community
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SlideBanner2;
