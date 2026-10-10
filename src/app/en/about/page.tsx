import AboutView, { metadata as localized } from "@/views/AboutView";

export const metadata = localized.en;

export default function AboutPage() {
  return <AboutView locale="en" />;
}
