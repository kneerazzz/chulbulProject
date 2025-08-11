import { cookies } from "next/headers";

export async function getAcccessToken() {
    const cookieStore = await cookies();
    const allCookies = cookieStore.getAll();
    return cookieStore.get("accessToken")?.value || null;
}

export async function requireAuth() {
    const token = await getAcccessToken();
    console.log("Token in requireAuth:", token);
    if(!token){
        console.log("Unauthorised access - no token found");
        throw new Error("Unauthorised");
    }
    return token;
}