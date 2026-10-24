import Link from "next/link";
import { ChevronRight, ShieldCheck } from "lucide-react";
import JsonLd from "@/components/JsonLd";
import ShieldConsole from "@/components/ShieldConsole";
import ClaimSimulator from "@/components/ClaimSimulator";
import CopyEmail from "@/components/CopyEmail";
import RevealHashTarget from "@/components/paper/RevealHashTarget";
import { ClaimPathFigure, Figure } from "@/components/home/HomeFigures";
import { BUTTON, BUTTON_OUTLINE, Disclosure, FactRows, LINK, PaperSection, TEXT_ACTION } from "@/components/paper/Editorial";
import { shieldJsonLd } from "@/lib/structuredData";
import { contactHref } from "@/lib/site";
import { RULES, THRESHOLD, scoreClaim, type RuleKey } from "@/lib/claimRules";
import { defineContent, localizedPath, type Locale } from "@/i18n/config";
import { defineMetadata } from "@/i18n/metadata";

export const metadata = defineMetadata("/initiatives/shield", {
  tr: {
    title: "Shield",
    description:
      "Tarık Ziya Eren'in bağımsız prototip projesi. Hastane fatura ve provizyon kalemlerini gönderimden önce SUT ve SGK provizyon kurallarına göre denetler; riskli kalem gerekçesiyle uzmanın kuyruğuna düşer. Gerçek faturalarda doğrulanmadı.",
  },
  en: {
    title: "Shield",
    description:
      "An independent prototype by Tarık Ziya Eren. Checks hospital billing and provision line items before submission against SUT (Turkey's reimbursement rulebook) and SGK (Social Security Institution) provision rules; a risky line item goes to the specialist's queue with the reason. Not validated on real claims.",
  },
});

/*
 * Shield on the paper surface (Academic Editorial), read as a claims review desk: what Shield is, whose
 * project it is and where it stands; why claims need a check before submission; one line item's path
 * through Shield (a ruled four-column figure computed from the example rule set); the claim simulator on a
 * dark workspace as the main interactive tool; rule coverage with honest status; traceability and access
 * with prototype behaviour kept apart from design goals (the review console opens on demand); the
 * retrospective validation plan; and ways to talk. Shield is Tarık Ziya Eren's independent project,
 * presented on this site; it is not a LavieuxLabs team product. Section ids are linked from elsewhere and
 * kept: #problem, #mimari, #simulator, #kapsam, #denetim, #izolasyon, #konsol, #retrospektif, #is-birligi.
 */

/** "shown": works in the browser prototype on fictional data. "goal": defined in the design, not built. */
type Trace = "shown" | "goal";
type PlaneStatus = "built" | "missing";

// The example line item, shared with the home page figure: angiography billed under a back-pain diagnosis
// with no pre-approval document. Its score and rules come from the same model the simulator uses.
const EXAMPLE = { item: "angio", icd: "M54.5", checks: { preapproval: false, repeat: false, signed: true } } as const;
const EXAMPLE_QUERY = `?item=${EXAMPLE.item}&code=${EXAMPLE.icd}&pre=0&repeat=0&signed=1#simulator`;

const traceTone: Record<Trace, string> = { shown: "font-medium text-ink", goal: "text-ink-2" };
const planeTone: Record<PlaneStatus, string> = { built: "font-medium text-ink", missing: "text-ink-3" };

