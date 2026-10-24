import { defineContent } from "@/i18n/config";

// The core team: one source for names, roles, contributions and profile links. The home page, the About
// page and the JSON-LD read from here. Every member works on PharmaDeux; Shield is Tarık Ziya Eren's own
// project and is not attributed to anyone else. No photos, titles or years of experience are listed.
// Links are stored percent-encoded and without tracking parameters; a link left null is not rendered.

type MemberId = "tarik-ziya-eren" | "semih-coban" | "mert-ali-ay" | "samed-demirci" | "yusuf-kaya";
type Member = { id: MemberId; name: string; linkedin: string | null; github: string | null };

export const TEAM: readonly Member[] = [
  {
    id: "tarik-ziya-eren",
    name: "Tarık Ziya Eren",
    linkedin: "https://www.linkedin.com/in/tarik-ziya-eren-65abb13a6/",
    github: "https://github.com/TarikZiyaEren",
  },
  {
    id: "semih-coban",
    name: "Semih Çoban",
    linkedin: "https://www.linkedin.com/in/semih-%C3%A7oban-89211a364",
    github: "https://github.com/semihcowboy",
  },
  {
    id: "mert-ali-ay",
    name: "Mert Ali Ay",
    linkedin: "https://www.linkedin.com/in/mert-ali-ay-ab0ba43b2/",
    github: "https://github.com/mertaliiiavvv5467",
  },
  {
    id: "samed-demirci",
    name: "Samed Demirci",
    linkedin: "https://www.linkedin.com/in/samed-demirci",
    github: "https://github.com/sam-ed-dmc",
  },
  {
    id: "yusuf-kaya",
    name: "Yusuf Kaya",
    linkedin: "https://www.linkedin.com/in/yusuf-kaya-366739385",
    github: "https://github.com/ysfky1724",
  },
];

/** The project lead; listed first wherever the team is shown, and Shield's creator in the JSON-LD. */
export const TEAM_LEAD = TEAM[0];

// Role and contribution per member, keyed by id. Sentence case, as everywhere else on the site. Roles follow
// the responsibilities the team has agreed, which can differ from who touched which file in the git history:
// Tarık owns the system architecture, API and orchestration (calling the clinical engines and combining their
// results); Semih owns the clinical data and drug knowledge layer and also contributes to the analysis modules.
export const teamCopy = defineContent<Record<MemberId, { role: string; summary: string }>>({
  tr: {
    "tarik-ziya-eren": {
      role: "Proje lideri, sistem mimarisi ve API",
      summary:
        "PharmaDeux'un proje koordinasyonu, sistem mimarisi, API katmanı ve analiz süreçlerinin orkestrasyonundan sorumludur. Klinik karar motorlarının sistemle bütünleşmesi, güvenlik ve teknik mimari çalışmalarını yürütür.",
    },
    "semih-coban": {
      role: "Klinik veri ve ilaç bilgi katmanı",
      summary:
        "PharmaDeux'un klinik veri ve ilaç bilgi katmanı üzerinde çalışır. İlaç verilerinin yapılandırılması, klinik kuralların veri temeli ve bu katmanın dokümantasyonuyla ilgilenir. Klinik analiz modüllerinin geliştirilmesine de katkı sağlar.",
    },
    "mert-ali-ay": {
      role: "Frontend ve klinik arayüz",
      summary:
        "PharmaDeux'un klinik çalışma alanı, reçete arayüzü ve analiz panosunun geliştirilmesine katkı sağlar. Kullanıcı deneyimi, arayüz bileşenleri ve klinik sonuçların kullanıcıya sunulması üzerinde çalışır.",
    },
    "samed-demirci": {
      role: "Veri hattı ve entegrasyon",
      summary:
        "PharmaDeux'un veri işleme süreçleri, veri hattı ve ilgili entegrasyonlarına katkı sağlar. Klinik veri akışları ve analiz sistemleri arasındaki bağlantıların geliştirilmesinde çalışmıştır.",
    },
    "yusuf-kaya": {
      role: "Kalite güvencesi ve test otomasyonu",
      summary:
        "PharmaDeux'un yazılım testleri, API sözleşme kontrolleri, regresyon testleri ve otomatik kalite doğrulama süreçlerine katkı sağlar.",
    },
  },
  en: {
    "tarik-ziya-eren": {
      role: "Project lead, system architecture and API",
      summary:
        "Responsible for PharmaDeux project coordination, system architecture, the API layer and the orchestration of the analysis process. Leads the integration of the clinical decision engines into the system, as well as security and technical architecture work.",
    },
    "semih-coban": {
      role: "Clinical data and drug knowledge layer",
      summary:
        "Works on the PharmaDeux clinical data and drug knowledge layer. Handles how drug data is structured, the data foundation of the clinical rules and the documentation of this layer. Also contributes to building the clinical analysis modules.",
    },
    "mert-ali-ay": {
      role: "Frontend and clinical interface",
      summary:
        "Contributes to building the PharmaDeux clinical workspace, prescription interface and analysis dashboard. Works on user experience, interface components and how clinical results are presented to the user.",
    },
    "samed-demirci": {
      role: "Data pipeline and integration",
      summary:
        "Contributes to PharmaDeux data processing, the data pipeline and related integrations. Has worked on building the connections between clinical data flows and the analysis systems.",
    },
    "yusuf-kaya": {
      role: "Quality assurance and test automation",
      summary:
        "Contributes to PharmaDeux software testing, API contract checks, regression tests and automated quality checks.",
    },
  },
});
