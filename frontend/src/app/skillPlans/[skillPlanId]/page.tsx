"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Loader2, ChevronLeft, CalendarDays, Target, Clock, CheckCircle } from "lucide-react";
import { format } from "date-fns";
import axios from "axios";
import Link from "next/link";
import { toast } from "sonner";

interface SkillPlanDetail {
  _id: string;
  skill: {
    _id: string;
    title: string;
    category: string;
    description: string;
  };
  targetLevel: string;
  durationInDays: number;
  currentDay: number;
  completedDays: number[];
  isCompleted: boolean;
  createdAt: string;
  lastDeliveredNote: Date;
  progress: number;
}


export default function SkillPlanDetailPage() {
  const { skillPlanId } = useParams();
  const router = useRouter();
  const [skillPlan, setSkillPlan] = useState<SkillPlanDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const fetchSkillPlan = async () => {
      try {
        const res = await axios.get(`/api/skillPlan/get-plan?skillPlanId=${skillPlanId}`);
        setSkillPlan(res.data.data);
      } catch (err) {
        console.error("Failed to fetch skill plan:", err);
        setError("Failed to load skill plan details");
      } finally {
        setLoading(false);
      }
    };

    fetchSkillPlan();
  }, [skillPlanId]);


  const deleteSkillPlan = async() => {
    try {
        await axios.delete(`/api/skillPlan/delete-plan?skillPlanId=${skillPlanId}`, {
            withCredentials: true
        })
        toast.success("Skill Plan deleted successfully")
        router.push("/skillPlans")
    } catch (error) {
        console.error("Error deleting Skill Plan ", error)
        setError("Failed to delete skill plan")
        toast.error("Error deleting Skill plan")
    }
  }


  useEffect(() => {
    const skillPlanProgress = async() => {
        try{
            const res = await axios.get(`/api/skillPlan/plan-progress?skillPlanId=${skillPlanId}`, {
                withCredentials: true
            })
            setProgress(res.data.data)
            return progress;
        }catch(error){
            console.log(error);
            setError("Failed to get the skill Plan progress")        
        } finally{
            setLoading(false)
        }
    }
     skillPlanProgress();
  }, [skillPlanId])


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

  const completionDate = new Date(skillPlan.createdAt);
  completionDate.setDate(completionDate.getDate() + skillPlan.durationInDays);

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6">
        <Button variant="ghost" onClick={() => router.back()} className="gap-2">
          <ChevronLeft className="h-4 w-4" />
          Back to All Plans
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Plan Overview Card */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-2xl">{skillPlan.skill.title}</CardTitle>
                  <p className="text-muted-foreground">{skillPlan.skill.description}</p>
                </div>
                <Badge variant="outline">{skillPlan.skill.category}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Target Level</p>
                    <p className="font-medium">{skillPlan.targetLevel}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Current Day</p>
                    <p className="font-medium">
                      {skillPlan.currentDay}/{skillPlan.durationInDays}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <CalendarDays className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Est. Completion</p>
                    <p className="font-medium">
                      {format(completionDate, 'MMM dd, yyyy')}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Status</p>
                    <p className="font-medium">
                      {skillPlan.isCompleted ? "Completed" : "In Progress"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-2 mb-6">
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Overall Progress</span>
                  <span>{progress}%</span>
                </div>
                <Progress value={progress} className="h-3" />
              </div>
            </CardContent>
          </Card>
          {/* Daily Progress Grid */}
          <Card>
            <CardHeader>
              <CardTitle>Daily Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-2">
                {Array.from({ length: skillPlan.durationInDays }).map((_, index) => {
                  const day = index + 1;
                  const isCompleted = skillPlan.completedDays.includes(day);
                  const isCurrent = day === skillPlan.currentDay && !skillPlan.isCompleted;
                  
                  return (
                    <Link 
                      key={day} 
                      href={`/skill-plans/${skillPlanId}/daily/${day}`}
                      className="flex flex-col items-center gap-1"
                    >
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center 
                          ${isCompleted ? "bg-green-500 text-white" : 
                           isCurrent ? "bg-blue-500 text-white" : "bg-muted"}`}
                      >
                        {day}
                      </div>
                      <span className="text-xs">
                        {isCurrent ? "Today" : isCompleted ? "✓" : ""}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Actions */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link href={`/skill-plans/${skillPlanId}/edit`}>
                <Button variant="outline" className="w-full">
                  Edit Plan
                </Button>
              </Link>
              <Button 
                variant="outline" 
                className="w-full text-red-600 hover:text-red-600"
                onClick={deleteSkillPlan}
              >
                Delete Plan
              </Button>
            </CardContent>
          </Card>

          {/* Today's Quick Access */}
          {!skillPlan.isCompleted && (
            <Card>
              <CardHeader>
                <CardTitle>Today's Session</CardTitle>
              </CardHeader>
              <CardContent>
                <Link 
                  href={`/skill-plans/${skillPlanId}/daily/${skillPlan.currentDay}`}
                  className="w-full"
                >
                  <Button className="w-full">
                    Go to Day {skillPlan.currentDay}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}