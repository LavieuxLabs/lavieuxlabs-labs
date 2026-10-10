import QualityView, { metadata as localized } from "@/views/legal/QualityView";

export const metadata = localized.en;

export default function QualityPage() {
  return <QualityView locale="en" />;
}
