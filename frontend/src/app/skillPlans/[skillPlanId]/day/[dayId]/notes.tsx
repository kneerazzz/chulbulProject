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

interface Note {
  _id: string;
  content: string;
  day: number;
  createdAt: string;
}

export default function Notes({ skillPlanId, day }: NotesProps) {
  const [loading, setLoading] = useState(true);
  const [note, setNote] = useState<string>("");
  const [savedNote, setSavedNote] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [allNotes, setAllNotes] = useState<Note[]>([]);

  // Fetch today’s note
  useEffect(() => {
    const fetchNote = async () => {
      if (!skillPlanId || !day) return;

      try {
        setLoading(true);
        const res = await axios.get(
          `/api/notes/get-note?skillPlanId=${skillPlanId}&day=${day}`,
          { withCredentials: true }
        );
        setNote(res.data.data?.content || "");
        setSavedNote(res.data.data?.content || "");
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
      const content = { content: note };
      const res = await axios.patch(
        `/api/notes/update-note?skillPlanId=${skillPlanId}&day=${day}`,
        content,
        { withCredentials: true }
      );
      setSavedNote(res.data.data.content);

      // Refresh all notes after update
      await handleAllNotes();
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
      await axios.delete(`/api/notes/delete-note?skillPlanId=${skillPlanId}&day=${day}`, {
        withCredentials: true,
      });
      setNote("");
      setSavedNote("");
      await handleAllNotes();
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to delete note");
    } finally {
      setSaving(false);
    }
  };

  // Fetch all notes for this plan
  const handleAllNotes = async () => {
    try {
      const res = await axios.get(`/api/notes/get-all-notes?skillPlanId=${skillPlanId}`, {
        withCredentials: true,
      });
      setAllNotes(res.data.data || []);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to fetch all notes");
    }
  };

  useEffect(() => {
    if (skillPlanId) handleAllNotes();
  }, [skillPlanId]);

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
        <CardTitle>📝 Notes (Day {day})</CardTitle>
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

        {/* Render all notes */}
        {allNotes.length > 0 && (
          <div className="mt-4">
            <h3 className="text-sm font-semibold mb-2">📚 All Notes</h3>
            <ul className="space-y-2">
              {allNotes.map((n) => (
                <li
                  key={n._id}
                  className="p-2 rounded border bg-gray-50 text-sm"
                >
                  <span className="font-medium">Day {n.day}:</span> {n.content}
                </li>
              ))}
            </ul>
          </div>
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
