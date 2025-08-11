import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { notFound } from "next/navigation";
import { Skill } from "@/types";
import { cookies } from "next/headers";
import axios from "axios";
async function getSkill(skillId: string) {
  try {
    
    // Get cookies from the server request
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();
    
    
    const response = await axios.get(`http://localhost:3000/api/skills/get-skill?skillId=${skillId}`, {
      headers: {
        'Cookie': cookieHeader,
        'Content-Type': 'application/json',
      },
      withCredentials: true
    });

    const data = await response.data;
    return data.data as Skill;
  } catch (error: any) {
    console.error("[Frontend] Full error details:", {
      message: error.message,
      stack: error.stack
    });
    return null;
  }
}

export default async function SkillDetailPage({ params }: { params: Promise<{ skillId: string }> }) {
  const { skillId } = await params;

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