import HomeView, { metadata as localized } from "@/views/HomeView";

export const metadata = localized.en;

export default function HomePage() {
  return <HomeView locale="en" />;
}
