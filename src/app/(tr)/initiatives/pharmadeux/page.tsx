import PharmaDeuxView, { metadata as localized } from "@/views/PharmaDeuxView";

export const metadata = localized.tr;

export default function PharmaDeuxPage() {
  return <PharmaDeuxView locale="tr" />;
}
