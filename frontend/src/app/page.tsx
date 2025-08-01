'use client'
import Button from "@/components/ui/button";
import React from "react";

export default function Home() {
  return (
    <div>
      <Button onClick={() => alert("just checking")} variant="primary" type="button">
        Get Started
      </Button>
    </div>
  );
}
