import { API_BASE_URL } from "@/lib/api";
import { requireAuth } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(req: NextRequest) {
    try {
            const token  = requireAuth()
            const url = new URL(req.url)
            const cookieHeader = req.headers.get("cookie") || ''
            const body = await req.json()
            const skillPlanId = url.searchParams.get("skillPlanId")
        
            const backendRes = await fetch(`${API_BASE_URL}/skillplans/c/${skillPlanId}/update-skill-plan`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    cookie: cookieHeader,
                    ...(token ? {Authorization: `Bearer ${token}`} : {})
                },
                body: JSON.stringify(body),
                credentials: 'include'
            })
            if(!backendRes.ok){
                const errorText = await backendRes.text();
                return new NextResponse(errorText, {status: backendRes.status})
            }
            const data =  await backendRes.json()

            return NextResponse.json(data)
    } catch (error: any) {
        return new NextResponse(error, {status: 401})
    }
}