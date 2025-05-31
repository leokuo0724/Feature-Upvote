"use client";

import { useState } from "react";
import { Check, ChevronsUpDown, X } from "lucide-react";
import {
  Button,
  Badge,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/shared/ui";
import { useLabels } from "@/entities/label";
import { LabelTag } from "./label-tag";
import { cn } from "@/shared/lib";

interface LabelSelectorProps {
  selectedLabelIds: string[];
  onSelectionChange: (labelIds: string[]) => void;
  disabled?: boolean;
  placeholder?: string;
}

export function LabelSelector({
  selectedLabelIds,
  onSelectionChange,
  disabled = false,
  placeholder = "Select labels...",
}: LabelSelectorProps) {
  const [open, setOpen] = useState(false);
  const { data: labels = [], isLoading } = useLabels();

  const handleToggleLabel = (labelId: string) => {
    if (selectedLabelIds.includes(labelId)) {
      // Remove label
      onSelectionChange(selectedLabelIds.filter((id) => id !== labelId));
    } else {
      // Add label
      onSelectionChange([...selectedLabelIds, labelId]);
    }
  };

  const handleRemoveLabel = (labelId: string) => {
    onSelectionChange(selectedLabelIds.filter((id) => id !== labelId));
  };

  return (
    <div className="space-y-2">
      {/* Selected Labels Display */}
      {selectedLabelIds.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {selectedLabelIds.map((labelId) => (
            <div key={labelId} className="flex items-center gap-1">
              <LabelTag labelId={labelId} />
              {!disabled && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-5 w-5 p-0 hover:bg-destructive hover:text-destructive-foreground"
                  onClick={() => handleRemoveLabel(labelId)}
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Label Selector */}
      {!disabled && (
        <DropdownMenu open={open} onOpenChange={setOpen}>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="w-full justify-between"
              disabled={isLoading}
            >
              {selectedLabelIds.length > 0
                ? `${selectedLabelIds.length} label${
                    selectedLabelIds.length > 1 ? "s" : ""
                  } selected`
                : placeholder}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-[var(--radix-dropdown-menu-trigger-width)] min-w-[8rem] p-0">
            <div className="max-h-60 overflow-auto">
              {isLoading ? (
                <div className="p-4 text-center text-sm text-muted-foreground">
                  Loading labels...
                </div>
              ) : labels.length === 0 ? (
                <div className="p-4 text-center text-sm text-muted-foreground">
                  No labels available. Ask an admin to create some labels.
                </div>
              ) : (
                <div className="p-1">
                  {labels.map((label) => {
                    const isSelected = selectedLabelIds.includes(label.id);
                    return (
                      <div
                        key={label.id}
                        className={cn(
                          "flex items-center gap-2 px-2 py-1.5 text-sm cursor-pointer hover:bg-accent hover:text-accent-foreground rounded-sm",
                          isSelected && "bg-accent"
                        )}
                        onClick={() => handleToggleLabel(label.id)}
                      >
                        <div className="flex items-center gap-2 flex-1">
                          <Badge variant="outline" className="text-xs">
                            {label.name}
                          </Badge>
                        </div>
                        {isSelected && (
                          <Check className="h-4 w-4 text-primary" />
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
}
