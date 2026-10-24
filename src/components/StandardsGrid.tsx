import Cite from "@/components/Cite";
import type { CiteKey } from "@/lib/citations";
import { defineContent, type Locale } from "@/i18n/config";
import { testsLabel } from "@/lib/metrics";

// The eight design principles of the software, on the paper surface. These are the software's own rules; each
// names the standard it is designed against. Naming a standard is not a certification claim.
// Status is stated plainly: live = built and tested in the prototype (software level, not clinical validation),
// prep = in preparation, input = a reference the architecture is designed against.
type Tone = "live" | "prep" | "input";
type Row = { label: string; value: string; mono?: boolean; note?: string; cite?: CiteKey };
type Principle = { title: string; body: string; rows: Row[] };

const tones: Tone[] = ["live", "live", "live", "live", "live", "live", "input", "prep"];

const copy = defineContent<{ status: Record<Tone, string>; statusLabel: string; items: Principle[] }>({
  tr: {
    status: { live: "Prototipte uygulandı", prep: "Hazırlıkta", input: "Tasarım girdisi" },
    statusLabel: "Durum",
    items: [
      {
        title: "Tekrarlanabilir karar",
        body: "Karar yolunda üretken model yok. Aynı girdi ve kural sürümü her zaman aynı çıktıyı verir.",
        rows: [
          { label: "Mekanizma", value: "Sürümlenmiş kural motoru" },
          { label: "Otomatik test (PharmaDeux, yazılım düzeyi)", value: testsLabel("tr"), mono: true },
          { label: "Referans", value: "IEC 62304 yaşam döngüsü", cite: "iec62304" },
        ],
      },
      {
        title: "Değiştirilemez denetim izi",
        body: "Her değerlendirme ve karar yalnızca eklenebilir kayda yazılır; her kayıt bir öncekinin özetini taşır.",
        rows: [
          { label: "Mekanizma", value: "Append-only kayıt, kayıt özeti zinciri" },
          { label: "Kapsam", value: "Girdi, kural sürümü, aktör, zaman" },
          { label: "Referans", value: "ISO/IEC 27001 kayıt kontrolleri" },
        ],
      },
      {
        title: "İnsan denetimi",
        body: "Sistem bulgu ve risk sinyali üretir; nihai kararı yetkili klinisyen veya uzman verir.",
        rows: [
          { label: "Mekanizma", value: "Human-in-the-loop kuyruğu" },
          { label: "Kayıt", value: "Onay, düzeltme, gerekçe" },
          { label: "Referans", value: "MDR Ek I, genel güvenlik gereklilikleri" },
        ],
      },
      {
        title: "Açıklanabilirlik",
        body: "Her uyarı ve skor; tetikleyen kural, parametre ve eşikle birlikte sunulur.",
        rows: [
          { label: "Çıktı", value: "Kural kimliği, değer, eşik" },
          { label: "Skor", value: "Σ kural katkısı" },
          { label: "Aralık", value: "0–100", mono: true, note: "Shield kural skoru; ret olasılığı değildir" },
        ],
      },
      {
        title: "Klinik ölçüm protokolleri",
        body: "Klinik parametreler doğru yöntem ve birimle hesaplanır; skor ile ölçüm karıştırılmaz.",
        rows: [
          { label: "QTc", value: "Fridericia, QT / ∛RR, ms", cite: "fridericia" },
          { label: "QT riski", value: "Tisdale skoru, 0–21 puan", cite: "tisdale" },
          { label: "Böbrek", value: "eGFR, CKD-EPI 2021, mL/dk/1,73 m²", cite: "ckdepi2021" },
        ],
      },
      {
        title: "Birlikte çalışabilirlik",
        body: "Klinik veri modeli HL7 FHIR R4 kaynakları üzerine kurulur.",
        rows: [
          { label: "Standart", value: "HL7 FHIR R4" },
          { label: "Kaynaklar", value: "MedicationRequest, Observation, Condition" },
          { label: "Terminoloji", value: "ATC, ICD-10, UCUM" },
        ],
      },
      {
        title: "Veri güvenliği ve gizlilik",
        body: "Rol tabanlı erişim ve kurum bazında izolasyon; kişisel veri yalnızca gerekli olduğu kadar işlenir.",
        rows: [
          { label: "Erişim", value: "RBAC, en az yetki" },
          { label: "İzolasyon", value: "Multi-tenant" },
          { label: "Çerçeve", value: "KVKK md. 12, ISO/IEC 27001" },
        ],
      },
      {
        title: "Regülasyon hazırlığı",
        body: "PharmaDeux, MDR Kural 11 kapsamında tıbbi cihaz yazılımı olarak konumlandırılır. CE işareti henüz yoktur.",
        rows: [
          { label: "Mevzuat", value: "MDR 2017/745, Kural 11", cite: "mdrRule11" },
          { label: "Hedef sınıf", value: "SaMD, Sınıf IIa" },
          { label: "Süreçler", value: "IEC 62304, ISO 14971", cite: "iec62304" },
        ],
      },
    ],
  },
  en: {
    status: { live: "Implemented in the prototype", prep: "In preparation", input: "Design input" },
    statusLabel: "Status",
    items: [
      {
        title: "Reproducible decisions",
        body: "No generative model in the decision path. The same input and rule version always give the same output.",
        rows: [
          { label: "Mechanism", value: "Versioned rule engine" },
          { label: "Automated tests (PharmaDeux, software level)", value: testsLabel("en"), mono: true },
          { label: "Reference", value: "IEC 62304 life cycle", cite: "iec62304" },
        ],
      },
      {
        title: "Tamper-evident audit trail",
        body: "Every assessment and decision is written to an append-only log. Each entry carries the digest of the previous one.",
        rows: [
          { label: "Mechanism", value: "Append-only log, digest chain" },
          { label: "Scope", value: "Input, rule version, actor, time" },
          { label: "Reference", value: "ISO/IEC 27001 logging controls" },
        ],
      },
      {
        title: "Human oversight",
        body: "The system produces findings and risk signals. A qualified clinician or specialist makes the final decision.",
        rows: [
          { label: "Mechanism", value: "Human-in-the-loop queue" },
          { label: "Record", value: "Approval, correction, reason" },
          { label: "Reference", value: "MDR Annex I, general safety requirements" },
        ],
      },
      {
        title: "Explainability",
        body: "Every alert and score is shown with the rule, parameter and threshold that triggered it.",
        rows: [
          { label: "Output", value: "Rule ID, value, threshold" },
          { label: "Score", value: "Σ rule contributions" },
          { label: "Range", value: "0–100", mono: true, note: "Shield rule score; not a rejection probability" },
        ],
      },
      {
        title: "Clinical measurement protocols",
        body: "Clinical parameters are calculated with the correct method and unit. A score is never presented as a measurement.",
        rows: [
          { label: "QTc", value: "Fridericia, QT / ∛RR, ms", cite: "fridericia" },
          { label: "QT risk", value: "Tisdale score, 0–21 points", cite: "tisdale" },
          { label: "Kidney", value: "eGFR, CKD-EPI 2021, mL/min/1.73 m²", cite: "ckdepi2021" },
        ],
      },
      {
        title: "Interoperability",
        body: "The clinical data model is built on HL7 FHIR R4 resources.",
        rows: [
          { label: "Standard", value: "HL7 FHIR R4" },
          { label: "Resources", value: "MedicationRequest, Observation, Condition" },
          { label: "Terminology", value: "ATC, ICD-10, UCUM" },
        ],
      },
      {
        title: "Data security and privacy",
        body: "Role-based access and per-institution isolation; personal data is processed only as far as needed.",
        rows: [
          { label: "Access", value: "RBAC, least privilege" },
          { label: "Isolation", value: "Multi-tenant" },
          { label: "Framework", value: "KVKK Art. 12, ISO/IEC 27001" },
        ],
      },
      {
        title: "Regulatory readiness",
        body: "PharmaDeux is positioned as medical device software under MDR Rule 11. It does not have a CE mark yet.",
        rows: [
          { label: "Regulation", value: "MDR 2017/745, Rule 11", cite: "mdrRule11" },
          { label: "Target class", value: "SaMD, Class IIa" },
          { label: "Processes", value: "IEC 62304, ISO 14971", cite: "iec62304" },
        ],
      },
    ],
  },
});

