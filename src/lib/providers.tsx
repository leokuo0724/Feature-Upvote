"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ThemeProvider } from "next-themes";
import { useState } from "react";
import { SettingsProvider } from "@/shared/contexts/settings-context";
import { ThemeProvider as CustomThemeProvider } from "@/shared/components/theme-provider";
import { AppLoader } from "@/shared/components/app-loader";

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 5 * 60 * 1000, // 5 minutes
            gcTime: 10 * 60 * 1000, // 10 minutes
            retry: (failureCount, error) => {
              // Don't retry on 4xx errors
              if (error instanceof Error && "status" in error) {
                const status = (error as any).status;
                if (status >= 400 && status < 500) return false;
              }
              return failureCount < 3;
            },
          },
          mutations: {
            retry: false,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <SettingsProvider>
          <AppLoader>
            <CustomThemeProvider>
              {children}
              <ReactQueryDevtools initialIsOpen={false} />
            </CustomThemeProvider>
          </AppLoader>
        </SettingsProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
