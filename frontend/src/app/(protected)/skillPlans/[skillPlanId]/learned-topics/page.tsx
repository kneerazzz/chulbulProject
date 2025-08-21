"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/app/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/app/components/ui/card";
import { Badge } from "@/app/components/ui/badge";
import { Loader2, ChevronLeft, BookOpen, Calendar, ArrowRight, AlertCircle, FileText } from "lucide-react";
import { format } from "date-fns";
import axios from "axios";
import Link from "next/link";

interface Note {
  _id: string;
  day: number;
  content: string;
  createdAt: string;
  updatedAt: string;
  skillPlan: string;
}

interface LearnedTopic {
  _id: string;
  day: number;
  title: string;
  content: string;
  createdAt: string;
  skillPlanId: string;
}

interface SkillPlan {
  _id: string;
  skill: {
    title: string;
  };
  completedSubtopics: Array<{
    title: string;
    content: string;
    day: number;
    completedAt: string;
  }>;
}

// Utility function to safely format dates
const safeFormatDate = (dateString: string, formatString: string = 'MMM dd, yyyy') => {
  if (!dateString) return 'Date not available';
  
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return 'Invalid date';
  
  return format(date, formatString);
};

export default function LearnedTopicsPage() {
  const { skillPlanId } = useParams();
  const router = useRouter();
  const [topics, setTopics] = useState<LearnedTopic[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [skillPlanTitle, setSkillPlanTitle] = useState("");

  useEffect(() => {
    if (!skillPlanId) {
      setError("Skill plan ID not found");
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        setError("");

        // Fetch skill plan data which contains completed subtopics
        const planRes = await axios.get(`/api/skillPlan/get-plan?skillPlanId=${skillPlanId}`, {
          withCredentials: true
        });

        if (planRes.data && planRes.data.data) {
          const skillPlan: SkillPlan = planRes.data.data;
          setSkillPlanTitle(skillPlan.skill?.title || "Unknown Skill");

          // Check if completedSubtopics exists and is an array
          if (skillPlan.completedSubtopics && Array.isArray(skillPlan.completedSubtopics)) {
            // Fetch all notes for this skill plan in a single request
            let allNotes: Note[] = [];
            try {
              const notesRes = await axios.get(`/api/notes/get-all-notes?skillPlanId=${skillPlanId}`, {
                withCredentials: true
              });
              
              if (notesRes.data && notesRes.data.data) {
                allNotes = notesRes.data.data;
              }
            } catch (notesErr) {
              console.warn("Failed to fetch notes:", notesErr);
              // Continue with just the subtopics if notes fetch fails
            }

            // Map completed subtopics to learned topics, combining with notes if available
            // Map completed subtopics to learned topics, combining with notes if available
            const learnedTopics = skillPlan.completedSubtopics.map((subtopic, index) => {
              // Use index + 1 as fallback if subtopic.day is undefined
              const dayNumber = subtopic.day || (index + 1);
              
              // Find the corresponding note for this day
              const noteForDay = allNotes.find(note => note.day === dayNumber);
              
              const finalContent = noteForDay?.content || subtopic.content || "No notes available";
              
              return {
                _id: `${skillPlan._id}-${dayNumber}`,
                day: dayNumber,
                title: subtopic.title || `Day ${dayNumber} Notes`,
                content: finalContent,
                createdAt: subtopic.completedAt || noteForDay?.createdAt || new Date().toISOString(),
                skillPlanId: skillPlan._id
              };
            });

            // Sort by day in descending order (most recent first)
            learnedTopics.sort((a, b) => b.day - a.day);
            setTopics(learnedTopics);
          } else {
            // If no completed subtopics, try to fetch any existing notes
            try {
              const notesRes = await axios.get(`/api/notes/get-all-notes/${skillPlanId}`, {
                withCredentials: true
              });
              
              if (notesRes.data && notesRes.data.data && notesRes.data.data.length > 0) {
                const notes: Note[] = notesRes.data.data;
                const learnedTopics = notes.map(note => ({
                  _id: note._id,
                  day: note.day,
                  title: `Day ${note.day} Notes`,
                  content: note.content || "No content",
                  createdAt: note.createdAt,
                  skillPlanId: skillPlanId as string
                }));
                
                learnedTopics.sort((a, b) => b.day - a.day);
                setTopics(learnedTopics);
              } else {
                // No completed subtopics or notes
                setTopics([]);
              }
            } catch (notesErr) {
              console.warn("Failed to fetch notes:", notesErr);
              setTopics([]);
            }
          }
        } else {
          throw new Error("Invalid response format from skill plan API");
        }

      } catch (err: any) {
        console.error("Failed to fetch data:", err);
        
        // Handle different types of errors
        if (err.response?.status === 404) {
          setError("Skill plan not found");
        } else if (err.response?.status === 401) {
          setError("Unauthorized access. Please log in again.");
        } else if (err.response?.status === 500 && err.response?.data?.message?.includes("No topics has been completed")) {
          // This is expected when no topics are completed yet
          setTopics([]);
          setSkillPlanTitle("Your Skill Plan");
        } else {
          setError(err.response?.data?.message || err.message || "Failed to load learned topics");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [skillPlanId]);

  // Handle retry
  const handleRetry = () => {
    setError("");
    setLoading(true);
    // Re-trigger the useEffect by updating a dependency or calling fetchData directly
    window.location.reload();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-10 w-10 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading learned topics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8 px-4 max-w-2xl">
        <Card className="text-center py-12 border-destructive/20">
          <CardContent>
            <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2 text-destructive">Error Loading Topics</h3>
            <p className="text-muted-foreground mb-6">{error}</p>
            <div className="flex gap-4 justify-center">
              <Button variant="outline" onClick={handleRetry}>
                Try Again
              </Button>
              <Button onClick={() => router.push(`/skillPlans/${skillPlanId}`)}>
                Back to Plan
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => router.back()} className="h-9 w-9">
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Learned Topics</h1>
            <p className="text-muted-foreground">
              From your {skillPlanTitle || "skill plan"}
            </p>
          </div>
        </div>
        <Badge variant="outline" className="text-sm px-3 py-1">
          {topics?.length || 0} {(topics?.length || 0) === 1 ? 'Topic' : 'Topics'}
        </Badge>
      </div>

      {!topics || topics.length === 0 ? (
        <Card className="text-center py-12 border-0 shadow-md">
          <CardContent>
            <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No topics learned yet</h3>
            <p className="text-muted-foreground mb-4">
              Start your learning journey to see your completed topics here.
            </p>
            <Button onClick={() => router.push(`/skillPlans/${skillPlanId}`)}>
              Back to Plan
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {topics.map((topic, index) => (
            <Card key={topic._id || index} className="border-0 shadow-md hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl flex items-center gap-2">
                      <FileText className="h-5 w-5 text-primary" />
                      {topic.title || "Untitled Topic"}
                    </CardTitle>
                    <CardDescription>Day {topic.day || "Unknown"}</CardDescription>
                  </div>
                  <Badge variant="secondary">Day {topic.day || "?"}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center text-sm text-muted-foreground mb-4">
                  <Calendar className="h-4 w-4 mr-1" />
                  Learned on {safeFormatDate(topic.createdAt)}
                </div>
                <div className="prose prose-sm max-w-none mb-4 p-3 bg-muted/30 rounded-md">
                  {topic.content && topic.content.length > 200 
                    ? `${topic.content.substring(0, 200)}...` 
                    : topic.content || "No notes available"
                  }
                </div>
                <Link href={`/skillPlans/${skillPlanId}/day/${topic.day}`}>
                  <Button 
                    variant="outline" 
                    className="gap-2"
                    disabled={!topic.day || topic.day < 1}
                  >
                    View Full Day Summary
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}