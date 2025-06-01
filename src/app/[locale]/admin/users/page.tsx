"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { Crown, User, Mail, Calendar, Shield, ShieldOff } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Button,
  Badge,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  useToast,
} from "@/shared/ui";
import { useAuth } from "@/shared/hooks/use-auth";
import {
  useAdminUsers,
  useUpdateUserAdminStatus,
} from "@/entities/user/api/queries";
import { User as UserType } from "@/shared/types";
import { formatDistanceToNow } from "date-fns";

interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: UserType | null;
  action: "promote" | "demote";
  onConfirm: () => void;
  isLoading: boolean;
}

function ConfirmDialog({
  open,
  onOpenChange,
  user,
  action,
  onConfirm,
  isLoading,
}: ConfirmDialogProps) {
  const t = useTranslations("admin");

  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {action === "promote"
              ? t("users.promoteDialog.title")
              : t("users.demoteDialog.title")}
          </DialogTitle>
          <DialogDescription>
            {action === "promote"
              ? t("users.promoteDialog.description", {
                  name: user.displayName || user.email || "Unknown User",
                })
              : t("users.demoteDialog.description", {
                  name: user.displayName || user.email || "Unknown User",
                })}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            {t("common.cancel")}
          </Button>
          <Button
            variant={action === "promote" ? "default" : "destructive"}
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading
              ? t("common.loading")
              : action === "promote"
              ? t("users.promoteDialog.confirm")
              : t("users.demoteDialog.confirm")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function UserCard({
  user,
  currentUser,
  onDemote,
}: {
  user: UserType;
  currentUser: UserType;
  onDemote: (user: UserType) => void;
}) {
  const t = useTranslations("admin");

  return (
    <Card className="mb-4">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              {user.photoURL ? (
                <img
                  src={user.photoURL}
                  alt={user.displayName || "User"}
                  className="h-12 w-12 rounded-full"
                />
              ) : (
                <User className="h-6 w-6" />
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold">
                  {user.displayName || "Anonymous User"}
                </h3>
                <Badge variant="secondary" className="text-xs">
                  <Crown className="h-3 w-3 mr-1" />
                  Admin
                </Badge>
              </div>
              <div className="flex flex-col sm:flex-row gap-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Mail className="h-4 w-4" />
                  {user.email || "No email"}
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  Joined{" "}
                  {formatDistanceToNow(user.createdAt, { addSuffix: true })}
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  Last login{" "}
                  {formatDistanceToNow(user.lastLoginAt, { addSuffix: true })}
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {user.uid !== currentUser.uid ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onDemote(user)}
                className="text-destructive hover:text-destructive"
              >
                <ShieldOff className="h-4 w-4 mr-2" />
                {t("users.actions.demote")}
              </Button>
            ) : (
              <Badge variant="outline">{t("users.currentUser")}</Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function AdminUsersPage() {
  const { user: currentUser } = useAuth();
  const t = useTranslations("admin");
  const { toast } = useToast();
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    user: UserType | null;
    action: "promote" | "demote";
  }>({
    open: false,
    user: null,
    action: "promote",
  });

  const { data: adminUsers = [], isLoading } = useAdminUsers();
  const updateAdminStatus = useUpdateUserAdminStatus();

  // Redirect if not admin
  if (currentUser && !currentUser.isAdmin) {
    return (
      <div className="container mx-auto py-8">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-2xl font-bold mb-4">
            {t("access.denied.title")}
          </h1>
          <p className="text-muted-foreground">{t("access.denied.message")}</p>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="container mx-auto py-8">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-2xl font-bold mb-4">
            {t("access.signInRequired.title")}
          </h1>
          <p className="text-muted-foreground">
            {t("access.signInRequired.message")}
          </p>
        </div>
      </div>
    );
  }

  const handleDemoteUser = (user: UserType) => {
    setConfirmDialog({
      open: true,
      user,
      action: "demote",
    });
  };

  const handleConfirmAction = async () => {
    if (!confirmDialog.user || !currentUser) return;

    try {
      const isPromoting = confirmDialog.action === "promote";
      await updateAdminStatus.mutateAsync({
        uid: confirmDialog.user.uid,
        isAdmin: isPromoting,
        updatedBy: currentUser.uid,
      });

      toast({
        title: t("users.success.title"),
        description: isPromoting
          ? t("users.success.promoted", {
              name:
                confirmDialog.user.displayName ||
                confirmDialog.user.email ||
                "Unknown User",
            })
          : t("users.success.demoted", {
              name:
                confirmDialog.user.displayName ||
                confirmDialog.user.email ||
                "Unknown User",
            }),
      });

      setConfirmDialog({ open: false, user: null, action: "promote" });
    } catch (error) {
      console.error("Error updating admin status:", error);
      toast({
        title: t("users.error.title"),
        description: t("users.error.message"),
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">{t("users.loading")}</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">{t("users.title")}</h1>
          <p className="text-muted-foreground">{t("users.description")}</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Crown className="h-5 w-5" />
              {t("users.adminUsers.title")}
            </CardTitle>
            <CardDescription>
              {t("users.adminUsers.description")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {adminUsers.length === 0 ? (
              <div className="text-center py-8">
                <Crown className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">
                  {t("users.noAdmins.title")}
                </h3>
                <p className="text-muted-foreground">
                  {t("users.noAdmins.description")}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {adminUsers.map((user) => (
                  <UserCard
                    key={user.uid}
                    user={user}
                    currentUser={currentUser}
                    onDemote={handleDemoteUser}
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <ConfirmDialog
          open={confirmDialog.open}
          onOpenChange={(open) => setConfirmDialog({ ...confirmDialog, open })}
          user={confirmDialog.user}
          action={confirmDialog.action}
          onConfirm={handleConfirmAction}
          isLoading={updateAdminStatus.isPending}
        />
      </div>
    </div>
  );
}
