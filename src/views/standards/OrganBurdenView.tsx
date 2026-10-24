import Cite from "@/components/Cite";
import StandardDoc from "@/components/StandardDoc";
import { CITATIONS } from "@/lib/citations";
import { metrics } from "@/lib/metrics";
import { standardPageJsonLd } from "@/lib/structuredData";
import { defineContent, type Locale } from "@/i18n/config";
import { defineMetadata } from "@/i18n/metadata";

const PATH = "/standartlar/kumulatif-organ-yuku";

export const metadata = defineMetadata(PATH, {
  tr: {
    title: "Polifarmaside kümülatif organ yükü",
    description:
      "Çoklu ilaç kullanan hastada ikili etkileşimin ötesinde renal, kardiyak, hepatik ve antikolinerjik düzlemlerde biriken yük: mekanizmalar, izlem parametreleri, triple whammy ve PharmaDeux'un yaklaşımı.",
  },
  en: {
    title: "Cumulative organ burden in polypharmacy",
    description:
      "Burden that builds up beyond pairwise interactions in patients on many drugs, across renal, cardiac, hepatic and anticholinergic planes: mechanisms, monitoring parameters, the triple whammy and how PharmaDeux approaches it.",
  },
});

const copy = defineContent({
  tr: {
    crumb: "Kümülatif organ yükü",
    eyebrow: "Klinik standart: çoklu ilaç güvenliği",
    title: "Polifarmaside kümülatif organ yükü",
    description:
      "Çoklu ilaç kullanan hastada risk tek bir ilaç çiftinden gelmeyebilir. Bu sayfa renal, kardiyak, hepatik ve antikolinerjik düzlemlerde biriken yükü anlatır.",
    problem: "Klinik problem",
    problemBody: [
      "İkili etkileşim kontrolü iki ilaca bakar. n ilaç için n(n−1)/2 ikili kombinasyon vardır; üçlü ve daha karmaşık etkiler bu sayıya girmez.",
      "Aynı organı etkileyen ilaçların etkisi toplanabilir. Tek başına hafif sayılan iki ya da üç risk, birlikte klinik olarak anlamlı bir yük oluşturabilir.",
      "Örnek: diüretik ve ACE inhibitörü kullanan yaşlı hastaya ağrı için NSAİİ eklenir. İlaç çiftlerinin hiçbiri tek başına kontrendike olmayabilir. Üçü birlikte akut böbrek hasarı riskini artırır.",
    ],
    planes: "Güvenlik düzlemleri",
    plane: "Düzlem",
    mechanism: "Mekanizma",
    monitoring: "Birincil izlem",
    planeRows: [
      {
        plane: "Renal yük",
        mechanism: "Renal perfüzyonun azalması (NSAİİ, ACE inhibitörü veya ARB, diüretik); doğrudan tübüler toksisite (ör. aminoglikozidler, vankomisin)",
        monitoring: "Serum kreatinin, eGFR, potasyum",
      },
      {
        plane: "Kardiyak (QTc)",
        mechanism: "IKr blokajının toplanması; diüretiğe bağlı hipokalemi ve hipomagnezemi",
        monitoring: "EKG'de QTc, potasyum, magnezyum",
      },
      {
        plane: "Hepatik yük",
        mechanism: "Hepatotoksik ilaçların toplanması; CYP inhibisyonuyla plazma düzeyinin artması",
        monitoring: "ALT, AST, ALP, total bilirubin",
      },
      {
        plane: "Antikolinerjik (SSS)",
        mechanism: "Muskarinik reseptör blokajının toplanması; sedatif etkilerin eklenmesi",
        monitoring: "Laboratuvar karşılığı yok; konfüzyon, düşme, idrar retansiyonu ve kabızlık klinik olarak izlenir",
      },
    ],
    planesNote: "Tablodaki ilaçlar sınıf örnekleridir; tam liste değildir.",
    triple: "Triple whammy: üçlü darbe",
    tripleBody: [
      "Glomerüler filtrasyon, glomerülün iki yanındaki arteriyollerin dengesine bağlıdır. Prostaglandinler giren (afferent) arteriyolü genişletir. Anjiyotensin II çıkan (efferent) arteriyolü daraltır.",
      "NSAİİ prostaglandin sentezini baskılar ve giren arteriyol daralır. ACE inhibitörü veya ARB çıkan arteriyolü gevşetir. Diüretik dolaşan hacmi azaltır. Üçü birlikte glomerüler basıncı iki yönden düşürür ve böbrek bunu dengeleyemez.",
      "Lapi ve arkadaşlarının iç içe vaka-kontrol çalışmasında üçlü kullanım, akut böbrek hasarı riskinde artışla ilişkiliydi. Risk, kullanımın ilk 30 gününde en yüksekti.",
    ],
    engine: "PharmaDeux bu yükle ne yapar",
    engineBody: [
      `PharmaDeux reçeteyi ${metrics.safetyPlanes} güvenlik düzleminde kontrol eder. Organ toksisitesi ve kümülatif yük başlıklarındaki düzlemler ilaçları tek tek değil, birlikte değerlendirir.`,
      "Her bulgu tetikleyen kural, değer ve eşikle gösterilir. Eşikler kurumun klinik politikasına göre ayarlanır.",
      "Tasarım hedefi bağlama bakan uyarıdır: aynı organa binen bulguları birlikte göstermek ve uyarı yorgunluğunu azaltmak. Bu hedefin klinik etkisi henüz bir kurumda ölçülmedi.",
      "Son karar hekimindir. Hekim uyarıyı gerekçe yazarak geçerse bu karar denetim izine yazılır.",
    ],
    limits: "Sınırlar",
    limitsItems: [
      "Organ rezervi zamanla değişir. Kural son ölçülen laboratuvar değerine bakar; dehidratasyon veya henüz laboratuvara yansımamış akut bir değişiklik kurala görünmez.",
      "İdiyosenkratik reaksiyonlar (dozla ilişkili olmayan, öngörülemeyen reaksiyonlar) kümülatif yük hesabıyla öngörülemez.",
      "Ürün bilgisi (KÜB) ve hekimin klinik değerlendirmesi önceliklidir.",
    ],
    review: "Klinik inceleme: bu sayfa henüz bir hekim tarafından incelenmedi.",
    related: [
      { href: "/initiatives/pharmadeux?case=polypharmacy#vakalar", label: "Örnek vaka: polifarmasi" },
      { href: "/standartlar/tisdale-score", label: "Tisdale skoru" },
      { href: "/standartlar/ckd-epi-2021", label: "CKD-EPI 2021" },
    ],
  },
  en: {
    crumb: "Cumulative organ burden",
    eyebrow: "Clinical standard: medication safety",
    title: "Cumulative organ burden in polypharmacy",
    description:
      "In a patient on many drugs, risk may not come from a single drug pair. This page covers the burden that builds up across renal, cardiac, hepatic and anticholinergic planes.",
    problem: "Clinical problem",
    problemBody: [
      "A pairwise interaction check looks at two drugs. For n drugs there are n(n−1)/2 pairs, and three-way or more complex effects are not part of that count.",
      "Drugs acting on the same organ can add up. Two or three risks that each look minor can together form a clinically relevant burden.",
      "Example: an older patient on a diuretic and an ACE inhibitor is given an NSAID for pain. No single pair may be contraindicated. Together, the three raise the risk of acute kidney injury.",
    ],
    planes: "Safety planes",
    plane: "Plane",
    mechanism: "Mechanism",
    monitoring: "Primary monitoring",
    planeRows: [
      {
        plane: "Renal burden",
        mechanism: "Reduced renal perfusion (NSAID, ACE inhibitor or ARB, diuretic); direct tubular toxicity (e.g. aminoglycosides, vancomycin)",
        monitoring: "Serum creatinine, eGFR, potassium",
      },
      {
        plane: "Cardiac (QTc)",
        mechanism: "Additive IKr block; diuretic-induced hypokalaemia and hypomagnesaemia",
        monitoring: "QTc on ECG, potassium, magnesium",
      },
      {
        plane: "Hepatic burden",
        mechanism: "Additive hepatotoxic drugs; plasma levels raised by CYP inhibition",
        monitoring: "ALT, AST, ALP, total bilirubin",
      },
      {
        plane: "Anticholinergic (CNS)",
        mechanism: "Additive muscarinic receptor block; added sedative effects",
        monitoring: "No laboratory marker; confusion, falls, urinary retention and constipation are monitored clinically",
      },
    ],
    planesNote: "The drugs in the table are class examples, not a complete list.",
    triple: "The triple whammy",
    tripleBody: [
      "Glomerular filtration depends on the balance between the arterioles on either side of the glomerulus. Prostaglandins widen the afferent (incoming) arteriole. Angiotensin II narrows the efferent (outgoing) arteriole.",
      "An NSAID suppresses prostaglandin synthesis, so the afferent arteriole narrows. An ACE inhibitor or ARB relaxes the efferent arteriole. A diuretic lowers circulating volume. Together they lower glomerular pressure from both sides, and the kidney cannot compensate.",
      "In the nested case-control study by Lapi and colleagues, triple therapy was associated with a higher risk of acute kidney injury. The risk was highest in the first 30 days of use.",
    ],
    engine: "What PharmaDeux does with this burden",
    engineBody: [
      `PharmaDeux checks an order across ${metrics.safetyPlanes} safety planes. The planes under organ toxicity and cumulative burden assess drugs together, not one at a time.`,
      "Each finding is shown with the rule, value and threshold that triggered it. Thresholds are configured to the institution's clinical policy.",
      "The design goal is context-aware alerting: showing findings that load the same organ together and reducing alert fatigue. The clinical effect of this goal has not yet been measured in an institution.",
      "The physician makes the final decision. When the physician overrides an alert with a reason, the decision is written to the audit trail.",
    ],
    limits: "Limits",
    limitsItems: [
      "Organ reserve changes over time. A rule reads the latest measured laboratory value, so dehydration or an acute change not yet reflected in the laboratory is invisible to it.",
      "Idiosyncratic reactions (unpredictable reactions not related to dose) cannot be predicted from cumulative burden.",
      "The product information (SmPC) and the physician's clinical judgement take precedence.",
    ],
    review: "Clinical review: this page has not been reviewed by a physician yet.",
    related: [
      { href: "/initiatives/pharmadeux?case=polypharmacy#vakalar", label: "Example case: polypharmacy" },
      { href: "/standartlar/tisdale-score", label: "Tisdale score" },
      { href: "/standartlar/ckd-epi-2021", label: "CKD-EPI 2021" },
    ],
  },
});

