"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Loader2 } from "lucide-react";

import TopicContent from "./topic-content";
import Notes from "./notes";
import SessionActions from "./actions";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { DailyTopic } from "@/types";
import axios from "axios";

export default function DailySessionPage() {
  const { skillPlanId, dayString } = useParams<{ skillPlanId: string; dayString: string }>();
  const day = Number(dayString)
  const [topic, setTopic] = useState<DailyTopic | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!skillPlanId || !day) return;

    const fetchTopic = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await axios.get(`/api/daily-topic/get-topic?skillPlanId=${skillPlanId}&day=${day}`, {
            withCredentials: true
        })
        if(!res){
            console.error("error getting response from the proxy route")
        }
        const topic = res.data.data;
        setTopic(topic); // assuming your API returns { data: { ...dailyTopic } }
      } catch (err: any) {
        setError(err.message || "Failed to load daily topic");
      } finally {
        setLoading(false);
      }
    };

    fetchTopic();
  }, [skillPlanId, day]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="animate-spin h-6 w-6 text-muted-foreground" />
        <span className="ml-2 text-muted-foreground">Loading daily session...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-red-500 font-medium">
        ⚠️ {error}
      </div>
    );
  }

  if (!topic) {
    return (
      <div className="p-4 text-muted-foreground">
        No topic found for this day.
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 p-4">
      {/* Topic Overview */}
      <Card>
        <CardHeader>
          <CardTitle>
            Day {day}: {topic.topic}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <TopicContent topic={topic} />
        </CardContent>
      </Card>

      {/* Notes Section */}
      <Notes skillPlanId={skillPlanId} day={day} />

      {/* Session Actions */}
      <SessionActions skillPlanId={skillPlanId} day={day} onUpdate={(updatedtopic) => {
        console.log("Updated topic: ", updatedtopic)
      }} />
    </div>
  );
}
