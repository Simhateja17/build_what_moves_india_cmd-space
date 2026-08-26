import { AuthGuard } from "@/components/AuthGuard";
import { GovHeader } from "@/components/GovHeader";
import { GovFooter } from "@/components/GovFooter";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <GovHeader />
      <AuthGuard>
        <main id="main" className="mx-auto w-full max-w-5xl flex-1 px-4 py-8">
          {children}
        </main>
      </AuthGuard>
      <GovFooter />
    </>
  );
}
