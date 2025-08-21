'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, RefreshCw, Trash2, Calendar, BookOpen, Lightbulb } from 'lucide-react';
import { toast } from 'sonner';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/app/components/ui/alert';
import { Badge } from '@/app/components/ui/badge';
import axios from 'axios';

interface DailyTopicProps {
  skillPlanId: string;
  day: number;
  currentDay: number; // Add currentDay prop
}

interface TopicData {
  topic: string;
  description: string;
  content: string;
  optionalTip?: string;
  isRegenerated?: boolean;
  generatedAt?: string;
  day?: number;
}

export default function DailyTopic({ skillPlanId, day, currentDay }: DailyTopicProps) {
  const router = useRouter();
  const [topic, setTopic] = useState<TopicData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [regenerating, setRegenerating] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Determine access permissions
  const isCurrentDay = day === currentDay;
  const isPastDay = day < currentDay;
  const isFutureDay = day > currentDay;
  const canEdit = isCurrentDay; // Only current day can be edited

  // Fetch topic data
  useEffect(() => {
    const fetchTopic = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await axios.get(`/api/dailyTopic/get-topic?skillPlanId=${skillPlanId}&day=${day}`, {
          withCredentials: true
        });
        
        if (res.status !== 200) throw new Error('Failed to fetch topic');
        const data = res.data.data;
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
      });

      if (res.status !== 200) throw new Error('Failed to regenerate topic');
      const newTopic = res.data.data;
      setTopic(newTopic);
      toast.success("Topic regenerated successfully");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Regeneration failed');
    } finally {
      setRegenerating(false);
    }
  };

  const handleDelete = async () => {
    try {
      setDeleting(true);
      const res = await axios.delete(`/api/dailyTopic/delete-topic?skillPlanId=${skillPlanId}&day=${day}`, {
        withCredentials: true
      });

      if (res.status !== 200) throw new Error('Failed to delete topic');
      
      toast.success("Topic deleted successfully");
      setTopic(null); // Clear the topic locally
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Deletion failed');
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <Card className="border-2 border-dashed border-muted">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-muted-foreground" />
            <CardTitle className="text-lg">Loading Day {day}</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="h-4 bg-muted rounded animate-pulse"></div>
            <div className="h-4 bg-muted rounded animate-pulse w-3/4"></div>
            <div className="h-20 bg-muted rounded animate-pulse"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive" className="border-2">
        <AlertTitle className="flex items-center gap-2">
          <BookOpen className="h-4 w-4" />
          Error Loading Topic
        </AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (!topic) {
    return (
      <Card className="border-2 border-dashed border-muted bg-muted/20">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <CardTitle className="text-lg">Day {day}</CardTitle>
            </div>
            <Badge variant="outline" className="capitalize">
              {isFutureDay ? 'Upcoming' : isPastDay ? 'Completed' : 'Current'}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">
              {isFutureDay 
                ? "This day hasn't started yet. Complete previous days to unlock."
                : "No topic has been generated for this day yet."
              }
            </p>
            {!isFutureDay && (
              <Button 
                onClick={() => router.push(`/skillPlans/${skillPlanId}`)}
                variant="outline"
              >
                Generate Topic
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-2 border-primary/10 shadow-lg">
      <CardHeader className="pb-4 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Calendar className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-xl">Day {day}: {topic.topic}</CardTitle>
              <p className="text-sm text-muted-foreground">
                {isCurrentDay ? 'Current Session' : isPastDay ? 'Completed Session' : 'Upcoming Session'}
              </p>
            </div>
          </div>
          <Badge variant={isCurrentDay ? "default" : "secondary"} className="capitalize">
            {isCurrentDay ? 'Active' : isPastDay ? 'Completed' : 'Upcoming'}
          </Badge>
        </div>

        {topic.description && (
          <p className="text-muted-foreground leading-relaxed border-l-4 border-primary/20 pl-4 py-1">
            {topic.description}
          </p>
        )}
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="prose prose-lg max-w-none">
          <div 
            className="leading-7 text-foreground/90"
            dangerouslySetInnerHTML={{ __html: topic.content }} 
          />
        </div>

        {topic.optionalTip && (
          <Alert className="bg-gradient-to-r from-gray-500 to-gray-300 border-amber-200">
            <Lightbulb className="h-5 w-5 text-amber-600" />
            <AlertTitle className="text-red-800">Pro Tip</AlertTitle>
            <AlertDescription className="text-amber-900">
              {topic.optionalTip}
            </AlertDescription>
          </Alert>
        )}
      </CardContent>

      <CardFooter className="flex flex-col gap-3 pt-4 border-t">
        {canEdit && (
          <div className="flex gap-2 w-full">
            <Button
              variant="outline"
              onClick={handleRegenerate}
              disabled={regenerating || deleting}
              className="flex-1 cursor-pointer"
            >
              {regenerating ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <RefreshCw className="h-4 w-4 mr-2" />
              )}
              Regenerate
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={regenerating || deleting}
              className="flex-1 cursor-pointer"
            >
              {deleting ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Trash2 className="h-4 w-4 mr-2" />
              )}
              Delete
            </Button>
          </div>
        )}

        {topic.isRegenerated && topic.generatedAt && (
          <div className="text-xs text-muted-foreground text-center w-full">
            Regenerated on {new Date(topic.generatedAt).toLocaleDateString()} at{' '}
            {new Date(topic.generatedAt).toLocaleTimeString()}
          </div>
        )}

        {!canEdit && (
          <div className="text-sm text-muted-foreground text-center w-full">
            {isPastDay 
              ? "This session has been completed. Actions are no longer available."
              : "This session hasn't started yet. Complete previous days to unlock."
            }
          </div>
        )}
      </CardFooter>
    </Card>
  );
}