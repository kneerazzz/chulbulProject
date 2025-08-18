'use client';

import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Loader2, CheckCircle, ChevronLeft } from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';

export default function SessionActions({
  skillPlanId,
  day,
  notesContent,
  onComplete,
}: {
  skillPlanId: string;
  day: number;
  notesContent: string;
  onComplete?: () => void;
}) {
  const router = useRouter();
  const [isCompleting, setIsCompleting] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);

  const handleCompleteDay = async () => {
    try {
      setIsCompleting(true);
      
      const res = await axios.patch(
        `/api/skillPlan/complete-day?skillPlanId=${skillPlanId}`,
        { notesContent },
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
    <div className="flex justify-between items-center gap-4">
      <Button
        variant="outline"
        onClick={() => router.push(`/skillPlans/${skillPlanId}`)}
        disabled={isCompleting || isNavigating}
      >
        {isNavigating ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <ChevronLeft className="mr-2 h-4 w-4" />
        )}
        Back to Plan
      </Button>

      <Button
        onClick={handleCompleteDay}
        disabled={isCompleting || isNavigating}
        className="bg-green-600 hover:bg-green-700"
      >
        {isCompleting ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <CheckCircle className="mr-2 h-4 w-4" />
        )}
        Mark Day as Complete
      </Button>
    </div>
  );
}