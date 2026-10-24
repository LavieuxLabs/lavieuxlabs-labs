import Reveal from "@/components/Reveal";
import SectionHeader from "@/components/SectionHeader";
import PrintButton from "@/components/PrintButton";
import { CONTACT_EMAIL, PILOT_PROTOCOL_REVISION, SITE_URL, office, organizationProfile } from "@/lib/site";
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
      "Bu çerçeve bir plandır; hiçbir fazı henüz hiçbir kurumda uygulanmadı. Bağlayıcı olmayan bir Niyet Mektubu (LOI), pilotun kapsamı, süresi ve başarı ölçütleri için bu çerçeveyi esas alır. LOI bir sözleşme değildir; LavieuxLabs henüz şirketleşmedi.",
    groups: [
      {
        title: "Amaç ve kapsam",
        rows: [
          { term: "Amaç", detail: "Projenin kurumun kendi verisinde, bağımsız bir referansa karşı doğrulanması." },
          {
            term: "Faz A · Retrospektif",
            detail:
              "Anonimleştirilmiş geçmiş reçete veya fatura verisi, sistemi görmeyen uzman paneline karşı değerlendirilir.",
          },
          {
            term: "Faz B · Gölge mod",
            detail:
              "Planlanan, HBYS bağlantısı gerektirir. Sistem güncel veriyi değerlendirir ama hekime ya da uzmana hiçbir şey göstermez. Bulgular sonradan gerçek kararlarla karşılaştırılır.",
          },
          {
            term: "Faz C · Planlanan pilot çalışma",
            detail:
              "İsteğe bağlı, henüz başlamadı. Yalnızca etik kurul ve kurum onayı alınırsa sınırlı bir serviste uyarılar kullanıcıya gösterilir.",
          },
          { term: "Süre ve servisler", detail: "Kurumla birlikte belirlenir ve LOI'de yazılır." },
        ],
      },
      {
        title: "Güvenlik ve KVKK",
        rows: [
          {
            term: "Çalışma yeri",
            detail: "Kurum içi sunucu (on-prem). Bugün kod düzeyinde mevcut kurulum Docker konteynerdir; kuruma ayrılmış izole VPC planlanan bir seçenektir. Hedef, verinin kurum altyapısından çıkmamasıdır.",
          },
          {
            term: "Anonimleştirme",
            detail: "Kimlik bilgileri veri sisteme verilmeden önce anonimleştirilir; yöntemi protokolde yazılır.",
          },
          { term: "Erişim", detail: "Rol bazlı. LavieuxLabs ekibi kimliği belirlenebilir veriye erişmez." },
          {
            term: "Hukuki zemin",
            detail: "Etik kurul onayı ve KVKK md. 12 kapsamındaki tedbirler gerekir. Veri işleme koşulları ve imza tarafı, gerekli taraflar ve yetkili hukuk danışmanlarıyla netleştirilir.",
          },
          { term: "Kayıt", detail: "Hedef: her değerlendirme ve erişimin yalnızca eklenebilir kayda yazılması." },
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
    note: "Shield (Tarık Ziya Eren'in bağımsız projesi) için planlanan pilotlarda advers ilaç olayı yerine red oranı, ön kontrolde yakalanan red nedenleri ve uzman inceleme süresi ölçülür. Hiçbir fazda sistem, kullanıcının yerine karar vermez.",
  },
  en: {
    eyebrow: "Pilot protocol",
    title: "Pilot protocol and LOI framework.",
    description:
      "This framework is a plan; none of its phases has been carried out at any institution yet. A non-binding Letter of Intent (LOI) uses it for the pilot's scope, duration and success criteria. An LOI is not an agreement; LavieuxLabs is not incorporated yet.",
    groups: [
      {
        title: "Purpose and scope",
        rows: [
          {
            term: "Purpose",
            detail: "Validate the project on the institution's own data against an independent reference.",
          },
          {
            term: "Phase A · Retrospective",
            detail:
              "Anonymised past prescription or claim data is assessed against an expert panel that has not seen the system's output.",
          },
          {
            term: "Phase B · Shadow mode",
            detail:
              "Planned; needs an HIS connection. The system assesses current data but shows nothing to physicians or specialists. Its findings are compared with the actual decisions afterwards.",
          },
          {
            term: "Phase C · Proposed pilot study",
            detail:
              "Optional and not started. Only once ethics committee and institutional approval are in place are alerts shown to users on a limited ward.",
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
              "On the institution's own servers (on-prem). Today the deployment that exists in the code is a Docker container; an isolated VPC dedicated to the institution is a planned option. The aim is that data does not leave the institution's infrastructure.",
          },
          {
            term: "Anonymisation",
            detail: "Identifiers are anonymised before data is given to the system; the method is written into the protocol.",
          },
          { term: "Access", detail: "Role-based. The LavieuxLabs team has no access to identifiable data." },
          {
            term: "Legal basis",
            detail:
              "Ethics committee approval and the safeguards required by Article 12 of KVKK (Turkey's data protection law) are needed. The data processing terms and the signing party are settled with the parties involved and their authorised legal advisers.",
          },
          { term: "Logging", detail: "Aim: every assessment and every access written to an append-only log." },
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
            detail: "Performance report shared with the institution. It also feeds the MDR clinical evaluation file.",
          },
        ],
      },
    ],
    note: "Shield pilots measure the rejection rate, the rejection reasons caught at pre-check and specialist review time instead of adverse drug events. In no phase does the system make a decision in place of the user.",
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
    imprint: { organization: "Kuruluş", address: "Konum", contact: "İletişim", web: "Web" },
    organization: `LavieuxLabs · ${organizationProfile.tr.short}`,
    footer:
      "Bu belge bilgilendirme amaçlıdır ve bağlayıcı değildir. LavieuxLabs henüz şirketleşmedi ve bu belge herhangi bir kişiyi yetkili imzacı olarak göstermez. Shield için proje sahibi Tarık Ziya Eren'dir; PharmaDeux ekibin ortak projesidir. Her LOI, imzadan önce gerçek tarafları ve imza yetkisini ayrıca belirlemelidir.",
  },
  en: {
    button: "Print / save as PDF",
    fileName: "LavieuxLabs – Pilot protocol and LOI framework",
    document: "Pilot protocol and LOI framework",
    revision: "Revision",
    imprint: { organization: "Organisation", address: "Location", contact: "Contact", web: "Web" },
    organization: `LavieuxLabs · ${organizationProfile.en.short}`,
    footer:
      "This document is for information and is not binding. LavieuxLabs is not incorporated and this document does not name any person as an authorised signatory. Tarık Ziya Eren owns the Shield project; PharmaDeux is the team's joint project. Each LOI must separately identify the actual parties and signing authority before signature.",
  },
});

