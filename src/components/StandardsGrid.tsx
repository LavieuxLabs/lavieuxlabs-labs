import { Activity, Binary, FileCheck2, FileText, History, LockKeyhole, Network, UserCheck } from "lucide-react";
import SpecCard, { JoinedGrid, type SpecRow } from "@/components/SpecCard";
import { defineContent, type Locale } from "@/i18n/config";

type Tone = "live" | "prep" | "input";

type StandardCopy = {
  title: string;
  body: string;
  rows: SpecRow[];
  status: string;
};

// Identifier, icon and status tone are shared; the copy is per locale. Status is stated plainly:
// live = built and tested, prep = in preparation, input = a reference the architecture is designed
// against, not a certification claim.
// Accent follows ownership: the 0–100 risk score is Shield's; clinical measurement, FHIR clinical data and the
// MDR preparation are PharmaDeux's; the other standards cover the whole platform and stay neutral.
const standards: { id: string; icon: typeof Binary; tone: Tone; accent?: "pharma" | "shield" }[] = [
  { id: "STD-01", icon: Binary, tone: "live" },
  { id: "STD-02", icon: History, tone: "live" },
  { id: "STD-03", icon: UserCheck, tone: "live" },
  { id: "STD-04", icon: FileText, tone: "live", accent: "shield" },
  { id: "STD-05", icon: Activity, tone: "live", accent: "pharma" },
  { id: "STD-06", icon: Network, tone: "live", accent: "pharma" },
  { id: "STD-07", icon: LockKeyhole, tone: "input" },
  { id: "STD-08", icon: FileCheck2, tone: "prep", accent: "pharma" },
];

