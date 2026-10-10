import {
  BookOpen,
  ClipboardCheck,
  FileSearch,
  FileText,
  GraduationCap,
  Network,
  Pill,
  Receipt,
  ShieldCheck,
  Stethoscope,
  Target,
  Workflow,
  type LucideIcon,
} from "lucide-react";
import { SOLUTION_VALUES, type SolutionValue } from "@/lib/site";
import { defineContent, type Locale } from "@/i18n/config";

type Accent = {
  text: string;
  selectedCard: string;
  focusRing: string;
  inputFocus: string;
  checkbox: string;
  buttonHover: string;
  topRule: string;
};

type SolutionCopy = {
  label: string;
  hint: string;
  placeholders: { organization: string; title: string; message: string };
  steps: { title: string; body: string }[];
};

export type SolutionContent = Omit<SolutionCopy, "steps"> & {
  icon: LucideIcon;
  steps: { icon: LucideIcon; title: string; body: string }[];
  /** Literal Tailwind classes so they are picked up at build time. */
  accent: Accent;
};

// Icons and accents are the same in every language.
const style: Record<SolutionValue, { icon: LucideIcon; stepIcons: LucideIcon[]; accent: Accent }> = {
  pharmadeux: {
    icon: Pill,
    stepIcons: [Stethoscope, FileText, Network],
    accent: {
      text: "text-pharma",
      selectedCard: "border-pharma/45 bg-pharma/[0.08]",
      focusRing: "has-[:focus-visible]:ring-pharma/40",
      inputFocus: "focus:border-pharma/60 focus:ring-pharma/20",
      checkbox: "accent-pharma",
      buttonHover: "hover:bg-teal-100",
      topRule: "from-pharma/70",
    },
  },
  shield: {
    icon: ShieldCheck,
    stepIcons: [Receipt, FileSearch, Workflow],
    accent: {
      text: "text-shield",
      selectedCard: "border-shield/45 bg-shield/[0.08]",
      focusRing: "has-[:focus-visible]:ring-shield/40",
      inputFocus: "focus:border-shield/60 focus:ring-shield/20",
      checkbox: "accent-shield",
      buttonHover: "hover:bg-indigo-100",
      topRule: "from-shield/70",
    },
  },
  academic: {
    icon: GraduationCap,
    stepIcons: [Target, ClipboardCheck, BookOpen],
    accent: {
      text: "text-academic",
      selectedCard: "border-academic/45 bg-academic/[0.08]",
      focusRing: "has-[:focus-visible]:ring-academic/40",
      inputFocus: "focus:border-academic/60 focus:ring-academic/20",
      checkbox: "accent-academic",
      buttonHover: "hover:bg-academic-soft",
      topRule: "from-academic/70",
    },
  },
};

