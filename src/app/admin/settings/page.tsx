"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
  Input,
  Textarea,
  Label,
  Badge,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/shared/ui";
import { useAuth } from "@/shared/hooks/use-auth";
import { updateAppSettings } from "@/entities/settings/api/firebase";
import { useSettings } from "@/shared/contexts/settings-context";
import { AppSettings } from "@/shared/types/settings";
import { Palette, Globe, Settings, Flag } from "lucide-react";

const settingsSchema = z.object({
  projectName: z.string().min(1, "Project name is required"),
  tagline: z.string().min(1, "Tagline is required"),
  primaryColor: z.string().regex(/^#[0-9A-F]{6}$/i, "Invalid color format"),
  defaultTheme: z.enum(["light", "dark", "system"]),
});

type SettingsFormData = z.infer<typeof settingsSchema>;

export default function AdminSettingsPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("branding");
  const [isUpdating, setIsUpdating] = useState(false);

  const { settings, isLoading, refetch } = useSettings();

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
    watch,
  } = useForm<SettingsFormData>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      projectName: settings?.projectName || "",
      tagline: settings?.tagline || "",
      primaryColor: settings?.primaryColor || "#3b82f6",
      defaultTheme: settings?.defaultTheme || "system",
    },
  });

  // Update form when settings load
  React.useEffect(() => {
    if (settings) {
      reset({
        projectName: settings.projectName,
        tagline: settings.tagline,
        primaryColor: settings.primaryColor,
        defaultTheme: settings.defaultTheme,
      });
    }
  }, [settings, reset]);

  const onSubmit = async (data: SettingsFormData) => {
    if (!user) return;

    try {
      setIsUpdating(true);
      await updateAppSettings(data, user.uid);
      // Refetch settings to update the context
      await refetch();
      // Reset form dirty state
      reset(data);
    } catch (error) {
      console.error("Error updating settings:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  if (!user?.isAdmin) {
    return (
      <div className="container mx-auto py-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="text-muted-foreground">
            You need admin privileges to access this page.
          </p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-2xl font-bold mb-4">Loading...</h1>
        </div>
      </div>
    );
  }

  const primaryColor = watch("primaryColor");

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">App Settings</h1>
            <p className="text-muted-foreground">
              Customize your feature upvote platform
            </p>
          </div>
          <Badge variant="secondary">Admin Only</Badge>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="branding" className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                Branding
              </TabsTrigger>
              <TabsTrigger value="theme" className="flex items-center gap-2">
                <Palette className="h-4 w-4" />
                Theme
              </TabsTrigger>
              <TabsTrigger value="features" className="flex items-center gap-2">
                <Flag className="h-4 w-4" />
                Features
              </TabsTrigger>
              <TabsTrigger value="advanced" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Advanced
              </TabsTrigger>
            </TabsList>

            <TabsContent value="branding" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="projectName">Project Name</Label>
                    <Input
                      id="projectName"
                      {...register("projectName")}
                      placeholder="Feature Upvote"
                    />
                    {errors.projectName && (
                      <p className="text-sm text-destructive">
                        {errors.projectName.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="tagline">Tagline</Label>
                    <Textarea
                      id="tagline"
                      {...register("tagline")}
                      placeholder="A feature request and upvoting platform for product teams"
                      rows={3}
                    />
                    {errors.tagline && (
                      <p className="text-sm text-destructive">
                        {errors.tagline.message}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="theme" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Color Scheme</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="primaryColor">Primary Color</Label>
                      <div className="flex items-center gap-2">
                        <Input
                          id="primaryColor"
                          type="color"
                          {...register("primaryColor")}
                          className="w-16 h-10 p-1 border rounded"
                        />
                        <Input
                          {...register("primaryColor")}
                          placeholder="#3b82f6"
                          className="flex-1"
                        />
                      </div>
                      {errors.primaryColor && (
                        <p className="text-sm text-destructive">
                          {errors.primaryColor.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Color Preview</Label>
                    <div className="flex gap-4 p-4 border rounded-lg">
                      <div
                        className="w-16 h-16 rounded-lg border"
                        style={{ backgroundColor: primaryColor }}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="defaultTheme">Default Theme</Label>
                    <select
                      id="defaultTheme"
                      {...register("defaultTheme")}
                      className="w-full p-2 border rounded-md"
                    >
                      <option value="system">System</option>
                      <option value="light">Light</option>
                      <option value="dark">Dark</option>
                    </select>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="features" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Feature Flags</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Feature configuration will be available in the next update.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="advanced" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Advanced Settings</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Advanced customization options will be available in the next
                    update.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end gap-4 mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => reset()}
              disabled={!isDirty}
            >
              Reset
            </Button>
            <Button type="submit" disabled={!isDirty || isUpdating}>
              {isUpdating ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
