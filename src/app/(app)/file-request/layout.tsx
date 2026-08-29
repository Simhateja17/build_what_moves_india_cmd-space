import { GuidelinesGate } from "@/components/GuidelinesGate";

/** The portal's guidelines stand in front of the filing form. */
export default function FileRequestLayout({
  children,
}: LayoutProps<"/file-request">) {
  return <GuidelinesGate always>{children}</GuidelinesGate>;
}
