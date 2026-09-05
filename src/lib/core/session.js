import { redirect } from "next/navigation";
import { auth } from "../auth";
import { headers } from "next/headers";

export const getUserSession = async () => {
    const session = await auth.api.getSession({
        headers: await headers()
    })

    return session?.user || null;
}

export const getUserToken = async () => {
    const { token } = await auth.api.getToken({
        headers: await headers()
    })

    return token || null;
}

export const requireRole = async (role) => {
    const user = await getUserSession()
    // console.log("requireRole check:", role, user?.role);
    if (!user) {
        redirect('/login')
    }
    if (user?.role !== role) {
        redirect('/unauthorized')
    }
    return user;
}
