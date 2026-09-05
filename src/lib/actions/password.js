"use server";

import { headers } from "next/headers";
import { auth } from "../auth";

// google diye account banano hoyeche emon user er kono password thake na,
// tai eta better-auth er serverOnly setPassword route - current password chara e prothombar password set kore
export const setInitialPassword = async (newPassword) => {
    try {
        await auth.api.setPassword({
            body: { newPassword },
            headers: await headers()
        });
        return { success: true };
    } catch (error) {
        return {
            success: false,
            message: error?.body?.message || "Could not set password"
        };
    }
}
