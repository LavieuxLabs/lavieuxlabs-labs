import PrivacyView, { metadata as localized } from "@/views/legal/PrivacyView";

export const metadata = localized.tr;

export default function PrivacyPage() {
  return <PrivacyView locale="tr" />;
}
