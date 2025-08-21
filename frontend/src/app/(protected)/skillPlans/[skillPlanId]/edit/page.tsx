"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/app/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/app/components/ui/card";
import { Label } from "@/app/components/ui/label";
import { Input } from "@/app/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select";
import { Skeleton } from "@/app/components/ui/skeleton";
import { 
  Loader2, 
  ChevronLeft, 
  Target, 
  Clock, 
  TrendingUp, 
  Zap,
  Clock4,
  Trash2,
} from "lucide-react";
import { format, addDays,} from "date-fns";
import axios from "axios";
import { toast } from "sonner";

// Common interfaces
interface Skill {
  _id: string;
  title: string;
  category: string;
  level?: number;
}

interface SkillPlanDetail {
  _id: string;
  targetLevel: string;
  durationInDays: number;
  currentDay: number;
  isCompleted: boolean;
  progress: number;
  daysRemaining: number;
  completionDate: string;
  streak: number;
  latestNote?: string;
  completedDays: number[];
  createdAt: string;
  lastDeliveredNote: Date;
  skill: Skill;
  isPaused?: boolean;
  priority?: "low" | "medium" | "high";
  estimatedHoursPerDay?: number;
  totalHoursSpent?: number;
}

const LEVELS = [
  { value: "beginner", label: "Beginner", color: "bg-red-500/20 text-red-400 border-red-500/30" },
  { value: "intermediate", label: "Intermediate", color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30" },
  { value: "advanced", label: "Advanced", color: "bg-blue-500/20 text-blue-400 border-blue-500/30" },
  { value: "expert", label: "Expert", color: "bg-green-500/20 text-green-400 border-green-500/30" }
];

const PRIORITIES = [
  { value: "low", label: "Low", color: "bg-blue-500/20 text-blue-400 border-blue-500/30" },
  { value: "medium", label: "Medium", color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30" },
  { value: "high", label: "High", color: "bg-red-500/20 text-red-400 border-red-500/30" }
];

// Edit Skill Plan Component
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
  const [priority, setPriority] = useState("medium");
  const [estimatedHours, setEstimatedHours] = useState(1);

  useEffect(() => {
    const fetchSkillPlan = async () => {
      try {
        const res = await axios.get(`/api/skillPlan/get-plan?skillPlanId=${skillPlanId}`);
        const data = res.data.data;
        setSkillPlan(data);
        setDuration(data.durationInDays);
        setTargetLevel(data.targetLevel);
        setPriority(data.priority || "medium");
        setEstimatedHours(data.estimatedHoursPerDay || 1);
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
            targetLevel: targetLevel,
            priority: priority,
            estimatedHoursPerDay: estimatedHours
        };
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

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this skill plan? This action cannot be undone.")) return;
    
    try {
      await axios.delete(`/api/skillPlan/delete-plan?skillPlanId=${skillPlanId}`);
      toast.success("Skill plan deleted successfully");
      router.push("/skillPlans");
    } catch (err) {
      console.error("Failed to delete skill plan:", err);
      toast.error("Failed to delete skill plan");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black py-8 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="mb-6">
            <Skeleton className="h-10 w-24 bg-neutral-800" />
          </div>
          <Card className="bg-neutral-900 border-neutral-800">
            <CardHeader>
              <Skeleton className="h-8 w-3/4 bg-neutral-800" />
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Skeleton className="h-4 w-1/3 bg-neutral-800" />
                <Skeleton className="h-10 w-full bg-neutral-800" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-1/3 bg-neutral-800" />
                <Skeleton className="h-10 w-full bg-neutral-800" />
              </div>
            </CardContent>
            <CardFooter className="flex justify-end gap-4">
              <Skeleton className="h-10 w-24 bg-neutral-800" />
              <Skeleton className="h-10 w-24 bg-neutral-800" />
            </CardFooter>
          </Card>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black py-8 px-4">
        <div className="container mx-auto max-w-4xl text-center py-8">
          <p className="text-red-400 mb-4">{error}</p>
          <Button 
            variant="outline" 
            onClick={() => window.location.reload()}
            className="bg-neutral-800 text-white border-neutral-700 hover:bg-neutral-700"
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

  if (!skillPlan) {
    return (
      <div className="min-h-screen bg-black py-8 px-4">
        <div className="container mx-auto max-w-4xl text-center py-8 text-white">
          Skill plan not found
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black py-8 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="mb-6">
          <Button 
            variant="ghost" 
            onClick={() => router.back()} 
            className="gap-2 text-gray-400 hover:text-white hover:bg-neutral-800"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to Plan
          </Button>
        </div>

        <Card className="bg-neutral-900 border-neutral-800">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2 text-white">
              <Target className="h-6 w-6 text-blue-400" />
              Edit {skillPlan.skill.title} Plan
            </CardTitle>
            <CardDescription className="text-gray-400">
              Adjust your learning goals and timeline
            </CardDescription>
          </CardHeader>
          
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="targetLevel" className="flex items-center gap-2 text-white">
                  <TrendingUp className="h-4 w-4 text-blue-400" />
                  Target Learning Level
                </Label>
                <Select 
                  value={targetLevel} 
                  onValueChange={setTargetLevel}
                >
                  <SelectTrigger id="targetLevel" className="mt-1 bg-neutral-800 border-neutral-700 text-white">
                    <SelectValue placeholder="Select target level" />
                  </SelectTrigger>
                  <SelectContent className="bg-neutral-800 border-neutral-700 text-white">
                    {LEVELS.map(level => (
                      <SelectItem key={level.value} value={level.value} className="hover:bg-neutral-700">
                        {level.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="duration" className="flex items-center gap-2 text-white">
                  <Clock className="h-4 w-4 text-blue-400" />
                  Duration (Days)
                </Label>
                <Input
                  id="duration"
                  type="number"
                  min="1"
                  max="365"
                  value={duration}
                  onChange={(e) => setDuration(Number(e.target.value))}
                  className="mt-1 bg-neutral-800 border-neutral-700 text-white"
                />
                <p className="text-sm text-gray-400">
                  Recommended: 30-90 days for best results
                </p>
                {skillPlan && (
                  <p className="text-sm text-gray-400">
                    Estimated completion: {format(addDays(new Date(), duration), 'MMM dd, yyyy')}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="priority" className="flex items-center gap-2 text-white">
                  <Zap className="h-4 w-4 text-blue-400" />
                  Priority Level
                </Label>
                <Select 
                  value={priority} 
                  onValueChange={setPriority}
                >
                  <SelectTrigger id="priority" className="mt-1 bg-neutral-800 border-neutral-700 text-white">
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent className="bg-neutral-800 border-neutral-700 text-white">
                    {PRIORITIES.map(priority => (
                      <SelectItem key={priority.value} value={priority.value} className="hover:bg-neutral-700">
                        {priority.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="estimatedHours" className="flex items-center gap-2 text-white">
                  <Clock4 className="h-4 w-4 text-blue-400" />
                  Daily Time Commitment (Hours)
                </Label>
                <Input
                  id="estimatedHours"
                  type="number"
                  min="0.5"
                  max="8"
                  step="0.5"
                  value={estimatedHours}
                  onChange={(e) => setEstimatedHours(Number(e.target.value))}
                  className="mt-1 bg-neutral-800 border-neutral-700 text-white"
                />
                <p className="text-sm text-gray-400">
                  How many hours per day you plan to dedicate to this skill
                </p>
              </div>
            </CardContent>

            <CardFooter className="flex justify-between border-t border-neutral-800 pt-6">
              <div>
                <Button 
                  type="button" 
                  variant="destructive" 
                  onClick={handleDelete}
                  className="gap-2 bg-red-500/20 text-red-400 border-red-500/30 hover:bg-red-500/30"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete Plan
                </Button>
              </div>
              <div className="flex gap-4">
                <Button 
                  variant="outline" 
                  type="button"
                  onClick={() => router.push(`/skillPlans/${skillPlanId}`)}
                  className="bg-neutral-800 text-white border-neutral-700 hover:bg-neutral-700"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={saving}
                  className="bg-white text-black hover:bg-gray-100"
                >
                  {saving ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Saving...
                    </>
                  ) : "Save Changes"}
                </Button>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}