'use client';

import { Suspense, useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
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
  
  const handleCompleteSuccess = () => {
    toast.success(`Day ${day} marked as complete!`);
    router.push(`/skillPlans/${skillPlanId}`);
  };


  useEffect(() => {
    const fetchSkillPlan = async () => {
      try {
        const res = await axios.get(`/api/skillPlan/get-plan?skillPlanId=${skillPlanId}`);
        setSkillPlan(res.data.data);
      } catch (err) {
        console.error("Failed to fetch skill plan:", err);
      }
    };

    fetchSkillPlan();
  }, [skillPlanId]);

  const currentDay = skillPlan?.currentDay || day

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
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
              <DailyTopic skillPlanId={skillPlanId} day={day} />
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
            <Card>
              <Suspense fallback={
                <CardContent className="space-y-2">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                </CardContent>
              }>
                <Actions 
                  skillPlanId={skillPlanId} 
                  day={day}
                  notesContent={notesContent}
                  onComplete={handleCompleteSuccess}
                />
              </Suspense>
            </Card>
          </div>
        </div>
      </Suspense>
    </div>
  );
}