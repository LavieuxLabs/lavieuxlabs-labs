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
    title: "İletişim ve Niyet Mektubu (LOI)",
    description:
      "PharmaDeux CDSS, Shield veya akademik iş birlikleri için pilot, demo ve Niyet Mektubu (LOI) talebinizi iletin.",
  },
  en: {
    title: "Contact and Letter of Intent (LOI)",
    description:
      "Send a pilot, demo or Letter of Intent (LOI) request for PharmaDeux CDSS, Shield or an academic collaboration.",
  },
});

const copy = defineContent({
  tr: {
    crumbs: { home: "Ana sayfa", here: "İletişim" },
    eyebrow: "İletişim",
    title: "Pilot, demo ya da iş birliği için yazın.",
    description:
      "Formu doldurun; hangi ürünle ilgilendiğinizi ve kurumunuzun ihtiyacını kısaca yazın. Size e-postayla dönüyoruz.",
    location: {
      eyebrow: "Konum",
      title: "Konya Teknik Üniversitesi yerleşkesindeyiz.",
      description: "Ziyaret etmek isterseniz önceden e-postayla randevu alın.",
    },
  },
  en: {
    crumbs: { home: "Home", here: "Contact" },
    eyebrow: "Contact",
    title: "Write to us about a pilot, a demo or a collaboration.",
    description:
      "Fill in the form with the product you are interested in and a short note on your institution's needs. We reply by email.",
    location: {
      eyebrow: "Location",
      title: "We are on the Konya Technical University campus.",
      description: "If you would like to visit, please book an appointment by email first.",
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
