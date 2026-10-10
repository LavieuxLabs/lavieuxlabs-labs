import Reveal from "@/components/Reveal";
import SectionHeader from "@/components/SectionHeader";
import PrintButton from "@/components/PrintButton";
import { CONTACT_EMAIL, OFFICE_ADDRESS_LINE, SITE_LAST_MODIFIED, SITE_URL, office } from "@/lib/site";
import { defineContent, type Locale } from "@/i18n/config";

type Row = { term: string; detail: string };
type Group = { title: string; rows: Row[] };

// Pilot protocol & LOI framework for hospital management, as a datasheet. Phases are kept apart
// on purpose: in shadow mode nothing is shown to clinicians, so nothing is "prevented" there and
// clinician response time can only be measured in the optional live phase.
const copy = defineContent<{ eyebrow: string; title: string; description: string; groups: Group[]; note: string }>({
  tr: {
    eyebrow: "Pilot protokolü",
    title: "Pilot uygulama protokolü ve LOI çerçevesi.",
    description:
      "Hastane yönetimiyle imzaladığımız Niyet Mektubu (LOI) bu çerçeveyi esas alır. Ayrıntılar kurumla birlikte yazılır; bu sayfa bağlayıcı değildir.",
    groups: [
      {
        title: "Amaç ve kapsam",
        rows: [
          { term: "Amaç", detail: "Ürünün kurumun kendi verisinde, bağımsız bir referansa karşı doğrulanması." },
          {
            term: "Faz A · Retrospektif",
            detail:
              "Anonimleştirilmiş geçmiş reçete veya fatura verisi, sistemi görmeyen uzman paneline karşı değerlendirilir.",
          },
          {
            term: "Faz B · Gölge mod",
            detail:
              "Sistem canlı veriyi değerlendirir ama hekime ya da uzmana hiçbir şey göstermez. Bulgular sonradan gerçek kararlarla karşılaştırılır.",
          },
          {
            term: "Faz C · Canlı pilot",
            detail: "İsteğe bağlı. Etik kurul ve kurum onayıyla, sınırlı bir serviste uyarılar kullanıcıya gösterilir.",
          },
          { term: "Süre ve servisler", detail: "Kurumla birlikte belirlenir ve LOI'de yazılır." },
        ],
      },
      {
        title: "Güvenlik ve KVKK",
        rows: [
          {
            term: "Çalışma yeri",
            detail: "Kurum içi sunucu (on-prem) ya da kuruma ayrılmış izole VPC. Veri kurumun altyapısından çıkmaz.",
          },
          {
            term: "Anonimleştirme",
            detail: "Kimlik bilgileri, veri sisteme girerken gerçek zamanlı olarak anonimleştirilir.",
          },
          { term: "Erişim", detail: "Rol bazlı. LavieuxLabs ekibi kimliği belirlenebilir veriye erişmez." },
          {
            term: "Hukuki zemin",
            detail: "Etik kurul onayı, veri işleme sözleşmesi ve KVKK md. 12 kapsamındaki tedbirler.",
          },
          { term: "Kayıt", detail: "Her değerlendirme ve erişim yalnızca eklenebilir kayda yazılır." },
        ],
      },
      {
        title: "Ölçülen çıktılar",
        rows: [
          { term: "Doğruluk · Faz A", detail: "Duyarlılık, özgüllük ve pozitif prediktif değer." },
          {
            term: "Yakalanan olaylar · Faz A–B",
            detail: "Panelin tespit ettiği potansiyel advers ilaç olaylarından sistemin yakaladığı oran.",
          },
          { term: "Uyarı yükü · Faz B", detail: "100 reçete başına düşen uyarı sayısı." },
          {
            term: "Hekim yanıtı · Faz C",
            detail: "Uyarının gösterilmesinden karara kadar geçen süre ve gerekçeli geçme oranı.",
          },
          { term: "Rapor", detail: "Kurumla paylaşılan duyarlılık raporu; MDR klinik değerlendirme dosyasına girdi." },
        ],
      },
    ],
    note: "Shield pilotlarında advers ilaç olayı yerine red oranı, ön kontrolde yakalanan red nedenleri ve uzman inceleme süresi ölçülür. Hiçbir fazda sistem, kullanıcının yerine karar vermez.",
  },
  en: {
    eyebrow: "Pilot protocol",
    title: "Pilot protocol and LOI framework.",
    description:
      "The Letter of Intent (LOI) we sign with hospital management is based on this framework. The details are written together with the institution; this page is not binding.",
    groups: [
      {
        title: "Purpose and scope",
        rows: [
          {
            term: "Purpose",
            detail: "Validate the product on the institution's own data against an independent reference.",
          },
          {
            term: "Phase A · Retrospective",
            detail:
              "Anonymised past prescription or claim data is assessed against an expert panel that has not seen the system's output.",
          },
          {
            term: "Phase B · Shadow mode",
            detail:
              "The system assesses live data but shows nothing to physicians or specialists. Its findings are compared with the actual decisions afterwards.",
          },
          {
            term: "Phase C · Live pilot",
            detail:
              "Optional. With ethics committee and institutional approval, alerts are shown to users on a limited ward.",
          },
          { term: "Duration and wards", detail: "Agreed with the institution and written into the LOI." },
        ],
      },
      {
        title: "Security and KVKK",
        rows: [
          {
            term: "Deployment",
            detail:
              "On the institution's own servers (on-prem) or in an isolated VPC dedicated to it. Data does not leave the institution's infrastructure.",
          },
          {
            term: "Anonymisation",
            detail: "Identifiers are anonymised in real time as data enters the system.",
          },
          { term: "Access", detail: "Role-based. The LavieuxLabs team has no access to identifiable data." },
          {
            term: "Legal basis",
            detail:
              "Ethics committee approval, a data processing agreement and the safeguards required by Article 12 of KVKK (Turkey's data protection law).",
          },
          { term: "Logging", detail: "Every assessment and every access is written to an append-only log." },
        ],
      },
      {
        title: "Measured outcomes",
        rows: [
          { term: "Accuracy · Phase A", detail: "Sensitivity, specificity and positive predictive value." },
          {
            term: "Events detected · Phases A–B",
            detail: "Share of the potential adverse drug events identified by the panel that the system also detected.",
          },
          { term: "Alert burden · Phase B", detail: "Alerts per 100 prescriptions." },
          {
            term: "Physician response · Phase C",
            detail: "Time from alert to decision, and the rate of overrides with a documented reason.",
          },
          {
            term: "Report",
            detail: "Performance report shared with the institution; input to the MDR clinical evaluation file.",
          },
        ],
      },
    ],
    note: "In Shield pilots, the measures are the rejection rate, the rejection reasons caught at pre-check and specialist review time, not adverse drug events. In no phase does the system make a decision in place of the user.",
  },
});

