import { Suspense } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import ContactExperience, { ContactExperienceFromParams } from "@/components/ContactExperience";
import PilotProtocol from "@/components/PilotProtocol";
import { CRUMB_LINK } from "@/components/paper/Editorial";
import { defineContent, localizedPath, type Locale } from "@/i18n/config";
import { defineMetadata } from "@/i18n/metadata";

export const metadata = defineMetadata("/contact", {
  tr: {
    title: "İletişim: tanışma görüşmesi, akademik ortaklık ve pilot",
    description:
      "PharmaDeux CDSS veya Shield için 15 dakikalık tanışma görüşmesi isteyin, akademik doğrulama ortaklığı önerin ya da pilot (LOI) başvurusu yapın.",
  },
  en: {
    title: "Contact: intro call, academic partnership and pilot",
    description:
      "Request a 15-minute intro call about PharmaDeux CDSS or Shield, propose an academic validation partnership or apply for a pilot (LOI).",
  },
});

/*
 * Contact on the paper surface (Academic Editorial). The first screen says what the page is for and offers the
 * three ways in, lowest commitment first; the form follows the chosen path.  The pilot protocol follows. No entrance
 * motion. Section ids are linked from elsewhere and kept: #pilot-protokolu.
 */
const copy = defineContent({
  tr: {
    crumbs: { home: "Ana sayfa", here: "İletişim", aria: "Sayfa konumu" },
    title: "Üç yoldan biriyle başlayın.",
    description:
      "İlk adım genellikle 15 dakikalık bir tanışma görüşmesidir; bunun için bir taahhüt gerekmez. Akademik ortaklık ve pilot başvurusu ayrı yollardır.",
  },
  en: {
    crumbs: { home: "Home", here: "Contact", aria: "Breadcrumb" },
    title: "Start in one of three ways.",
    description:
      "The first step is usually a 15-minute intro call, which needs no commitment. An academic partnership and a pilot application are separate paths.",
  },
});

export default function ContactView({ locale }: { locale: Locale }) {
  const c = copy[locale];

  // Who we are, where the projects stand and what a request is not; beside the path choice on wide screens.
  return (
    <main id="main" className="surface-paper relative flex-1 bg-paper text-ink">
      {/* Hero: what the page is for. The three ways in follow straight away. */}
      <section aria-labelledby="hero-title" className="pt-16">
        <div className="mx-auto max-w-7xl text-center px-4 pt-6 pb-8 sm:px-6 sm:pt-12 sm:pb-12 lg:px-8">
          <nav aria-label={c.crumbs.aria} className="text-left">
            <ol className="flex flex-wrap items-center gap-1 text-[14px] text-ink-3">
              <li>
                <Link href={localizedPath(locale, "/")} className={`-my-3 inline-block py-3 ${CRUMB_LINK}`}>
                  {c.crumbs.home}
                </Link>
              </li>
              <li aria-hidden="true">
                <ChevronRight className="h-3.5 w-3.5" strokeWidth={1.8} />
              </li>
              <li>
                <Link href={localizedPath(locale, "/contact")} aria-current="page" className={`-my-3 inline-block py-3 text-ink-2 ${CRUMB_LINK}`}>
                  {c.crumbs.here}
                </Link>
              </li>
            </ol>
          </nav>
          <h1
            id="hero-title"
            className="mx-auto mt-6 max-w-[40ch] text-balance font-serif text-[34px] leading-[1.08] font-medium tracking-[-0.022em] text-ink sm:mt-8 sm:text-[46px]"
          >
            {c.title}
          </h1>
          <p className="mx-auto mt-4 max-w-[84ch] text-pretty text-[17px] leading-[1.6] text-ink-2">{c.description}</p>
        </div>
      </section>

      <div className="pb-16 sm:pb-24">
        <Suspense fallback={<ContactExperience locale={locale} tone="paper" />}>
          <ContactExperienceFromParams locale={locale} tone="paper" />
        </Suspense>
      </div>

      <PilotProtocol locale={locale} tone="paper" />

    </main>
  );
}