// Classes per surface. Paper: ink on paper, label in the left three columns, the three groups as plain columns
// under a 2px ink rule (no card frame). Dark: the datasheet panel on hairlines.
const tones = {
  dark: {
    section: "scroll-mt-24 pb-24 sm:pb-32",
    grid: "grid gap-px overflow-hidden rounded-2xl border border-hairline bg-hairline lg:grid-cols-3",
    group: "bg-navy-850 p-5 sm:p-6",
    groupTitle: "text-[11px] font-medium tracking-wider text-white/50 uppercase",
    rows: "divide-y divide-hairline",
    term: "text-[13px] font-medium text-white",
    detail: "text-[13px] leading-relaxed text-white/55",
    note: "max-w-3xl text-xs leading-relaxed text-white/55",
  },
  paper: {
    section: "scroll-mt-16 border-t border-rule",
    grid: "grid gap-x-10 gap-y-10 lg:grid-cols-3",
    group: "border-t-2 border-ink pt-4",
    groupTitle: "font-serif text-[20px] font-medium text-ink",
    rows: "divide-y divide-rule",
    term: "text-[15px] font-semibold text-ink",
    detail: "text-[15px] leading-[1.6] text-ink-2",
    note: "max-w-[64ch] text-[15px] leading-[1.6] text-ink-3",
  },
};

