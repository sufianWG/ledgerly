import Link from "next/link";

const CTABanner = () => {
    return (
        <div className="px-6 lg:px-10 pb-20 pt-4 bg-dll-surface-alt">
            <div className="max-w-5xl mx-auto bg-gradient-to-br from-dll-primary via-dll-primary to-dll-secondary rounded-[32px] px-8 py-16 lg:py-20 text-center relative overflow-hidden">
                <div className="absolute -top-16 -left-16 w-64 h-64 rounded-full bg-dll-accent/25 blur-3xl"></div>
                <div className="absolute -bottom-16 -right-16 w-64 h-64 rounded-full bg-white/10 blur-3xl"></div>
                <div className="relative">
                    <h2 className="font-serif text-white text-[28px] lg:text-[38px] font-semibold mb-5 leading-tight">
                        Your story might be someone else&apos;s turning point.
                    </h2>
                    <p className="text-white/70 max-w-lg mx-auto mb-9 text-[15px]">
                        Join a community that turns hard-earned experience into lessons worth keeping — for you, and for everyone who reads them.
                    </p>
                    <Link href="/dashboard/user/add-lesson" className="bg-dll-accent text-white inline-block px-9 py-4 rounded-full font-semibold text-sm hover:opacity-90 transition">
                        Create Your First Lesson
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default CTABanner;
