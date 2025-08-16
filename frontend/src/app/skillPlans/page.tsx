"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
import { format } from "date-fns";
import axios from "axios";

interface EnhancedSkillPlan {
  _id: string;
  skill: {
    _id: string;
    title: string;
    category: string;
  };
  targetLevel: string;
  durationInDays: number;
  currentDay: number;
  isCompleted: boolean;
  progress: number;
  daysRemaining: number;
  completionDate: string;
  streak: number;
  latestNote?: string;
}

export default function SkillPlansPage() {
  const router = useRouter();
  const [skillPlans, setSkillPlans] = useState<EnhancedSkillPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all");

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

  const calculateCompletionDate = (plan: EnhancedSkillPlan) => {
    // assume createdAt exists in the response
    const createdAt = new Date((plan as any).createdAt); 
    if (isNaN(createdAt.getTime())) return null;

    const completion = new Date(createdAt);
    completion.setDate(completion.getDate() + plan.durationInDays);
    return completion;
  };


  const filteredPlans = skillPlans.filter(plan => {
    if (filter === "active") return !plan.isCompleted;
    if (filter === "completed") return plan.isCompleted;
    return true;
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
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500 mb-4">{error}</p>
        <Button 
          variant="outline"
          onClick={() => window.location.reload()}
        >
          Retry
        </Button>
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
        
        <div className="flex gap-4 w-full md:w-auto">
          <Button asChild>
            <Link href="/skillPlans/create">
              Create New Plan
            </Link>
          </Button>
        </div>
      </div>

      {/* Filter Controls */}
      <div className="flex gap-2 mb-6">
        <Button
          variant={filter === "all" ? "default" : "outline"}
          onClick={() => setFilter("all")}
        >
          All Plans
        </Button>
        <Button
          variant={filter === "active" ? "default" : "outline"}
          onClick={() => setFilter("active")}
        >
          Active
        </Button>
        <Button
          variant={filter === "completed" ? "default" : "outline"}
          onClick={() => setFilter("completed")}
        >
          Completed
        </Button>
      </div>

      {filteredPlans.length === 0 ? (
        <div className="text-center py-12 border rounded-lg">
          <p className="text-muted-foreground mb-4">
            {filter === "all" 
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
              className="hover:shadow-lg transition-shadow h-full flex flex-col"
              onClick={() => router.push(`/skillPlans/${plan._id}`)}
            >
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-xl line-clamp-2">
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
                      <span>{plan.progress}%</span>
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
                    <div>
                      <p className="text-muted-foreground">Est. Completion</p>
                      <p className="font-medium">
                        {calculateCompletionDate(plan)
                          ? format(calculateCompletionDate(plan)!, "MMM dd")
                          : "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Status</p>
                      <p className="font-medium">
                        {plan.isCompleted ? "Completed" : "In Progress"}
                      </p>
                    </div>
                  </div>
                  
                  {plan.latestNote && (
                    <div className="mt-2">
                      <p className="text-sm text-muted-foreground">Latest Note</p>
                      <p className="text-sm line-clamp-2">{plan.latestNote}</p>
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