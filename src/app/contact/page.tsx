import type { Metadata } from "next";
import { Suspense } from "react";
import { FileText, Handshake, Mail, MessagesSquare } from "lucide-react";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import ContactForm, { ContactFormFromParams } from "@/components/ContactForm";
import LocationMap from "@/components/LocationMap";
import SectionHeader from "@/components/SectionHeader";
import { CONTACT_EMAIL } from "@/lib/site";

export const metadata: Metadata = {
  title: "İletişim ve Niyet Mektubu (LOI)",
  description:
    "PharmaDeux CDSS, Shield veya akademik iş birlikleri için pilot, demo ve Niyet Mektubu (LOI) talebinizi iletin.",
};

const steps = [
  {
    icon: MessagesSquare,
    title: "Tanışma görüşmesi",
    body: "Kurumunuzun ihtiyacını, mevcut süreçlerinizi ve hedeflediğiniz çıktıları dinleriz.",
  },
  {
    icon: FileText,
    title: "Niyet Mektubu (LOI)",
    body: "Pilot kapsamı, veri erişim koşulları ve başarı ölçütleri bağlayıcı olmayan bir Niyet Mektubu (LOI) ile tanımlanır.",
  },
  {
    icon: Handshake,
    title: "Pilot ve doğrulama",
    body: "Etik kurul, veri işleme sözleşmesi ve teknik entegrasyon adımları birlikte planlanır.",
  },
];

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
        <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-[1fr_1.5fr] lg:px-8">
          <div className="space-y-10">
            <Reveal>
              <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-teal-300/80">Süreç nasıl işler?</p>
              <ol className="mt-6 space-y-6">
                {steps.map(({ icon: Icon, title, body }, i) => (
                  <li key={title} className="flex gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03]">
                      <Icon className="h-4 w-4 text-teal-300" strokeWidth={1.7} />
                    </div>
                    <div>
                      <p className="font-mono text-[10.5px] text-white/30">ADIM {String(i + 1).padStart(2, "0")}</p>
                      <h2 className="mt-0.5 text-[15px] font-medium text-white">{title}</h2>
                      <p className="mt-1 text-sm leading-relaxed text-white/55">{body}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </Reveal>

            <Reveal className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6">
              <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-white/40">Doğrudan iletişim</p>
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="mt-3 inline-flex items-center gap-2 font-mono text-sm text-white transition-colors hover:text-teal-200"
              >
                <Mail className="h-4 w-4 text-teal-300" />
                {CONTACT_EMAIL}
              </a>
              <p className="mt-4 text-xs leading-relaxed text-white/40">
                Lütfen iletişim kanallarımız üzerinden hasta verisi veya özel nitelikli kişisel veri paylaşmayınız.
              </p>
            </Reveal>
          </div>

          <Reveal delay={0.1}>
            <Suspense fallback={<ContactForm />}>
              <ContactFormFromParams />
            </Suspense>
          </Reveal>
        </div>
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