const copy = defineContent<StandardCopy[]>({
  tr: [
    {
      title: "Tekrarlanabilir karar",
      body: "Karar yolunda üretken model yok. Aynı girdi ve kural sürümü her zaman aynı çıktıyı verir.",
      rows: [
        { label: "Mekanizma", value: "Sürümlenmiş kural motoru" },
        { label: "Otomatik test", value: "2.480+", mono: true },
        { label: "Referans", value: "IEC 62304 yaşam döngüsü", cite: "iec62304" },
      ],
      status: "Uygulamada",
    },
    {
      title: "Değiştirilemez denetim izi",
      body: "Her değerlendirme ve karar yalnızca eklenebilir kayda yazılır; her kayıt bir öncekinin özetini taşır.",
      rows: [
        { label: "Mekanizma", value: "Append-only · kayıt özeti zinciri" },
        { label: "Kapsam", value: "Girdi · kural sürümü · aktör · zaman" },
        { label: "Referans", value: "ISO/IEC 27001 kayıt kontrolleri" },
      ],
      status: "Uygulamada",
    },
    {
      title: "İnsan denetimi",
      body: "Sistem öneri ve risk sinyali üretir; nihai kararı yetkili klinisyen veya uzman verir.",
      rows: [
        { label: "Mekanizma", value: "Human-in-the-loop kuyruğu" },
        { label: "Kayıt", value: "Onay · düzeltme · gerekçe" },
        { label: "Referans", value: "MDR Ek I · genel güvenlik gereklilikleri" },
      ],
      status: "Uygulamada",
    },
    {
      title: "Açıklanabilirlik",
      body: "Her uyarı ve skor; tetikleyen kural, parametre ve eşikle birlikte sunulur.",
      rows: [
        { label: "Çıktı", value: "Kural kimliği · değer · eşik" },
        { label: "Skor", value: "Σ kural katkısı" },
        { label: "Aralık", value: "0–100", mono: true },
      ],
      status: "Uygulamada",
    },
    {
      title: "Klinik ölçüm protokolleri",
      body: "Klinik parametreler doğru yöntem ve birimle hesaplanır; skor ile ölçüm karıştırılmaz.",
      rows: [
        { label: "QTc", value: "Fridericia · QT / ∛RR · ms", cite: "fridericia" },
        { label: "QT riski", value: "Tisdale skoru · 0–21 puan", cite: "tisdale" },
        { label: "Böbrek", value: "eGFR · CKD-EPI 2021 · mL/dk/1,73 m²", cite: "ckdepi2021" },
      ],
      status: "Uygulamada",
    },
    {
      title: "Birlikte çalışabilirlik",
      body: "Klinik veri modeli HL7 FHIR R4 kaynakları üzerine kurulur.",
      rows: [
        { label: "Standart", value: "HL7 FHIR R4", mono: true },
        { label: "Kaynaklar", value: "MedicationRequest · Observation · Condition" },
        { label: "Terminoloji", value: "ATC · ICD-10 · UCUM", mono: true },
      ],
      status: "Uygulamada",
    },
    {
      title: "Veri güvenliği ve gizlilik",
      body: "Rol tabanlı erişim ve kurum bazında izolasyon; kişisel veri yalnızca gerekli olduğu kadar işlenir.",
      rows: [
        { label: "Erişim", value: "RBAC · en az yetki" },
        { label: "İzolasyon", value: "Multi-tenant" },
        { label: "Çerçeve", value: "KVKK md. 12 · ISO/IEC 27001" },
      ],
      status: "Tasarım girdisi",
    },
    {
      title: "Regülasyon hazırlığı",
      body: "PharmaDeux, MDR Kural 11 kapsamında tıbbi cihaz yazılımı olarak konumlandırılır. CE işareti henüz yoktur.",
      rows: [
        { label: "Mevzuat", value: "MDR 2017/745 · Kural 11", mono: true, cite: "mdrRule11" },
        { label: "Hedef sınıf", value: "SaMD · Sınıf IIa" },
        { label: "Süreçler", value: "IEC 62304 · ISO 14971", mono: true, cite: "iec62304" },
      ],
      status: "Hazırlık",
    },
  ],
  en: [
    {
      title: "Reproducible decisions",
      body: "No generative model in the decision path. The same input and rule version always give the same output.",
      rows: [
        { label: "Mechanism", value: "Versioned rule engine" },
        { label: "Automated tests", value: "2,480+", mono: true },
        { label: "Reference", value: "IEC 62304 life cycle", cite: "iec62304" },
      ],
      status: "In use",
    },
    {
      title: "Tamper-evident audit trail",
      body: "Every assessment and decision is written to an append-only log; each entry carries the digest of the one before.",
      rows: [
        { label: "Mechanism", value: "Append-only · digest chain" },
        { label: "Scope", value: "Input · rule version · actor · time" },
        { label: "Reference", value: "ISO/IEC 27001 logging controls" },
      ],
      status: "In use",
    },
    {
      title: "Human oversight",
      body: "The system produces suggestions and risk signals; a qualified clinician or specialist makes the final decision.",
      rows: [
        { label: "Mechanism", value: "Human-in-the-loop queue" },
        { label: "Record", value: "Approval · correction · reason" },
        { label: "Reference", value: "MDR Annex I · general safety requirements" },
      ],
      status: "In use",
    },
    {
      title: "Explainability",
      body: "Every alert and score is shown with the rule, parameter and threshold that triggered it.",
      rows: [
        { label: "Output", value: "Rule ID · value · threshold" },
        { label: "Score", value: "Σ rule contributions" },
        { label: "Range", value: "0–100", mono: true },
      ],
      status: "In use",
    },
    {
      title: "Clinical measurement protocols",
      body: "Clinical parameters are calculated with the correct method and unit; a score is never presented as a measurement.",
      rows: [
        { label: "QTc", value: "Fridericia · QT / ∛RR · ms", cite: "fridericia" },
        { label: "QT risk", value: "Tisdale score · 0–21 points", cite: "tisdale" },
        { label: "Kidney", value: "eGFR · CKD-EPI 2021 · mL/min/1.73 m²", cite: "ckdepi2021" },
      ],
      status: "In use",
    },
    {
      title: "Interoperability",
      body: "The clinical data model is built on HL7 FHIR R4 resources.",
      rows: [
        { label: "Standard", value: "HL7 FHIR R4", mono: true },
        { label: "Resources", value: "MedicationRequest · Observation · Condition" },
        { label: "Terminology", value: "ATC · ICD-10 · UCUM" },
      ],
      status: "In use",
    },
    {
      title: "Data security and privacy",
      body: "Role-based access and per-institution isolation; personal data is processed only as far as needed.",
      rows: [
        { label: "Access", value: "RBAC · least privilege" },
        { label: "Isolation", value: "Multi-tenant" },
        { label: "Framework", value: "KVKK Art. 12 · ISO/IEC 27001" },
      ],
      status: "Design input",
    },
    {
      title: "Regulatory readiness",
      body: "PharmaDeux is positioned as medical device software under MDR Rule 11. It does not have a CE mark yet.",
      rows: [
        { label: "Regulation", value: "MDR 2017/745 · Rule 11", cite: "mdrRule11" },
        { label: "Target class", value: "SaMD · Class IIa" },
        { label: "Processes", value: "IEC 62304 · ISO 14971", cite: "iec62304" },
      ],
      status: "In preparation",
    },
  ],
});

export default function StandardsGrid({ locale }: { locale: Locale }) {
  const maxRows = Math.max(...copy[locale].map((item) => item.rows.length));
  return (
    <JoinedGrid columns="sm:grid-cols-2 xl:grid-cols-4">
      {standards.map((s, i) => {
        const text = copy[locale][i];
        return (
          <SpecCard
            key={s.id}
            variant="cell"
            align={{ rows: maxRows }}
            accentLine="hover"
            id={s.id}
            accent={s.accent}
            icon={s.icon}
            title={text.title}
            body={text.body}
            rows={text.rows}
            status={{ label: text.status, tone: s.tone }}
          />
        );
      })}
    </JoinedGrid>
  );
}
