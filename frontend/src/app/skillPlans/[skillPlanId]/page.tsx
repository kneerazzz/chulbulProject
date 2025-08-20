"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  Loader2, 
  ChevronLeft, 
  CalendarDays, 
  Target, 
  Clock, 
  CheckCircle, 
  BookOpen,
  Trash2,
  Edit,
  Play,
  TrendingUp,
  BarChart3
} from "lucide-react";
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

// Utility function to safely format dates
const safeFormatDate = (dateString: string, formatString: string = 'MMM dd, yyyy') => {
  if (!dateString) return 'Date not available';
  
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return 'Invalid date';
  
  return format(date, formatString);
};

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
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-10 w-10 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading your skill plan...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8 px-4 text-center">
        <p className="text-red-500 mb-4">{error}</p>
        <Button variant="outline" onClick={() => window.location.reload()}>
          Retry
        </Button>
      </div>
    );
  }

  if (!skillPlan) {
    return (
      <div className="container mx-auto py-8 px-4 text-center">
        <p className="text-muted-foreground mb-4">Skill plan not found</p>
        <Button onClick={() => router.push("/skillPlans")}>
          Back to All Plans
        </Button>
      </div>
    );
  }

  const createTopic = async(skillPlan: SkillPlanDetail) => {
    try {
      const res = await axios.get(`/api/dailyTopic/create-topic?skillPlanId=${skillPlanId}&day=${skillPlan.currentDay}`, {
        withCredentials: true
      })
      toast.success("Today's topic is generated successfully")
      router.push(`/skillPlans/${skillPlanId}/day/${skillPlan.currentDay}`)
    } catch (error) {
      console.error("Error creating topic", error)
      toast.error("Error creating today's topic")
    } finally{
      setLoading(false)
    }
  }

  function getCompletionEstimate(skillPlan: SkillPlanDetail) {
    // Simple remaining days calculation
    const simpleEstimate = new Date();
    simpleEstimate.setDate(simpleEstimate.getDate() + skillPlan.durationInDays - skillPlan.currentDay);

    // Pace-based calculation if enough data exists
    if (skillPlan.completedDays.length > 1 && skillPlan.createdAt) {
      // Safely parse the createdAt date
      const startDate = new Date(skillPlan.createdAt);
      // Check if the date is valid
      if (isNaN(startDate.getTime())) {
        return simpleEstimate;
      }
      
      const currentDate = new Date();
      const daysSinceStart = Math.floor((currentDate.getTime() - startDate.getTime()) / (86400 * 1000));
      
      const completionPace = daysSinceStart / skillPlan.completedDays.length;
      const paceEstimate = new Date();
      paceEstimate.setDate(
        paceEstimate.getDate() + 
        Math.ceil((skillPlan.durationInDays - skillPlan.currentDay) * completionPace)
      );
      return paceEstimate;
    }
    return simpleEstimate;
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => router.back()} className="h-9 w-9">
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{skillPlan.skill.title}</h1>
            <p className="text-muted-foreground">{skillPlan.skill.description}</p>
          </div>
        </div>
        <Badge variant="outline" className="text-sm px-3 py-1">
          {skillPlan.skill.category}
        </Badge>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Progress Overview Card */}
          <Card className="border-0 shadow-md">
            <CardHeader className="pb-3">
              <CardTitle className="text-xl flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Progress Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Overall Completion</span>
                  <span>{progress}%</span>
                </div>
                <Progress value={progress} className="h-3" />
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex flex-col gap-1 p-3 bg-muted/30 rounded-lg">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Target className="h-4 w-4" />
                    <span className="text-xs">Target Level</span>
                  </div>
                  <p className="font-semibold">{skillPlan.targetLevel}</p>
                </div>
                
                <div className="flex flex-col gap-1 p-3 bg-muted/30 rounded-lg">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span className="text-xs">Current Day</span>
                  </div>
                  <p className="font-semibold">
                    {skillPlan.currentDay}/{skillPlan.durationInDays}
                  </p>
                </div>
                
                <div className="flex flex-col gap-1 p-3 bg-muted/30 rounded-lg">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <CalendarDays className="h-4 w-4" />
                    <span className="text-xs">Est. Completion</span>
                  </div>
                  <p className="font-semibold">
                    {safeFormatDate(getCompletionEstimate(skillPlan).toString())}
                  </p>
                </div>
                
                <div className="flex flex-col gap-1 p-3 bg-muted/30 rounded-lg">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <CheckCircle className="h-4 w-4" />
                    <span className="text-xs">Status</span>
                  </div>
                  <p className="font-semibold">
                    {skillPlan.isCompleted ? "Completed" : "In Progress"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Daily Progress Grid */}
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Daily Progress
              </CardTitle>
              <CardDescription>
                Track your progress day by day. Click on completed days to review.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-2">
                {Array.from({ length: skillPlan.durationInDays }).map((_, index) => {
                  const day = index + 1;
                  const isCompleted = skillPlan.completedDays.includes(day);
                  const isCurrent = day === skillPlan.currentDay && !skillPlan.isCompleted;
                  const isFuture = day > skillPlan.currentDay;

                  if (isFuture) {
                    // Future days are locked
                    return (
                      <div key={day} className="flex flex-col items-center gap-1">
                        <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-muted text-muted-foreground cursor-not-allowed">
                          {day}
                        </div>
                        <span className="text-xs text-muted-foreground">Locked</span>
                      </div>
                    );
                  }

                  if (isCurrent) {
                    // Current day → call createTopic()
                    return (
                      <button
                        key={day}
                        onClick={() => createTopic(skillPlan)}
                        className="flex flex-col items-center gap-1 cursor-pointer group"
                      >
                        <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-primary text-primary-foreground group-hover:bg-primary/90 transition-colors">
                          {day}
                        </div>
                        <span className="text-xs">Today</span>
                      </button>
                    );
                  }

                  // Past days → simple link
                  return (
                    <Link
                      key={day}
                      href={`/skillPlans/${skillPlanId}/day/${day}`}
                      className="flex flex-col items-center gap-1 group"
                    >
                      <div
                        className={`w-10 h-10 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform
                          ${isCompleted ? "bg-green-500 text-white" : "bg-muted"}`}
                      >
                        {day}
                      </div>
                      <span className="text-xs">{isCompleted ? "Completed" : "Incomplete"}</span>
                    </Link>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Actions */}
        <div className="space-y-6">
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle>Plan Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link href={`/skillPlans/${skillPlanId}/learned-topics`}>
                <Button variant="outline" className="w-full justify-start gap-2">
                  <BookOpen className="h-4 w-4" />
                  View Learned Topics
                </Button>
              </Link>
              <Link href={`/skillPlans/${skillPlanId}/edit`}>
                <Button variant="outline" className="w-full justify-start gap-2">
                  <Edit className="h-4 w-4" />
                  Edit Plan
                </Button>
              </Link>
              <Button 
                variant="outline" 
                className="w-full justify-start gap-2 text-destructive hover:text-destructive"
                onClick={deleteSkillPlan}
              >
                <Trash2 className="h-4 w-4" />
                Delete Plan
              </Button>
            </CardContent>
          </Card>

          {/* Today's Quick Access */}
          {!skillPlan.isCompleted && (
            <Card className="border-0 shadow-md bg-primary/5">
              <CardHeader>
                <CardTitle>Today's Session</CardTitle>
                <CardDescription>
                  Continue your learning journey with today's topic
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  className="w-full gap-2" 
                  onClick={() => createTopic(skillPlan)} 
                  disabled={loading}
                >
                  <Play className="h-4 w-4" />
                  Start Day {skillPlan.currentDay}
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Stats Card */}
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle>Plan Statistics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Days Completed</span>
                <span className="font-medium">{skillPlan.completedDays.length}/{skillPlan.durationInDays}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Success Rate</span>
                <span className="font-medium">
                  {skillPlan.durationInDays > 0 
                    ? Math.round((skillPlan.completedDays.length / skillPlan.durationInDays) * 100) 
                    : 0}%
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Started On</span>
                <span className="font-medium">{safeFormatDate(skillPlan.createdAt)}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}