const copy = defineContent<{
  crumbs: { home: string; products: string; aria: string };
  hero: {
    title: string;
    lead: string;
    owner: string;
    primary: string;
    secondary: string;
    summaryTitle: string;
    summary: { label: string; value: string }[];
    onPage: string;
  };
  sections: { id: string; label: string }[];
  problem: { label: string; title: string; intro: string; items: { title: string; body: string }[] };
  flow: {
    label: string;
    title: string;
    intro: string;
    steps: string[];
    item: string;
    diagnosis: string;
    documents: string;
    rules: Record<RuleKey, string>;
    ruleCount: (fired: number, all: number) => string;
    score: string;
    threshold: (t: number) => string;
    review: string;
    below: string;
    decisions: string[];
    decisionNote: string;
    caption: string;
    open: string;
  };
  sim: { label: string; title: string; intro: string; notTitle: string; not: { title: string; body: string }[] };
  scope: {
    label: string;
    title: string;
    intro: string;
    columns: { plane: string; checks: string; status: string };
    statusLabels: Record<PlaneStatus, string>;
    planes: { title: string; checks: string; status: PlaneStatus }[];
    rulebookLabel: string;
    rulebookMeta: string;
    rulebook: { label: string; value: string }[];
    note: { before: string; link: string; after: string };
  };
  trace: {
    label: string;
    title: string;
    intro: string;
    statusLabels: Record<Trace, string>;
    statusMeaning: Record<Trace, string>;
    columns: { capability: string; detail: string; status: string };
    rows: { name: string; detail: string; status: Trace; id?: string }[];
    rolesLabel: string;
    rolesMeta: string;
    roles: { role: string; scope: string; access: string }[];
    rolesNote: string;
    consoleLabel: string;
    consoleMeta: string;
    consoleSteps: string[];
  };
  retro: {
    label: string;
    title: string;
    intro: string;
    steps: { title: string; body: string }[];
    metricsTitle: string;
    metrics: { name: string; definition: string }[];
    note: string;
  };
  collab: {
    label: string;
    title: string;
    intro: string;
    modes: { title: string; body: string; link: string }[];
    legal: string;
    audiencesTitle: string;
    audiences: string[];
    email: string;
    noData: string;
  };
}>({
  tr: {
    crumbs: { home: "Ana sayfa", products: "Projeler", aria: "Sayfa konumu" },
    hero: {
      title: "Hastane faturasındaki red riskini gönderimden önce gösteren denetim yazılımı.",
      lead: "Shield fatura ve provizyon kalemlerini gönderimden önce SUT ve SGK kurallarına göre kontrol eder. Riskli kalem, tetiklenen kuralla birlikte fatura uzmanının kuyruğuna düşer; gönderim kararını uzman verir.",
      owner: "Tarık Ziya Eren’in bağımsız projesi · LavieuxLabs sitesinde tanıtılıyor · prototip",
      primary: "15 dk tanışma görüşmesi",
      secondary: "Örnek faturayı inceleyin",
      summaryTitle: "Kısaca",
      summary: [
        { label: "Sahiplik", value: "Tarık Ziya Eren'in bağımsız projesi. LavieuxLabs sitesinde tanıtılır; ekibin ortak projesi değildir." },
        { label: "Aşama", value: "Prototip" },
        { label: "Kurallar", value: "Dört denetim düzleminden üçü uygulandı ve sentetik faturalarla test edildi." },
        { label: "Gerçek fatura doğrulaması", value: "Henüz yapılmadı. Shield hiçbir kurumun faturasında çalıştırılmadı." },
        { label: "Kapsam", value: "Faturalama ve provizyon. Tanı koymaz, tedavi kararı vermez." },
      ],
      onPage: "Bu sayfada",
    },
    sections: [
      { id: "problem", label: "Sorun" },
      { id: "mimari", label: "Nasıl çalışır" },
      { id: "simulator", label: "Örnek inceleme" },
      { id: "kapsam", label: "Kural kapsamı" },
      { id: "denetim", label: "İzlenebilirlik ve erişim" },
      { id: "retrospektif", label: "Doğrulama planı" },
      { id: "is-birligi", label: "İş birliği" },
    ],
    problem: {
      label: "Sorun",
      title: "Gönderimden sonra öğrenilen red, itiraz ve yeniden gönderim gerektirir.",
      intro:
        "Red nedenlerinin bir kısmı önlenebilir hatalardır: eksik belge, kod uyumsuzluğu, limit aşımı. Bunlar gönderimden önce, kuralla ve gerekçesiyle yakalanabilir.",
      items: [
        {
          title: "Red geç öğreniliyor",
          body: "Red kararı çoğu zaman fatura gönderildikten sonra gelir. İtiraz, düzeltme ve yeniden gönderim hem ödemeyi geciktirir hem ekibin vaktini alır.",
        },
        {
          title: "Kurallar sık değişiyor",
          body: "SUT, paket tanımları ve kurum sözleşmeleri sık güncellenir. Kuralları kişisel deneyimle takip etmek, aynı kalemin farklı kişilerce farklı işlenmesine yol açar.",
        },
        {
          title: "Gerekçesiz skor işe yaramaz",
          body: "Neden riskli olduğu söylenmeyen bir skor, ekibe ne yapması gerektiğini söylemez ve denetimde savunulamaz.",
        },
      ],
    },
    flow: {
      label: "Nasıl çalışır",
      title: "Bir fatura kalemi Shield'dan nasıl geçer.",
      intro:
        "Shield faturalama sisteminin yerini almaz. Gönderimden hemen önce çalışır, kalemi kurallarla kontrol eder ve eşiği aşan kalemi uzmana gösterir. Gönderim kararını kendisi vermez.",
      steps: ["Fatura kalemi", "SUT/SGK kontrolü", "Riskli kalem", "Uzman değerlendirmesi"],
      item: "Kardiyoloji, koroner anjiyografi",
      diagnosis: "Tanı M54.5, bel ağrısı",
      documents: "Ön onay belgesi yok, epikriz imzalı",
      rules: {
        mismatch: "Tanı bu işlemi gerekçelendirmiyor",
        preapproval: "Ön onay belgesi dosyada yok",
        repeat: "Aynı işlem 30 gün içinde tekrar",
        unsigned: "Epikriz imzasız",
      },
      ruleCount: (fired, all) => `Örnek kural setindeki ${all} kuraldan ${fired} tanesi tetiklendi.`,
      score: "Kural skoru",
      threshold: (t) => `eşik ${t}`,
      review: "Uzmanın kuyruğuna gider",
      below: "Eşiğin altında",
      decisions: ["Onaylar", "Düzeltmeye gönderir", "Gönderimi durdurur"],
      decisionNote: "Karar ve gerekçe kalemle birlikte kayda yazılır.",
      caption:
        "Örnek kalem ve kurgusal kural seti; ICD-10 kodu gerçektir. Skor tetiklenen kuralların katkılarının toplamıdır, SGK ret olasılığı değildir.",
      open: "Bu kalemi simülatörde açın",
    },
    sim: {
      label: "Örnek inceleme",
      title: "Kalemi değiştirin, skorun nasıl değiştiğini görün.",
      intro:
        "Branş ve fatura kalemini, tanı kodunu ve belge durumunu değiştirin. Kural motoru skoru yeniden hesaplar ve hangi kuralın ne kadar katkı verdiğini yazar. Skoru 40 ve üzerinde olan kalem uzmanın kuyruğuna düşer.",
      notTitle: "Skor ne değildir",
      not: [
        { title: "SGK ret olasılığı değil", body: "Tetiklenen kuralların ağırlıklarının toplamıdır; bir olasılık ölçümü değildir." },
        { title: "Tasarruf tahmini değil", body: "Finansal kayıp, geri kazanım veya tasarruf hesabı yapmaz." },
        { title: "Gerçek kural seti değil", body: "Bu örnekteki kurallar ve ağırlıklar kurgusaldır. Gerçek kurallar SUT, paket tanımları ve kurum sözleşmesinden türetilir." },
      ],
    },
    scope: {
      label: "Kural kapsamı",
      title: "Hangi kurallar uygulandı, hangisi henüz yok.",
      intro:
        "Dört denetim düzleminden üçü kural motorunda uygulandı ve sentetik faturalarla otomatik testlerden geçiyor. Hiçbiri henüz gerçek bir kurumun faturalarında doğrulanmadı.",
      columns: { plane: "Denetim düzlemi", checks: "Neyi kontrol eder", status: "Durum" },
      statusLabels: { built: "Uygulandı, sentetik faturalarla test edildi", missing: "Henüz uygulanmadı" },
      planes: [
        { title: "Branş ve hekim yetkisi", checks: "Uzmanlık dalına bağlı işlem ve ilaçlarda faturadaki hekimin branşı.", status: "built" },
        { title: "Mükerrer işlem ve paket aşımı", checks: "Aynı gün tekrar eden tetkik, pakete dahil kalemin ayrıca faturalanması, yatış süresinin paket limitini aşması.", status: "built" },
        { title: "Tanı–işlem tutarlılığı", checks: "İşlem ya da tetkikin faturadaki ICD-10 tanısıyla gerekçelenmesi.", status: "built" },
        { title: "Tıbbi malzeme ve ilaç koşulları", checks: "Rapor şartı, ön onay belgesi, kullanım sınırı ve tekrar aralığı.", status: "missing" },
      ],
      rulebookLabel: "Mevzuat sürümü ve kaynaklar",
      rulebookMeta: "SUT, ekleri ve güncelleme yöntemi",
      rulebook: [
        { label: "Esas metin", value: "Sağlık Uygulama Tebliği (SUT)" },
        { label: "Değişiklik sürümü", value: "Henüz sabitlenmedi; pilot öncesi kurumla birlikte sabitlenir." },
        { label: "Kaynaklar", value: "SUT ekleri (EK-2B hizmet başı, EK-2C tanıya dayalı paket), paket tanımları, kurum sözleşmesi." },
        { label: "Güncelleme", value: "Her SUT değişikliği yeni bir kural seti sürümüdür; geçmiş karar kendi sürümüyle yeniden üretilir." },
      ],
      note: { before: "Düzlemlerin ayrıntısı ve skorun nasıl toplandığı", link: "SUT fatura denetimi", after: "sayfasında." },
    },
    trace: {
      label: "İzlenebilirlik ve erişim",
      title: "Kim, neyi, hangi kurala göre karar verdi.",
      intro:
        "Bir kararı savunabilmek için hangi veriyle, hangi kural sürümüyle ve kimin tarafından verildiğini gösterebilmek gerekir. Aşağıda prototipte gösterilenle tasarım hedefi olan ayrı yazıldı. Çok kurumlu çalışan bir Shield servisi yok.",
      statusLabels: { shown: "Prototipte gösteriliyor", goal: "Tasarım hedefi" },
      statusMeaning: {
        shown: "Tarayıcıdaki örnek konsolda kurgusal veriyle çalışır. Bir kurum ortamında denenmedi.",
        goal: "Mimaride tanımlı; prototipte yok.",
      },
      columns: { capability: "Yetenek", detail: "Ayrıntı", status: "Durum" },
      rows: [
        { name: "Yalnızca ekleme yapılan karar kaydı", detail: "Örnek konsolda her karar yeni bir satır olarak eklenir ve bir önceki satırın özetini taşır (tarayıcıda hesaplanan FNV-1a özeti).", status: "shown" },
        { name: "Tam bağlam", detail: "Her kayıtta kural seti sürümü, girdinin özeti, skorun bileşenleri, kararı veren kişi ve zaman.", status: "goal" },
        { name: "Yeniden üretilebilirlik", detail: "Geçmiş bir kararın o günkü kural sürümü ve veriyle aynen yeniden üretilmesi.", status: "goal" },
        { name: "Dışa aktarım", detail: "Kayıtların iç ve dış denetim için yapılandırılmış biçimde dışa aktarılması.", status: "goal" },
        { name: "Kurum bazında veri izolasyonu", detail: "Her kurumun verisi, kuyruğu ve kaydı ayrı; kurum kimliği her sorguda zorunlu.", status: "goal", id: "izolasyon" },
        { name: "Rol bazlı erişim", detail: "Kim neyi görebileceği role göre, en az yetki ilkesiyle belirlenir.", status: "goal" },
      ],
      rolesLabel: "Örnek rol tanımları",
      rolesMeta: "kurum yöneticisi, gelir analisti, inceleme uzmanı, denetçi",
      roles: [
        { role: "Kurum yöneticisi", scope: "Kullanıcıları, rolleri ve eşikleri ayarlar", access: "Yönetim" },
        { role: "Gelir analisti", scope: "Kuyruğu, raporları ve eğilimleri görür", access: "Okuma" },
        { role: "İnceleme uzmanı", scope: "Kuyruktaki kalemler için karar verir", access: "Karar" },
        { role: "Denetçi", scope: "Kayıtları ve karar geçmişini inceler", access: "Salt okunur" },
      ],
      rolesNote: "Roller kurumun ihtiyacına göre ayarlanır. Shield tanı koymaz ve tedavi kararı vermez; yalnızca faturalama ve provizyon süreçlerinde çalışır.",
      consoleLabel: "Örnek inceleme konsolu",
      consoleMeta: "kuyruk, kural katkıları, uzman kararı ve denetim kaydı; kurgusal veri",
      consoleSteps: [
        "Kuyruktan bir talep seçin; skoru oluşturan kurallar listelenir.",
        "Onaylayın, düzeltmeye gönderin ya da gönderimi durdurun.",
        "Kararınız denetim kaydına yeni bir satır olarak eklenir.",
      ],
    },
    retro: {
      label: "Doğrulama planı",
      title: "Geçmiş faturalarla ölçülecek; henüz başlamadı.",
      intro:
        "Bu bir plandır. Hiçbir kurumla retrospektif çalışma yapılmadı ve aşağıdaki oranlar için ölçülmüş bir değer yok. Plana göre Shield, bir kurumun anonimleştirilmiş geçmiş faturalarında SGK'nın gerçek kararlarıyla karşılaştırılacak.",
      steps: [
        {
          title: "Veri kurum altyapısında işlenir",
          body: "Anonimleştirilmiş geçmiş faturalar ve SGK sonuçları kurumun altyapısında işlenir ve dışarı çıkarılmaz. Veri işleme koşulları gerekli taraflar ve yetkili hukuk danışmanlarıyla netleştirilir.",
        },
        { title: "Kör çalıştırma", body: "Shield faturaları gönderim öncesindeki hâliyle kontrol eder. SGK'nın verdiği ret ve kesinti kararlarını görmez." },
        { title: "Karşılaştırma", body: "Shield'ın işaretlediği kalemler SGK'nın gerçek kararlarıyla kalem kalem karşılaştırılır." },
        { title: "Ortak rapor", body: "Oranlar, kaçırılan red nedenleri ve kural seti sürümü kurumla birlikte raporlanır." },
      ],
      metricsTitle: "Ölçülecek oranlar",
      metrics: [
        { name: "Red yakalama oranı", definition: "SGK'nın reddettiği veya kestiği kalemlerden Shield'ın gönderim öncesi işaretlediklerinin oranı." },
        { name: "Yanlış pozitif oranı", definition: "Sorunsuz ödenen kalemlerden Shield'ın yine de işaretlediklerinin oranı." },
        { name: "Pozitif prediktif değer", definition: "İşaretlenen kalemlerden gerçekten reddedilen veya kesilenlerin oranı." },
        { name: "İnceleme yükü", definition: "Uzman kuyruğuna düşen kalemlerin toplam kalemlere oranı." },
      ],
      note: "İlk değerler bir kurumun geçmiş faturalarında ölçüldüğünde, kurumun onayıyla yayımlanır.",
    },
    collab: {
      label: "İş birliği",
      title: "Faturalama ekipleri ve araştırmacılarla görüşmek istiyoruz.",
      intro:
        "Hastane faturalama ve gelir döngüsü birimleri, provizyon ekipleri ve bu alanda çalışan araştırmacılarla tanışmak istiyoruz. İlk adım 15 dakikalık bir görüşmedir ve bir taahhüt istemez.",
      modes: [
        { title: "Tanışma ve demo", body: "15 dakika. Ekibinizin red nedenlerini ve Shield'ın bugünkü durumunu konuşuruz.", link: "15 dk tanışma görüşmesi" },
        { title: "Araştırma iş birliği", body: "Fatura reddi, kural yönetimi ve değerlendirme yöntemi üzerine akademik çalışma.", link: "Araştırma için yazın" },
        { title: "Retrospektif pilot", body: "Kapsam ve veri koşulları bağlayıcı olmayan bir Niyet Mektubu (LOI) ile yazılır.", link: "Pilot başvurusu (LOI)" },
      ],
      legal:
        "Shield, Tarık Ziya Eren'in bağımsız projesidir. LavieuxLabs henüz şirketleşmedi. Niyet Mektubu (LOI) bağlayıcı değildir ve bir sözleşme yerine geçmez. Bir doğrulama çalışmasında sözleşmeyi hangi tarafın imzalayacağı ve veri işleme koşulları, gerekli taraflar ve yetkili hukuk danışmanlarıyla netleştirilir.",
      audiencesTitle: "Kimlerle çalışmak istiyoruz",
      audiences: [
        "Hastane faturalama ve gelir döngüsü birimleri",
        "Provizyon ve SGK geri ödeme ekipleri",
        "Sağlık finansmanı ve faturalama üzerine çalışan araştırmacılar",
      ],
      email: "E-posta:",
      noData: "İlk görüşmede fatura veya hasta verisi paylaşmanız gerekmez.",
    },
  },
  en: {
    crumbs: { home: "Home", products: "Projects", aria: "Breadcrumb" },
    hero: {
      title: "Claim audit software that shows rejection risk on a hospital claim before it is submitted.",
      lead: "Shield checks claim and provision line items before submission against SUT (Turkey's reimbursement rulebook) and SGK (Social Security Institution) rules. A risky item goes to the billing specialist with the rule it triggered; the specialist decides.",
      owner: "An independent project by Tarık Ziya Eren · presented on the LavieuxLabs website · prototype",
      primary: "15-minute intro call",
      secondary: "Review an example claim",
      summaryTitle: "At a glance",
      summary: [
        { label: "Ownership", value: "An independent project by Tarık Ziya Eren. Presented on the LavieuxLabs website; not a joint team project." },
        { label: "Stage", value: "Prototype" },
        { label: "Rules", value: "Three of four audit planes are implemented and tested on synthetic claims." },
        { label: "Validation on real claims", value: "Not done yet. Shield has not been run on any institution's claims." },
        { label: "Scope", value: "Billing and provision. It does not diagnose or make treatment decisions." },
      ],
      onPage: "On this page",
    },
    sections: [
      { id: "problem", label: "Problem" },
      { id: "mimari", label: "How it works" },
      { id: "simulator", label: "Example review" },
      { id: "kapsam", label: "Rule coverage" },
      { id: "denetim", label: "Traceability and access" },
      { id: "retrospektif", label: "Validation plan" },
      { id: "is-birligi", label: "Collaboration" },
    ],
    problem: {
      label: "Problem",
      title: "A rejection found after submission means an appeal and a resubmission.",
      intro:
        "Some rejections come from preventable errors: missing documents, code mismatches and exceeded limits. A rule can catch them before submission and state the reason.",
      items: [
        {
          title: "Rejections arrive late",
          body: "A rejection usually comes after the claim has been sent. Appeal, correction and resubmission delay payment and take up the team's time.",
        },
        {
          title: "The rules change often",
          body: "SUT, package definitions and payer contracts are updated often. Tracking them from memory leads different people to handle the same item differently.",
        },
        {
          title: "A score without a reason is not useful",
          body: "A score that does not say why an item is risky does not tell the team what to do and cannot be defended in an audit.",
        },
      ],
    },
    flow: {
      label: "How it works",
      title: "How a claim line passes through Shield.",
      intro:
        "Shield does not replace the billing system. It runs just before submission, checks the line item against rules and shows an item over the threshold to a specialist. It never decides on submission by itself.",
      steps: ["Claim line", "SUT/SGK check", "Risky item", "Specialist review"],
      item: "Cardiology, coronary angiography",
      diagnosis: "Diagnosis M54.5, low back pain",
      documents: "No pre-approval document, discharge summary signed",
      rules: {
        mismatch: "The diagnosis does not justify this procedure",
        preapproval: "No pre-approval document on file",
        repeat: "Same procedure again within 30 days",
        unsigned: "Discharge summary unsigned",
      },
      ruleCount: (fired, all) => `${fired} of the ${all} rules in the example rule set fired.`,
      score: "Rule score",
      threshold: (t) => `threshold ${t}`,
      review: "Goes to the specialist's queue",
      below: "Below the threshold",
      decisions: ["Approves", "Sends for correction", "Holds the submission"],
      decisionNote: "The decision and its reason are written to the log with the item.",
      caption:
        "Example item and fictional rule set; the ICD-10 code is real. The score is the sum of the rules that fired, not a probability of SGK rejection.",
      open: "Open this item in the simulator",
    },
    sim: {
      label: "Example review",
      title: "Change the line item and watch the score change.",
      intro:
        "Change the department and line item, the diagnosis code and the document status. The rule engine recalculates the score and lists how much each rule contributed. Items scoring 40 or more go to the specialist's queue.",
      notTitle: "What the score is not",
      not: [
        { title: "Not a probability of SGK rejection", body: "It is the sum of the weights of the rules that fired, not a measured probability." },
        { title: "Not a savings estimate", body: "It does not calculate financial loss, recovery or savings." },
        { title: "Not the real rule set", body: "The rules and weights in this example are fictional. Real rules come from SUT, package definitions and the institution's contract." },
      ],
    },
    scope: {
      label: "Rule coverage",
      title: "Which rules are built, and which are not yet.",
      intro:
        "Three of the four audit planes are implemented in the rule engine and pass automated tests on synthetic claims. None has been validated on a real institution's claims yet.",
      columns: { plane: "Audit plane", checks: "What it checks", status: "Status" },
      statusLabels: { built: "Implemented, tested on synthetic claims", missing: "Not implemented yet" },
      planes: [
        { title: "Department and physician authority", checks: "For procedures and drugs tied to a specialty, the physician's department on the claim.", status: "built" },
        { title: "Duplicate procedures and package limits", checks: "The same test repeated on the same day, an item already in a package billed separately, a stay longer than the package limit.", status: "built" },
        { title: "Diagnosis–procedure consistency", checks: "Whether a procedure or test is justified by the ICD-10 diagnosis on the claim.", status: "built" },
        { title: "Medical supply and drug conditions", checks: "Report requirement, prior approval, usage limit and repeat interval.", status: "missing" },
      ],
      rulebookLabel: "Regulation version and sources",
      rulebookMeta: "SUT, its annexes and how updates work",
      rulebook: [
        { label: "Base text", value: "Health Implementation Communiqué (SUT)" },
        { label: "Amendment", value: "Not pinned yet; pinned with the institution before a pilot." },
        { label: "Sources", value: "SUT annexes (EK-2B fee-for-service, EK-2C diagnosis-based package), package definitions, institution contract." },
        { label: "Updates", value: "Each SUT amendment becomes a new rule set version; a past decision is reproduced with its own version." },
      ],
      note: { before: "The planes and how the score adds up are described on the", link: "SUT billing audit", after: "page." },
    },
    trace: {
      label: "Traceability and access",
      title: "Who decided what, under which rule.",
      intro:
        "To defend a decision, you need to show what data it used, which rule version applied and who made it. Below, what the prototype shows is kept apart from what is a design goal. No multi-institution Shield service is running.",
      statusLabels: { shown: "Shown in the prototype", goal: "Design goal" },
      statusMeaning: {
        shown: "Works in the example console in the browser, on fictional data. Not tried in an institution's environment.",
        goal: "Defined in the architecture; not in the prototype.",
      },
      columns: { capability: "Capability", detail: "Detail", status: "Status" },
      rows: [
        { name: "Append-only decision log", detail: "In the example console each decision is added as a new row and carries the digest of the row before it (an FNV-1a digest computed in the browser).", status: "shown" },
        { name: "Full context", detail: "Each entry holds the rule set version, a digest of the input, the score components, who decided and when.", status: "goal" },
        { name: "Reproducibility", detail: "A past decision reproduced exactly with that day's rule version and data.", status: "goal" },
        { name: "Export", detail: "Entries exported in a structured format for internal and external audit.", status: "goal" },
        { name: "Per-institution data isolation", detail: "Each institution's data, queue and log kept apart; an institution ID required on every query.", status: "goal", id: "izolasyon" },
        { name: "Role-based access", detail: "Roles decide who can see what, with least privilege.", status: "goal" },
      ],
      rolesLabel: "Example roles",
      rolesMeta: "institution admin, revenue analyst, review specialist, auditor",
      roles: [
        { role: "Institution admin", scope: "Sets up users, roles and thresholds", access: "Admin" },
        { role: "Revenue analyst", scope: "Sees the queue, reports and trends", access: "Read" },
        { role: "Review specialist", scope: "Decides on items in the queue", access: "Decide" },
        { role: "Auditor", scope: "Reviews logs and decision history", access: "Read-only" },
      ],
      rolesNote: "Roles are configured to fit the institution. Shield does not diagnose or make treatment decisions. It works only in billing and pre-authorisation.",
      consoleLabel: "Example review console",
      consoleMeta: "queue, rule contributions, specialist decision and audit log; fictional data",
      consoleSteps: [
        "Select a claim in the queue to list the rules behind its score.",
        "Approve it, send it for correction or hold the submission.",
        "Your decision is added to the audit log as a new row.",
      ],
    },
    retro: {
      label: "Validation plan",
      title: "It will be measured on past claims; this has not started.",
      intro:
        "This is a plan. No retrospective study has been run with any institution, and there are no measured values for the rates below. Under the plan, Shield will be compared with SGK's actual decisions on an institution's anonymised historical claims.",
      steps: [
        {
          title: "Data is processed on site",
          body: "Anonymised historical claims and SGK outcomes are processed in the institution's infrastructure and do not leave it. The data processing terms are settled with the parties involved and their authorised legal advisers.",
        },
        { title: "Blind run", body: "Shield checks the claims as they were before submission. It does not see SGK's rejection and deduction decisions." },
        { title: "Comparison", body: "Each item Shield flagged is compared line by line with SGK's actual decisions." },
        { title: "Joint report", body: "The rates, the missed rejection reasons and the rule set version are reported jointly with the institution." },
      ],
      metricsTitle: "Rates to be measured",
      metrics: [
        { name: "Rejection catch rate", definition: "Of the items SGK rejected or cut, the share Shield flagged before submission." },
        { name: "False positive rate", definition: "Of the items paid without issue, the share Shield still flagged." },
        { name: "Positive predictive value", definition: "Of the flagged items, the share that was actually rejected or cut." },
        { name: "Review load", definition: "Items sent to the specialist queue as a share of all items." },
      ],
      note: "The first values will be published with the institution's consent once they have been measured on its historical claims.",
    },
    collab: {
      label: "Collaboration",
      title: "We would like to talk with billing teams and researchers.",
      intro:
        "We would like to meet hospital billing and revenue cycle units, pre-authorisation teams and researchers working in this area. The first step is a 15-minute call, with no commitment.",
      modes: [
        { title: "Intro and demo", body: "15 minutes. We talk about your team's rejection reasons and where Shield stands today.", link: "15-minute intro call" },
        { title: "Research collaboration", body: "Academic work on claim rejection, rule management and evaluation method.", link: "Write about research" },
        { title: "Retrospective pilot", body: "Scope and data conditions are written in a non-binding Letter of Intent (LOI).", link: "Apply for a pilot (LOI)" },
      ],
      legal:
        "Shield is an independent project by Tarık Ziya Eren. LavieuxLabs is not incorporated yet. A Letter of Intent (LOI) is non-binding and does not replace an agreement. For a validation study, which party signs the agreement and the data processing terms are settled with the parties involved and their authorised legal advisers.",
      audiencesTitle: "Who we would like to work with",
      audiences: [
        "Hospital billing and revenue cycle units",
        "Pre-authorisation and SGK reimbursement teams",
        "Researchers working on healthcare financing and billing",
      ],
      email: "Email:",
      noData: "You do not need to share claim or patient data in the first conversation.",
    },
  },
});

