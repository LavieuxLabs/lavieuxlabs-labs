import TermsView, { metadata as localized } from "@/views/legal/TermsView";

export const metadata = localized.en;

export default function TermsPage() {
  return <TermsView locale="en" />;
}
