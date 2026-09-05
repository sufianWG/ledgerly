import Link from "next/link";
import { FiXCircle } from "react-icons/fi";

export const metadata = {
    title: "Payment Cancelled — Digital Life Lessons",
};

const PaymentCancelPage = () => {
    return (
        <div className="min-h-[70vh] flex items-center justify-center px-6 text-center">
            <div className="max-w-md w-full">
                <div className="w-16 h-16 rounded-full bg-dll-error-bg flex items-center justify-center mx-auto mb-5">
                    <FiXCircle size={28} className="text-dll-error"></FiXCircle>
                </div>
                <h1 className="font-serif text-2xl font-semibold text-dll-heading mb-2">Payment Cancelled</h1>
                <p className="text-sm text-dll-muted mb-8">
                    Your payment was not completed. No charge was made — feel free to try again whenever you&apos;re ready.
                </p>
                <Link href="/pricing" className="bg-dll-accent text-white px-6 py-3 rounded-full font-semibold text-sm">
                    Back to Pricing
                </Link>
            </div>
        </div>
    );
};

export default PaymentCancelPage;
