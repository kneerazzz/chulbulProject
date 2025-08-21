"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import { format } from "date-fns";
import { toast } from "sonner";

import { Button } from "@/app/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/app/components/ui/card";
import { Badge } from "@/app/components/ui/badge";
import { Progress } from "@/app/components/ui/progress";

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
  BarChart3,
  History,
  Brain,
  Sparkles,
  Share2,
  Download,
  Info,
} from "lucide-react";

// Charts
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

interface SkillPlanDetail {
  _id: string;
  skill: {
    _id: string;
    title: string;
    category: string;
    description: string;
  };
  targetLevel: string; // string or number from backend; we1 coerce when needed
  durationInDays: number;
  currentDay: number; // 1-indexed
  completedDays: number[]; // list of day numbers completed
  isCompleted: boolean;
  createdAt: string;
  lastDeliveredNote?: string;
}

// Utility: safe date format
const safeFormatDate = (dateString?: string, fmt: string = "MMM dd, yyyy") => {
  if (!dateString) return "Date not available";
  const d = new Date(dateString);
  return isNaN(d.getTime()) ? "Invalid date" : format(d, fmt);
};

export default function SkillPlanDetailPage() {
  const { skillPlanId } = useParams();
  const router = useRouter();

  const [skillPlan, setSkillPlan] = useState<SkillPlanDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [progressPct, setProgressPct] = useState<number>(0);

  // Local reflections stored in localStorage to avoid backend coupling
  const [notesMap, setNotesMap] = useState<Record<number, string>>({});

  // -------- Fetch Plan + Progress (combined in code) --------
  useEffect(() => {
    let mounted = true;

    async function fetchAll() {
      try {
        setLoading(true);
        const [planRes, progressRes] = await Promise.all([
          axios.get(`/api/skillPlan/get-plan?skillPlanId=${skillPlanId}`, { withCredentials: true }),
          axios.get(`/api/skillPlan/plan-progress?skillPlanId=${skillPlanId}`, { withCredentials: true }),
        ]);

        if (!mounted) return;
        setSkillPlan(planRes.data?.data);
        setProgressPct(progressRes.data?.data ?? 0);
      } catch (err: any) {
        console.error(err);
        if (mounted) {
          setError(err?.response?.data?.message || "Failed to load skill plan");
        }
      } finally {
        if (mounted) setLoading(false);
      }
    }

    fetchAll();

    return () => {
      mounted = false;
    };
  }, [skillPlanId]);

  // -------- Local Notes (persist to localStorage) --------
  useEffect(() => {
    if (!skillPlanId) return;
    if (typeof window === "undefined") return;
    try {
      const raw = localStorage.getItem(`skillplan:${skillPlanId}:notes`);
      if (raw) setNotesMap(JSON.parse(raw));
    } catch {}
  }, [skillPlanId]);

  const saveNotesMap = (next: Record<number, string>) => {
    setNotesMap(next);
    try {
      if (typeof window !== "undefined") {
        localStorage.setItem(`skillplan:${skillPlanId}:notes`, JSON.stringify(next));
      }
    } catch {}
  };

  const setNoteForDay = (day: number, note: string) => {
    const next = { ...notesMap, [day]: note };
    saveNotesMap(next);
  };

  // -------- Derived Metrics --------
  const currentStreak = useMemo(() => {
    if (!skillPlan) return 0;
    const completed = new Set(skillPlan.completedDays);
    let streak = 0;
    let d = Math.min(skillPlan.currentDay - 1, skillPlan.durationInDays);
    while (d >= 1 && completed.has(d)) {
      streak += 1;
      d -= 1;
    }
    return streak;
  }, [skillPlan]);

  const longestStreak = useMemo(() => {
    if (!skillPlan) return 0;
    const days = [...new Set(skillPlan.completedDays)].sort((a, b) => a - b);
    let maxStreak = 0;
    let cur = 0;
    let prev = 0;
    for (const day of days) {
      if (day === prev + 1) cur += 1; else cur = 1;
      prev = day;
      if (cur > maxStreak) maxStreak = cur;
    }
    return maxStreak;
  }, [skillPlan]);

  const last7Data = useMemo(() => {
    if (!skillPlan) return [] as { label: string; value: number }[];
    const cur = Math.max(1, skillPlan.currentDay);
    const set = new Set(skillPlan.completedDays);
    const data: { label: string; value: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const day = cur - i;
      const label = day <= 0 ? `D${day}` : `Day ${day}`;
      data.push({ label, value: day > 0 && set.has(day) ? 1 : 0 });
    }
    return data;
  }, [skillPlan]);

  const consistency = useMemo(() => {
    if (!last7Data.length) return 0;
    const sum = last7Data.reduce((a, b) => a + b.value, 0);
    return Math.round((sum / last7Data.length) * 100);
  }, [last7Data]);

  // -------- Actions --------
  const deleteSkillPlan = async () => {
    try {
      await axios.delete(`/api/skillPlan/delete-plan?skillPlanId=${skillPlanId}`, { withCredentials: true });
      toast.success("Skill Plan deleted");
      router.push("/skillPlans");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete plan");
    }
  };

  const createTopic = async () => {
    if (!skillPlan) return;
    try {
      await axios.get(`/api/dailyTopic/create-topic?skillPlanId=${skillPlanId}&day=${skillPlan.currentDay}`, { withCredentials: true });
      toast.success("Today's topic generated");
      router.push(`/skillPlans/${skillPlanId}/day/${skillPlan.currentDay}`);
    } catch (err) {
      console.error(err);
      toast.error("Failed to create today's topic");
    }
  };

  const sharePlan = async () => {
    try {
      const url = typeof window !== "undefined" ? window.location.href : "";
      if ((navigator as any)?.share) {
        await (navigator as any).share({ title: "My Skill Plan", text: skillPlan?.skill?.title, url });
      } else {
        await navigator.clipboard.writeText(url);
        toast.success("Link copied to clipboard");
      }
    } catch {}
  };

  const exportReport = () => {
    if (!skillPlan) return;
    const payload = {
      id: skillPlan._id,
      skill: skillPlan.skill,
      durationInDays: skillPlan.durationInDays,
      currentDay: skillPlan.currentDay,
      completedDays: skillPlan.completedDays,
      progressPct: progressPct,
      createdAt: skillPlan.createdAt,
      stats: {
        currentStreak,
        longestStreak,
        consistencyLast7: consistency,
      },
      notes: notesMap,
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const href = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = href;
    a.download = `skill-plan-${skillPlan._id}.json`;
    a.click();
    URL.revokeObjectURL(href);
  };

  // -------- UI States --------
  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-white mx-auto mb-4" />
          <p className="text-gray-400">Loading your skill plan…</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Card className="bg-neutral-900 border-neutral-800 text-center">
          <CardContent className="p-8">
            <p className="text-red-400 mb-4">{error}</p>
            <Button variant="outline" onClick={() => location.reload()}>Retry</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!skillPlan) {
    return (
      <div className="min-h-screen bg-black flex progressitems-center justify-center">
        <Card className="bg-neutral-900 border-neutral-800 text-center">
          <CardContent className="p-8">
            <p className="text-gray-400 mb-4">Skill plan not found</p>
            <Button onClick={() => router.push("/skillPlans")}>Back to All Plans</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Render
  return (
    <div className="min-h-screen bg-black">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-8">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.back()}
              className="h-10 w-10 text-gray-400 hover:text-white hover:bg-neutral-800"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-white mb-1">{skillPlan.skill.title}</h1>
              <p className="text-gray-400 max-w-2xl">{skillPlan.skill.description}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-neutral-900 text-gray-300 border-neutral-700 capitalize">
              {skillPlan.skill.category}
            </Badge>
            <Link href={`/skillPlans/${skillPlanId}/aiHistory`}>
              <Button variant="outline" size="sm" className="gap-2 border-neutral-700 text-gray-300">
                <History className="h-4 w-4" /> AI History
              </Button>
            </Link>
            <Button onClick={sharePlan} variant="outline" size="sm" className="gap-2 border-neutral-700 text-gray-300">
              <Share2 className="h-4 w-4" /> Share
            </Button>
            <Button onClick={exportReport} variant="outline" size="sm" className="gap-2 border-neutral-700 text-gray-300">
              <Download className="h-4 w-4" /> Export
            </Button>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Progress Overview */}
            <Card className="bg-neutral-900 border-neutral-800 shadow-lg">
              <CardHeader className="pb-3">
                <CardTitle className="text-xl flex items-center gap-2 text-white">
                  <TrendingUp className="h-5 w-5 text-cyan-400" /> Progress Overview
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Keep up the momentum. Consistency beats intensity.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-gray-400">
                    <span>Overall Completion</span>
                    <span className="text-white font-medium">{Math.round(progressPct)}%</span>
                  </div>
                  <Progress value={progressPct} className="h-3 bg-neutral-800" />
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="flex flex-col gap-1 p-3 bg-neutral-800/60 rounded-lg border border-neutral-700">
                    <div className="flex items-center gap-2 text-gray-400"><Target className="h-4 w-4" /><span className="text-xs">Target Level</span></div>
                    <p className="font-semibold text-white">{skillPlan.targetLevel}</p>
                  </div>
                  <div className="flex flex-col gap-1 p-3 bg-neutral-800/60 rounded-lg border border-neutral-700">
                    <div className="flex items-center gap-2 text-gray-400"><Clock className="h-4 w-4" /><span className="text-xs">Current Day</span></div>
                    <p className="font-semibold text-white">{skillPlan.currentDay}/{skillPlan.durationInDays}</p>
                  </div>
                  <div className="flex flex-col gap-1 p-3 bg-neutral-800/60 rounded-lg border border-neutral-700">
                    <div className="flex items-center gap-2 text-gray-400"><CalendarDays className="h-4 w-4" /><span className="text-xs">Est. Completion</span></div>
                    <p className="font-semibold text-white">{safeFormatDate(new Date(Date.now() + (skillPlan.durationInDays - skillPlan.currentDay) * 86400000).toISOString())}</p>
                  </div>
                  <div className="flex flex-col gap-1 p-3 bg-neutral-800/60 rounded-lg border border-neutral-700">
                    <div className="flex items-center gap-2 text-gray-400"><CheckCircle className="h-4 w-4" /><span className="text-xs">Status</span></div>
                    <p className="font-semibold">
                      {skillPlan.isCompleted ? (
                        <span className="text-emerald-400">Completed</span>
                      ) : (
                        <span className="text-cyan-400">In Progress</span>
                      )}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Consistency Chart & Streaks */}
            <Card className="bg-neutral-900 border-neutral-800 shadow-lg">
              <CardHeader className="pb-3">
                <CardTitle className="text-xl flex items-center gap-2 text-white">
                  <BarChart3 className="h-5 w-5 text-cyan-400" /> Last 7 Days
                </CardTitle>
                <CardDescription className="text-gray-400">1 = completed, 0 = missed</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-56 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={last7Data}>
                      <XAxis dataKey="label" tick={{ fill: "#9CA3AF", fontSize: 12 }} axisLine={{ stroke: "#374151" }} tickLine={{ stroke: "#374151" }} />
                      <YAxis allowDecimals={false} domain={[0, 1]} tick={{ fill: "#9CA3AF", fontSize: 12 }} axisLine={{ stroke: "#374151" }} tickLine={{ stroke: "#374151" }} />
                      <Tooltip
                        contentStyle={{ background: "#111827", border: "1px solid #1F2937", color: "#E5E7EB" }}
                        labelStyle={{ color: "#9CA3AF" }}
                        cursor={{ fill: "#1F2937" }}
                      />
                      <Bar dataKey="value" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="grid grid-cols-3 gap-4 mt-6">
                  <div className="p-3 rounded-lg bg-neutral-800/60 border border-neutral-700">
                    <p className="text-xs text-gray-400">Consistency</p>
                    <p className="text-xl font-semibold text-white">{consistency}%</p>
                  </div>
                  <div className="p-3 rounded-lg bg-neutral-800/60 border border-neutral-700">
                    <p className="text-xs text-gray-400">Current Streak</p>
                    <p className="text-xl font-semibold text-white">{currentStreak}d</p>
                  </div>
                  <div className="p-3 rounded-lg bg-neutral-800/60 border border-neutral-700">
                    <p className="text-xs text-gray-400">Longest Streak</p>
                    <p className="text-xl font-semibold text-white">{longestStreak}d</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Daily Progress Grid */}
            <Card className="bg-neutral-900 border-neutral-800 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <BookOpen className="h-5 w-5 text-cyan-400" /> Daily Progress
                </CardTitle>
                <CardDescription className="text-gray-400">Click a completed day to review, or start today.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-7 gap-3">
                  {Array.from({ length: skillPlan.durationInDays }).map((_, idx) => {
                    const day = idx + 1;
                    const isCompleted = skillPlan.completedDays.includes(day);
                    const isCurrent = day === skillPlan.currentDay && !skillPlan.isCompleted;
                    const isFuture = day > skillPlan.currentDay;

                    if (isFuture) {
                      return (
                        <div key={day} className="flex flex-col items-center gap-1">
                          <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-neutral-800 text-gray-500 border border-neutral-700 cursor-not-allowed">
                            {day}
                          </div>
                          <span className="text-xs text-gray-500">Locked</span>
                        </div>
                      );
                    }

                    if (isCurrent) {
                      return (
                        <button key={day} onClick={createTopic} className="flex flex-col items-center gap-1 group">
                          <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-white text-black font-semibold group-hover:opacity-90 transition">
                            {day}
                          </div>
                          <span className="text-xs text-white/90 font-medium">Today</span>
                        </button>
                      );
                    }

                    return (
                      <Link key={day} href={`/skillPlans/${skillPlanId}/day/${day}`} className="flex flex-col items-center gap-1 group">
                        <div
                          className={`w-10 h-10 rounded-lg flex items-center justify-center border transition ${
                            isCompleted
                              ? "bg-emerald-600 text-white border-emerald-700 shadow"
                              : "bg-neutral-800 text-gray-500 border-neutral-700"
                          }`}
                        >
                          {day}
                        </div>
                        <span className={`text-xs ${isCompleted ? "text-emerald-400" : "text-gray-500"}`}>
                          {isCompleted ? "Done" : "Incomplete"}
                        </span>
                      </Link>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Reflections / Notes for the current day */}
            {!skillPlan.isCompleted && (
              <Card className="bg-neutral-900 border-neutral-800 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Brain className="h-5 w-5 text-cyan-400" /> Reflection Notes
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Jot a quick takeaway for better retention. Stored locally on your device.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <textarea
                      className="w-full min-h-28 rounded-lg bg-neutral-950 text-gray-200 placeholder:text-gray-500 border border-neutral-800 p-3 focus:outline-none focus:ring-2 focus:ring-neutral-700"
                      placeholder={`What did you learn in Day ${skillPlan.currentDay}? Any blockers?`}
                      value={notesMap[skillPlan.currentDay] ?? ""}
                      onChange={(e) => setNoteForDay(skillPlan.currentDay, e.target.value)}
                    />
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Info className="h-4 w-4" /> Notes are private and saved in your browser.
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Plan Actions */}
            <Card className="bg-neutral-900 border-neutral-800 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Sparkles className="h-5 w-5 text-cyan-400" /> Plan Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link href={`/skillPlans/${skillPlanId}/learned-topics`}>
                  <Button variant="outline" className="w-full justify-start gap-2 border-neutral-700 text-gray-300 hover:bg-neutral-800">
                    <BookOpen className="h-4 w-4" /> View Learned Topics
                  </Button>
                </Link>
                <Link href={`/skillPlans/${skillPlanId}/aiHistory`}>
                  <Button variant="outline" className="w-full justify-start gap-2 border-neutral-700 text-gray-300 hover:bg-neutral-800">
                    <History className="h-4 w-4" /> AI Generation History
                  </Button>
                </Link>
                <Link href={`/skillPlans/${skillPlanId}/edit`}>
                  <Button variant="outline" className="w-full justify-start gap-2 border-neutral-700 text-gray-300 hover:bg-neutral-800">
                    <Edit className="h-4 w-4" /> Edit Plan
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  className="w-full justify-start gap-2 text-red-400 border-neutral-700 hover:bg-red-500/10"
                  onClick={deleteSkillPlan}
                >
                  <Trash2 className="h-4 w-4" /> Delete Plan
                </Button>
              </CardContent>
            </Card>

            {/* Today's Quick Access */}
            {!skillPlan.isCompleted && (
              <Card className="bg-neutral-900 border-neutral-800 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Play className="h-5 w-5 text-cyan-400" /> Today&apos;s Session
                  </CardTitle>
                  <CardDescription className="text-gray-400">Jump back in where you left off.</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button
                    className="w-full gap-2 bg-white text-black hover:bg-gray-100"
                    onClick={createTopic}
                    disabled={loading}
                  >
                    <Play className="h-4 w-4" /> Start Day {skillPlan.currentDay}
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* AI Insights (client-side heuristic) */}
            <Card className="bg-neutral-900 border-neutral-800 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Brain className="h-5 w-5 text-cyan-400" /> AI Insights
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Simple guidance based on your recent consistency.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-gray-300">
                <ul className="list-disc pl-5 space-y-2">
                  {consistency >= 70 ? (
                    <>
                      <li>You&apos;re on a roll. Increase difficulty slightly for the next 3 days.</li>
                      <li>Try a timed review session (20–25 min) before starting new material.</li>
                    </>
                  ) : consistency >= 40 ? (
                    <>
                      <li>Streak is decent. Schedule shorter, daily sessions (15–20 min).</li>
                      <li>Pre-plan tomorrow&apos;s topic at the end of each session.</li>
                    </>
                  ) : (
                    <>
                      <li>Build momentum: commit to 7 consecutive short sessions.</li>
                      <li>Reduce scope per day; finish something tiny but shippable.</li>
                    </>
                  )}
                </ul>
                <div className="text-xs text-gray-500">These tips are generated locally from your stats.</div>
              </CardContent>
            </Card>

            {/* Plan Statistics */}
            <Card className="bg-neutral-900 border-neutral-800 shadow-lg">
              <CardHeader>
                <CardTitle className="text-white">Plan Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-gray-300">
                <div className="flex justify-between"><span className="text-gray-400">Days Completed</span><span className="font-medium text-white">{skillPlan.completedDays.length}/{skillPlan.durationInDays}</span></div>
                <div className="flex justify-between"><span className="text-gray-400">Success Rate</span><span className="font-medium text-white">{skillPlan.durationInDays > 0 ? Math.round((skillPlan.completedDays.length / skillPlan.durationInDays) * 100) : 0}%</span></div>
                <div className="flex justify-between"><span className="text-gray-400">Started On</span><span className="font-medium text-white">{safeFormatDate(skillPlan.createdAt)}</span></div>
                <div className="flex justify-between"><span className="text-gray-400">Target Level</span><span className="font-medium text-white">{skillPlan.targetLevel}</span></div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
