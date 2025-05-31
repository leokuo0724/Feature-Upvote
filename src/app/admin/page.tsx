"use client";

import Link from "next/link";
import { Settings, Tag, Users, BarChart3 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/ui";
import { useAuth } from "@/shared/hooks/use-auth";

const adminFeatures = [
  {
    title: "Label Management",
    description: "Create and manage labels for feature requests",
    icon: Tag,
    href: "/admin/labels",
    color: "text-blue-600",
    bgColor: "bg-blue-50",
  },
  {
    title: "User Management",
    description: "Manage user roles and permissions",
    icon: Users,
    href: "/admin/users",
    color: "text-green-600",
    bgColor: "bg-green-50",
    disabled: true,
  },
  {
    title: "Analytics",
    description: "View platform statistics and insights",
    icon: BarChart3,
    href: "/admin/analytics",
    color: "text-purple-600",
    bgColor: "bg-purple-50",
    disabled: true,
  },
  {
    title: "Settings",
    description: "Configure platform settings and preferences",
    icon: Settings,
    href: "/admin/settings",
    color: "text-orange-600",
    bgColor: "bg-orange-50",
    disabled: true,
  },
];

export default function AdminPage() {
  const { user } = useAuth();

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

  if (!user) {
    return (
      <div className="container mx-auto py-8">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-2xl font-bold mb-4">Please Sign In</h1>
          <p className="text-muted-foreground">
            You need to sign in to access the admin panel.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Admin Panel</h1>
          <p className="text-muted-foreground mt-2">
            Manage your Feature Upvote platform
          </p>
        </div>

        {/* Admin Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {adminFeatures.map((feature) => {
            const IconComponent = feature.icon;

            if (feature.disabled) {
              return (
                <Card
                  key={feature.title}
                  className="opacity-50 cursor-not-allowed"
                >
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${feature.bgColor}`}>
                        <IconComponent className={`h-6 w-6 ${feature.color}`} />
                      </div>
                      <div>
                        <CardTitle className="text-lg">
                          {feature.title}
                        </CardTitle>
                        <CardDescription className="text-sm">
                          Coming Soon
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              );
            }

            return (
              <Link key={feature.title} href={feature.href}>
                <Card className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${feature.bgColor}`}>
                        <IconComponent className={`h-6 w-6 ${feature.color}`} />
                      </div>
                      <div>
                        <CardTitle className="text-lg">
                          {feature.title}
                        </CardTitle>
                        <CardDescription className="text-sm">
                          Manage & Configure
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>

        {/* Quick Stats */}
        <div className="mt-12">
          <h2 className="text-xl font-semibold mb-4">Quick Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">-</div>
                  <p className="text-sm text-muted-foreground">
                    Total Feature Requests
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">-</div>
                  <p className="text-sm text-muted-foreground">Active Users</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">-</div>
                  <p className="text-sm text-muted-foreground">Total Labels</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
