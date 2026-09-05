import Image from "next/image";
import { HiSparkles } from "react-icons/hi2";

const TopContributors = async () => {
    let contributors = [];
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/top-contributors`, { cache: "no-store" });
        const result = await res.json();
        contributors = result.contributors || [];
    } catch (error) {
        console.error("TopContributors fetch error:", error);
    }

    if (contributors.length === 0) {
        return null;
    }

    return (
        <div className="py-20 px-6 lg:px-10 bg-dll-surface-alt">
            <div className="max-w-6xl mx-auto">
                <p className="text-dll-accent text-xs font-semibold uppercase tracking-[0.14em] mb-2">This Week</p>
                <h2 className="font-serif text-[32px] font-semibold text-dll-heading mb-10">Top Contributors</h2>

                <div className="flex gap-6 overflow-x-auto pb-2">
                    {contributors.map((contributor) => (
                        <div key={contributor.email} className="w-56 shrink-0 bg-dll-surface rounded-2xl p-6 border border-dll-border text-center">
                            <Image
                                src={contributor.image || "https://i.pravatar.cc/150"}
                                alt={contributor.name}
                                width={64}
                                height={64}
                                className="rounded-full object-cover mx-auto mb-3 ring-4 ring-dll-accent/15"
                            ></Image>
                            <h4 className="font-semibold text-sm text-dll-heading">{contributor.name}</h4>
                            <p className="text-xs text-dll-muted mb-3">{contributor.lessonCount} lessons · {contributor.totalLikes} likes</p>
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full bg-dll-accent/15 text-dll-accent">
                                <HiSparkles size={12}></HiSparkles> Top Voice
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TopContributors;
