import TermsView, { metadata as localized } from "@/views/legal/TermsView";

export const metadata = localized.tr;

export default function TermsPage() {
  return <TermsView locale="tr" />;
}
