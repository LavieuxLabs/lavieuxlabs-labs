import {
  BookOpen,
  CalendarClock,
  ClipboardCheck,
  FileSearch,
  FileSignature,
  FileText,
  GraduationCap,
  MessageSquare,
  Network,
  Pill,
  Receipt,
  ShieldCheck,
  Stethoscope,
  Target,
  Video,
  Workflow,
  type LucideIcon,
} from "lucide-react";
import { CONTACT_PATHS, PRODUCT_VALUES, type ContactPath, type ProductValue } from "@/lib/site";
import { defineContent, type Locale } from "@/i18n/config";

/** Literal Tailwind classes so they are picked up at build time. */
export type Accent = {
  text: string;
  selectedCard: string;
  focusRing: string;
  inputFocus: string;
  topRule: string;
};

type Step = { title: string; body: string };
type Placeholders = { organization: string; message: string };

// The contact page is shared chrome, so it stays neutral; a product accent appears only once a
// product is chosen (selected product card, input focus, the form's top rule).
const neutral: Accent = {
  text: "text-titanium",
  selectedCard: "border-white/25 bg-navy-800",
  focusRing: "has-[:focus-visible]:ring-white/30",
  inputFocus: "focus:border-white/50 focus:ring-white/25",
  topRule: "from-white/30",
};

export const productStyle: Record<ProductValue, { icon: LucideIcon; accent: Accent }> = {
  pharmadeux: {
    icon: Pill,
    accent: {
      text: "text-pharma",
      selectedCard: "border-pharma/35 bg-navy-800",
      focusRing: "has-[:focus-visible]:ring-pharma/40",
      inputFocus: "focus:border-pharma/70 focus:ring-pharma/35",
      topRule: "from-pharma/70",
    },
  },
  shield: {
    icon: ShieldCheck,
    accent: {
      text: "text-shield",
      selectedCard: "border-shield/35 bg-navy-800",
      focusRing: "has-[:focus-visible]:ring-shield/40",
      inputFocus: "focus:border-shield/70 focus:ring-shield/35",
      topRule: "from-shield/70",
    },
  },
};

export const pathIcons: Record<ContactPath, LucideIcon> = {
  intro: CalendarClock,
  academic: GraduationCap,
  pilot: FileSignature,
};

const stepIcons: Record<ContactPath, Record<ProductValue, LucideIcon[]>> = {
  intro: {
    pharmadeux: [MessageSquare, Video, ClipboardCheck],
    shield: [MessageSquare, Video, ClipboardCheck],
  },
  academic: {
    pharmadeux: [Target, ClipboardCheck, BookOpen],
    shield: [Target, ClipboardCheck, BookOpen],
  },
  pilot: {
    pharmadeux: [Stethoscope, FileText, Network],
    shield: [Receipt, FileSearch, Workflow],
  },
};

type PathCopy = {
  label: string;
  hint: string;
  /** Spec rows on the path card: who it is for and what it commits the visitor to. */
  rows: { label: string; value: string }[];
  submit: string;
};

type ContactCopy = {
  paths: Record<ContactPath, PathCopy>;
  products: Record<ProductValue, { label: string; hint: string }>;
  /** Process steps per path; academic steps do not depend on the product. */
  steps: { intro: Record<ProductValue, Step[]>; academic: Step[]; pilot: Record<ProductValue, Step[]> };
  placeholders: { intro: Record<ProductValue, Placeholders>; academic: Placeholders; pilot: Record<ProductValue, Placeholders> };
  /** Success screen, per path. The pilot steps are the three-step pilot process. */
  nextSteps: Record<ContactPath, Step[]>;
};

