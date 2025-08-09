"use client";

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Skill } from "@/types";
import { Loader2 } from "lucide-react";
import { api } from "@/lib/api";

export default function SkillsPage() {
  const router = useRouter();
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const response = await api.get("/skills/get-all-skills")
        const data = response.data.data
        if (response) {
          setSkills(data);
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
              onClick={() => router.push(`/skills/c/${skill._id}/get-skill`)}
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