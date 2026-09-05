import Link from "next/link";
import { FiCheckCircle } from "react-icons/fi";
import { stripe } from "@/lib/stripe";
import { upgradeToPremium } from "@/lib/actions/premium";

export const metadata = {
    title: "Payment Successful — Digital Life Lessons",
};

// webhook use korchi na, tai user checkout theke ferot ashar por
// direct stripe theke session status check kore isPremium update kori
const PaymentSuccessPage = async ({ searchParams }) => {
    const { session_id } = await searchParams;

    if (!session_id) {
        return (
            <div className="min-h-[70vh] flex items-center justify-center px-6 text-center">
                <p className="text-sm text-dll-error">No payment session found.</p>
            </div>
        );
    }

    const checkoutSession = await stripe.checkout.sessions.retrieve(session_id);
    // console.log("checkout session status:", checkoutSession.status);

    let upgradeFailed = false;
    if (checkoutSession.status === "complete") {
        try {
            const result = await upgradeToPremium();
            console.log("upgradeToPremium result:", result);
        } catch (error) {
            // ledgerly-server jokhon chalu thakbe na, tokhon account upgrade e somoshsha hote pare, seta handle korar jonno
            console.error("upgradeToPremium error:", error);
            upgradeFailed = true;
        }
    }

    return (
        <div className="min-h-[70vh] flex items-center justify-center px-6 text-center">
            <div className="max-w-md w-full">
                <div className="w-16 h-16 rounded-full bg-dll-success-bg flex items-center justify-center mx-auto mb-5">
                    <FiCheckCircle size={28} className="text-dll-success"></FiCheckCircle>
                </div>
                <h1 className="font-serif text-2xl font-semibold text-dll-heading mb-2">Payment Successful!</h1>
                {upgradeFailed ? (
                    <p className="text-sm text-dll-warning mb-8">
                        Your payment went through, but we couldn&apos;t update your account automatically. Please contact support so we can activate your Premium access.
                    </p>
                ) : (
                    <p className="text-sm text-dll-muted mb-8">
                        Thank you for upgrading. Your account now has lifetime Premium access.
                    </p>
                )}
                <Link href="/dashboard/user" className="bg-dll-accent text-white px-6 py-3 rounded-full font-semibold text-sm">
                    Go to Dashboard
                </Link>
            </div>
        </div>
    );
};

export default PaymentSuccessPage;