const copy = defineContent<ContactCopy>({
  tr: {
    paths: {
      intro: {
        label: "15 dk tanışma görüşmesi",
        hint: "İhtiyacınızı dinleyip projenin size uyup uymadığını konuşuruz. Görüşme zamanını e-postayla birlikte belirleriz.",
        rows: [
          { label: "Kim için", value: "Hekim, eczacı, yönetici, gelir ekibi" },
          { label: "Taahhüt", value: "Yok · mesaj isteğe bağlı" },
        ],
        submit: "Görüşme talep et",
      },
      academic: {
        label: "Akademik ve klinik ortaklık",
        hint: "Klinik doğrulama ve farmakoloji kuralları üzerinde önerilen bilimsel iş birliği. Henüz yürütülen bir ortak çalışma yok.",
        rows: [
          { label: "Kim için", value: "Hekim, farmakolog, tıp fakültesi araştırmacısı" },
          { label: "Hedef çıktı", value: "Ortak protokol · hakemli yayın" },
        ],
        submit: "İş birliği talebi gönder",
      },
      pilot: {
        label: "Pilot ve retrospektif doğrulama",
        hint: "Kurumunuzun geçmiş verileriyle bir doğrulama çalışmasını konuşmak için. Bağlayıcı olmayan bir Niyet Mektubuyla başlar; bir sözleşme değildir.",
        rows: [
          { label: "Kim için", value: "Hastane karar vericileri" },
          { label: "Belge", value: "Bağlayıcı olmayan Niyet Mektubu (LOI)" },
        ],
        submit: "Pilot talebi gönder",
      },
    },
    products: {
      pharmadeux: { label: "PharmaDeux CDSS", hint: "İlaç güvenliği · hekim ve eczacı" },
      shield: { label: "Shield", hint: "Hastane faturalaması · gelir döngüsü ekipleri" },
    },
    steps: {
      intro: {
        pharmadeux: [
          { title: "Kısa form", body: "Kurumunuzu ve rolünüzü yazın. Mesaj isteğe bağlıdır." },
          { title: "15 dakikalık görüşme", body: "Reçete ve ilaç güvenliği akışınızı dinler, PharmaDeux'u örnek bir vaka üzerinde gösteririz." },
          { title: "Uygunluk notu", body: "Projenin kurumunuza uyup uymadığını açıkça söyleriz. Sonraki adım için taahhüt istenmez." },
        ],
        shield: [
          { title: "Kısa form", body: "Kurumunuzu ve rolünüzü yazın. Mesaj isteğe bağlıdır." },
          { title: "15 dakikalık görüşme", body: "Red ve kesinti nedenlerinizi dinler, Shield'ı örnek bir fatura üzerinde gösteririz." },
          { title: "Uygunluk notu", body: "Projenin kurumunuza uyup uymadığını açıkça söyleriz. Sonraki adım için taahhüt istenmez." },
        ],
      },
      academic: [
        { title: "Çalışma kapsamı ve hipotez", body: "Araştırma sorusunu, hedef popülasyonu ve birincil sonlanım noktalarını birlikte netleştiririz." },
        { title: "Etik kurul ve veri protokolü", body: "Etik kurul başvurusu, anonimleştirme ve veri işleme protokolü ile tarafların rolleri yazılır." },
        { title: "Ortak doğrulama ve yayın", body: "Önerilen yol: doğrulama çalışmasının birlikte yürütülmesi ve bulguların hakemli yayın standartlarında raporlanması." },
      ],
      pilot: {
        pharmadeux: [
          { title: "Klinik ihtiyaç analizi", body: "Hedef servisleri, mevcut ilaç güvenliği süreçlerinizi ve klinik eczacılık iş akışınızı birlikte haritalarız." },
          { title: "Retrospektif test protokolü (LOI)", body: "Anonimleştirilmiş geçmiş reçeteler üzerinde yürütülecek doğrulama protokolü ve ölçütleri, bağlayıcı olmayan bir Niyet Mektubu (LOI) ile tanımlanır. Çalışma etik kurul onayından önce başlamaz." },
          { title: "Sonraki aşama: HBYS bağlantısı (planlanan)", body: "PharmaDeux bugün hiçbir HBYS'ye bağlı değil; FHIR R4 Bundle içe ve dışa aktarımı yalnızca kod düzeyinde var. Kurumdaki bağlantı ve hekime uyarı göstermeyen gölge mod, retrospektif sonuçlardan ve etik kurul onayından sonra ayrıca planlanır." },
        ],
        shield: [
          { title: "Red nedenlerinin analizi", body: "Red ve kesinti gerekçelerinizi, provizyon akışınızı ve en sık kayıp yaşanan noktaları birlikte inceleriz." },
          { title: "Retrospektif fatura testi (LOI)", body: "Plana göre Shield anonimleştirilmiş geçmiş faturalarda çalıştırılır ve red yakalama ile yanlış pozitif oranları ölçülür. Bu çalışma henüz hiçbir kurumda yapılmadı. Kapsam bağlayıcı olmayan bir LOI ile yazılır." },
          { title: "Sonraki aşama (henüz yok)", body: "Faturalama akışına bağlantı bugün sunulan bir hizmet değildir. Retrospektif sonuçlara göre, ilgili taraflarla ayrıca değerlendirilir." },
        ],
      },
    },
    placeholders: {
      intro: {
        pharmadeux: {
          organization: "Örn. Eğitim ve Araştırma Hastanesi",
          message: "Örn. Dahiliye servisinde çoklu ilaç kullanan hastalarda nasıl çalıştığını görmek istiyoruz.",
        },
        shield: {
          organization: "Örn. Hastane / sağlık grubu",
          message: "Örn. SGK kesintilerinin en çok hangi kalemlerden geldiğini görmek istiyoruz.",
        },
      },
      academic: {
        organization: "Örn. Tıp Fakültesi Farmakoloji AD · bağımsız çalışıyorsanız boş bırakın",
        message: "Araştırma sorusu, ortak doğrulama fikri veya fon başvurusu...",
      },
      pilot: {
        pharmadeux: {
          organization: "Örn. Üniversite Hastanesi / Eğitim ve Araştırma Hastanesi",
          message: "Hedef servisler, HBYS altyapısı, yatak kapasitesi...",
        },
        shield: {
          organization: "Örn. Sağlık Grubu / Hastane Döner Sermaye İşletmesi",
          message: "Aylık fatura hacmi, en sık red nedenleri, test için ayrılabilecek dönem...",
        },
      },
    },
    nextSteps: {
      intro: [
        { title: "Görüşme zamanı", body: "Talebinizi aldıktan sonra uygun bir görüşme zamanını e-postayla birlikte belirleriz." },
        { title: "15 dakikalık görüşme", body: "İhtiyacınızı dinliyor, ilgili prototipi kısa bir demoyla gösteriyoruz." },
        { title: "Kısa not", body: "Görüşmeden sonra projenin uygunluğu ve olası sonraki adım hakkında kısa bir not paylaşıyoruz." },
      ],
      academic: [
        { title: "Ön görüşme", body: "Araştırma sorusunu, tarafların rollerini ve veri ihtiyacını konuşuyoruz." },
        { title: "Etik kurul ve veri protokolü", body: "Etik kurul başvurusu ve veri işleme protokolünün birlikte hazırlanması önerilir." },
        { title: "Ortak çalışma planı", body: "Yöntem, sonlanım noktaları ve yayın planı yazılı hâle getirilir." },
      ],
      pilot: [
        { title: "Teknik keşif ve ön görüşme", body: "HBYS mimariniz, veri akışı ve FHIR R4 / HL7 v2 arayüzleri bilgi işlem ekibinizle incelenir." },
        { title: "Güvenlik ve izolasyon protokolü", body: "Kurulum biçimi ve KVKK md. 12 tedbirleri konuşulur. Bugün kod düzeyinde mevcut kurulum Docker konteynerdir; izole VPC ve internetsiz ağ planlanan seçeneklerdir. Veri işleme koşulları ve imza tarafı, gerekli taraflar ve yetkili hukuk danışmanlarıyla netleştirilir." },
        { title: "Pilot entegrasyon ve doğrulama", body: "Kapsam uygun görülürse sistem bir test ortamında çalıştırılır ve bağımsız bir referansa karşı ölçülür. Henüz hiçbir kurumda yapılmadı. Süre ve servisler kurumla birlikte belirlenir ve LOI'de yazılır." },
      ],
    },
  },
  en: {
    paths: {
      intro: {
        label: "15-minute intro call",
        hint: "We listen to what you need and talk about whether the project fits. We agree on a time for the call by email.",
        rows: [
          { label: "For", value: "Physicians, pharmacists, managers, revenue teams" },
          { label: "Commitment", value: "None · message optional" },
        ],
        submit: "Request a call",
      },
      academic: {
        label: "Academic and clinical partnership",
        hint: "A proposed scientific collaboration on clinical validation and pharmacology rules. No joint study is under way yet.",
        rows: [
          { label: "For", value: "Physicians, pharmacologists, medical faculty researchers" },
          { label: "Intended output", value: "Joint protocol · peer-reviewed publication" },
        ],
        submit: "Send a collaboration request",
      },
      pilot: {
        label: "Pilot and retrospective validation",
        hint: "To discuss a validation study on your institution's historical data. It starts with a non-binding Letter of Intent; that is not an agreement.",
        rows: [
          { label: "For", value: "Hospital decision makers" },
          { label: "Document", value: "Non-binding Letter of Intent (LOI)" },
        ],
        submit: "Send a pilot request",
      },
    },
    products: {
      pharmadeux: { label: "PharmaDeux CDSS", hint: "Medication safety · physicians and pharmacists" },
      shield: { label: "Shield", hint: "Hospital billing · revenue cycle teams" },
    },
    steps: {
      intro: {
        pharmadeux: [
          { title: "Short form", body: "Tell us your institution and role. The message is optional." },
          { title: "15-minute call", body: "We listen to your prescribing and medication safety workflow and show PharmaDeux on an example case." },
          { title: "Fit note", body: "We tell you plainly whether the project fits your institution. There is no commitment to a next step." },
        ],
        shield: [
          { title: "Short form", body: "Tell us your institution and role. The message is optional." },
          { title: "15-minute call", body: "We listen to your rejection and deduction reasons and show Shield on an example claim." },
          { title: "Fit note", body: "We tell you plainly whether the project fits your institution. There is no commitment to a next step." },
        ],
      },
      academic: [
        { title: "Study scope and hypothesis", body: "Together we define the research question, the target population and the primary endpoints." },
        { title: "Ethics committee and data protocol", body: "We write down each party's role, the ethics application and the anonymisation and data processing protocol." },
        { title: "Joint validation and publication", body: "Proposed: running the validation study together and reporting the findings to peer-review standards." },
      ],
      pilot: {
        pharmadeux: [
          { title: "Clinical needs review", body: "Together we map the target wards, your current medication safety processes and your clinical pharmacy workflow." },
          { title: "Retrospective test protocol (LOI)", body: "The validation protocol for anonymised past prescriptions and its criteria are set out in a non-binding Letter of Intent (LOI). The study does not start before ethics committee approval." },
          { title: "Later stage: HIS connection (planned)", body: "PharmaDeux is not connected to any HIS today; FHIR R4 Bundle import and export exist only in the code. A connection at the institution, and a shadow mode that shows clinicians no alerts, are planned separately after retrospective results and ethics approval." },
        ],
        shield: [
          { title: "Rejection reason review", body: "Together we review your rejection and deduction reasons, your pre-authorisation flow and where revenue is most often lost." },
          { title: "Retrospective claims test (LOI)", body: "Under the plan, Shield runs on anonymised past claims and rejection catch and false positive rates are measured. This has not been done at any institution yet. The scope is set out in a non-binding LOI." },
          { title: "Later stage (not available yet)", body: "A connection to your billing flow is not a service offered today. Depending on the retrospective results, it is assessed separately with the parties involved." },
        ],
      },
    },
    placeholders: {
      intro: {
        pharmadeux: {
          organization: "e.g. Training and Research Hospital",
          message: "e.g. We would like to see how it works for internal medicine patients on several drugs.",
        },
        shield: {
          organization: "e.g. Hospital / healthcare group",
          message: "e.g. We would like to see which line items most of our SGK deductions come from.",
        },
      },
      academic: {
        organization: "e.g. Department of Pharmacology · leave empty if you work independently",
        message: "Research question, a joint validation idea or a funding application...",
      },
      pilot: {
        pharmadeux: {
          organization: "e.g. University Hospital / Training and Research Hospital",
          message: "Target wards, hospital information system, bed capacity...",
        },
        shield: {
          organization: "e.g. Healthcare Group / Hospital Revenue Office",
          message: "Monthly claim volume, most frequent rejection reasons, a period that could be tested...",
        },
      },
    },
    nextSteps: {
      intro: [
        { title: "Time for the call", body: "Once we have your request, we agree on a time for the call with you by email." },
        { title: "15-minute call", body: "We listen to what you need and show the relevant prototype in a short demo." },
        { title: "Short note", body: "After the call we share a short note on fit and a possible next step." },
      ],
      academic: [
        { title: "First conversation", body: "We discuss the research question, each party's role and the data needed." },
        { title: "Ethics committee and data protocol", body: "We propose preparing the ethics application and data-processing protocol together." },
        { title: "Joint study plan", body: "Method, endpoints and publication plan are put in writing." },
      ],
      pilot: [
        { title: "Technical review and first call", body: "Your hospital information system (HIS) architecture, data flow and FHIR R4 / HL7 v2 interfaces are reviewed with your IT team." },
        { title: "Security and isolation protocol", body: "The deployment model and the safeguards under Article 12 of KVKK (Turkey's data protection law) are discussed. Today the deployment that exists in the code is a Docker container; an isolated VPC and an air-gapped network are planned options. The data processing terms and the signing party are settled with the parties involved and their authorised legal advisers." },
        { title: "Pilot integration and validation", body: "If the scope fits, the system runs in a test environment and is measured against an independent reference. This has not been done at any institution yet. Duration and wards are agreed with the institution and written into the LOI." },
      ],
    },
  },
});

export type ContactView = {
  path: PathCopy & { icon: LucideIcon };
  /** Product accent, or the neutral one on the academic path. */
  accent: Accent;
  steps: (Step & { icon: LucideIcon })[];
  placeholders: Placeholders;
  nextSteps: Step[];
};

/** Everything the contact page shows for one path and product. */
export function contactView(locale: Locale, path: ContactPath, product: ProductValue): ContactView {
  const c = copy[locale];
  const steps = path === "academic" ? c.steps.academic : c.steps[path][product];
  return {
    path: { ...c.paths[path], icon: pathIcons[path] },
    accent: path === "academic" ? neutral : productStyle[product].accent,
    steps: steps.map((s, i) => ({ ...s, icon: stepIcons[path][product][i] })),
    placeholders: path === "academic" ? c.placeholders.academic : c.placeholders[path][product],
    nextSteps: c.nextSteps[path],
  };
}

export const contactPaths = (locale: Locale) =>
  CONTACT_PATHS.map((path) => ({ value: path, icon: pathIcons[path], ...copy[locale].paths[path] }));

export const contactProducts = (locale: Locale) =>
  PRODUCT_VALUES.map((value) => ({ value, ...productStyle[value], ...copy[locale].products[value] }));
