import PharmaDeuxView, { metadata as localized } from "@/views/PharmaDeuxView";

export const metadata = localized.en;

export default function PharmaDeuxPage() {
  return <PharmaDeuxView locale="en" />;
}
