import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { notFound } from "next/navigation";
import { Skill } from "@/types";
import { api } from "@/lib/api";

async function getSkill(skillId: string) {
  try {
    const response = await api.get(`/skills/c/${skillId}/get-skill`);

    return response.data.data as Skill
  } catch (error) {
    console.error("Error fetching skill:", error);
    return null; // Return null so page can handle 'notFound'
  }
}

export default async function SkillDetailPage({
  params,
}: {
  params: { skillId: string };
}) {
  const skill = await getSkill(params.skillId);

  if (!skill) {
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