"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Loader2, Calendar, Hash, Cpu, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/app/components/ui/badge";

interface GeneratedTopic {
  title: string;
  generatedAt: string;
  model: string;
  _id: string;
}

interface HistoryItem {
  _id: string;
  user: string;
  skillPlan: string;
  generatedTopics: GeneratedTopic[];
  day: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export default function SkillPlanHistoryPage() {
  const { skillPlanId } = useParams();
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [deleting, setDeleting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    if (!skillPlanId) return;

    const fetchHistory = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`/api/aiHistory/get-ai-history?skillPlanId=${skillPlanId}`, {
          withCredentials: true,
        });
        setHistory(res.data.data || []);
      } catch (err: any) {
        toast.error(err.response?.data?.message || "Failed to load history");
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [skillPlanId]);

  const clearHistory = async () => {
    setDeleting(true);
    try {
      await axios.delete(`/api/aiHistory/delete-history?skillPlanId=${skillPlanId}`, {
        withCredentials: true,
      });
      setHistory([]);
      toast.success("All history cleared");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to clear history");
    } finally {
      setDeleting(false);
    }
  };

  const deleteSingleItem = async (id: string) => {
    setDeletingId(id);
    try {
      // Fixed: Using query parameters as expected by your proxy route
      await axios.delete(`/api/aiHistory/delete-single-log?skillPlanId=${skillPlanId}&id=${id}`, {
        withCredentials: true,
      });
      setHistory(history.filter(item => item._id !== id));
      toast.success("History item deleted");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to delete item");
    } finally {
      setDeletingId(null);
    }
  };

  // Group history by day
  const historyByDay = history.reduce((acc, item) => {
    if (!acc[item.day]) {
      acc[item.day] = [];
    }
    acc[item.day].push(item);
    return acc;
  }, {} as Record<number, HistoryItem[]>);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">AI Generation History</h1>
          <p className="text-muted-foreground mt-1">Topics generated for your skill plan</p>
        </div>
        {history.length > 0 && (
          <Button
            variant="destructive"
            onClick={clearHistory}
            disabled={deleting}
            className="flex items-center gap-2"
          >
            {deleting ? (
              <Loader2 className="animate-spin w-4 h-4" />
            ) : (
              <Trash2 className="w-4 h-4" />
            )}
            Clear All
          </Button>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <Loader2 className="animate-spin w-8 h-8 text-primary" />
        </div>
      ) : history.length === 0 ? (
        <div className="text-center py-12 border rounded-lg">
          <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
            <Cpu className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium mb-1">No history yet</h3>
          <p className="text-muted-foreground">AI generated topics will appear here</p>
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(historyByDay)
            .sort(([dayA], [dayB]) => parseInt(dayB) - parseInt(dayA))
            .map(([day, dayHistory]) => (
              <div key={day} className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-primary/10 rounded-full">
                    <Hash className="w-5 h-5 text-primary" />
                  </div>
                  <h2 className="text-xl font-semibold">Day {day}</h2>
                </div>
                
                <div className="grid gap-4">
                  {dayHistory.map((item) => (
                    <Card key={item._id} className="overflow-hidden">
                      <CardHeader className="pb-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-lg">
                              {item.generatedTopics[0]?.title || "Untitled Topic"}
                            </CardTitle>
                            <CardDescription className="flex items-center gap-4 mt-2">
                              <span className="flex items-center gap-1">
                                <Cpu className="w-4 h-4" />
                                {item.generatedTopics[0]?.model || "Unknown Model"}
                              </span>
                              <span className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                {new Date(item.createdAt).toLocaleDateString()}
                              </span>
                            </CardDescription>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => deleteSingleItem(item._id)}
                            disabled={deletingId === item._id}
                            className="h-8 w-8"
                          >
                            {deletingId === item._id ? (
                              <Loader2 className="animate-spin w-4 h-4" />
                            ) : (
                              <Trash2 className="w-4 h-4" />
                            )}
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent className="pb-3">
                        <div className="flex flex-wrap gap-2">
                          <Badge variant="secondary" className="flex items-center gap-1">
                            <Hash className="w-3 h-3" />
                            Day {item.day}
                          </Badge>
                          <Badge variant="outline">
                            {new Date(item.createdAt).toLocaleTimeString()}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}