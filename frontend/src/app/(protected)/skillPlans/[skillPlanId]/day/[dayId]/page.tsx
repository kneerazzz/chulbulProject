"use client";

import { Suspense, useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent } from '@/app/components/ui/card';
import { Skeleton } from '@/app/components/ui/skeleton';
import { Button } from '@/app/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import Loading from './loading';
import { toast } from 'sonner';

// Components
import DailyTopic from './topic-content';
import Notes from './notes';
import Actions from './actions';
import axios from 'axios';

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

export default function DailySessionPage() {
  const params = useParams();
  const router = useRouter();
  const skillPlanId = params.skillPlanId as string;
  const day = Number(params.dayId);
  const [notesContent, setNotesContent] = useState('');
  const [skillPlan, setSkillPlan] = useState<SkillPlanDetail | null>(null);
  const [loading, setLoading] = useState(true);
  
  const handleCompleteSuccess = () => {
    toast.success(`Day ${day} marked as complete!`);
    router.push(`/skillPlans/${skillPlanId}`);
  };

  useEffect(() => {
    const fetchSkillPlan = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`/api/skillPlan/get-plan?skillPlanId=${skillPlanId}`);
        setSkillPlan(res.data.data);
      } catch (err) {
        console.error("Failed to fetch skill plan:", err);
        toast.error("Failed to load skill plan details");
      } finally {
        setLoading(false);
      }
    };

    fetchSkillPlan();
  }, [skillPlanId]);

  if (loading) {
    return <Loading />;
  }

  if (!skillPlan) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="text-red-500 mb-4">Skill plan not found</p>
        <Button onClick={() => router.push('/skillPlans')}>
          Back to All Plans
        </Button>
      </div>
    );
  }

  const currentDay = skillPlan.currentDay;
  const isPastDay = day < currentDay;
  const isToday = day === currentDay;
  const isFutureDay = day > currentDay;
  const isCompletedDay = skillPlan.completedDays.includes(day);

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      {/* Header with Back Button */}
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="ghost"
          onClick={() => router.push(`/skillPlans/${skillPlanId}`)}
          className="gap-2"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to Plan
        </Button>
        
        {/* Status Badge */}
        <div className="text-sm text-muted-foreground">
          {isFutureDay && "🔒 Upcoming Day"}
          {isToday && "🎯 Current Day"}
          {(isPastDay || isCompletedDay) && "✅ Completed Day"}
        </div>
      </div>

      <Suspense fallback={<Loading />}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-6">
            <Suspense fallback={
              <Card>
                <CardHeader>
                  <CardTitle>
                    <Skeleton className="h-6 w-40" />
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-24 w-full" />
                </CardContent>
              </Card>
            }>
              <DailyTopic skillPlanId={skillPlanId} day={day} currentDay={currentDay} />
            </Suspense>

            <Suspense fallback={
              <Card>
                <CardHeader>
                  <CardTitle>
                    <Skeleton className="h-5 w-24" />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-24 w-full" />
                </CardContent>
              </Card>
            }>
              <Notes 
                skillPlanId={skillPlanId} 
                day={day}
                onNotesChange={setNotesContent}
                currentDay={currentDay}
              />
            </Suspense>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {isToday && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Session Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <Actions 
                    skillPlanId={skillPlanId} 
                    day={day}
                    currentDay={currentDay}
                    notesContent={notesContent}
                    onComplete={handleCompleteSuccess}
                  />
                </CardContent>
              </Card>
            )}

            {(isPastDay || isCompletedDay) && (
              <Card className="bg-muted/50">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <span className="text-green-600">✅</span>
                    Day Completed
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground text-sm">
                    This day has been completed. You can review the content and notes, 
                    but no further actions are available.
                  </p>
                  <Button 
                    onClick={() => router.push(`/skillPlans/${skillPlanId}`)}
                    className="w-full"
                    variant="outline"
                  >
                    Return to Plan Overview
                  </Button>
                </CardContent>
              </Card>
            )}

            {isFutureDay && (
              <Card className="bg-amber-50 border-amber-200">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <span className="text-amber-600">🔒</span>
                    Upcoming Day
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-amber-700 text-sm">
                    This day hasn&apos;t started yet. Complete the current day to unlock 
                    future sessions.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </Suspense>
    </div>
  );
}