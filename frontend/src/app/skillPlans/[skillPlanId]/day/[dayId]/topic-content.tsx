"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface TopicContentProps {
  topic: {
    day: number;
    topic: string;
    description: string;
    content: string;
    optionalTip?: string;
  } | null;
}

export default function TopicContent({ topic }: TopicContentProps) {
  if (!topic) {
    return (
      <Card>
        <CardContent className="text-gray-500 text-center p-6">
          No topic available for today. Try generating one.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Day {topic.day}: {topic.topic}
        </CardTitle>
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
  );
}