// Copy for the contact page, per solution chosen in the form.
const copy = defineContent<Record<SolutionValue, SolutionCopy>>({
  tr: {
    pharmadeux: {
      label: "PharmaDeux CDSS",
      hint: "Klinik karar destek · ilaç güvenliği",
      placeholders: {
        organization: "Örn. Üniversite Hastanesi / Eğitim ve Araştırma Hastanesi",
        title: "Örn. Klinik Farmakolog, Başhekim, Eczacılık Direktörü",
        message: "Pilot çalışma hedeflenen branşlar, HBYS entegrasyon ihtiyacı ve yatak kapasitesi...",
      },
      steps: [
        {
          title: "Klinik ihtiyaç analizi",
          body: "Hedef servisleri, mevcut ilaç güvenliği süreçlerinizi ve klinik eczacılık iş akışınızı birlikte haritalarız.",
        },
        {
          title: "Retrospektif test protokolü (LOI)",
          body: "Anonimleştirilmiş geçmiş reçeteler üzerinde yürütülecek doğrulama protokolü ve başarı ölçütleri, bağlayıcı olmayan bir Niyet Mektubu (LOI) ile tanımlanır.",
        },
        {
          title: "HBYS entegrasyonu ve canlı doğrulama",
          body: "Etik kurul onaylı çalışma kapsamında HL7 FHIR R4 üzerinden HBYS entegrasyonu kurulur; sistem klinisyen denetiminde gerçek iş akışında doğrulanır.",
        },
      ],
    },
    shield: {
      label: "Shield",
      hint: "Gelir bütünlüğü · red riski",
      placeholders: {
        organization: "Örn. Sağlık Grubu / Hastane Döner Sermaye İşletmesi",
        title: "Örn. Gelir Döngüsü Müdürü (RCM), Provizyon & Fatura Sorumlusu",
        message: "Aylık fatura/provizyon işlem hacmi, SGK SUT veya özel sigorta red oranları...",
      },
      steps: [
        {
          title: "Gelir kaçağı ve red tespiti",
          body: "Red gerekçelerinizi, provizyon akışınızı ve en sık kayıp yaşanan noktaları birlikte analiz ederiz.",
        },
        {
          title: "Geçmiş fatura örneklem analizi (LOI)",
          body: "Shield kural setleri anonimleştirilmiş bir geçmiş fatura örnekleminde çalıştırılır; kapsam ve ölçütler Niyet Mektubu (LOI) ile belirlenir.",
        },
        {
          title: "Gönderim öncesi canlı entegrasyon",
          body: "Shield, gönderim öncesi katman olarak faturalama akışınıza bağlanır; işaretlenen işlemler uzman kuyruğunda değerlendirilir.",
        },
      ],
    },
    academic: {
      label: "Akademik İş Birliği",
      hint: "Araştırma ve doğrulama projeleri",
      placeholders: {
        organization: "Örn. Konya Teknik Üniversitesi / Tıp / Eczacılık Fakültesi",
        title: "Örn. Öğretim Üyesi, Doktora Araştırmacısı, Proje Yürütücüsü",
        message: "Ortak klinik validasyon, TÜBİTAK / uluslararası fon başvurusu veya Ar-Ge ortaklığı...",
      },
      steps: [
        {
          title: "Çalışma kapsamı ve hipotez",
          body: "Araştırma sorusunu, hedef popülasyonu ve birincil sonlanım noktalarını birlikte netleştiririz.",
        },
        {
          title: "Etik kurul ve veri protokolü (LOI)",
          body: "Etik kurul başvurusu, anonimleştirme ve veri işleme protokolü ile tarafların rolleri Niyet Mektubu (LOI) ile tanımlanır.",
        },
        {
          title: "Ortak validasyon ve yayın",
          body: "Doğrulama çalışması birlikte yürütülür; bulgular hakemli yayın ve fon raporlama standartlarında raporlanır.",
        },
      ],
    },
  },
  en: {
    pharmadeux: {
      label: "PharmaDeux CDSS",
      hint: "Clinical decision support · medication safety",
      placeholders: {
        organization: "e.g. University Hospital / Training and Research Hospital",
        title: "e.g. Clinical Pharmacologist, Chief Medical Officer, Director of Pharmacy",
        message: "Target specialties for the pilot, hospital information system integration needs, bed capacity...",
      },
      steps: [
        {
          title: "Clinical needs review",
          body: "Together we map the target wards, your current medication safety processes and your clinical pharmacy workflow.",
        },
        {
          title: "Retrospective test protocol (LOI)",
          body: "The validation protocol on anonymised past prescriptions, and its success criteria, are set out in a non-binding Letter of Intent (LOI).",
        },
        {
          title: "Integration and live validation",
          body: "Under an ethics-approved study, the system is connected to your hospital information system over HL7 FHIR R4 and validated in the real workflow under clinician supervision.",
        },
      ],
    },
    shield: {
      label: "Shield",
      hint: "Revenue integrity · rejection risk",
      placeholders: {
        organization: "e.g. Healthcare Group / Hospital Revenue Office",
        title: "e.g. Revenue Cycle Manager, Claims and Billing Lead",
        message: "Monthly claim volume, rejection rates from SGK (SUT) or private insurers...",
      },
      steps: [
        {
          title: "Revenue leakage and rejection review",
          body: "Together we analyse your rejection reasons, your pre-authorisation flow and where revenue is most often lost.",
        },
        {
          title: "Historical claim sample (LOI)",
          body: "Shield's rule sets are run on an anonymised sample of past claims; scope and criteria are set out in a Letter of Intent (LOI).",
        },
        {
          title: "Live pre-submission integration",
          body: "Shield connects to your billing flow as a pre-submission layer; flagged claims are reviewed in the specialist queue.",
        },
      ],
    },
    academic: {
      label: "Academic collaboration",
      hint: "Research and validation projects",
      placeholders: {
        organization: "e.g. Konya Technical University / Faculty of Medicine / Faculty of Pharmacy",
        title: "e.g. Faculty Member, PhD Researcher, Principal Investigator",
        message: "Joint clinical validation, a TÜBİTAK or international funding application, or an R&D partnership...",
      },
      steps: [
        {
          title: "Study scope and hypothesis",
          body: "Together we define the research question, the target population and the primary endpoints.",
        },
        {
          title: "Ethics committee and data protocol (LOI)",
          body: "The ethics application, anonymisation and data-processing protocol, and each party's role are set out in a Letter of Intent (LOI).",
        },
        {
          title: "Joint validation and publication",
          body: "The validation study is run together; findings are reported to peer-review and funder reporting standards.",
        },
      ],
    },
  },
});

function build(locale: Locale): Record<SolutionValue, SolutionContent> {
  const entries = SOLUTION_VALUES.map((value): [SolutionValue, SolutionContent] => {
    const { icon, stepIcons, accent } = style[value];
    const text = copy[locale][value];
    return [
      value,
      { ...text, icon, accent, steps: text.steps.map((step, i) => ({ ...step, icon: stepIcons[i] })) },
    ];
  });
  return Object.fromEntries(entries) as Record<SolutionValue, SolutionContent>;
}

export const solutionContent: Record<Locale, Record<SolutionValue, SolutionContent>> = {
  tr: build("tr"),
  en: build("en"),
};
