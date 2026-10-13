import SutAuditView, { metadata as localized } from "@/views/standards/SutAuditView";

export const metadata = localized.en;

export default function SutAuditPage() {
  return <SutAuditView locale="en" />;
}
