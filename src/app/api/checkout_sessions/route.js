import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { stripe } from "@/lib/stripe";
import { getUserSession } from "@/lib/core/session";

export async function POST() {
    try {
        const headersList = await headers();
        const origin = headersList.get("origin");

        const user = await getUserSession();
        if (!user) {
            return NextResponse.redirect(`${origin}/login`, 303);
        }

        const session = await stripe.checkout.sessions.create({
            customer_email: user.email,
            line_items: [
                {
                    price: process.env.STRIPE_PRODUCT_PRICE_ID,
                    quantity: 1,
                },
            ],
            mode: "payment",
            success_url: `${origin}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${origin}/payment/cancel`,
        });

        return NextResponse.redirect(session.url, 303);
    } catch (err) {
        console.error("checkout_sessions error:", err);
        return NextResponse.json(
            { error: err.message },
            { status: err.statusCode || 500 }
        );
    }
}