// Print sheet (A4): letterhead with the imprint, the three columns, and a footer line. Shown only
// on paper / PDF; on screen the section looks as before plus a print button.
const sheet = defineContent({
  tr: {
    button: "Yazdır / PDF olarak kaydet",
    fileName: "LavieuxLabs – Pilot protokolü ve LOI çerçevesi",
    document: "Pilot protokolü ve LOI çerçevesi",
    revision: "Revizyon",
    imprint: { organization: "Kuruluş", address: "Adres", contact: "İletişim", web: "Web" },
    organization: "LavieuxLabs · Sağlık teknolojileri Ar-Ge",
    footer:
      "Bu belge bilgilendirme amaçlıdır ve bağlayıcı değildir. Pilotun kapsamı, süresi ve veri koşulları kurumla imzalanan Niyet Mektubu'nda (LOI) yazılır.",
  },
  en: {
    button: "Print / save as PDF",
    fileName: "LavieuxLabs – Pilot protocol and LOI framework",
    document: "Pilot protocol and LOI framework",
    revision: "Revision",
    imprint: { organization: "Organisation", address: "Address", contact: "Contact", web: "Web" },
    organization: "LavieuxLabs · Health technology R&D",
    footer:
      "This document is for information and is not binding. The pilot's scope, duration and data conditions are set out in the Letter of Intent (LOI) signed with the institution.",
  },
});

