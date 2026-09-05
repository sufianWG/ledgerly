import Image from "next/image";
import Link from "next/link";
import { FiBookOpen } from "react-icons/fi";

const SlideBanner1 = () => {
    return (
        <div className="relative overflow-hidden bg-gradient-to-br from-dll-primary/15 via-dll-background to-dll-background">
            <div className="absolute -top-24 -right-24 w-[420px] h-[420px] rounded-full bg-dll-accent/20 blur-3xl"></div>

            <div className="relative max-w-7xl mx-auto px-6 lg:px-10 pt-16 pb-20 lg:pt-24 lg:pb-24 grid lg:grid-cols-2 gap-14 items-center">
                <div>
                    <span className="inline-flex items-center gap-2 bg-dll-surface border border-dll-border text-dll-text text-xs font-medium px-4 py-1.5 rounded-full mb-7">
                        <span className="w-1.5 h-1.5 rounded-full bg-dll-accent"></span>
                        12,400+ lessons shared by real people
                    </span>

                    <h1 className="font-serif text-dll-heading text-[36px] sm:text-[46px] lg:text-[52px] leading-[1.08] font-semibold mb-6">
                        Every hard day teaches something worth <span className="italic text-dll-primary">keeping.</span>
                    </h1>

                    <p className="text-dll-muted text-[16px] leading-relaxed max-w-md mb-9">
                        Digital Life Lessons is where people turn their mistakes, breakthroughs and quiet realizations into wisdom worth passing on.
                    </p>

                    <div className="flex flex-wrap items-center gap-4">
                        <Link href="/register" className="bg-dll-accent text-white px-7 py-3 rounded-full font-semibold text-sm hover:opacity-90 transition">
                            Start Writing
                        </Link>
                        <Link href="/public-lessons" className="border border-dll-border text-dll-text px-7 py-3 rounded-full font-semibold text-sm hover:bg-dll-surface-alt transition">
                            Explore Lessons
                        </Link>
                    </div>
                </div>

                <div className="relative">
                    <div className="relative bg-dll-surface rounded-3xl border border-dll-border p-8 lg:p-10 max-w-md ml-auto">
                        <FiBookOpen size={30} className="text-dll-accent/50 mb-3"></FiBookOpen>
                        <p className="font-serif text-dll-heading text-xl leading-snug mb-5">The greatest lessons rarely come wrapped in success — they come from the moments we almost gave up.</p>
                        <div className="flex items-center gap-3">
                            <Image src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=faces" alt="Amina Rahman" width={36} height={36} className="rounded-full object-cover"></Image>
                            <div>
                                <p className="text-sm font-semibold text-dll-heading">Amina Rahman</p>
                                <p className="text-xs text-dll-muted">Personal Growth</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SlideBanner1;
