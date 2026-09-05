import Image from "next/image";
import Link from "next/link";
import { HiSparkles } from "react-icons/hi2";
import { FiCheck } from "react-icons/fi";

const checkItems = ["Unlimited premium reads", "Priority in public feed", "Ad-free experience", "Verified badge"];

const SlideBanner3 = () => {
    return (
        <div className="relative overflow-hidden">
            <div className="absolute inset-0">
                <Image src="https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?w=1600&h=900&fit=crop" alt="" fill className="object-cover"></Image>
                <div className="absolute inset-0 bg-gradient-to-r from-dll-background/95 via-dll-background/70 to-dll-background/20"></div>
            </div>

            <div className="relative max-w-7xl mx-auto px-6 lg:px-10 pt-20 pb-24 lg:pt-28 lg:pb-32">
                <div className="max-w-xl">
                    <span className="inline-flex items-center gap-2 bg-dll-accent text-white text-xs font-semibold px-4 py-1.5 rounded-full mb-7">
                        <HiSparkles></HiSparkles> Premium Membership
                    </span>

                    <h1 className="font-serif text-white text-[32px] sm:text-[40px] lg:text-[48px] leading-[1.1] font-semibold mb-6">
                        Go beyond the surface. Unlock the <span className="italic text-dll-accent">deeper</span> lessons.
                    </h1>

                    <p className="text-white/75 text-[16px] leading-relaxed mb-8">
                        Premium members get access to in-depth stories, ad-free reading, and priority visibility for their own lessons — for a one-time ৳1500.
                    </p>

                    <div className="grid grid-cols-2 gap-3 mb-9 max-w-md">
                        {checkItems.map((item) => (
                            <div key={item} className="flex items-center gap-2 text-white/85 text-sm">
                                <FiCheck className="text-dll-accent"></FiCheck> {item}
                            </div>
                        ))}
                    </div>

                    <div className="flex flex-wrap items-center gap-4">
                        <Link href="/pricing" className="bg-dll-accent text-white px-7 py-3 rounded-full font-semibold text-sm hover:opacity-90 transition">
                            Upgrade to Premium
                        </Link>
                        <Link href="/pricing" className="border border-white/35 text-white px-7 py-3 rounded-full font-semibold text-sm hover:bg-white/10 transition">
                            See What&apos;s Included
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SlideBanner3;
