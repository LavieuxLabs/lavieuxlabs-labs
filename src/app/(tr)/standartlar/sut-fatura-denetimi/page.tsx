import SutAuditView, { metadata as localized } from "@/views/standards/SutAuditView";

export const metadata = localized.tr;

export default function SutAuditPage() {
  return <SutAuditView locale="tr" />;
}
