"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Star, Users, MessageSquare } from "lucide-react";
import { Button, Card, CardContent, CardHeader, CardTitle } from "@/shared/ui";
import { WelcomeBanner } from "@/shared/components/welcome-banner";
import { useSettings } from "@/shared/contexts/settings-context";

export default function HomePage() {
  const { settings } = useSettings();

  const features = [
    {
      icon: Star,
      title: "Feature Voting",
      description: "Let your users vote on the features they want most",
    },
    {
      icon: Users,
      title: "Community Driven",
      description: "Build features that your community actually needs",
    },
    {
      icon: MessageSquare,
      title: "Feedback & Discussion",
      description: "Engage with your users through comments and discussions",
    },
  ];

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Welcome Banner */}
        <WelcomeBanner />

        {/* Default content if no banner */}
        {!settings.welcomeBanner?.enabled && (
          <div className="text-center space-y-6">
            <h1 className="text-5xl font-bold tracking-tight">
              Welcome to {settings.projectName}
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              {settings.tagline}
            </p>
            <div className="flex justify-center gap-4">
              <Link href="/feature-requests">
                <Button size="lg" className="font-semibold">
                  View Feature Requests
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        )}

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <Card key={index} className="text-center">
                <CardHeader>
                  <div className="mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    <IconComponent className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* CTA Section */}
        <div className="text-center bg-muted/50 rounded-lg p-8">
          <h2 className="text-3xl font-bold mb-4">Ready to get started?</h2>
          <p className="text-lg text-muted-foreground mb-6">
            Join the conversation and help shape the future of our platform.
          </p>
          <Link href="/feature-requests">
            <Button size="lg">
              Explore Feature Requests
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
