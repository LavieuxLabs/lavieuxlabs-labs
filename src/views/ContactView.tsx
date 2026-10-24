import { Suspense } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import ContactExperience, { ContactExperienceFromParams } from "@/components/ContactExperience";
import LocationMap from "@/components/LocationMap";
import PilotProtocol from "@/components/PilotProtocol";
import { LINK, PaperSection } from "@/components/paper/Editorial";
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
 * three ways in, lowest commitment first; the form follows the chosen path. A short summary says who we are,
 * where the projects stand and what a request is not. The pilot protocol and the location follow. No entrance
 * motion. Section ids are linked from elsewhere and kept: #pilot-protokolu, #konum.
 */
const copy = defineContent({
  tr: {
    crumbs: { home: "Ana sayfa", here: "İletişim", aria: "Sayfa konumu" },
    title: "Üç yoldan biriyle başlayın.",
    description:
      "İlk adım genellikle 15 dakikalık bir tanışma görüşmesidir; bunun için bir taahhüt gerekmez. Akademik ortaklık ve pilot başvurusu ayrı yollardır.",
    summaryTitle: "Kısaca",
    summary: [
      {
        label: "Biz kimiz",
        value:
          "Konya Teknik Üniversitesi'nde okuyan öğrencilerin bağımsız girişimi. LavieuxLabs henüz şirketleşmedi ve üniversitenin bir birimi değil.",
      },
      { label: "Projeler", value: "PharmaDeux ekibin ortak projesi. Shield, Tarık Ziya Eren'in bağımsız projesi." },
      { label: "Aşama", value: "İkisi de prototip. Hiçbir hastaneye bağlı değil; klinik doğrulama henüz yapılmadı." },
      { label: "Talep", value: "Form bir talep iletir. Randevu onayı, anlaşma veya sözleşme değildir." },
      { label: "Göndermeyin", value: "Hasta verisi ve gerçek fatura verisi." },
    ],
    location: {
      label: "Konum",
      title: "Ekip Konya'da çalışıyor.",
      description:
        "Ekip Konya Teknik Üniversitesi'nde öğrenci; aşağıdaki adres öğrenim gördüğümüz fakültedir. LavieuxLabs üniversitenin resmi bir birimi veya ortağı değildir. Görüşmek isterseniz önceden e-postayla randevu alın.",
    },
  },
  en: {
    crumbs: { home: "Home", here: "Contact", aria: "Breadcrumb" },
    title: "Start in one of three ways.",
    description:
      "The first step is usually a 15-minute intro call, which needs no commitment. An academic partnership and a pilot application are separate paths.",
    summaryTitle: "In brief",
    summary: [
      {
        label: "Who we are",
        value:
          "An independent venture of students at Konya Technical University. LavieuxLabs is not incorporated yet and is not a unit of the university.",
      },
      { label: "Projects", value: "PharmaDeux is the team's joint project. Shield is an independent project by Tarık Ziya Eren." },
      { label: "Stage", value: "Both are prototypes. Neither is connected to a hospital, and no clinical validation has been done yet." },
      { label: "Request", value: "The form sends a request. It is not a confirmed appointment, an agreement or a contract." },
      { label: "Do not send", value: "Patient data or real claim data." },
    ],
    location: {
      label: "Location",
      title: "The team works in Konya.",
      description:
        "The team members are students at Konya Technical University. The address below is the faculty where we study. LavieuxLabs is not an official unit or partner of the university. If you would like to meet, please book an appointment by email first.",
    },
  },
});

export default function ContactView({ locale }: { locale: Locale }) {
  const c = copy[locale];

  // Who we are, where the projects stand and what a request is not; beside the path choice on wide screens.
  const summary = (
    <aside aria-labelledby="contact-summary" className="border-t-2 border-ink pt-4">
      <h2 id="contact-summary" className="font-serif text-[20px] font-semibold text-ink">
        {c.summaryTitle}
      </h2>
      <dl className="mt-3 divide-y divide-rule border-t border-rule">
        {c.summary.map((r) => (
          <div key={r.label} className="grid grid-cols-[110px_minmax(0,1fr)] gap-3 py-2.5 lg:grid-cols-1 lg:gap-0.5">
            <dt className="text-[13px] text-ink-3">{r.label}</dt>
            <dd className="text-[14px] leading-snug text-ink">{r.value}</dd>
          </div>
        ))}
      </dl>
    </aside>
  );

  return (
    <main id="main" className="surface-paper relative flex-1 bg-paper text-ink">
      {/* Hero: what the page is for. The three ways in follow straight away. */}
      <section aria-labelledby="hero-title" className="pt-16">
        <div className="mx-auto max-w-7xl px-4 pt-6 pb-8 sm:px-6 sm:pt-12 sm:pb-12 lg:px-8">
          <nav aria-label={c.crumbs.aria}>
            <ol className="flex flex-wrap items-center gap-1 text-[14px] text-ink-3">
              <li>
                <Link href={localizedPath(locale, "/")} className={`-my-3 inline-block py-3 ${LINK}`}>
                  {c.crumbs.home}
                </Link>
              </li>
              <li aria-hidden="true">
                <ChevronRight className="h-3.5 w-3.5" strokeWidth={1.8} />
              </li>
              <li aria-current="page" className="text-ink-2">
                {c.crumbs.here}
              </li>
            </ol>
          </nav>
          <h1
            id="hero-title"
            className="mt-6 max-w-[22ch] font-serif text-[34px] leading-[1.08] font-medium tracking-[-0.022em] text-ink sm:mt-8 sm:text-[46px]"
          >
            {c.title}
          </h1>
          <p className="mt-4 max-w-[62ch] text-[17px] leading-[1.6] text-ink-2">{c.description}</p>
        </div>
      </section>

      <div className="pb-16 sm:pb-24">
        <Suspense fallback={<ContactExperience locale={locale} tone="paper" aside={summary} />}>
          <ContactExperienceFromParams locale={locale} tone="paper" aside={summary} />
        </Suspense>
      </div>

      <PilotProtocol locale={locale} tone="paper" />

      <PaperSection id="konum" label={c.location.label} title={c.location.title} intro={<p>{c.location.description}</p>}>
        <LocationMap locale={locale} tone="paper" />
      </PaperSection>
    </main>
  );
}