/** Datasheet panel: three columns on hairlines, numbers in mono. Prints as a one-page A4 sheet. */
export default function PilotProtocol({ locale }: { locale: Locale }) {
  const c = copy[locale];
  const s = sheet[locale];
  const place = office(locale);
  const host = SITE_URL.replace(/^https?:\/\//, "");

  return (
    <section id="pilot-protokolu" data-print-sheet="protocol" className="scroll-mt-24 pb-24 sm:pb-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Letterhead: print only */}
        <header className="hidden print:block">
          <div className="flex items-baseline justify-between border-b-2 pb-2" data-print-rule>
            <p className="text-[15pt] font-semibold tracking-[-0.02em]">LavieuxLabs</p>
            <p className="text-[8.5pt]">
              {s.document} · {s.revision}{" "}
              <span className="font-mono tabular-nums">{SITE_LAST_MODIFIED}</span>
            </p>
          </div>
          <dl className="mt-2 grid grid-cols-4 gap-3 border-b pb-2 text-[7.5pt] leading-snug">
            <div>
              <dt className="print-muted">{s.imprint.organization}</dt>
              <dd>{s.organization}</dd>
            </div>
            <div>
              <dt className="print-muted">{s.imprint.address}</dt>
              <dd>
                {place.institution}, {place.unit}, {OFFICE_ADDRESS_LINE}, {place.country}
              </dd>
            </div>
            <div>
              <dt className="print-muted">{s.imprint.contact}</dt>
              <dd className="font-mono">{CONTACT_EMAIL}</dd>
            </div>
            <div>
              <dt className="print-muted">{s.imprint.web}</dt>
              <dd className="font-mono">{host}</dd>
            </div>
          </dl>
        </header>

        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between print:mt-5">
          <SectionHeader eyebrow={c.eyebrow} title={c.title} description={c.description} />
          <PrintButton
            target="protocol"
            documentTitle={s.fileName}
            label={s.button}
            className="self-start lg:self-end"
          />
        </div>
        <Reveal className="mt-12 print:mt-5">
          <div
            data-print-rule
            className="grid gap-px overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.06] lg:grid-cols-3 print:grid-cols-3 print:gap-0 print:rounded-none"
          >
            {c.groups.map((group) => (
              <section
                key={group.title}
                aria-label={group.title}
                className="bg-navy-850 p-5 sm:p-6 print:border-l print:p-3 print:first:border-l-0"
              >
                <h3 className="text-[11px] font-medium tracking-wider text-white/50 uppercase print:text-[7.5pt]">
                  {group.title}
                </h3>
                <dl className="mt-3 divide-y divide-white/[0.06] print:mt-1">
                  {group.rows.map((row) => (
                    <div key={row.term} className="py-3 print:py-1.5">
                      <dt className="text-[13px] font-medium text-white print:text-[8.5pt]">{row.term}</dt>
                      <dd className="print-muted mt-1 text-[13px] leading-relaxed text-white/55 print:mt-0.5 print:text-[8pt] print:leading-snug">
                        {row.detail}
                      </dd>
                    </div>
                  ))}
                </dl>
              </section>
            ))}
          </div>
        </Reveal>
        <p className="mt-4 max-w-3xl text-xs leading-relaxed text-white/55 print:mt-3 print:max-w-none print:text-[8pt]">
          {c.note}
        </p>

        {/* Footer line: print only */}
        <p className="print-muted mt-4 hidden border-t pt-2 text-[7.5pt] leading-snug print:block">{s.footer}</p>
      </div>
    </section>
  );
}
