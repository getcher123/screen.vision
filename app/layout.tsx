import "./globals.css";
import { GeistSans } from "geist/font/sans";
import { Toaster } from "sonner";
import { cn } from "@/lib/utils";
import { TaskProvider } from "./providers/TaskProvider";
import { AnalyticsProvider } from "./providers/AnalyticsProvider";
import { SettingsProvider } from "./providers/SettingsProvider";
import localFont from "next/font/local";
import { PostHogProvider } from "./providers/PosthogProvider";
import { ChunkErrorHandler } from "./providers/ChunkErrorHandler";

export const metadata = {
  metadataBase: new URL("https://screen.vision"),
  title: "Figma помощник",
  description:
    "Поделитесь экраном и получите пошаговые подсказки для задач в Figma.",
  icons: {
    icon: "/icon.png",
    shortcut: "/icon.png",
    apple: "/icon.png",
  },
};

// Use a local font to avoid build-time fetches to Google Fonts (breaks in CI / some networks).
const inter = localFont({
  src: "../assets/geist.ttf",
  variable: "--font-inter",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <body
        className={cn(
          GeistSans.className,
          inter.variable,
          "antialiased dark",
          "bg-background"
        )}
      >
        <Toaster position="top-center" richColors />
        <ChunkErrorHandler>
          <PostHogProvider>
            <AnalyticsProvider>
              <SettingsProvider>
                <TaskProvider>{children}</TaskProvider>
              </SettingsProvider>
            </AnalyticsProvider>
          </PostHogProvider>
        </ChunkErrorHandler>
      </body>
    </html>
  );
}
