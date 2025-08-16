"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Trash2, Save } from "lucide-react";

interface NotesProps {
  skillPlanId: string;
  day?: number; // current day, passed from daily topic page
}

export default function Notes({ skillPlanId, day }: NotesProps) {
  const [loading, setLoading] = useState(true);
  const [note, setNote] = useState<string>("");
  const [savedNote, setSavedNote] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // Fetch today’s note
  useEffect(() => {
    const fetchNote = async () => {
      if (!skillPlanId || !day) return;

      try {
        setLoading(true);
        const res = await axios.get(
          `/api/notes?skillPlanId=${skillPlanId}&day=${day}`
        );
        setNote(res.data.data.content || "");
        setSavedNote(res.data.data.content || "");
      } catch (err: any) {
        setError(err.response?.data?.message || "No note found for today");
      } finally {
        setLoading(false);
      }
    };

    fetchNote();
  }, [skillPlanId, day]);

  // Save/update note
  const handleSave = async () => {
    if (!note.trim()) return;
    try {
      setSaving(true);
      const res = await axios.put(
        `/api/notes/update?skillPlanId=${skillPlanId}&day=${day}`,
        { content: note }
      );
      setSavedNote(res.data.data.content);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to save note");
    } finally {
      setSaving(false);
    }
  };

  // Delete note
  const handleDelete = async () => {
    try {
      setSaving(true);
      await axios.delete(`/api/notes/delete?skillPlanId=${skillPlanId}&day=${day}`);
      setNote("");
      setSavedNote("");
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to delete note");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>📝 Notes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center items-center py-6">
            <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>📝 Notes</CardTitle>
      </CardHeader>
      <CardContent>
        {error ? (
          <p className="text-sm text-red-600">{error}</p>
        ) : (
          <Textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Write your notes for today..."
            className="min-h-[150px]"
          />
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button
          variant="outline"
          onClick={handleSave}
          disabled={saving || note === savedNote}
        >
          {saving ? (
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
          ) : (
            <Save className="h-4 w-4 mr-2" />
          )}
          Save
        </Button>

        <Button
          variant="destructive"
          onClick={handleDelete}
          disabled={saving || !savedNote}
        >
          {saving ? (
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
          ) : (
            <Trash2 className="h-4 w-4 mr-2" />
          )}
          Delete
        </Button>
      </CardFooter>
    </Card>
  );
}
