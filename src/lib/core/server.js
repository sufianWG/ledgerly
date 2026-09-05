import { getUserToken } from "./session";

const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL;

export const authHeader = async () => {
    const token = await getUserToken();
    return token ? { authorization: `Bearer ${token}` } : {};
}

export const serverMutation = async (path, data, method = "PATCH") => {
    const res = await fetch(`${baseUrl}${path}`, {
        method: method,
        headers: {
            "content-type": "application/json",
            ...await authHeader()
        },
        body: JSON.stringify(data)
    });

    return res.json();
}