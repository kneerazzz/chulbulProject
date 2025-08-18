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
  currentDay,
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
  // --- inside useEffect


  

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        setIsLoading(true);
        const res = await axios.get(
          `/api/notes/get-note?skillPlanId=${skillPlanId}&day=${day}`, 
          { withCredentials: true }
        );

        const data = res.data?.data;
        if (data) {
          setContent(data.content || '');
          if (onNotesChange) onNotesChange(data.content || '');
        } else {
          // No note exists for this day
          setContent('');
        }
      } catch (error) {
        toast.message("No note available for the day"); // only real error
      } finally {
        setIsLoading(false);
      }
    };
    fetchNotes()
  }, [skillPlanId, day])


  const handleContentChange = (value: string) => {
    setContent(value);
    if (onNotesChange) onNotesChange(value);
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      const res = await axios.patch(
        `/api/notes/update-note?skillPlanId=${skillPlanId}&day=${day}`,
        { content },
        { withCredentials: true }
      );

      if (res.status === 200) {
        toast.success("Notes updated successfully");
        setIsEditing(false);
      }
    } catch {
      toast.error("Failed to update notes");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCreate = async () => {
    try {
      setIsSaving(true);
      const res = await axios.post(
        `/api/notes/create-note?skillPlanId=${skillPlanId}&day=${day}`,
        { content },
        { withCredentials: true }
      );

      if (res.status === 200) {
        toast.success("Note created successfully");
        toast.warning("Mark the day as complete to finalize the note");
        setIsEditing(false);
      }
    } catch {
      toast.error("Failed to create note");
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
    } catch {
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
        {content === '' && !isEditing && !isFutureDay ? (
          <p className="text-muted-foreground italic">
            No note available for this day.
          </p>
        ) : (
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
        )}
      </CardContent>


      {isEditing && (
        <CardFooter className="flex justify-between">
          {isCurrentDay ? (
            // 👉 Current day → only Create button (right side)
            <div className="flex justify-end w-full">
              <Button onClick={handleCreate} disabled={isSaving || isDeleting || !content}>
                {isSaving ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4 mr-2" />
                )}
                Create Note
              </Button>
            </div>
          ) : isPastDay ? (
            // 👉 Past day → Delete (left) + Update (right)
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
              <Button onClick={handleSave} disabled={isSaving || isDeleting || !content}>
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
