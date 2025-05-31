"use client";

import { useState } from "react";
import { Plus, Edit, Trash2, Tag } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
  Input,
  Badge,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/ui";
import { useAuth } from "@/shared/hooks/use-auth";
import {
  useLabels,
  useCreateLabel,
  useUpdateLabel,
  useDeleteLabel,
} from "@/entities/label";
import { Label, CreateLabelData, UpdateLabelData } from "@/shared/types";
import { formatDistanceToNow } from "date-fns";

interface LabelFormData {
  name: string;
}

export default function AdminLabelsPage() {
  const { user } = useAuth();
  const [isCreating, setIsCreating] = useState(false);
  const [editingLabel, setEditingLabel] = useState<Label | null>(null);
  const [formData, setFormData] = useState<LabelFormData>({ name: "" });

  const { data: labels = [], isLoading } = useLabels();
  const createLabel = useCreateLabel();
  const updateLabel = useUpdateLabel();
  const deleteLabel = useDeleteLabel();

  // Redirect if not admin
  if (user && !user.isAdmin) {
    return (
      <div className="container mx-auto py-8">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="text-muted-foreground">
            You don't have permission to access this page.
          </p>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !formData.name.trim()) return;

    try {
      if (editingLabel) {
        // Update existing label
        await updateLabel.mutateAsync({
          id: editingLabel.id,
          updates: { name: formData.name.trim() },
        });
        setEditingLabel(null);
      } else {
        // Create new label
        await createLabel.mutateAsync({
          data: { name: formData.name.trim() },
          createdBy: user.uid,
        });
        setIsCreating(false);
      }
      setFormData({ name: "" });
    } catch (error) {
      console.error("Error saving label:", error);
    }
  };

  const handleEdit = (label: Label) => {
    setEditingLabel(label);
    setFormData({ name: label.name });
    setIsCreating(true);
  };

  const handleDelete = async (label: Label) => {
    if (
      !confirm(`Are you sure you want to delete the label "${label.name}"?`)
    ) {
      return;
    }

    try {
      await deleteLabel.mutateAsync(label.id);
    } catch (error) {
      console.error("Error deleting label:", error);
    }
  };

  const handleCancel = () => {
    setIsCreating(false);
    setEditingLabel(null);
    setFormData({ name: "" });
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-muted rounded w-1/4"></div>
            <div className="h-32 bg-muted rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Label Management</h1>
            <p className="text-muted-foreground mt-2">
              Manage labels for feature requests
            </p>
          </div>
          <Button onClick={() => setIsCreating(true)} disabled={isCreating}>
            <Plus className="h-4 w-4 mr-2" />
            Add Label
          </Button>
        </div>

        {/* Create/Edit Form */}
        {isCreating && (
          <Card>
            <CardHeader>
              <CardTitle>
                {editingLabel ? "Edit Label" : "Create New Label"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium mb-2"
                  >
                    Label Name
                  </label>
                  <Input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="Enter label name..."
                    required
                  />
                </div>

                <div className="flex gap-2">
                  <Button
                    type="submit"
                    disabled={
                      !formData.name.trim() ||
                      createLabel.isPending ||
                      updateLabel.isPending
                    }
                  >
                    {editingLabel ? "Update" : "Create"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCancel}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Labels List */}
        <Card>
          <CardHeader>
            <CardTitle>Labels ({labels.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {labels.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No labels created yet. Create your first label to get started.
              </div>
            ) : (
              <div className="space-y-4">
                {labels.map((label) => (
                  <div
                    key={label.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className="text-xs">
                        <Tag className="h-3 w-3 mr-1" />
                        {label.name}
                      </Badge>
                      <div className="text-sm text-muted-foreground">
                        Created{" "}
                        {formatDistanceToNow(label.createdAt, {
                          addSuffix: true,
                        })}
                      </div>
                    </div>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                        >
                          <span className="sr-only">Open menu</span>
                          <svg
                            className="h-4 w-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 5v.01M12 12v.01M12 19v.01"
                            />
                          </svg>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEdit(label)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => handleDelete(label)}
                          className="text-destructive focus:text-destructive"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
