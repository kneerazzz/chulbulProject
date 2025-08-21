'use client';
import { Button } from '@/app/components/ui/button';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Loader2, CheckCircle, ArrowLeft, Target } from 'lucide-react';
import { toast } from 'sonner';
import { Card, CardContent, CardFooter } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import axios from 'axios';

export default function SessionActions({
  skillPlanId,
  day,
  onComplete,
  currentDay,
}: {
  skillPlanId: string;
  day: number;
  notesContent: string;
  onComplete?: () => void;
  currentDay: number;
}) {
  const router = useRouter();
  const [isCompleting, setIsCompleting] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);

  // Determine access permissions
  const isCurrentDay = day === currentDay;
  const isPastDay = day < currentDay;
  const canComplete = isCurrentDay; // Only current day can be completed

  const handleCompleteDay = async () => {
    try {
      setIsCompleting(true);
      
      const res = await axios.patch(
        `/api/skillPlan/complete-day?skillPlanId=${skillPlanId}`,
        { withCredentials: true }
      );
      if (res.status === 200) {
        toast.success(`Day ${day} completed successfully!`);
        if (onComplete) onComplete();
        setIsNavigating(true);
        router.push(`/skillPlans/${skillPlanId}`);
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to complete day');
    } finally {
      setIsCompleting(false);
    }
  };

  return (
    <Card className="border-2 border-primary/10 shadow-lg">
      <CardContent className="pt-6">
        {/* Header with day indicator */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Target className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-semibold">Session Actions</h3>
              <p className="text-sm text-muted-foreground">
                Manage your Day {day} progress
              </p>
            </div>
          </div>
          <Badge variant={isCurrentDay ? "default" : "secondary"} className="capitalize">
            {isCurrentDay ? 'Active' : isPastDay ? 'Completed' : 'Upcoming'}
          </Badge>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col gap-4">
          {/* Complete button - Primary emphasis */}
          {canComplete ? (
            <Button
              onClick={handleCompleteDay}
              disabled={isCompleting || isNavigating}
              className="h-12 bg-primary hover:bg-primary/90 text-primary-foreground shadow transition-all duration-200 rounded-lg"
            >
              {isCompleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  <span className="font-medium">Completing Session...</span>
                </>
              ) : (
                <>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  <span className="font-medium">Complete Day {day}</span>
                </>
              )}
            </Button>
          ) : (
            <Button
              disabled
              variant="outline"
              className="h-12 rounded-lg"
            >
              <CheckCircle className="mr-2 h-4 w-4" />
              <span className="font-medium">
                {isPastDay ? 'Session Completed' : 'Session Not Started'}
              </span>
            </Button>
          )}

          {/* Back button */}
          <Button
            variant="outline"
            onClick={() => router.push(`/skillPlans/${skillPlanId}`)}
            disabled={isCompleting || isNavigating}
            className="h-12 border-muted-foreground/20 hover:border-primary/30 hover:bg-primary/5 transition-all duration-200 rounded-lg"
          >
            {isNavigating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                <span>Navigating...</span>
              </>
            ) : (
              <>
                <ArrowLeft className="mr-2 h-4 w-4" />
                <span>Back to Plan Overview</span>
              </>
            )}
          </Button>
        </div>
      </CardContent>

      <CardFooter className="flex flex-col gap-3 pt-4 border-t">
        <div className="text-sm text-muted-foreground text-center w-full">
          {canComplete 
            ? "Complete this session to continue your progress"
            : isPastDay 
              ? "This session has been completed. View your progress in the plan overview."
              : "This session hasn't started yet. Complete previous days to unlock."
          }
        </div>
      </CardFooter>
    </Card>
  );
}