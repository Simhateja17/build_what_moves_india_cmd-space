import { GuidelinesGate } from "@/components/GuidelinesGate";

/** The portal's guidelines stand in front of the assistant. */
export default function AssistantLayout({ children }: LayoutProps<"/assistant">) {
  return <GuidelinesGate>{children}</GuidelinesGate>;
}
