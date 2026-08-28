import { AuthGuard } from "@/components/AuthGuard";
import { GovHeader } from "@/components/GovHeader";
import { GovFooter } from "@/components/GovFooter";
import { AppBottomNav } from "@/components/AppBottomNav";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <GovHeader />
      <AuthGuard>
        {/* No sidebar. Four destinations do not justify a permanent 224px
            rail on every page — they live in the header now, which also
            ends the duplicate "Dashboard" link the two navs used to share.
            Bottom padding clears the fixed mobile nav so the last card is
            never trapped underneath it. */}
        <main
          id="main"
          className="app-main mx-auto w-full max-w-[1240px] flex-1 px-4 py-5 pb-28 sm:px-8 sm:py-8 md:pb-8 lg:px-10"
        >
          {children}
        </main>
        <AppBottomNav />
      </AuthGuard>
      <GovFooter />
    </>
  );
}
