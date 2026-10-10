import "../globals.css";
import SiteShell from "@/components/SiteShell";
import { rootMetadata } from "@/i18n/rootMetadata";

export const metadata = rootMetadata("en");

export default function EnglishRootLayout({ children }: LayoutProps<"/en">) {
  return <SiteShell locale="en">{children}</SiteShell>;
}
