import { API_BASE_URL } from "@/lib/api"
import { requireAuth } from "@/lib/auth"
import { NextRequest, NextResponse } from "next/server"


export async function GET(req: NextRequest){
    try {
            const token = await requireAuth()
            const cookieHeader = req.headers.get("cookie") || ""
        
            const url = new URL(req.url)
            const skillPlanId = url.searchParams.get("skillPlanId")
        
            const backendRes = await fetch(`${API_BASE_URL}/dailyTopics/c/${skillPlanId}/create-topic`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Cookie: cookieHeader,
                    ...(token ? {Authorization: `Bearer ${token}`} : {})
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
        console.error("Error in creating-topic", error)
        return new NextResponse("Unauthorised", {status: 401})
    }
}