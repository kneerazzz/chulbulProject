"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/app/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/app/components/ui/card";
import { Progress } from "@/app/components/ui/progress";
import { Badge } from "@/app/components/ui/badge";
import { Input } from "@/app/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/app/components/ui/tabs";
import { Skeleton } from "@/app/components/ui/skeleton";
import { 
  Calendar,  
  TrendingUp, 
  Plus, 
  Filter, 
  Search, 
  BookOpen,
  BarChart3,
  Award,
  Flame,
  Edit3,
  Play,
  Pause,
} from "lucide-react";
import { format} from "date-fns";
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


// Edit Skill Plan Component
// Skill Plans Overview Component
export default function SkillPlansOverview() {
  const router = useRouter();
  const [skillPlans, setSkillPlans] = useState<SkillPlanDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState<"all" | "active" | "completed" | "paused">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"progress" | "deadline" | "priority" | "streak">("progress");

  useEffect(() => {
    const fetchSkillPlans = async () => {
      try {
        const res = await axios.get("/api/skillPlan/get-all-plan");
        const response = res.data.data;
        console.log(response);
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

  const togglePlanStatus = async (planId: string, currentStatus: boolean) => {
    try {
      await axios.patch(`/api/skillPlan/toggle-status?skillPlanId=${planId}`, {
        isPaused: !currentStatus
      });
      
      // Update local state
      setSkillPlans(prev => prev.map(plan => 
        plan._id === planId ? { ...plan, isPaused: !currentStatus } : plan
      ));
      
      toast.success(`Plan ${currentStatus ? "paused" : "resumed"} successfully`);
    } catch (err) {
      console.error("Failed to toggle plan status:", err);
      toast.error("Failed to update plan status");
    }
  };

  const filteredPlans = skillPlans
    .filter(plan => {
      // Filter by status
      let statusMatch = true;
      if (filter === "active") statusMatch = !plan.isCompleted && !plan.isPaused;
      if (filter === "completed") statusMatch = plan.isCompleted;
      
      // Filter by search query
      const searchMatch = plan.skill.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         plan.skill.category.toLowerCase().includes(searchQuery.toLowerCase());
      
      return statusMatch && searchMatch;
    })
    .sort((a, b) => {
      // Sort based on selected criteria
      switch (sortBy) {
        case "progress":
          return b.progress - a.progress;
        case "deadline":
          return (a.durationInDays - a.currentDay) - (b.durationInDays - b.currentDay);
        case "priority":
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          return (priorityOrder[b.priority || "medium"] - priorityOrder[a.priority || "medium"]);
        case "streak":
          return b.streak - a.streak;
        default:
          return 0;
      }
    });

  const getBadgeVariant = (targetLevel: string) => {
    switch (targetLevel.toLowerCase()) {
      case "beginner": return "bg-red-500/20 text-red-400 border-red-500/30";
      case "intermediate": return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "advanced": return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case "expert": return "bg-green-500/20 text-green-400 border-green-500/30";
      default: return "bg-neutral-800 text-gray-300 border-neutral-700";
    }
  };

  const getPriorityBadge = (priority: string = "medium") => {
    switch (priority) {
      case "high": return "bg-red-500/20 text-red-400 border-red-500/30";
      case "medium": return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "low": return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      default: return "bg-neutral-800 text-gray-300 border-neutral-700";
    }
  };

  // Calculate statistics
  const totalPlans = skillPlans.length;
  const activePlans = skillPlans.filter(plan => !plan.isCompleted && !plan.isPaused).length;
  const completedPlans = skillPlans.filter(plan => plan.isCompleted).length;
  const averageProgress = totalPlans > 0 ? Math.round((completedPlans/totalPlans)*100) : 0

  if (loading) {
    return (
      <div className="min-h-screen bg-black py-8 px-4">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <Skeleton className="h-9 w-48 mb-2 bg-neutral-800" />
              <Skeleton className="h-5 w-64 bg-neutral-800" />
            </div>
            <Skeleton className="h-10 w-40 bg-neutral-800" />
          </div>
          
          {/* Stats Skeletons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[1, 2, 3, 4].map(i => (
              <Card key={i} className="bg-neutral-900 border-neutral-800">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <Skeleton className="h-4 w-24 mb-2 bg-neutral-800" />
                      <Skeleton className="h-7 w-12 bg-neutral-800" />
                    </div>
                    <Skeleton className="h-10 w-10 rounded-full bg-neutral-800" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="flex gap-2 mb-6 flex-wrap">
            <Skeleton className="h-10 w-24 bg-neutral-800" />
            <Skeleton className="h-10 w-24 bg-neutral-800" />
            <Skeleton className="h-10 w-24 bg-neutral-800" />
            <Skeleton className="h-10 w-24 bg-neutral-800" />
          </div>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="h-full bg-neutral-900 border-neutral-800">
                <CardHeader className="pb-3">
                  <Skeleton className="h-6 w-3/4 mb-2 bg-neutral-800" />
                  <div className="flex gap-2">
                    <Skeleton className="h-5 w-16 bg-neutral-800" />
                    <Skeleton className="h-5 w-20 bg-neutral-800" />
                  </div>
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-3 w-full mb-4 bg-neutral-800" />
                  <div className="grid grid-cols-2 gap-4">
                    <Skeleton className="h-4 w-full bg-neutral-800" />
                    <Skeleton className="h-4 w-full bg-neutral-800" />
                    <Skeleton className="h-4 w-full bg-neutral-800" />
                    <Skeleton className="h-4 w-full bg-neutral-800" />
                  </div>
                </CardContent>
                <CardFooter>
                  <Skeleton className="h-10 w-full bg-neutral-800" />
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black py-8 px-4">
        <div className="container mx-auto text-center py-8">
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

  return (
    <div className="min-h-screen bg-black py-8 px-4">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white">My Learning Plans</h1>
            <p className="text-gray-400">
              Track your progress across all skills
            </p>
          </div>
          
          <Button asChild className="bg-white text-black hover:bg-gray-100">
            <Link href="/skillPlans/create" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              New Plan
            </Link>
          </Button>
        </div>

        {/* Stats Cards */}
        {skillPlans.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="bg-neutral-900 border-neutral-800 shadow-lg hover:shadow-xl transition-all duration-200 hover:bg-neutral-800/50">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-400 mb-1">Total Plans</p>
                    <p className="text-3xl font-bold text-white">{totalPlans}</p>
                  </div>
                  <div className="p-3 bg-blue-500/20 rounded-full">
                    <BookOpen className="h-6 w-6 text-blue-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-neutral-900 border-neutral-800 shadow-lg hover:shadow-xl transition-all duration-200 hover:bg-neutral-800/50">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-400 mb-1">Active Plans</p>
                    <p className="text-3xl font-bold text-white">{activePlans}</p>
                  </div>
                  <div className="p-3 bg-green-500/20 rounded-full">
                    <TrendingUp className="h-6 w-6 text-green-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-neutral-900 border-neutral-800 shadow-lg hover:shadow-xl transition-all duration-200 hover:bg-neutral-800/50">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-400 mb-1">Avg Progress</p>
                    <p className="text-3xl font-bold text-white">{averageProgress}%</p>
                  </div>
                  <div className="p-3 bg-purple-500/20 rounded-full">
                    <BarChart3 className="h-6 w-6 text-purple-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-neutral-900 border-neutral-800 shadow-lg hover:shadow-xl transition-all duration-200 hover:bg-neutral-800/50">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-400 mb-1">Completed</p>
                    <p className="text-3xl font-bold text-white">{completedPlans}</p>
                  </div>
                  <div className="p-3 bg-orange-500/20 rounded-full">
                    <Award className="h-6 w-6 text-orange-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search plans..."
              className="pl-10 bg-neutral-800 border-neutral-700 text-white"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex gap-2 flex-wrap">
            <Tabs defaultValue="all" className="w-auto">
              <TabsList className="bg-neutral-800 border border-neutral-700">
                <TabsTrigger 
                  value="all" 
                  onClick={() => setFilter("all")}
                  className="data-[state=active]:bg-neutral-700 data-[state=active]:text-white"
                >
                  All Plans
                </TabsTrigger>
                <TabsTrigger 
                  value="active" 
                  onClick={() => setFilter("active")}
                  className="data-[state=active]:bg-neutral-700 data-[state=active]:text-white"
                >
                  Active
                </TabsTrigger>
                <TabsTrigger 
                  value="completed" 
                  onClick={() => setFilter("completed")}
                  className="data-[state=active]:bg-neutral-700 data-[state=active]:text-white"
                >
                  Completed
                </TabsTrigger>
                <TabsTrigger 
                  value="paused" 
                  onClick={() => setFilter("paused")}
                  className="data-[state=active]:bg-neutral-700 data-[state=active]:text-white"
                >
                  Paused
                </TabsTrigger>
              </TabsList>
            </Tabs>

            <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
              <SelectTrigger className="w-[140px] bg-neutral-800 border-neutral-700 text-white">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent className="bg-neutral-800 border-neutral-700 text-white">
                <SelectItem value="progress">Progress</SelectItem>
                <SelectItem value="deadline">Deadline</SelectItem>
                <SelectItem value="priority">Priority</SelectItem>
                <SelectItem value="streak">Streak</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {filteredPlans.length === 0 ? (
          <Card className="bg-neutral-900 border-neutral-800">
            <CardContent className="text-center py-16">
              <div className="mx-auto w-20 h-20 bg-neutral-800 rounded-full flex items-center justify-center mb-6">
                <Filter className="h-10 w-10 text-gray-500" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">No Plans Found</h3>
              <p className="text-gray-400 mb-6 max-w-md mx-auto">
                {searchQuery 
                  ? `No plans found for "${searchQuery}"` 
                  : filter === "all" 
                    ? "You don't have any skill plans yet" 
                    : filter === "active" 
                      ? "No active plans found" 
                      : filter === "completed"
                        ? "No completed plans found"
                        : "No paused plans found"}
              </p>
              <Button asChild className="bg-white text-black hover:bg-gray-100">
                <Link href="/skillPlans/create">
                  Create New Plan
                </Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredPlans.map((plan) => (
              <Card 
                key={plan._id} 
                className="group bg-neutral-900 border-neutral-800 shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer hover:scale-[1.02] hover:bg-neutral-800/80 hover:border-neutral-700 overflow-hidden"
              >
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors line-clamp-2 leading-tight">
                      {plan.skill.title}
                    </CardTitle>
                    {plan.isCompleted ? (
                      <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                        Completed
                      </Badge>
                    ) : plan.isPaused ? (
                      <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                        Paused
                      </Badge>
                    ) : (
                      <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                        Active
                      </Badge>
                    )}
                  </div>
                  <div className="flex gap-2 mt-2 flex-wrap">
                    <Badge variant="outline" className="bg-neutral-800 text-gray-300 border-neutral-700">
                      {plan.skill.category}
                    </Badge>
                    <Badge className={getBadgeVariant(plan.targetLevel)}>
                      {plan.targetLevel}
                    </Badge>
                    <Badge className={getPriorityBadge(plan.priority)}>
                      {plan.priority || "medium"} priority
                    </Badge>
                    {plan.streak > 0 && (
                      <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30">
                        <Flame className="h-3 w-3 mr-1" /> {plan.streak} day streak
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                
                <CardContent className="pt-0 space-y-4">
                  <div>
                    <div className="flex justify-between text-sm text-gray-400 mb-1">
                      <span>Progress</span>
                      <span>{Math.round(((plan.currentDay)/plan.durationInDays)*100)}%</span>
                    </div>
                    <Progress value={((plan.currentDay)/plan.durationInDays)*100} className="h-2 bg-neutral-700" />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-400">Current Day</p>
                      <p className="font-medium text-white">{plan.currentDay}/{plan.durationInDays}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Days Left</p>
                      <p className="font-medium text-white">{plan.durationInDays - plan.currentDay}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-gray-400 flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        Est. Completion
                      </p>
                      <p className="font-medium text-white">
                        {format(getCompletionEstimate(plan), 'MMM dd, yyyy')}
                      </p>
                    </div>
                  </div>
                  
                  {plan.latestNote && (
                    <div className="mt-2 p-3 bg-neutral-800/50 rounded-md">
                      <p className="text-sm text-gray-400">Latest Note</p>
                      <p className="text-sm text-white line-clamp-2 mt-1">{plan.latestNote}</p>
                    </div>
                  )}
                </CardContent>
                
                <CardFooter className="flex flex-col gap-3">
                  <div className="flex gap-2 w-full">
                    <Button 
                      variant="outline" 
                      className="flex-1 bg-neutral-800 text-white border-neutral-700 hover:bg-neutral-700"
                      onClick={() => router.push(`/skillPlans/${plan._id}`)}
                    >
                      View Details
                    </Button>
                    <Button 
                      variant="outline" 
                      size="icon"
                      className="bg-neutral-800 text-white border-neutral-700 hover:bg-neutral-700"
                      onClick={() => router.push(`/skillPlans/${plan._id}/edit`)}
                    >
                      <Edit3 className="h-4 w-4" />
                    </Button>
                    {!plan.isCompleted && (
                      <Button 
                        variant="outline" 
                        size="icon"
                        className={plan.isPaused 
                          ? "bg-green-500/20 text-green-400 border-green-500/30 hover:bg-green-500/30" 
                          : "bg-yellow-500/20 text-yellow-400 border-yellow-500/30 hover:bg-yellow-500/30"
                        }
                        onClick={() => togglePlanStatus(plan._id, !plan.isPaused)}
                      >
                        {plan.isPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
                      </Button>
                    )}
                  </div>
                  {plan.estimatedHoursPerDay && (
                    <div className="flex items-center justify-between w-full text-xs text-gray-400">
                      <span>Daily commitment:</span>
                      <span>{plan.estimatedHoursPerDay} hours/day</span>
                    </div>
                  )}
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}