

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { notFound } from "next/navigation";
import { Skill } from "@/types";
import { api } from "@/lib/api";
import { cookies } from "next/headers";
import { error } from "console";

async function getSkill(skillId: string) {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;

    if(!accessToken){
      throw new Error("unauthorised")
    }

    console.log("frontend is working for now ig")

    const res = await fetch(`http://localhost:4000/api/v1/skills/c/${skillId}/get-skill`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        cache: "no-store", // to always fetch fresh data
      });

      if (!res.ok) {
        console.error("Failed to fetch skill:", await res.text());
        return null;
      }

      const data = await res.json();

      return data.data as Skill;
  } catch (error: any) {
    console.error("[Frontend] Error details:", error.response?.data || error.message);
    return null;
  }
}



export default async function SkillDetailPage({ params }: { params: Promise<{ skillId: string }> }) {
  const { skillId } = await params; // ✅ await it
  console.log("[Frontend] Route params received:", { skillId });

  const skill = await getSkill(skillId);
  if (!skill) {
    console.warn("[Frontend] Skill not found, returning 404");
    return notFound();
  }

  return (
    <div className="container mx-auto py-8 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">{skill.title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-medium">Category</h3>
            <p className="text-muted-foreground">{skill.category}</p>
          </div>
          <div>
            <h3 className="font-medium">Level</h3>
            <p className="text-muted-foreground">{skill.level}</p>
          </div>
          <div>
            <h3 className="font-medium">Description</h3>
            <p className="text-muted-foreground">{skill.description}</p>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end gap-4">
          <Button variant="outline">Edit</Button>
          <Button variant="destructive">Delete</Button>
        </CardFooter>
      </Card>
    </div>
  );
}