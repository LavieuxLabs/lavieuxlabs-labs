import CookiesView, { metadata as localized } from "@/views/legal/CookiesView";

export const metadata = localized.tr;

export default function CookiesPage() {
  return <CookiesView locale="tr" />;
}
