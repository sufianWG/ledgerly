import Link from "next/link";

const Home = () => {
  return (
    <div className="bg-dll-background min-h-[70vh] flex items-center justify-center px-6 py-24">
      <div className="max-w-2xl text-center">
        <p className="text-dll-accent text-xs font-semibold uppercase tracking-[0.14em] mb-3">Digital Life Lessons</p>
        <h1 className="font-serif text-dll-heading text-[36px] sm:text-[46px] leading-tight font-semibold mb-6">
          Every hard day teaches something worth <span className="italic text-dll-primary">keeping.</span>
        </h1>
        <p className="text-dll-muted text-[16px] leading-relaxed mb-9">
          Write down what life has taught you, and learn from what it&apos;s taught everyone else.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link href="/register" className="bg-dll-accent text-white px-7 py-3 rounded-full font-semibold text-sm hover:opacity-90 transition">
            Start Writing
          </Link>
          <Link href="/public-lessons" className="border border-dll-border text-dll-text px-7 py-3 rounded-full font-semibold text-sm hover:bg-dll-surface-alt transition">
            Explore Lessons
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
