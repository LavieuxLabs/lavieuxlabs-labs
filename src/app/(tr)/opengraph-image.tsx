import { ogContentType, ogSize, renderOgCard } from "@/lib/ogImage";
import { ogCards } from "@/lib/ogCards";

const { alt: cardAlt, ...card } = ogCards.tr.home;

export const alt = cardAlt;
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return renderOgCard({ locale: "tr", ...card });
}
