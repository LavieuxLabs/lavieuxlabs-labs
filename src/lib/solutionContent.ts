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
import type { SolutionValue } from "@/lib/site";

export type SolutionContent = {
  icon: LucideIcon;
  hint: string;
  placeholders: { organization: string; title: string; message: string };
  steps: { icon: LucideIcon; title: string; body: string }[];
  /** Literal Tailwind classes so they are picked up at build time. */
  accent: {
    text: string;
    selectedCard: string;
    focusRing: string;
    inputFocus: string;
    checkbox: string;
    buttonHover: string;
    topRule: string;
  };
};

// Copy and accents for the contact page, per solution chosen in the form.
export const solutionContent: Record<SolutionValue, SolutionContent> = {
  pharmadeux: {
    icon: Pill,
    hint: "Klinik karar destek · ilaç güvenliği",
    placeholders: {
      organization: "Örn. Üniversite Hastanesi / Eğitim ve Araştırma Hastanesi",
      title: "Örn. Klinik Farmakolog, Başhekim, Eczacılık Direktörü",
      message: "Pilot çalışma hedeflenen branşlar, HBYS entegrasyon ihtiyacı ve yatak kapasitesi...",
    },
    steps: [
      {
        icon: Stethoscope,
        title: "Klinik ihtiyaç analizi",
        body: "Hedef servisleri, mevcut ilaç güvenliği süreçlerinizi ve klinik eczacılık iş akışınızı birlikte haritalarız.",
      },
      {
        icon: FileText,
        title: "Retrospektif test protokolü (LOI)",
        body: "Anonimleştirilmiş geçmiş reçeteler üzerinde yürütülecek doğrulama protokolü ve başarı ölçütleri, bağlayıcı olmayan bir Niyet Mektubu (LOI) ile tanımlanır.",
      },
      {
        icon: Network,
        title: "HBYS entegrasyonu ve canlı doğrulama",
        body: "Etik kurul onaylı çalışma kapsamında HL7 FHIR R4 üzerinden HBYS entegrasyonu kurulur; sistem klinisyen denetiminde gerçek iş akışında doğrulanır.",
      },
    ],
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
    hint: "Gelir bütünlüğü · red riski",
    placeholders: {
      organization: "Örn. Sağlık Grubu / Hastane Döner Sermaye İşletmesi",
      title: "Örn. Gelir Döngüsü Müdürü (RCM), Provizyon & Fatura Sorumlusu",
      message: "Aylık fatura/provizyon işlem hacmi, SGK SUT veya özel sigorta red oranları...",
    },
    steps: [
      {
        icon: Receipt,
        title: "Gelir kaçağı ve red tespiti",
        body: "Red gerekçelerinizi, provizyon akışınızı ve en sık kayıp yaşanan noktaları birlikte analiz ederiz.",
      },
      {
        icon: FileSearch,
        title: "Geçmiş fatura örneklem analizi (LOI)",
        body: "Shield kural setleri anonimleştirilmiş bir geçmiş fatura örnekleminde çalıştırılır; kapsam ve ölçütler Niyet Mektubu (LOI) ile belirlenir.",
      },
      {
        icon: Workflow,
        title: "Gönderim öncesi canlı entegrasyon",
        body: "Shield, gönderim öncesi katman olarak faturalama akışınıza bağlanır; işaretlenen işlemler uzman kuyruğunda değerlendirilir.",
      },
    ],
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
    hint: "Araştırma ve doğrulama projeleri",
    placeholders: {
      organization: "Örn. Konya Teknik Üniversitesi / Tıp / Eczacılık Fakültesi",
      title: "Örn. Öğretim Üyesi, Doktora Araştırmacısı, Proje Yürütücüsü",
      message: "Ortak klinik validasyon, TÜBİTAK / uluslararası fon başvurusu veya Ar-Ge ortaklığı...",
    },
    steps: [
      {
        icon: Target,
        title: "Çalışma kapsamı ve hipotez",
        body: "Araştırma sorusunu, hedef popülasyonu ve birincil sonlanım noktalarını birlikte netleştiririz.",
      },
      {
        icon: ClipboardCheck,
        title: "Etik kurul ve veri protokolü (LOI)",
        body: "Etik kurul başvurusu, anonimleştirme ve veri işleme protokolü ile tarafların rolleri Niyet Mektubu (LOI) ile tanımlanır.",
      },
      {
        icon: BookOpen,
        title: "Ortak validasyon ve yayın",
        body: "Doğrulama çalışması birlikte yürütülür; bulgular hakemli yayın ve fon raporlama standartlarında raporlanır.",
      },
    ],
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
