'use client';

import { useState, useEffect } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Loader2, Edit, Save, Trash2 } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { toast } from 'sonner';
import axios from 'axios';

export default function Notes({
  skillPlanId,
  day,
  currentDay, // 👈 add this prop so we can check
  onNotesChange,
}: {
  skillPlanId: string;
  day: number;
  currentDay: number;
  onNotesChange?: (content: string) => void;
}) {
  const [content, setContent] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch notes on mount
  useEffect(() => {
    const fetchNotes = async () => {
      try {
        setIsLoading(true);
        const res = await axios.get(
          `/api/notes/get-note?skillPlanId=${skillPlanId}&day=${day}`, 
          { withCredentials: true }
        );
        
        if (res) {
          const data = res.data.data;
          setContent(data?.content || '');
          if (onNotesChange) onNotesChange(data?.content || '');
        }
      } catch (error) {
        toast.error("Failed to load notes");
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotes();
  }, [skillPlanId, day]);

  const handleContentChange = (value: string) => {
    setContent(value);
    if (onNotesChange) onNotesChange(value);
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      const res = await axios.patch(
        `/api/notes/update-note?skillPlanId=${skillPlanId}&day=${day}`, 
        {content}, 
        { withCredentials: true }
      );

      if (res.status === 200) {
        toast.success("Notes saved successfully");
        setIsEditing(false);
      }
    } catch (error) {
      toast.error("Failed to save notes");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      const res = await axios.delete(
        `/api/notes/delete-note?skillPlanId=${skillPlanId}&day=${day}`,
        { withCredentials: true }
      );

      if (res.status === 200) {
        toast.success("Note deleted successfully");
        handleContentChange('');
        setIsEditing(false);
      }
    } catch (error) {
      toast.error("Failed to delete note");
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Notes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[200px] flex items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        </CardContent>
      </Card>
    );
  }

  // ✅ permission checks
  const isCurrentDay = day === currentDay;
  const isPastDay = day < currentDay;
  const isFutureDay = day > currentDay;

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Notes</CardTitle>

          {/* Only allow editing button for current or past days */}
          {(isCurrentDay || isPastDay) && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsEditing(!isEditing)}
              disabled={isSaving || isDeleting}
            >
              <Edit className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <Textarea
          value={content}
          onChange={(e) => handleContentChange(e.target.value)}
          className="min-h-[200px]"
          placeholder={
            isFutureDay
              ? "You can't write notes for a future day."
              : "Write your notes here..."
          }
          disabled={isFutureDay || !isEditing}
          onFocus={() => {
            if (!isFutureDay) setIsEditing(true);
          }}
        />
      </CardContent>

      {/* Footer actions */}
      {isEditing && (
        <CardFooter className="flex justify-between">
          {day === currentDay ? (
            // Current day → Only Create button on right
            <div className="flex justify-end w-full">
              <Button onClick={() => toast.success("Note is created successfully")} disabled={isSaving || isDeleting}>
                {isSaving ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4 mr-2" />
                )}
                Create Note
              </Button>
            </div>
          ) : day < currentDay ? (
            // Past day → Delete left, Update right
            <>
              <Button
                variant="destructive"
                onClick={handleDelete}
                disabled={isSaving || isDeleting || !content}
              >
                {isDeleting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Trash2 className="h-4 w-4 mr-2" />
                )}
                Delete
              </Button>
              <Button onClick={handleSave} disabled={isSaving || isDeleting}>
                {isSaving ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4 mr-2" />
                )}
                Update
              </Button>
            </>
          ) : null}
        </CardFooter>
      )}
    </Card>
  );
}
