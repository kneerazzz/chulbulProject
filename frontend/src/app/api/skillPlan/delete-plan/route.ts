import { API_BASE_URL } from "@/lib/api";
import { requireAuth } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest){
    try {
        const token = await requireAuth();
    
        if(!token){
            throw new NextResponse("Token not found-unauthorised request", {status: 401} )
        }
        const cookieHeader = req.cookies.toString()
        const url = new URL(req.url)
        const skillPlanId = url.searchParams.get("skillPlanId")
    
        const backendRes = await fetch(`${API_BASE_URL}/skillplans/c/${skillPlanId}/delete-skill-plan`, {
            method: "DELETE",
            headers: {
                cookie: cookieHeader,
                ...(token ? {Authorization: `Bearer ${token}`}: {})
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
        console.log("Error in delete skill plan API: ", error)
        return new NextResponse('Unauthorized', {status: 401})
    }

}