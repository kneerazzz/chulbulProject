import { requireAuth } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest){
    try {
        const token = await requireAuth();
    
        if(!token){
            throw new NextResponse("Token now found-unauthorised request", {status: 401} )
        }
        const cookieHeader = req.cookies.toString()
        const url = new URL(req.url)
        const skillId = url.searchParams.get("skillId")
    
        const backendRes = await fetch(`http://localhost:4000/api/v1/skills/c/${skillId}/delete-skill`, {
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
        console.log("Error in delete skill API: ", error)
        return new NextResponse('Unauthorized', {status: 401})
    }

}