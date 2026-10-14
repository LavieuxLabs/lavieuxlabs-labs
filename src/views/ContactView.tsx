import { Suspense } from "react";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import ContactExperience, { ContactExperienceFromParams } from "@/components/ContactExperience";
import LocationMap from "@/components/LocationMap";
import SectionHeader from "@/components/SectionHeader";
import PilotProtocol from "@/components/PilotProtocol";
import { defineContent, type Locale } from "@/i18n/config";
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

const copy = defineContent({
  tr: {
    crumbs: { home: "Ana sayfa", here: "İletişim" },
    eyebrow: "İletişim",
    title: "Üç yoldan biriyle başlayın.",
    description:
      "İlk adım genellikle 15 dakikalık bir tanışma görüşmesidir; bunun için bir taahhüt gerekmez. Akademik ortaklık ve pilot başvurusu ayrı yollardır.",
    location: {
      eyebrow: "Konum",
      title: "Ekip Konya'da çalışıyor.",
      description:
        "Ekip Konya Teknik Üniversitesi'nde öğrenci; aşağıdaki adres öğrenim gördüğümüz fakültedir. LavieuxLabs üniversitenin resmi bir birimi veya ortağı değildir. Görüşmek isterseniz önceden e-postayla randevu alın.",
    },
  },
  en: {
    crumbs: { home: "Home", here: "Contact" },
    eyebrow: "Contact",
    title: "Start in one of three ways.",
    description:
      "The first step is usually a 15-minute intro call, which needs no commitment. An academic partnership and a pilot application are separate paths.",
    location: {
      eyebrow: "Location",
      title: "The team works in Konya.",
      description:
        "The team members are students at Konya Technical University. The address below is the faculty where we study. LavieuxLabs is not an official unit or partner of the university. If you would like to meet, please book an appointment by email first.",
    },
  },
});

export default function ContactView({ locale }: { locale: Locale }) {
  const c = copy[locale];

  return (
    <main className="relative flex-1 overflow-x-clip">
      <PageHero
        locale={locale}
        breadcrumbs={[{ href: "/", label: c.crumbs.home }, { label: c.crumbs.here }]}
        eyebrow={c.eyebrow}
        title={c.title}
        description={c.description}
      />

      <section className="pb-24 sm:pb-32">
        <Reveal>
          <Suspense fallback={<ContactExperience locale={locale} />}>
            <ContactExperienceFromParams locale={locale} />
          </Suspense>
        </Reveal>
      </section>

      <PilotProtocol locale={locale} />

      <section id="konum" className="scroll-mt-20 pb-24 sm:pb-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader {...c.location} />
          <Reveal className="mt-12">
            <LocationMap locale={locale} />
          </Reveal>
        </div>
      </section>
    </main>
  );
}
