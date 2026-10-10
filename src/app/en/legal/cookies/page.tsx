import CookiesView, { metadata as localized } from "@/views/legal/CookiesView";

export const metadata = localized.en;

export default function CookiesPage() {
  return <CookiesView locale="en" />;
}
