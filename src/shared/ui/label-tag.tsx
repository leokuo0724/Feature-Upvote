"use client";

import { Tag } from "lucide-react";
import { useLabel } from "@/entities/label";
import { Badge } from "./badge";

interface LabelTagProps {
  labelId: string;
  className?: string;
}

export function LabelTag({ labelId, className = "" }: LabelTagProps) {
  const { data: label, isLoading } = useLabel(labelId);

  if (isLoading || !label) {
    return null;
  }

  return (
    <Badge variant="outline" className={`text-xs ${className}`}>
      <Tag className="h-3 w-3 mr-1" />
      {label.name}
    </Badge>
  );
}
