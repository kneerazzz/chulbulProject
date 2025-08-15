import { API_BASE_URL } from "@/lib/api";
import { requireAuth } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";


export async function PATCH(req: NextRequest) {
    try{
        const token = await requireAuth();

        if(!token) {
            throw new NextResponse("Token not found - Unauthorised request", {status: 401})
        }
        const cookieHeader = req.cookies.toString()
        const url = new URL(req.url)

        const skillId = url.searchParams.get("skillId")

        const body = await req.json()

        const backendRes = await fetch(`${API_BASE_URL}/skills/c/${skillId}/update-skill`, {
            method: 'PATCH',
            headers: {
                "Content-Type": "application/json",
                cookie: cookieHeader,
                ...(token ? {Authorization: `Bearer ${token}`} : {})
            },
            credentials: 'include',
            body: JSON.stringify(body)
        })
        
        if(!backendRes.ok){
            const errorText = await backendRes.text()
            return new NextResponse(errorText, {status: backendRes.status})
        }
        const data = await backendRes.json()
        return NextResponse.json(data)

    }catch(error){
        console.log("Error in update skill API", error)
        return new NextResponse("Unauthorised", {status: 401})
    }
}