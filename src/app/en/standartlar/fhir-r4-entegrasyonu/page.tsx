import FhirStandardView, { metadata as localized } from "@/views/standards/FhirStandardView";

export const metadata = localized.en;

export default function FhirStandardPage() {
  return <FhirStandardView locale="en" />;
}
