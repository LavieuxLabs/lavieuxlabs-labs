import FhirStandardView, { metadata as localized } from "@/views/standards/FhirStandardView";

export const metadata = localized.tr;

export default function FhirStandardPage() {
  return <FhirStandardView locale="tr" />;
}
