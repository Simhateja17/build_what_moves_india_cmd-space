import { AuthGuard } from "@/components/AuthGuard";
import { TabBar } from "@/components/mobile/TabBar";
import { OfflineBanner } from "@/components/mobile/OfflineBanner";
import { DraftProvider } from "@/lib/draft";

/* ------------------------------------------------------------------
   The mobile shell.

   One column at every width — the desktop view is the phone view,
   centred, not a second design. There is no masthead nav and no
   footer: on a phone both are scroll the citizen pays for and never
   reads. Navigation lives in the fixed tab bar at the bottom, in
   thumb reach.

   Screens that own their own top bar render it themselves, because the
   bar differs by screen type (root / task / detail) and the layout has
   no way to know which one it is wrapping.
------------------------------------------------------------------- */

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    // The filing draft lives here rather than under /file-request,
    // because payment continues the same draft on a sibling route.
    <DraftProvider>
      <div className="m-shell flex min-h-full flex-1 flex-col">
        <OfflineBanner />
        <AuthGuard>
          <main id="main" className="flex-1">
            {children}
          </main>
        </AuthGuard>
        <TabBar />
      </div>
    </DraftProvider>
  );
}
