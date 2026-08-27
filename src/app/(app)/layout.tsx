import { AuthGuard } from "@/components/AuthGuard";
import { GovHeader } from "@/components/GovHeader";
import { GovFooter } from "@/components/GovFooter";
import { AppBottomNav } from "@/components/AppBottomNav";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <GovHeader />
      <AuthGuard>
        {/* Bottom padding clears the fixed mobile nav so the last card is
            never trapped underneath it. */}
        <main
          id="main"
          className="app-main mx-auto w-full max-w-[1600px] flex-1 px-4 py-5 pb-28 sm:px-8 sm:py-8 md:pb-8 lg:px-10 xl:px-12"
        >
          {children}
        </main>
        <AppBottomNav />
      </AuthGuard>
      <GovFooter />
    </>
  );
}
