import { cookies } from "next/headers";

export async function getAcccessToken() {
    const cookieStore = await cookies();
    return cookieStore.get("accessToken")?.value || null;
}

export async function requireAuth() {
    const token = await getAcccessToken();
    if(!token){
        console.log("Unauthorised access - no token found");
        throw new Error("Unauthorised");
    }
    return token;
}