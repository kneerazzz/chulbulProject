"use client";

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Skill } from "@/types";
import { Loader2 } from "lucide-react";
import { api } from "@/lib/api";
import { cookies } from "next/headers";

export default function SkillsPage() {
  const router = useRouter();
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const cookieStore = await cookies()
        const accessToken = cookieStore.get("accessToken")?.value

        if(!accessToken){
            throw new Error("Unauthorised")
        }
        const response = await fetch(`http://localhost:4000/api/v1/skills/get-all-skills`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            cache: "no-store"
        })

        if(!response.ok){
            console.error("Failed to fetch skill", await response.text())
            return null
        }
        const data = await response.json()
        if (response) {
          setSkills(data.data);
        } else {
          throw new Error(data.message || "Failed to fetch skills");
        }
      } catch (error: any) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSkills();
  }, []);

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My Skills</h1>
        <Button onClick={() => router.push("/skills/new")}>
          Add New Skill
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : skills.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>No Skills Found</CardTitle>
          </CardHeader>
          <CardContent>
            <Button onClick={() => router.push("/skills/new")}>
              Create your first skill
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {skills.map((skill) => (
            <Card 
              key={skill._id} 
              className="hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => router.push(`/skills/${skill._id}`)}
            >
              <CardHeader>
                <CardTitle>{skill.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    {skill.category}
                  </p>
                  <div className="flex items-center">
                    <span className="text-sm font-medium">
                      Level: {skill.level}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}