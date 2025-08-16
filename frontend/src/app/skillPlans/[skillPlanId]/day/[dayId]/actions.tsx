"use client";

import { useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { RotateCcw, Trash2 } from "lucide-react";
import { Loader2 } from "lucide-react";

interface ActionsProps {
  skillPlanId: string;
  day: number;
  onUpdate: (topic: any | null) => void; // callback to parent
}

export default function Actions({ skillPlanId, day, onUpdate }: ActionsProps) {
  const [loading, setLoading] = useState<"regen" | "delete" | null>(null);

  const handleRegenerate = async () => {
    try {
      setLoading("regen");
      const res = await axios.put(
        `/api/daily-topics/regenerate?skillPlanId=${skillPlanId}&day=${day}`
      );
      onUpdate(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(null);
    }
  };

  const handleDelete = async () => {
    try {
      setLoading("delete");
      await axios.delete(
        `/api/daily-topics/delete?skillPlanId=${skillPlanId}&day=${day}`
      );
      onUpdate(null);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="flex gap-2">
      <Button
        variant="outline"
        onClick={handleRegenerate}
        disabled={loading !== null}
      >
        {loading === "regen" ? (
          <Loader2 className="h-4 w-4 animate-spin mr-2" />
        ) : (
          <RotateCcw className="h-4 w-4 mr-2" />
        )}
        Regenerate
      </Button>

      <Button
        variant="destructive"
        onClick={handleDelete}
        disabled={loading !== null}
      >
        {loading === "delete" ? (
          <Loader2 className="h-4 w-4 animate-spin mr-2" />
        ) : (
          <Trash2 className="h-4 w-4 mr-2" />
        )}
        Delete
      </Button>
    </div>
  );
}