/** The pilot plan as a datasheet: three groups of term / detail rows. Prints as a one-page A4 sheet. */
export default function PilotProtocol({ locale, tone = "dark" }: { locale: Locale; tone?: "dark" | "paper" }) {
  const c = copy[locale];
  const s = sheet[locale];
  const t = tones[tone];
  const paper = tone === "paper";
  const place = office(locale);
  // Paper pages have no entrance motion.
  const Wrap = paper ? "div" : Reveal;
  const host = SITE_URL.replace(/^https?:\/\//, "");
  const printButton = (
    <PrintButton target="protocol" documentTitle={s.fileName} label={s.button} tone={tone} className="self-start lg:self-end" />
  );

  return (
    <section
      id="pilot-protokolu"
      data-print-sheet="protocol"
      aria-labelledby={paper ? "pilot-protokolu-title" : undefined}
      className={t.section}
    >
      <div className={`mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 ${paper ? "py-12 sm:py-20 lg:py-24" : ""}`}>
        {/* Letterhead: print only */}
        <header className="hidden print:block">
          <div className="flex items-baseline justify-between border-b-2 pb-2" data-print-rule>
            <p className="text-[15pt] font-semibold tracking-[-0.02em]">LavieuxLabs</p>
            <p className="text-[8.5pt]">
              {s.document} · {s.revision}{" "}
              <span className="font-mono tabular-nums">{PILOT_PROTOCOL_REVISION}</span>
            </p>
          </div>
          <dl className="mt-2 grid grid-cols-4 gap-3 border-b pb-2 text-[7.5pt] leading-snug">
            <div>
              <dt className="print-muted">{s.imprint.organization}</dt>
              <dd>{s.organization}</dd>
            </div>
            <div>
              <dt className="print-muted">{s.imprint.address}</dt>
              {/* City only: the faculty address on the contact page is where the team studies, not the venture's office. */}
              <dd>
                {place.city}, {place.country}
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

        {paper ? (
          <div className="grid gap-x-10 gap-y-3 lg:grid-cols-12 print:mt-5 print:block">
            <p className="font-serif text-[17px] text-ink-3 lg:col-span-3 lg:pt-2 print:hidden">{c.eyebrow}</p>
            <div className="lg:col-span-9">
              <h2
                id="pilot-protokolu-title"
                className="max-w-[26ch] font-serif text-[30px] leading-[1.1] font-medium tracking-[-0.015em] text-ink sm:text-[40px]"
              >
                {c.title}
              </h2>
              <p className="mt-4 max-w-[64ch] text-[17px] leading-[1.65] text-ink-2">{c.description}</p>
              <div className="mt-6 flex">{printButton}</div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between print:mt-5">
            <SectionHeader eyebrow={c.eyebrow} title={c.title} description={c.description} />
            {printButton}
          </div>
        )}
        <Wrap className={`${paper ? "mt-10 sm:mt-14" : "mt-12"} print:mt-5`}>
          <div data-print-rule className={`${t.grid} print:grid-cols-3 print:gap-0 print:rounded-none`}>
            {c.groups.map((group) => (
              <section
                key={group.title}
                aria-label={group.title}
                className={`${t.group} print:border-t-0 print:border-l print:p-3 print:first:border-l-0`}
              >
                <h3 className={`${t.groupTitle} print:text-[7.5pt]`}>{group.title}</h3>
                <dl className={`mt-3 ${t.rows} print:mt-1`}>
                  {group.rows.map((row) => (
                    <div key={row.term} className="py-3 print:py-1.5">
                      <dt className={`${t.term} print:text-[8.5pt]`}>{row.term}</dt>
                      <dd className={`print-muted mt-1 ${t.detail} print:mt-0.5 print:text-[8pt] print:leading-snug`}>
                        {row.detail}
                      </dd>
                    </div>
                  ))}
                </dl>
              </section>
            ))}
          </div>
        </Wrap>
        <p className={`${paper ? "mt-8" : "mt-4"} ${t.note} print:mt-3 print:max-w-none print:text-[8pt]`}>{c.note}</p>

        {/* Footer line: print only */}
        <p className="print-muted mt-4 hidden border-t pt-2 text-[7.5pt] leading-snug print:block">{s.footer}</p>
      </div>
    </section>
  );
}
