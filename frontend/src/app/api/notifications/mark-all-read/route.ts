import { API_BASE_URL } from "@/lib/api";
import { requireAuth } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";


export async function PATCH(req: NextRequest){
    try {
            const token = await requireAuth()
            const cookieHeader = req.headers.get("cookie") || ""
        
            const backendRes = await fetch(`${API_BASE_URL}/notifications/mark-all-notifications-read`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    cookie: cookieHeader,
                    ...(token? {Authorization: `Bearer ${token}`} : {} )
                },
                credentials: 'include'
            })
            if(!backendRes.ok){
                const errorText = await backendRes.text()
                return new NextResponse(errorText, {status: backendRes.status})
            }
            const data = await backendRes.json()
            return NextResponse.json(data)
    } catch (error) {
        console.error("Error deleting topic", error)
        return new NextResponse("Unauthorised", {status: 401})
    }
}