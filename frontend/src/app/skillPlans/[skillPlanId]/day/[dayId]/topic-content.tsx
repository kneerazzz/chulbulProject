'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, RefreshCw, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import axios from 'axios';

export default function DailyTopic({
  skillPlanId,
  day,
}: {
  skillPlanId: string;
  day: number;
}) {
  const router = useRouter();
  const [topic, setTopic] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [regenerating, setRegenerating] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Fetch topic data
  useEffect(() => {
    const fetchTopic = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await axios.get(`/api/dailyTopic/get-topic?skillPlanId=${skillPlanId}&day=${day}`, {
          withCredentials: true
        })
        if (res.status !== 200) throw new Error('Failed to fetch topic');
        const data = await res.data.data
        console.log(data)
        setTopic(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load topic');
      } finally {
        setLoading(false);
      }
    };

    fetchTopic();
  }, [skillPlanId, day]);

  const handleRegenerate = async () => {
    try {
      setRegenerating(true);
      const res = await axios.get(`/api/dailyTopic/regenerate-topic?skillPlanId=${skillPlanId}`, {
        withCredentials: true
      })

      if (res.status !== 200) throw new Error('Failed to regenerate topic');
      console.log(res)
      const newTopic = await res.data.data
      setTopic(newTopic);
      toast.success("Topic regenerated successfully")
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Regeneration failed',)
    } finally {
      setRegenerating(false);
    }
  };

  const handleDelete = async () => {
    try {
      setDeleting(true);
      const res = await axios.delete(`/api/dailyTopic/delete-topic?skillPlanId=${skillPlanId}`, {
        withCredentials: true
      })

      if (res.status !== 200) throw new Error('Failed to delete topic');
      
      toast.success("Topic deleted successfully")
      router.refresh(); // Refresh to show empty state
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Deletion failed',)
    } finally {
      setDeleting(false);
    }
  };

  

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Daily Topic</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (!topic) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No Topic Found</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            No topic has been generated for this day yet.
          </p>
        </CardContent>
        <CardFooter className="flex justify-end gap-2">
          <Button
            onClick={() => router.push(`/skillPlans/${skillPlanId}`)}
          >
            Generate Topic
          </Button>
        </CardFooter>
      </Card>
    );``
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Day {day}: {topic.topic}</CardTitle>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={handleRegenerate}
              disabled={regenerating || deleting}
            >
              {regenerating ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={handleDelete}
              disabled={regenerating || deleting}
            >
              {deleting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {topic.description && (
          <p className="text-muted-foreground">{topic.description}</p>
        )}
        
        <div 
          className="prose max-w-none" 
          dangerouslySetInnerHTML={{ __html: topic.content }} 
        />
        
        {topic.optionalTip && (
          <Alert className="mt-4">
            <AlertTitle>Pro Tip</AlertTitle>
            <AlertDescription>{topic.optionalTip}</AlertDescription>
          </Alert>
        )}
      </CardContent>
      {topic.isRegenerated && (
        <CardFooter className="text-sm text-muted-foreground">
          This topic was regenerated on {new Date(topic.generatedAt).toLocaleDateString()}
        </CardFooter>
      )}
    </Card>
  );
}