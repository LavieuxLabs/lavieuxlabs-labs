import { Activity, Binary, FileCheck2, FileText, History, LockKeyhole, Network, UserCheck } from "lucide-react";
import Reveal from "@/components/Reveal";
import SpecCard, { type SpecRow } from "@/components/SpecCard";

type Standard = {
  id: string;
  icon: typeof Binary;
  title: string;
  body: string;
  rows: SpecRow[];
  status: { label: string; tone: "live" | "prep" | "input" };
};

// Engineering and regulatory standards as datasheet cards. Status is stated plainly:
// "Uygulamada" = built and tested, "Hazırlık" = in preparation, "Tasarım girdisi" = a reference
// the architecture is designed against, not a certification claim.
const standards: Standard[] = [
  {
    id: "STD-01",
    icon: Binary,
    title: "Tekrarlanabilir karar",
    body: "Karar yolunda üretken model yok. Aynı girdi ve kural sürümü her zaman aynı çıktıyı verir.",
    rows: [
      { label: "Mekanizma", value: "Sürümlenmiş kural motoru" },
      { label: "Otomatik test", value: "2.480+", mono: true },
      { label: "Referans", value: "IEC 62304 yaşam döngüsü" },
    ],
    status: { label: "Uygulamada", tone: "live" },
  },
  {
    id: "STD-02",
    icon: History,
    title: "Değiştirilemez denetim izi",
    body: "Her değerlendirme ve karar yalnızca eklenebilir kayda yazılır; her kayıt bir öncekinin özetini taşır.",
    rows: [
      { label: "Mekanizma", value: "Append-only · kayıt özeti zinciri" },
      { label: "Kapsam", value: "Girdi · kural sürümü · aktör · zaman" },
      { label: "Referans", value: "ISO/IEC 27001 kayıt kontrolleri" },
    ],
    status: { label: "Uygulamada", tone: "live" },
  },
  {
    id: "STD-03",
    icon: UserCheck,
    title: "İnsan denetimi",
    body: "Sistem öneri ve risk sinyali üretir; nihai kararı yetkili klinisyen veya uzman verir.",
    rows: [
      { label: "Mekanizma", value: "Human-in-the-loop kuyruğu" },
      { label: "Kayıt", value: "Onay · düzeltme · gerekçe" },
      { label: "Referans", value: "MDR Ek I · genel güvenlik gereklilikleri" },
    ],
    status: { label: "Uygulamada", tone: "live" },
  },
  {
    id: "STD-04",
    icon: FileText,
    title: "Açıklanabilirlik",
    body: "Her uyarı ve skor; tetikleyen kural, parametre ve eşikle birlikte sunulur.",
    rows: [
      { label: "Çıktı", value: "Kural kimliği · değer · eşik" },
      { label: "Skor", value: "Σ kural katkısı" },
      { label: "Aralık", value: "0–100", mono: true },
    ],
    status: { label: "Uygulamada", tone: "live" },
  },
  {
    id: "STD-05",
    icon: Activity,
    title: "Klinik ölçüm protokolleri",
    body: "Klinik parametreler doğru yöntem ve birimle hesaplanır; skor ile ölçüm karıştırılmaz.",
    rows: [
      { label: "QTc", value: "Fridericia · QT / ∛RR · ms" },
      { label: "QT riski", value: "Tisdale skoru · 0–21 puan" },
      { label: "Böbrek", value: "eGFR · CKD-EPI 2021 · mL/dk/1,73 m²" },
    ],
    status: { label: "Uygulamada", tone: "live" },
  },
  {
    id: "STD-06",
    icon: Network,
    title: "Birlikte çalışabilirlik",
    body: "Klinik veri modeli HL7 FHIR R4 kaynakları üzerine kurulur.",
    rows: [
      { label: "Standart", value: "HL7 FHIR R4" },
      { label: "Kaynaklar", value: "MedicationRequest · Observation · Condition" },
      { label: "Terminoloji", value: "ATC · ICD-10 · UCUM" },
    ],
    status: { label: "Uygulamada", tone: "live" },
  },
  {
    id: "STD-07",
    icon: LockKeyhole,
    title: "Veri güvenliği ve gizlilik",
    body: "Rol tabanlı erişim ve kurum bazında izolasyon; kişisel veri yalnızca gerekli olduğu kadar işlenir.",
    rows: [
      { label: "Erişim", value: "RBAC · en az yetki" },
      { label: "İzolasyon", value: "Multi-tenant" },
      { label: "Çerçeve", value: "KVKK md. 12 · ISO/IEC 27001" },
    ],
    status: { label: "Tasarım girdisi", tone: "input" },
  },
  {
    id: "STD-08",
    icon: FileCheck2,
    title: "Regülasyon hazırlığı",
    body: "PharmaDeux, MDR Kural 11 kapsamında tıbbi cihaz yazılımı olarak konumlandırılır. CE işareti henüz yoktur.",
    rows: [
      { label: "Mevzuat", value: "MDR 2017/745 · Kural 11" },
      { label: "Hedef sınıf", value: "SaMD · Sınıf IIa" },
      { label: "Süreçler", value: "IEC 62304 · ISO 14971" },
    ],
    status: { label: "Hazırlık", tone: "prep" },
  },
];

export default function StandardsGrid() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {standards.map((s, i) => (
        <Reveal key={s.id} delay={(i % 4) * 0.04} className="h-full">
          <SpecCard id={s.id} icon={s.icon} title={s.title} body={s.body} rows={s.rows} status={s.status} />
        </Reveal>
      ))}
    </div>
  );
}
