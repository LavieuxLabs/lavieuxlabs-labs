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
        eyebrow="Bize ulaşın · Demo ve Niyet Mektubu (LOI)"
        title="Pilot, demo veya iş birliği için ilk adımı atın."
        description="Talebinizi aşağıdaki formla iletin. Kurumunuzun ihtiyacına uygun çözümü ve pilot çerçevesini birlikte belirleyelim."
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
            title="Akademik bir Ar-Ge ortamında çalışıyoruz."
            description="Ar-Ge faaliyetlerimizi üniversite yerleşkesinde, klinik ve mühendislik disiplinlerinin kesişiminde yürütüyoruz. Ziyaretler önceden randevu ile planlanır."
          />
          <Reveal className="mt-12">
            <LocationMap />
          </Reveal>
        </div>
      </section>
    </main>
  );
}
