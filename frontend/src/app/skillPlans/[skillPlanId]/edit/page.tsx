"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, ChevronLeft } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";

interface SkillPlanDetail {
  _id: string;
  targetLevel: string;
  durationInDays: number;
  skill: {
    title: string;
    category: string;
  };
}

const LEVELS = [
  { value: "beginner", label: "Beginner" },
  { value: "intermediate", label: "Intermediate" },
  { value: "advanced", label: "Advanced" },
  { value: "expert", label: "Expert" }
];

export default function EditSkillPlanPage() {
  const { skillPlanId } = useParams();
  const router = useRouter();
  const [skillPlan, setSkillPlan] = useState<SkillPlanDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  
  // Form state
  const [duration, setDuration] = useState(0);
  const [targetLevel, setTargetLevel] = useState("");

  useEffect(() => {
    const fetchSkillPlan = async () => {
      try {
        const res = await axios.get(`/api/skillPlan/get-plan?skillPlanId=${skillPlanId}`);
        const data = res.data.data;
        setSkillPlan(data);
        setDuration(data.durationInDays);
        setTargetLevel(data.targetLevel);
      } catch (err) {
        console.error("Failed to fetch skill plan:", err);
        setError("Failed to load skill plan details");
      } finally {
        setLoading(false);
      }
    };

    fetchSkillPlan();
  }, [skillPlanId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    try {
        const updatedDetails = {
            durationInDays: duration,
            targetLevel: targetLevel
        }
      await axios.patch(`/api/skillPlan/update-plan?skillPlanId=${skillPlanId}`, updatedDetails);
      
      toast.success("Skill plan updated successfully");
      router.push(`/skillPlans/${skillPlanId}`);
    } catch (err) {
      console.error("Failed to update skill plan:", err);
      setError("Failed to update skill plan");
      toast.error("Failed to update skill plan");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500 mb-4">{error}</p>
        <Button variant="outline" onClick={() => window.location.reload()}>
          Retry
        </Button>
      </div>
    );
  }

  if (!skillPlan) {
    return <div className="text-center py-8">Skill plan not found</div>;
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6">
        <Button variant="ghost" onClick={() => router.back()} className="gap-2">
          <ChevronLeft className="h-4 w-4" />
          Back to Plan
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">
            Edit {skillPlan.skill.title} Plan
          </CardTitle>
        </CardHeader>
        
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="targetLevel">Target Learning Level</Label>
              <Select 
                value={targetLevel} 
                onValueChange={setTargetLevel}
              >
                <SelectTrigger id="targetLevel">
                  <SelectValue placeholder="Select target level" />
                </SelectTrigger>
                <SelectContent>
                  {LEVELS.map(level => (
                    <SelectItem key={level.value} value={level.value}>
                      {level.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="duration">Duration (Days)</Label>
              <Input
                id="duration"
                type="number"
                min="1"
                max="365"
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
              />
              <p className="text-sm text-muted-foreground">
                Recommended: 30-90 days for best results
              </p>
            </div>
          </CardContent>

          <CardFooter className="flex justify-end gap-4">
            <Button 
              variant="outline" 
              type="button"
              onClick={() => router.push(`/skill-plans/${skillPlanId}`)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Saving...
                </>
              ) : "Save Changes"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}