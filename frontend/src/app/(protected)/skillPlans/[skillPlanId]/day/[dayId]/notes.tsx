'use client';

import { useState, useEffect, useCallback } from "react";
import { Textarea } from '@/app/components/ui/textarea';
import { Button } from '@/app/components/ui/button';
import { Loader2, Edit, Save, Trash2, Plus, BookOpen } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
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
  const [noteExists, setNoteExists] = useState(false);
  const [originalContent, setOriginalContent] = useState('');

  // Determine day status
  const isCurrentDay = day === currentDay;
  const isPastDay = day < currentDay;
  const isFutureDay = day > currentDay;
  const canEdit = isCurrentDay || isPastDay; // Allow editing for current and past days

  // Reusable fetch functio

  const fetchNotes = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await axios.get(
        `/api/notes/get-note?skillPlanId=${skillPlanId}&day=${day}`,
        { withCredentials: true }
      );

      if (res.status === 200 && res.data.data) {
        const noteContent = res.data.data.content || '';
        setContent(noteContent);
        setOriginalContent(noteContent);
        setNoteExists(true);
        if (onNotesChange) onNotesChange(noteContent);
      } else {
        setContent('');
        setOriginalContent('');
        setNoteExists(false);
      }
    } catch (error: any) {
      if (error.response?.status === 404) {
        setContent('');
        setOriginalContent('');
        setNoteExists(false);
      } else {
        toast.error("Failed to load notes");
      }
    } finally {
      setIsLoading(false);
    }
  }, [skillPlanId, day, onNotesChange]); // include deps

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

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
        setNoteExists(true);
        setOriginalContent(content);
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
        setNoteExists(true);
        setOriginalContent(content);
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
        setContent('');
        setOriginalContent('');
        setNoteExists(false);
        setIsEditing(true);
        if (onNotesChange) onNotesChange('');
      }
    } catch {
      toast.error("Failed to delete note");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancel = () => {
    if (noteExists) {
      setContent(originalContent);
      if (onNotesChange) onNotesChange(originalContent);
    } else {
      setContent('');
      if (onNotesChange) onNotesChange('');
    }
    setIsEditing(false);
  };

  const handleStartEditing = () => {
    setOriginalContent(content);
    setIsEditing(true);
  };

  if (isLoading) {
    return (
      <Card className="border-2 border-primary/10 shadow-lg">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <BookOpen className="h-5 w-5 text-primary" />
            </div>
            <CardTitle className="text-lg">Notes</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-[200px] flex items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-2 border-primary/10 shadow-lg">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <BookOpen className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">Session Notes</CardTitle>
              <p className="text-sm text-muted-foreground">
                Your personal reflections for Day {day}
              </p>
            </div>
          </div>
          <Badge variant={isCurrentDay ? "default" : "secondary"} className="capitalize">
            {isCurrentDay ? 'Active' : isPastDay ? 'Completed' : 'Upcoming'}
          </Badge>
        </div>
      </CardHeader>

      <CardContent>
        {!noteExists && !isEditing && !isFutureDay ? (
          <div className="space-y-4 py-4 text-center">
            <BookOpen className="h-12 w-12 text-muted-foreground mx-auto opacity-50" />
            <p className="text-muted-foreground italic">
              No notes yet for this session.
            </p>
            {canEdit && (
              <Button onClick={handleStartEditing} className="mt-2">
                <Plus className="h-4 w-4 mr-2" />
                Create Notes
              </Button>
            )}
          </div>
        ) : isFutureDay ? (
          <div className="space-y-4 py-4 text-center">
            <BookOpen className="h-12 w-12 text-muted-foreground mx-auto opacity-50" />
            <p className="text-muted-foreground">
              Notes will be available when you reach Day {day}.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <Textarea
              value={content}
              onChange={(e) => handleContentChange(e.target.value)}
              className="min-h-[200px] resize-y border-muted-foreground/20 focus:border-primary/50"
              placeholder="Record your thoughts, insights, and observations from today's session..."
              disabled={!isEditing}
              onFocus={() => {
                if (canEdit && !isEditing) handleStartEditing();
              }}
            />
            {!isEditing && canEdit && content && (
              <div className="text-sm text-muted-foreground text-center">
                Click on the text to edit your notes
              </div>
            )}
          </div>
        )}
      </CardContent>

      {(isEditing || (noteExists && canEdit && !isFutureDay)) && (
        <CardFooter className="flex flex-col gap-3 pt-4 border-t">
          {isEditing ? (
            <div className="flex justify-between gap-2 w-full">
              <Button
                variant="outline"
                onClick={handleCancel}
                disabled={isSaving || isDeleting}
                className="flex-1"
              >
                Cancel
              </Button>
              
              <div className="flex gap-2">
                {noteExists && (
                  <Button
                    variant="destructive"
                    onClick={handleDelete}
                    disabled={isSaving || isDeleting}
                    className="flex-1"
                  >
                    {isDeleting ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                  </Button>
                )}
                
                <Button 
                  onClick={noteExists ? handleSave : handleCreate} 
                  disabled={isSaving || isDeleting || !content.trim()}
                  className="flex-1"
                >
                  {isSaving ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          ) : (
            <Button
              variant="outline"
              onClick={handleStartEditing}
              className="w-full"
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit Notes
            </Button>
          )}
        </CardFooter>
      )}
    </Card>
  );
}