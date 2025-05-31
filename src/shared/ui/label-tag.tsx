"use client";

import { useLabel } from "@/entities/label";

interface LabelTagProps {
  labelId: string;
  className?: string;
}

export function LabelTag({ labelId, className = "" }: LabelTagProps) {
  const { data: label, isLoading } = useLabel(labelId);

  // 如果找不到 label 或正在載入，不顯示任何內容
  if (isLoading || !label) {
    return null;
  }

  return (
    <span
      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${className}`}
      style={{
        backgroundColor: label.backgroundColor,
        color: label.textColor,
        borderColor: label.textColor + "20", // 20% opacity for border
      }}
    >
      {label.name}
    </span>
  );
}
