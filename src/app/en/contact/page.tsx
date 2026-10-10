import ContactView, { metadata as localized } from "@/views/ContactView";

export const metadata = localized.en;

export default function ContactPage() {
  return <ContactView locale="en" />;
}
