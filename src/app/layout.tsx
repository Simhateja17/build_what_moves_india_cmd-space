import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { StoreProvider } from "@/lib/store";
import { RouteMotion } from "@/components/RouteMotion";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "RTI, plainly",
  description:
    "A redesign concept for RTI Online — plain language first, official terms follow.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      // The inline script below stamps data-js before React hydrates, so this
      // element legitimately differs from the server HTML.
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[var(--background)] text-[var(--foreground)]">
        {/* Marks that scripting is available. Reveal animations hide their
            content only under this flag, so with JS off everything renders
            plainly instead of staying invisible. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `document.documentElement.dataset.js="1"`,
          }}
        />
        <StoreProvider>
          <RouteMotion>{children}</RouteMotion>
        </StoreProvider>
      </body>
    </html>
  );
}
