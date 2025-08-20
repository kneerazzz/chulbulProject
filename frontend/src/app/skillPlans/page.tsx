"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2, ChevronLeft, Calendar, Target, Clock, TrendingUp, Plus, Filter, Search } from "lucide-react";
import { format, addDays } from "date-fns";
import axios from "axios";
import { toast } from "sonner";

// Common interfaces
interface Skill {
  _id: string;
  title: string;
  category: string;
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
}

const LEVELS = [
  { value: "beginner", label: "Beginner" },
  { value: "intermediate", label: "Intermediate" },
  { value: "advanced", label: "Advanced" },
  { value: "expert", label: "Expert" }
];

// Edit Skill Plan Component
export function EditSkillPlanPage() {
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
      <div className="container mx-auto py-8 px-4 max-w-4xl">
        <div className="mb-6">
          <Button variant="ghost" onClick={() => router.back()} className="gap-2">
            <ChevronLeft className="h-4 w-4" />
            Back
          </Button>
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-3/4" />
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-10 w-full" />
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-4">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-24" />
          </CardFooter>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8 px-4 max-w-4xl">
        <div className="text-center py-8">
          <p className="text-red-500 mb-4">{error}</p>
          <Button variant="outline" onClick={() => window.location.reload()}>
            Retry
          </Button>
        </div>
      </div>
    );
  }

  if (!skillPlan) {
    return (
      <div className="container mx-auto py-8 px-4 max-w-4xl">
        <div className="text-center py-8">Skill plan not found</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <div className="mb-6">
        <Button variant="ghost" onClick={() => router.back()} className="gap-2">
          <ChevronLeft className="h-4 w-4" />
          Back to Plan
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <Target className="h-6 w-6 text-primary" />
            Edit {skillPlan.skill.title} Plan
          </CardTitle>
          <CardDescription>
            Adjust your learning goals and timeline
          </CardDescription>
        </CardHeader>
        
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="targetLevel" className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Target Learning Level
              </Label>
              <Select 
                value={targetLevel} 
                onValueChange={setTargetLevel}
              >
                <SelectTrigger id="targetLevel" className="mt-1">
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
              <Label htmlFor="duration" className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Duration (Days)
              </Label>
              <Input
                id="duration"
                type="number"
                min="1"
                max="365"
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                className="mt-1"
              />
              <p className="text-sm text-muted-foreground">
                Recommended: 30-90 days for best results
              </p>
              {skillPlan && (
                <p className="text-sm text-muted-foreground">
                  Estimated completion: {format(addDays(new Date(), duration), 'MMM dd, yyyy')}
                </p>
              )}
            </div>
          </CardContent>

          <CardFooter className="flex justify-end gap-4 border-t pt-6">
            <Button 
              variant="outline" 
              type="button"
              onClick={() => router.push(`/skillPlans/${skillPlanId}`)}
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

// Skill Plans Overview Component
export function SkillPlansOverview() {
  const router = useRouter();
  const [skillPlans, setSkillPlans] = useState<SkillPlanDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchSkillPlans = async () => {
      try {
        const res = await axios.get("/api/skillPlan/get-all-plan");
        const response = res.data.data
        console.log(response)
        setSkillPlans(response);
      } catch (err) {
        console.error("Failed to fetch skill plans:", err);
        setError("Failed to load skill plans. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchSkillPlans();
  }, []);

  function getCompletionEstimate(skillPlan: SkillPlanDetail) {
      // Simple remaining days calculation
      const simpleEstimate = new Date();
      simpleEstimate.setDate(simpleEstimate.getDate() + skillPlan.durationInDays - skillPlan.currentDay);

      // Pace-based calculation if enough data exists
      if (skillPlan.completedDays.length > 1 && skillPlan.createdAt) {
        // Convert dates to timestamps (numbers) before subtraction
        const startDate = new Date(skillPlan.createdAt).getTime(); // returns number
        const currentDate = new Date().getTime(); // returns number
        const daysSinceStart = Math.floor((currentDate - startDate) / (86400 * 1000));
        
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

  const filteredPlans = skillPlans.filter(plan => {
    // Filter by status
    let statusMatch = true;
    if (filter === "active") statusMatch = !plan.isCompleted;
    if (filter === "completed") statusMatch = plan.isCompleted;
    
    // Filter by search query
    const searchMatch = plan.skill.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                       plan.skill.category.toLowerCase().includes(searchQuery.toLowerCase());
    
    return statusMatch && searchMatch;
  });

  const getBadgeVariant = (targetLevel: string) => {
    switch (targetLevel.toLowerCase()) {
      case "beginner": return "secondary";
      case "intermediate": return "default";
      case "advanced": return "destructive";
      default: return "outline";
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <Skeleton className="h-9 w-48 mb-2" />
            <Skeleton className="h-5 w-64" />
          </div>
          <Skeleton className="h-10 w-40" />
        </div>
        
        <div className="flex gap-2 mb-6">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-24" />
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="h-full">
              <CardHeader className="pb-3">
                <Skeleton className="h-6 w-3/4 mb-2" />
                <div className="flex gap-2">
                  <Skeleton className="h-5 w-16" />
                  <Skeleton className="h-5 w-20" />
                </div>
              </CardHeader>
              <CardContent>
                <Skeleton className="h-3 w-full mb-4" />
                <div className="grid grid-cols-2 gap-4">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                </div>
              </CardContent>
              <CardFooter>
                <Skeleton className="h-10 w-full" />
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="text-center py-8">
          <p className="text-red-500 mb-4">{error}</p>
          <Button 
            variant="outline"
            onClick={() => window.location.reload()}
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">My Learning Plans</h1>
          <p className="text-muted-foreground">
            Track your progress across all skills
          </p>
        </div>
        
        <Button asChild>
          <Link href="/skillPlans/create" className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            New Plan
          </Link>
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search plans..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <Tabs defaultValue="all" className="w-auto">
          <TabsList>
            <TabsTrigger value="all" onClick={() => setFilter("all")}>
              All Plans
            </TabsTrigger>
            <TabsTrigger value="active" onClick={() => setFilter("active")}>
              Active
            </TabsTrigger>
            <TabsTrigger value="completed" onClick={() => setFilter("completed")}>
              Completed
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {filteredPlans.length === 0 ? (
        <div className="text-center py-12 border rounded-lg">
          <div className="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
            <Filter className="h-8 w-8 text-muted-foreground" />
          </div>
          <p className="text-muted-foreground mb-4">
            {searchQuery 
              ? `No plans found for "${searchQuery}"` 
              : filter === "all" 
                ? "You don't have any skill plans yet" 
                : filter === "active" 
                  ? "No active plans found" 
                  : "No completed plans found"}
          </p>
          <Button asChild>
            <Link href="/skillPlans/create">
              Create New Plan
            </Link>
          </Button>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredPlans.map((plan) => (
            <Card 
              key={plan._id} 
              className="hover:shadow-lg transition-shadow h-full flex flex-col cursor-pointer group"
              onClick={() => router.push(`/skillPlans/${plan._id}`)}
            >
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-xl line-clamp-2 group-hover:text-primary transition-colors">
                    {plan.skill.title}
                  </CardTitle>
                  {plan.isCompleted && (
                    <Badge variant="default" className="shrink-0">
                      Completed
                    </Badge>
                  )}
                </div>
                <div className="flex gap-2 mt-2 flex-wrap">
                  <Badge variant="outline">{plan.skill.category}</Badge>
                  <Badge variant={getBadgeVariant(plan.targetLevel)}>
                    {plan.targetLevel}
                  </Badge>
                  {plan.streak > 0 && (
                    <Badge variant="secondary">
                      🔥 {plan.streak} day streak
                    </Badge>
                  )}
                </div>
              </CardHeader>
              
              <CardContent className="flex-grow">
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm text-muted-foreground mb-1">
                      <span>Progress</span>
                      <span>{Math.round(plan.progress)}%</span>
                    </div>
                    <Progress value={plan.progress} className="h-2" />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Current Day</p>
                      <p className="font-medium">{plan.currentDay}/{plan.durationInDays}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Days Left</p>
                      <p className="font-medium">{plan.durationInDays-plan.currentDay}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-muted-foreground flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        Est. Completion
                      </p>
                      <p className="font-medium">
                        {format(getCompletionEstimate(plan), 'MMM dd, yyyy')}
                      </p>
                    </div>
                  </div>
                  
                  {plan.latestNote && (
                    <div className="mt-2 p-3 bg-muted/50 rounded-md">
                      <p className="text-sm text-muted-foreground">Latest Note</p>
                      <p className="text-sm line-clamp-2 mt-1">{plan.latestNote}</p>
                    </div>
                  )}
                </div>
              </CardContent>
              
              <CardFooter>
                <Button 
                  variant="outline" 
                  className="w-full cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    router.push(`/skillPlans/${plan._id}`);
                  }}
                >
                  View Details
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

// Main page component with routing
export default function SkillPlansPage() {
  const params = useParams();
  
  // If we're on the edit page, show the edit component
  if (params.skillPlanId && params.skillPlanId !== "create") {
    return <EditSkillPlanPage />;
  }
  
  // Otherwise show the overview
  return <SkillPlansOverview />;
}