export default function OrganBurdenView({ locale }: { locale: Locale }) {
  const c = copy[locale];
  const refs = CITATIONS.tripleWhammy.refs;
  return (
    <StandardDoc
      locale={locale}
      path={PATH}
      crumb={c.crumb}
      eyebrow={c.eyebrow}
      title={c.title}
      description={c.description}
      toc={[
        { id: "problem", label: c.problem },
        { id: "duzlemler", label: c.planes },
        { id: "triple-whammy", label: c.triple },
        { id: "pharmadeux", label: c.engine },
        { id: "sinirlar", label: c.limits },
      ]}
      references={refs}
      related={c.related}
      jsonLd={standardPageJsonLd({
        locale,
        path: PATH,
        name: c.title,
        description: metadata[locale].description as string,
        kind: "medical",
        citations: refs,
      })}
    >
      <h2 id="problem">{c.problem}</h2>
      {c.problemBody.map((text) => (
        <p key={text}>{text}</p>
      ))}

      <h2 id="duzlemler" className="mt-12">{c.planes}</h2>
      <table>
        <thead>
          <tr>
            <th>{c.plane}</th>
            <th>{c.mechanism}</th>
            <th>{c.monitoring}</th>
          </tr>
        </thead>
        <tbody>
          {c.planeRows.map((r) => (
            <tr key={r.plane}>
              <td className="font-medium text-ink">{r.plane}</td>
              <td>{r.mechanism}</td>
              <td>{r.monitoring}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="text-[14px]">{c.planesNote}</p>

      <h2 id="triple-whammy" className="mt-12">
        {c.triple}
        <Cite id="tripleWhammy" tone="paper" />
      </h2>
      {c.tripleBody.map((text) => (
        <p key={text}>{text}</p>
      ))}

      <h2 id="pharmadeux" className="mt-12">{c.engine}</h2>
      {c.engineBody.map((text) => (
        <p key={text}>{text}</p>
      ))}

      <h2 id="sinirlar" className="mt-12">{c.limits}</h2>
      <ul>
        {c.limitsItems.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      <p className="text-[14px]">{c.review}</p>
    </StandardDoc>
  );
}
