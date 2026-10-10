import PrivacyView, { metadata as localized } from "@/views/legal/PrivacyView";

export const metadata = localized.en;

export default function PrivacyPage() {
  return <PrivacyView locale="en" />;
}
