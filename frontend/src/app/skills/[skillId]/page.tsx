"use client";

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Skill } from "@/types";
import axios from "axios";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function SkillDetailPage({ params }: { params: Promise<{ skillId: string }> }) {
  const [skill, setSkill] = useState<Skill | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();


  async function deleteSkill() {
    try {
      const resolvedParams = await params;
      const {skillId} = resolvedParams;

      await axios.delete(`/api/skills/delete-skill?skillId=${skillId}`, {
        withCredentials: true
      })

      toast.success("Skill deleted successfully")
      router.push("/skills")
      
    } catch (error) {
      console.log("error here", error)
      setError("Failed to delete skill")  
    } finally{
      setLoading(false)
    }
  }

  async function updateSkill() {
    try {
      const resolvedParams = await params
      const {skillId} = resolvedParams

      router.push(`/skills/${skillId}/update`)
      
    } catch (error) {
      console.log("Error in updating skill", error)
      setError("Failed to update skill")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    async function fetchSkill() {
      try {
        const resolvedParams = await params;
        const { skillId } = resolvedParams;
        
        console.log("[Frontend] Fetching skill with ID:", skillId);
        
        const response = await axios.get(`/api/skills/get-skill?skillId=${skillId}`, {
          withCredentials: true
        });
        
        console.log("Skill data received:", response.data);
        setSkill(response.data.data);
      } catch (error: any) {
        console.error("[Frontend] Full error details:", {
          message: error.message,
          url: error.config?.url,
          status: error.response?.status,
          data: error.response?.data
        });
        setError("Failed to load skill");
      } finally {
        setLoading(false);
      }
    }

    fetchSkill();
  }, [params]);

  if (loading) {
    return <div className="container mx-auto py-8 max-w-2xl">Loading...</div>;
  }

  if (error || !skill) {
    return <div className="container mx-auto py-8 max-w-2xl">Skill not found</div>;
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
          <Button variant="outline" onClick={updateSkill}>Edit</Button>
          <Button variant="destructive" onClick={deleteSkill}>Delete</Button>
        </CardFooter>
      </Card>
    </div>
  );
}