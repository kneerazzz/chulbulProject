"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";
import { Skill } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

export default function SkillsPage() {
  const router = useRouter();
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const response = await axios.get("/api/skills/get-all-skills", {withCredentials: true});
        const skills = response.data.data;
        setSkills(skills);
      } catch (error: any) {
        toast.error(error.message || "Failed to fetch skills");
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
        <Button onClick={() => router.push("/skills/new")}>Add New Skill</Button>
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
            <Button onClick={() => router.push("/skills/new")}>Create your first skill</Button>
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
                <p className="text-sm text-muted-foreground">{skill.category}</p>
                <div className="flex items-center">
                  <span className="text-sm font-medium">Level: {skill.level}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
