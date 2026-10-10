import AboutView, { metadata as localized } from "@/views/AboutView";

export const metadata = localized.tr;

export default function AboutPage() {
  return <AboutView locale="tr" />;
}
