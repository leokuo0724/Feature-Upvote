"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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
  LabelSelector,
} from "@/shared/ui";
import { CreateFeatureRequestData, FeatureRequest } from "@/shared/types";
import { useAuth } from "@/shared/hooks/use-auth";
import {
  useCreateFeatureRequest,
  useUpdateFeatureRequest,
} from "@/entities/feature-request";

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
  editData?: FeatureRequest;
}

export function CreateFeatureRequestForm({
  open,
  onOpenChange,
  onSuccess,
  editData,
}: CreateFeatureRequestFormProps) {
  const { user } = useAuth();
  const createFeatureRequest = useCreateFeatureRequest();
  const updateFeatureRequest = useUpdateFeatureRequest();
  const [labelIds, setLabelIds] = useState<string[]>([]);

  const isEditMode = !!editData;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<CreateFeatureRequestFormData>({
    resolver: zodResolver(createFeatureRequestSchema),
    defaultValues: {
      title: "",
      description: "",
    },
  });

  // 初始化編輯模式的數據
  useEffect(() => {
    if (editData && open) {
      reset({
        title: editData.title,
        description: editData.description,
      });
      setLabelIds(editData.labels || []);
    } else if (!open) {
      // 關閉時重置表單
      reset({
        title: "",
        description: "",
      });
      setLabelIds([]);
    }
  }, [editData, open, reset]);

  const onSubmit = async (data: CreateFeatureRequestFormData) => {
    if (!user) return;

    try {
      const createData: CreateFeatureRequestData = {
        ...data,
        labels: labelIds,
      };

      if (isEditMode) {
        await updateFeatureRequest.mutateAsync({
          id: editData.id,
          updates: {
            title: createData.title,
            description: createData.description,
            labels: createData.labels,
          },
        });
      } else {
        await createFeatureRequest.mutateAsync({
          data: createData,
          authorId: user.uid,
          authorName: user.displayName || "Anonymous",
          authorEmail: user.email || "",
        });
      }

      // Reset form
      reset();
      setLabelIds([]);
      onOpenChange(false);
      onSuccess?.();
    } catch (error) {
      console.error("Error creating feature request:", error);
    }
  };

  const handleClose = () => {
    reset();
    setLabelIds([]);
    onOpenChange(false);
  };

  if (!user) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? "Edit Feature Request" : "Create Feature Request"}
          </DialogTitle>
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

          {/* Labels - Only for admins */}
          {user.isAdmin && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Labels (optional)</label>
              <LabelSelector
                selectedLabelIds={labelIds}
                onSelectionChange={setLabelIds}
                placeholder="Select labels for this feature request..."
              />
            </div>
          )}

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
              {isSubmitting
                ? isEditMode
                  ? "Updating..."
                  : "Creating..."
                : isEditMode
                ? "Update Request"
                : "Create Request"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
