"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { X, Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  Button,
  Input,
  Textarea,
  Badge,
} from "@/shared/ui";
import { CreateFeatureRequestData } from "@/shared/types";
import { useAuth } from "@/shared/hooks/use-auth";
import { useCreateFeatureRequest } from "@/entities/feature-request";

const createFeatureRequestSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(100, "Title must be less than 100 characters"),
  description: z
    .string()
    .min(1, "Description is required")
    .max(1000, "Description must be less than 1000 characters"),
});

type CreateFeatureRequestFormData = z.infer<typeof createFeatureRequestSchema>;

interface CreateFeatureRequestFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function CreateFeatureRequestForm({
  open,
  onOpenChange,
  onSuccess,
}: CreateFeatureRequestFormProps) {
  const { user } = useAuth();
  const createFeatureRequest = useCreateFeatureRequest();
  const [labels, setLabels] = useState<string[]>([]);
  const [labelInput, setLabelInput] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<CreateFeatureRequestFormData>({
    resolver: zodResolver(createFeatureRequestSchema),
  });

  const handleAddLabel = () => {
    const trimmedLabel = labelInput.trim();
    if (trimmedLabel && !labels.includes(trimmedLabel)) {
      setLabels([...labels, trimmedLabel]);
      setLabelInput("");
    }
  };

  const handleRemoveLabel = (labelToRemove: string) => {
    setLabels(labels.filter((label) => label !== labelToRemove));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddLabel();
    }
  };

  const onSubmit = async (data: CreateFeatureRequestFormData) => {
    if (!user) return;

    try {
      const createData: CreateFeatureRequestData = {
        ...data,
        labels,
      };

      await createFeatureRequest.mutateAsync({
        data: createData,
        authorId: user.uid,
        authorName: user.displayName || "Anonymous",
        authorEmail: user.email || "",
      });

      // Reset form
      reset();
      setLabels([]);
      setLabelInput("");
      onOpenChange(false);
      onSuccess?.();
    } catch (error) {
      console.error("Error creating feature request:", error);
    }
  };

  const handleClose = () => {
    reset();
    setLabels([]);
    setLabelInput("");
    onOpenChange(false);
  };

  if (!user) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Create Feature Request</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-medium">
              Title *
            </label>
            <Input
              id="title"
              placeholder="Enter a clear, descriptive title"
              {...register("title")}
              className={errors.title ? "border-destructive" : ""}
            />
            {errors.title && (
              <p className="text-sm text-destructive">{errors.title.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium">
              Description *
            </label>
            <Textarea
              id="description"
              placeholder="Describe the feature request in detail..."
              rows={4}
              {...register("description")}
              className={errors.description ? "border-destructive" : ""}
            />
            {errors.description && (
              <p className="text-sm text-destructive">
                {errors.description.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="labels" className="text-sm font-medium">
              Labels (optional)
            </label>
            <div className="flex gap-2">
              <Input
                id="labels"
                placeholder="Add a label"
                value={labelInput}
                onChange={(e) => setLabelInput(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddLabel}
                disabled={!labelInput.trim()}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            {labels.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {labels.map((label) => (
                  <Badge
                    key={label}
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    {label}
                    <button
                      type="button"
                      onClick={() => handleRemoveLabel(label)}
                      className="ml-1 hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create Feature Request"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
