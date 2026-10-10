import ContactView, { metadata as localized } from "@/views/ContactView";

export const metadata = localized.tr;

export default function ContactPage() {
  return <ContactView locale="tr" />;
}
