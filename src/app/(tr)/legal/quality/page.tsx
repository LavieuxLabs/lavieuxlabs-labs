import QualityView, { metadata as localized } from "@/views/legal/QualityView";

export const metadata = localized.tr;

export default function QualityPage() {
  return <QualityView locale="tr" />;
}
