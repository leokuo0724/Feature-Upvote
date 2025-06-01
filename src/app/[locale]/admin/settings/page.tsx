"use client";

import React, { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslations } from "next-intl";
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

// Custom ColorPicker component that auto-saves on outside click
interface ColorPickerProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

function ColorPicker({ value, onChange, className }: ColorPickerProps) {
  const colorInputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isColorPickerOpen, setIsColorPickerOpen] = useState(false);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node) &&
        isColorPickerOpen
      ) {
        setIsColorPickerOpen(false);
      }
    }

    if (isColorPickerOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [isColorPickerOpen]);

  const handleColorInputClick = () => {
    setIsColorPickerOpen(true);
  };

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <div ref={containerRef} className={className}>
      <div className="flex items-center gap-2">
        <Input
          ref={colorInputRef}
          type="color"
          value={value}
          onChange={handleColorChange}
          onClick={handleColorInputClick}
          className="w-16 h-10 p-1 border rounded cursor-pointer"
        />
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="#3b82f6"
          className="flex-1"
        />
      </div>
    </div>
  );
}

export default function AdminSettingsPage() {
  const { user } = useAuth();
  const t = useTranslations("admin");
  const [activeTab, setActiveTab] = useState("branding");
  const [isUpdating, setIsUpdating] = useState(false);

  const { settings, isLoading, refetch } = useSettings();

  const settingsSchema = z.object({
    projectName: z.string().min(1, t("settings.branding.projectName.error")),
    tagline: z.string().min(1, t("settings.branding.tagline.error")),
    primaryColor: z
      .string()
      .regex(/^#[0-9A-F]{6}$/i, t("settings.theme.primaryColor.error")),
    defaultTheme: z.enum(["light", "dark", "system"]),
  });

  type SettingsFormData = z.infer<typeof settingsSchema>;

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
    watch,
    setValue,
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
          <h1 className="text-2xl font-bold mb-4">
            {t("access.adminRequired.title")}
          </h1>
          <p className="text-muted-foreground">
            {t("access.adminRequired.message")}
          </p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-2xl font-bold mb-4">{t("settings.loading")}</h1>
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
            <h1 className="text-3xl font-bold">{t("settings.title")}</h1>
            <p className="text-muted-foreground">{t("settings.subtitle")}</p>
          </div>
          <Badge variant="secondary">{t("settings.adminOnly")}</Badge>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="branding" className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                {t("settings.tabs.branding")}
              </TabsTrigger>
              <TabsTrigger value="theme" className="flex items-center gap-2">
                <Palette className="h-4 w-4" />
                {t("settings.tabs.theme")}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="branding" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>{t("settings.branding.title")}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="projectName">
                      {t("settings.branding.projectName.label")}
                    </Label>
                    <Input
                      id="projectName"
                      {...register("projectName")}
                      placeholder={t(
                        "settings.branding.projectName.placeholder"
                      )}
                    />
                    {errors.projectName && (
                      <p className="text-sm text-destructive">
                        {errors.projectName.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="tagline">
                      {t("settings.branding.tagline.label")}
                    </Label>
                    <Textarea
                      id="tagline"
                      {...register("tagline")}
                      placeholder={t("settings.branding.tagline.placeholder")}
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
                  <CardTitle>{t("settings.theme.title")}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="primaryColor">
                        {t("settings.theme.primaryColor.label")}
                      </Label>
                      <ColorPicker
                        value={primaryColor}
                        onChange={(value) => {
                          setValue("primaryColor", value, {
                            shouldDirty: true,
                            shouldValidate: true,
                          });
                        }}
                        className="w-full"
                      />
                      {errors.primaryColor && (
                        <p className="text-sm text-destructive">
                          {errors.primaryColor.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="defaultTheme">
                      {t("settings.theme.defaultTheme.label")}
                    </Label>
                    <select
                      id="defaultTheme"
                      {...register("defaultTheme")}
                      className="w-full p-2 border rounded-md"
                    >
                      <option value="system">
                        {t("settings.theme.defaultTheme.options.system")}
                      </option>
                      <option value="light">
                        {t("settings.theme.defaultTheme.options.light")}
                      </option>
                      <option value="dark">
                        {t("settings.theme.defaultTheme.options.dark")}
                      </option>
                    </select>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="features" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>{t("settings.features.title")}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    {t("settings.features.description")}
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="advanced" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>{t("settings.advanced.title")}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    {t("settings.advanced.description")}
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
              {t("settings.actions.reset")}
            </Button>
            <Button type="submit" disabled={!isDirty || isUpdating}>
              {isUpdating
                ? t("settings.actions.saving")
                : t("settings.actions.save")}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