const TRACES: Trace[] = ["shown", "goal"];

export default function ShieldView({ locale }: { locale: Locale }) {
  const c = copy[locale];
  const href = (path: string) => localizedPath(locale, path);
  const { triggered, score } = scoreClaim(EXAMPLE.item, EXAMPLE.icd, EXAMPLE.checks);
  const review = score >= THRESHOLD;

  return (
    <main id="main" className="surface-paper relative flex-1 bg-paper text-ink">
      <JsonLd data={shieldJsonLd(locale)} />
      <RevealHashTarget />

      {/* Hero: what Shield is, whose project it is, where it stands. */}
      <section aria-labelledby="hero-title" className="pt-16">
        <div className="mx-auto grid max-w-7xl gap-x-10 gap-y-6 px-4 pt-5 pb-12 sm:gap-y-8 sm:px-6 sm:pt-14 sm:pb-16 lg:grid-cols-12 lg:gap-y-10 lg:px-8">
          <nav aria-label={c.crumbs.aria} className="lg:col-span-12">
            <ol className="flex flex-wrap items-center gap-1 text-[14px] text-ink-3">
              <li>
                <Link href={href("/")} className={`-my-3 inline-block py-3 ${LINK}`}>
                  {c.crumbs.home}
                </Link>
              </li>
              <li aria-hidden="true">
                <ChevronRight className="h-3.5 w-3.5" strokeWidth={1.8} />
              </li>
              <li>
                <Link href={href("/#platformlar")} className={`-my-3 inline-block py-3 ${LINK}`}>
                  {c.crumbs.products}
                </Link>
              </li>
              <li aria-hidden="true">
                <ChevronRight className="h-3.5 w-3.5" strokeWidth={1.8} />
              </li>
              <li aria-current="page" className="text-ink-2" lang="en">
                Shield
              </li>
            </ol>
          </nav>

          <div className="lg:col-span-8">
            <p className="flex items-center gap-2.5">
              <ShieldCheck className="h-5 w-5 shrink-0 text-ink" strokeWidth={1.6} aria-hidden="true" />
              <span className="font-serif text-[20px] font-medium text-indigo-700" lang="en">
                Shield
              </span>
            </p>
            <p className="mt-2 text-[14px] leading-snug text-ink-2">{c.hero.owner}</p>
            <h1
              id="hero-title"
              className="mt-3 max-w-[22ch] font-serif text-[30px] leading-[1.08] font-medium tracking-[-0.022em] text-ink sm:mt-4 sm:text-[46px] lg:text-[54px]"
            >
              {c.hero.title}
            </h1>
            <p className="mt-4 max-w-[62ch] text-[16px] leading-[1.6] text-ink-2 sm:mt-5 sm:text-[17px]">{c.hero.lead}</p>
            <div className="mt-6 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:flex-wrap sm:items-center print:hidden">
              <Link href={href(contactHref("intro", "shield"))} className={BUTTON}>
                {c.hero.primary}
              </Link>
              <a href="#simulator" className={BUTTON_OUTLINE}>
                {c.hero.secondary}
              </a>
            </div>
          </div>

          <aside aria-labelledby="hero-summary" className="self-end border-t-2 border-ink pt-4 lg:col-span-4">
            <h2 id="hero-summary" className="font-serif text-[20px] font-semibold text-ink">
              {c.hero.summaryTitle}
            </h2>
            <dl className="mt-3 divide-y divide-rule border-t border-rule">
              {c.hero.summary.map((r) => (
                <div key={r.label} className="grid grid-cols-[120px_minmax(0,1fr)] gap-3 py-2.5 lg:grid-cols-1 lg:gap-0.5">
                  <dt className="text-[13px] text-ink-3">{r.label}</dt>
                  <dd className="text-[14px] leading-snug text-ink">{r.value}</dd>
                </div>
              ))}
            </dl>
          </aside>

          <nav aria-label={c.hero.onPage} className="border-t border-rule pt-4 lg:col-span-12 print:hidden">
            <p className="font-serif text-[15px] text-ink-3">{c.hero.onPage}</p>
            <ul className="mt-1 flex flex-wrap gap-x-6">
              {c.sections.map((s) => (
                <li key={s.id}>
                  <a href={`#${s.id}`} className={`inline-flex min-h-11 items-center text-[15px] text-ink-2 hover:text-ink ${LINK}`}>
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </section>

      {/* Problem: three problems in prose next to a claim's path today. */}
      <PaperSection id="problem" label={c.problem.label} title={c.problem.title} intro={<p>{c.problem.intro}</p>}>
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
          <dl className="space-y-6 lg:col-span-6">
            {c.problem.items.map((p) => (
              <div key={p.title} className="border-t border-ink pt-4">
                <dt className="text-[17px] font-semibold text-ink">{p.title}</dt>
                <dd className="mt-2 text-[15px] leading-[1.6] text-ink-2">{p.body}</dd>
              </div>
            ))}
          </dl>
          <div className="min-w-0 lg:col-span-6">
            <ClaimPathFigure locale={locale} />
          </div>
        </div>
      </PaperSection>

      {/* How it works: one line item's path as a ruled four-column ledger, computed from the example rule set. */}
      <PaperSection id="mimari" label={c.flow.label} title={c.flow.title} intro={<p>{c.flow.intro}</p>} band>
        <Figure
          caption={
            <>
              {c.flow.caption}{" "}
              <a href={EXAMPLE_QUERY} className={`text-ink-2 ${LINK}`}>
                {c.flow.open}
              </a>
            </>
          }
        >
          <ol className="grid gap-0 md:grid-cols-4 md:divide-x md:divide-rule">
            {c.flow.steps.map((step, i) => (
              <li key={step} className="border-t border-rule py-4 first:border-t-0 first:pt-0 md:border-t-0 md:px-5 md:py-0 md:first:pl-0 md:last:pr-0">
                <p className="flex items-baseline gap-2">
                  <span className="font-serif text-[22px] leading-none text-ink-3 tabular-nums">{i + 1}</span>
                  <span className="text-[15px] font-semibold text-ink">{step}</span>
                </p>
                <div className="mt-3 text-[14px] leading-snug">
                  {i === 0 && (
                    <>
                      <p className="text-ink">{c.flow.item}</p>
                      <p className="mt-1 text-ink-2">{c.flow.diagnosis}</p>
                      <p className="mt-1 text-ink-2">{c.flow.documents}</p>
                    </>
                  )}
                  {i === 1 && (
                    <>
                      <ul className="divide-y divide-rule border-y border-rule">
                        {triggered.map((k) => (
                          <li key={k} className="grid grid-cols-[minmax(0,1fr)_36px] items-baseline gap-2 py-2">
                            <span className="text-ink-2">{c.flow.rules[k]}</span>
                            <span className="text-right font-mono text-ink tabular-nums">+{RULES[k].weight}</span>
                          </li>
                        ))}
                      </ul>
                      <p className="mt-2 text-[13px] text-ink-3">{c.flow.ruleCount(triggered.length, Object.keys(RULES).length)}</p>
                    </>
                  )}
                  {i === 2 && (
                    <>
                      <p className="flex items-baseline gap-2">
                        <span className="text-ink-2">{c.flow.score}</span>
                        <span className={`font-mono text-[22px] tabular-nums ${review ? "text-amber-700" : "text-ink"}`}>{score}</span>
                        <span className="text-[13px] text-ink-3">/ 100, {c.flow.threshold(THRESHOLD)}</span>
                      </p>
                      <p className={`mt-2 font-medium ${review ? "text-amber-700" : "text-ink-2"}`}>{review ? c.flow.review : c.flow.below}</p>
                    </>
                  )}
                  {i === 3 && (
                    <>
                      <ul className="space-y-1 text-ink">
                        {c.flow.decisions.map((d) => (
                          <li key={d}>{d}</li>
                        ))}
                      </ul>
                      <p className="mt-2 text-ink-2">{c.flow.decisionNote}</p>
                    </>
                  )}
                </div>
              </li>
            ))}
          </ol>
        </Figure>
      </PaperSection>

      {/* Example review: the claim simulator is the page's main tool, on a dark workspace. */}
      <PaperSection id="simulator" label={c.sim.label} title={c.sim.title} intro={<p>{c.sim.intro}</p>}>
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-4">
            <h3 className="font-serif text-[20px] font-medium text-ink">{c.sim.notTitle}</h3>
            <dl className="mt-3 divide-y divide-rule border-y border-rule">
              {c.sim.not.map((x) => (
                <div key={x.title} className="py-3">
                  <dt className="text-[15px] font-semibold text-ink">{x.title}</dt>
                  <dd className="mt-1 text-[14px] leading-[1.55] text-ink-2">{x.body}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="panel-dark min-w-0 [color-scheme:dark] lg:col-span-8">
            <ClaimSimulator locale={locale} />
          </div>
        </div>
      </PaperSection>

      {/* Rule coverage: four planes with their real status; regulation sources on demand. */}
      <PaperSection id="kapsam" label={c.scope.label} title={c.scope.title} intro={<p>{c.scope.intro}</p>} band>
        <table className="hidden w-full border-collapse text-left text-[15px] md:table">
          <thead>
            <tr className="border-b border-ink text-[13px] text-ink-3">
              <th scope="col" className="w-[30%] py-2.5 pr-4 font-medium">{c.scope.columns.plane}</th>
              <th scope="col" className="py-2.5 pr-4 font-medium">{c.scope.columns.checks}</th>
              <th scope="col" className="w-[26%] py-2.5 font-medium">{c.scope.columns.status}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-rule border-b border-rule">
            {c.scope.planes.map((p) => (
              <tr key={p.title} className="align-top">
                <th scope="row" className="py-3.5 pr-4 text-left font-medium text-ink">{p.title}</th>
                <td className="py-3.5 pr-4 leading-snug text-ink-2">{p.checks}</td>
                <td className={`py-3.5 leading-snug ${planeTone[p.status]}`}>{c.scope.statusLabels[p.status]}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <ul className="divide-y divide-rule border-y border-rule md:hidden">
          {c.scope.planes.map((p) => (
            <li key={p.title} className="py-3">
              <p className="text-[15px] font-medium text-ink">{p.title}</p>
              <p className={`mt-0.5 text-[14px] ${planeTone[p.status]}`}>{c.scope.statusLabels[p.status]}</p>
              <p className="mt-1 text-[14px] leading-snug text-ink-2">{p.checks}</p>
            </li>
          ))}
        </ul>
        <div className="mt-6">
          <Disclosure summary={c.scope.rulebookLabel} meta={c.scope.rulebookMeta}>
            <FactRows rows={c.scope.rulebook} />
          </Disclosure>
        </div>
        <p className="mt-4 text-[15px] leading-[1.6] text-ink-2">
          {c.scope.note.before}{" "}
          <Link href={href("/standartlar/sut-fatura-denetimi")} className={`text-ink ${LINK}`}>
            {c.scope.note.link}
          </Link>{" "}
          {c.scope.note.after}
        </p>
      </PaperSection>

      {/* Traceability and access: prototype behaviour apart from design goals; roles and the console on demand. */}
      <PaperSection id="denetim" label={c.trace.label} title={c.trace.title} intro={<p>{c.trace.intro}</p>}>
        <div className="grid gap-8 lg:grid-cols-12 lg:gap-12">
          <dl className="grid content-start gap-4 lg:col-span-4">
            {TRACES.map((s) => (
              <div key={s} className="border-t border-ink pt-3">
                <dt className={`text-[15px] ${traceTone[s]}`}>{c.trace.statusLabels[s]}</dt>
                <dd className="mt-1 text-[14px] leading-[1.55] text-ink-2">{c.trace.statusMeaning[s]}</dd>
              </div>
            ))}
          </dl>
          <div className="min-w-0 lg:col-span-8">
            <ul className="divide-y divide-rule border-y border-ink">
              {c.trace.rows.map((r) => (
                <li key={r.name} id={r.id} className="grid scroll-mt-20 gap-1 py-3 sm:grid-cols-[minmax(0,0.9fr)_minmax(0,1.4fr)_minmax(0,0.7fr)] sm:gap-4">
                  <p className="text-[15px] font-medium text-ink">{r.name}</p>
                  <p className="text-[14px] leading-snug text-ink-2">{r.detail}</p>
                  <p className={`text-[14px] sm:text-right ${traceTone[r.status]}`}>{c.trace.statusLabels[r.status]}</p>
                </li>
              ))}
            </ul>
            <div className="mt-6 space-y-2">
              <Disclosure summary={c.trace.rolesLabel} meta={c.trace.rolesMeta}>
                <dl className="divide-y divide-rule border-y border-rule">
                  {c.trace.roles.map((r) => (
                    <div key={r.role} className="grid gap-1 py-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:gap-6">
                      <dt>
                        <span className="block text-[15px] font-medium text-ink">{r.role}</span>
                        <span className="block text-[13px] leading-snug text-ink-3">{r.scope}</span>
                      </dt>
                      <dd className="text-[14px] text-ink-2 sm:text-right">{r.access}</dd>
                    </div>
                  ))}
                </dl>
                <p className="mt-3 text-[14px] leading-snug text-ink-2">{c.trace.rolesNote}</p>
              </Disclosure>
              <Disclosure summary={c.trace.consoleLabel} meta={c.trace.consoleMeta}>
                {/* #konsol sits inside the disclosure, so a link to it opens the disclosure (browser fragment navigation). */}
                <div id="konsol" className="scroll-mt-20">
                  <ol className="mb-4 list-decimal space-y-1 pl-5 text-[14px] leading-snug text-ink-2 marker:text-ink-3">
                    {c.trace.consoleSteps.map((s) => (
                      <li key={s}>{s}</li>
                    ))}
                  </ol>
                  <div className="panel-dark min-w-0 [color-scheme:dark]">
                    <ShieldConsole locale={locale} />
                  </div>
                </div>
              </Disclosure>
            </div>
          </div>
        </div>
      </PaperSection>

      {/* Validation plan: written as a plan; nothing here has been measured. */}
      <PaperSection id="retrospektif" label={c.retro.label} title={c.retro.title} intro={<p>{c.retro.intro}</p>} band>
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
          <ol className="space-y-5 lg:col-span-6">
            {c.retro.steps.map((s, i) => (
              <li key={s.title} className="grid grid-cols-[32px_minmax(0,1fr)] gap-4">
                <span aria-hidden="true" className="font-serif text-[26px] leading-none text-ink-3 tabular-nums">
                  {i + 1}
                </span>
                <div>
                  <h3 className="text-[17px] font-semibold text-ink">{s.title}</h3>
                  <p className="mt-1 text-[15px] leading-[1.6] text-ink-2">{s.body}</p>
                </div>
              </li>
            ))}
          </ol>
          <div className="min-w-0 lg:col-span-6">
            <h3 className="font-serif text-[20px] font-medium text-ink">{c.retro.metricsTitle}</h3>
            <dl className="mt-3 divide-y divide-rule border-y border-rule">
              {c.retro.metrics.map((m) => (
                <div key={m.name} className="py-3">
                  <dt className="text-[15px] font-medium text-ink">{m.name}</dt>
                  <dd className="mt-0.5 text-[14px] leading-snug text-ink-2">{m.definition}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-3 text-[14px] leading-snug text-ink-3">{c.retro.note}</p>
          </div>
        </div>
      </PaperSection>

      {/* Collaboration: three ways in, with the legal position stated plainly. */}
      <PaperSection id="is-birligi" label={c.collab.label} title={c.collab.title} intro={<p>{c.collab.intro}</p>}>
        <div className="grid gap-8 md:grid-cols-3">
          {c.collab.modes.map((mode, i) => (
            <div key={mode.title} className="flex flex-col border-t-2 border-ink pt-5">
              <h3 className="font-serif text-[24px] leading-tight font-medium text-ink">{mode.title}</h3>
              <p className="mt-3 text-[15px] leading-[1.6] text-ink-2">{mode.body}</p>
              <Link
                href={href(i === 0 ? contactHref("intro", "shield") : i === 1 ? contactHref("academic") : contactHref("pilot", "shield"))}
                className={`mt-3 self-start md:mt-auto md:pt-3 ${TEXT_ACTION}`}
              >
                {mode.link}
              </Link>
            </div>
          ))}
        </div>
        <p className="mt-8 max-w-[70ch] border-l-2 border-ink pl-4 text-[15px] leading-[1.6] text-ink">{c.collab.legal}</p>
        <div className="mt-10 grid gap-8 border-t border-rule pt-8 md:grid-cols-2 md:gap-12">
          <div>
            <h3 className="text-[17px] font-semibold text-ink">{c.collab.audiencesTitle}</h3>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-[15px] leading-[1.55] text-ink-2 marker:text-ink-3">
              {c.collab.audiences.map((a) => (
                <li key={a}>{a}</li>
              ))}
            </ul>
          </div>
          <div className="flex flex-col gap-3">
            <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[15px] text-ink-2">
              {c.collab.email}
              <CopyEmail locale={locale} tone="paper" className="min-h-11 text-ink" />
            </p>
            <p className="text-[14px] text-ink-3">{c.collab.noData}</p>
          </div>
        </div>
      </PaperSection>
    </main>
  );
}
