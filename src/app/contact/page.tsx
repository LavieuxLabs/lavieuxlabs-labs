import type { Metadata } from "next";
import { Suspense } from "react";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import ContactExperience, { ContactExperienceFromParams } from "@/components/ContactExperience";
import LocationMap from "@/components/LocationMap";
import SectionHeader from "@/components/SectionHeader";

export const metadata: Metadata = {
  title: "İletişim ve Niyet Mektubu (LOI)",
  description:
    "PharmaDeux CDSS, Shield veya akademik iş birlikleri için pilot, demo ve Niyet Mektubu (LOI) talebinizi iletin.",
};

export default function ContactPage() {
  return (
    <main className="relative flex-1 overflow-x-clip">
      <PageHero
        breadcrumbs={[{ href: "/", label: "Ana sayfa" }, { label: "İletişim" }]}
        eyebrow="İletişim"
        title="Pilot, demo ya da iş birliği için yazın."
        description="Formu doldurun; hangi ürünle ilgilendiğinizi ve kurumunuzun ihtiyacını kısaca yazın. Size e-postayla dönüyoruz."
      />

      <section className="pb-24 sm:pb-32">
        <Reveal>
          <Suspense fallback={<ContactExperience />}>
            <ContactExperienceFromParams />
          </Suspense>
        </Reveal>
      </section>

      <section id="konum" className="scroll-mt-20 pb-24 sm:pb-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="Konum"
            title="Konya Teknik Üniversitesi yerleşkesindeyiz."
            description="Ziyaret etmek isterseniz önceden e-postayla randevu alın."
          />
          <Reveal className="mt-12">
            <LocationMap />
          </Reveal>
        </div>
      </section>
    </main>
  );
}
