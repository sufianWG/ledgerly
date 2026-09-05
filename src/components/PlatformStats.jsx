const PlatformStats = async () => {
    let stats = { totalLessons: 0, totalUsers: 0, totalSaves: 0, totalLikes: 0 };
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/platform-stats`, { cache: "no-store" });
        stats = await res.json();
    } catch (error) {
        console.error("PlatformStats fetch error:", error);
    }

    const statsList = [
        { label: "Lessons Shared", value: stats.totalLessons },
        { label: "Active Members", value: stats.totalUsers },
        { label: "Lessons Saved", value: stats.totalSaves },
        { label: "Total Likes", value: stats.totalLikes },
    ];

    return (
        <div className="py-14 px-6 lg:px-10 bg-dll-background border-b border-dll-border">
            <div className="max-w-6xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
                {statsList.map((stat) => (
                    <div key={stat.label}>
                        <p className="font-serif text-[32px] font-semibold text-dll-heading">{stat.value}</p>
                        <p className="text-xs text-dll-muted mt-1">{stat.label}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PlatformStats;
