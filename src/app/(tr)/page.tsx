import HomeView, { metadata as localized } from "@/views/HomeView";

export const metadata = localized.tr;

export default function HomePage() {
  return <HomeView locale="tr" />;
}
