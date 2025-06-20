"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { Moon, Sun, LogIn, LogOut, User, Settings } from "lucide-react";
import { useTheme } from "next-themes";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Avatar,
  AvatarFallback,
  AvatarImage,
  LanguageSwitcher,
} from "@/shared/ui";
import { useAuth } from "@/shared/hooks/use-auth";
import { useSettings } from "@/shared/contexts/settings-context";

export function Navigation() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const { user, signIn, signOut } = useAuth();
  const { settings } = useSettings();
  const t = useTranslations();

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleSignIn = async () => {
    try {
      await signIn();
    } catch (error) {
      console.error("Sign in error:", error);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo and Navigation Links */}
          <div className="flex items-center space-x-8">
            <Link href="/" className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">
                  {getInitials(settings.projectName)}
                </span>
              </div>
              <span className="font-bold text-xl">{settings.projectName}</span>
            </Link>

            <div className="hidden md:flex items-center space-x-6">
              <Link
                href="/feature-requests"
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  pathname.includes("/feature-requests")
                    ? "text-primary"
                    : "text-muted-foreground"
                }`}
              >
                {t("navigation.featureRequests")}
              </Link>

              {user?.isAdmin && (
                <Link
                  href="/admin"
                  className={`text-sm font-medium transition-colors hover:text-primary ${
                    pathname.includes("/admin")
                      ? "text-primary"
                      : "text-muted-foreground"
                  }`}
                >
                  {t("navigation.admin")}
                </Link>
              )}
            </div>
          </div>

          {/* Right side - Language switcher, Theme toggle and User menu */}
          <div className="flex items-center">
            {/* Language Switcher */}
            <LanguageSwitcher />

            {/* Theme Toggle */}
            <Button
              className="mr-2"
              variant="ghost"
              size="sm"
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            >
              <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>

            {/* User Authentication */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-8 w-8 rounded-full"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.photoURL || undefined} />
                      <AvatarFallback>
                        {getInitials(user.displayName || "User")}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      <p className="font-medium">{user.displayName}</p>
                      <p className="w-[200px] truncate text-sm text-muted-foreground">
                        {user.email}
                      </p>
                      {user.isAdmin && (
                        <p className="text-xs text-primary font-medium">
                          {t("auth.profile.admin")}
                        </p>
                      )}
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      {t("navigation.profile")}
                    </Link>
                  </DropdownMenuItem>
                  {user.isAdmin && (
                    <DropdownMenuItem asChild>
                      <Link href="/admin" className="cursor-pointer">
                        <Settings className="mr-2 h-4 w-4" />
                        {t("navigation.admin")}
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleSignOut}
                    className="cursor-pointer"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    {t("navigation.signOut")}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button onClick={handleSignIn} size="sm">
                <LogIn className="mr-2 h-4 w-4" />
                {t("navigation.signIn")}
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
