import Link from "next/link";

export const metadata = {
    title: "Unauthorized — Digital Life Lessons",
};

const UnauthorizedPage = () => {
    return (
        <div className="min-h-[70vh] flex items-center justify-center px-6 text-center">
            <div>
                <p className="text-dll-accent text-xs font-semibold uppercase tracking-[0.14em] mb-3">Access Denied</p>
                <h1 className="font-serif text-2xl font-semibold text-dll-heading mb-3">You don&apos;t have permission to view this page.</h1>
                <p className="text-sm text-dll-muted mb-8">This area is restricted based on your account role.</p>
                <Link href="/" className="bg-dll-accent text-white px-6 py-3 rounded-full font-semibold text-sm">Back to Home</Link>
            </div>
        </div>
    );
};

export default UnauthorizedPage;
