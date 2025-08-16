"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, RotateCcw, Trash2, BookOpen } from "lucide-react";
import Notes from "@/components/notes"; // your separate file

type DailyTopic = {
  _id: string;
  topic: string;
  description: string;
  content: string;
  optionalTip?: string;
  day: number;
};

export default function DailyTopicPage() {
  const router = useRouter();
  const params = useParams();
  const skillPlanId = params?.skillPlanId as string;

  const [loading, setLoading] = useState(true);
  const [topic, setTopic] = useState<DailyTopic | null>(null);
  const [learnedTopics, setLearnedTopics] = useState<any[]>([]);
  const [allTopics, setAllTopics] = useState<DailyTopic[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Fetch today's topic
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const [todayRes, learnedRes, allRes] = await Promise.all([
          axios.get(`/api/dailytopics/get-today-topic?skillPlanId=${skillPlanId}`),
          axios.get(`/api/dailytopics/get-learned-topics?skillPlanId=${skillPlanId}`),
          axios.get(`/api/dailytopics/get-all-topics?skillPlanId=${skillPlanId}`),
        ]);

        setTopic(todayRes.data.data);
        setLearnedTopics(learnedRes.data.data);
        setAllTopics(allRes.data.data);
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    if (skillPlanId) fetchData();
  }, [skillPlanId]);

  const handleRegenerate = async () => {
    try {
      setLoading(true);
      const res = await axios.put(`/api/dailytopics/regenerate-topic?skillPlanId=${skillPlanId}`);
      setTopic(res.data.data);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to regenerate topic");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setLoading(true);
      await axios.delete(`/api/dailytopics/delete-topic?skillPlanId=${skillPlanId}`);
      setTopic(null);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to delete topic");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-600 p-4">{error}</div>;
  }

  return (
    <div className="p-6 grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Main Topic */}
      <div className="lg:col-span-3 space-y-6">
        {topic ? (
          <Card>
            <CardHeader className="flex justify-between items-center">
              <CardTitle>
                Day {topic.day}: {topic.topic}
              </CardTitle>
              <div className="flex gap-2">
                <Button variant="outline" onClick={handleRegenerate}>
                  <RotateCcw className="h-4 w-4 mr-2" /> Regenerate
                </Button>
                <Button variant="destructive" onClick={handleDelete}>
                  <Trash2 className="h-4 w-4 mr-2" /> Delete
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700">{topic.description}</p>
              <div className="prose max-w-none">
                <p>{topic.content}</p>
              </div>
              {topic.optionalTip && (
                <div className="p-3 bg-blue-50 border rounded-md">
                  💡 <span className="font-semibold">Tip:</span> {topic.optionalTip}
                </div>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="text-gray-500">No topic for today. Try generating one.</div>
        )}

        {/* Notes Section */}
        <Notes skillPlanId={skillPlanId} day={topic?.day} />
      </div>

      {/* Sidebar */}
      <div className="space-y-6">
        {/* Learned Topics */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">✅ Learned Topics</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              {learnedTopics.length ? (
                learnedTopics.map((t, i) => (
                  <li key={i} className="p-2 rounded bg-green-50">
                    {t.title}
                  </li>
                ))
              ) : (
                <p className="text-gray-500">No topics completed yet.</p>
              )}
            </ul>
          </CardContent>
        </Card>

        {/* All Topics */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">📚 All Topics</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              {allTopics.length ? (
                allTopics.map((t) => (
                  <li
                    key={t._id}
                    className="p-2 rounded bg-gray-50 cursor-pointer hover:bg-gray-100"
                    onClick={() => router.push(`/skillplans/${skillPlanId}/day/${t.day}`)}
                  >
                    Day {t.day}: {t.topic}
                  </li>
                ))
              ) : (
                <p className="text-gray-500">No topics found.</p>
              )}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