export const PRINCIPLE_COUNT = tones.length;

/** The eight principles as a numbered editorial list: title, body and status on the left, facts on the right. */
export default function StandardsGrid({ locale }: { locale: Locale }) {
  const c = copy[locale];
  return (
    <ol className="divide-y divide-rule border-y border-rule">
      {c.items.map((item, i) => (
        <li key={item.title} className="grid gap-x-8 gap-y-3 py-6 sm:grid-cols-[40px_minmax(0,1fr)] lg:grid-cols-[40px_minmax(0,0.9fr)_minmax(0,1.1fr)]">
          <span className="font-serif text-[24px] leading-none text-ink-3" aria-hidden="true">
            {i + 1}
          </span>
          <div className="min-w-0">
            <h3 className="text-[18px] font-semibold tracking-[-0.01em] text-ink">{item.title}</h3>
            <p className="mt-2 max-w-[56ch] text-[15px] leading-[1.6] text-ink-2">{item.body}</p>
            <p className="mt-2 text-[14px] text-ink-3">
              {c.statusLabel}: <span className="text-ink">{c.status[tones[i]]}</span>
            </p>
          </div>
          <dl className="min-w-0 divide-y divide-rule border-t border-rule sm:col-start-2 lg:col-start-3 lg:border-t-0">
            {item.rows.map((r) => (
              <div key={r.label} className="grid gap-x-4 gap-y-0.5 py-2.5 lg:first:pt-0 sm:grid-cols-[150px_minmax(0,1fr)]">
                <dt className="text-[14px] leading-snug text-ink-3">{r.label}</dt>
                <dd className="text-[15px] leading-snug text-ink">
                  <span className={r.mono ? "font-mono tabular-nums" : undefined}>{r.value}</span>
                  {r.cite && <Cite id={r.cite} tone="paper" />}
                  {r.note && <span className="block text-[14px] text-ink-3">{r.note}</span>}
                </dd>
              </div>
            ))}
          </dl>
        </li>
      ))}
    </ol>
  );
}
