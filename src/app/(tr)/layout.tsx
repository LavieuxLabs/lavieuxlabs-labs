import "../globals.css";
import SiteShell from "@/components/SiteShell";
import { rootMetadata } from "@/i18n/rootMetadata";

export const metadata = rootMetadata("tr");

export default function TurkishRootLayout({ children }: LayoutProps<"/">) {
  return <SiteShell locale="tr">{children}</SiteShell>;
}
