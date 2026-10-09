"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Binary, FileText, History, LockKeyhole, Network, UserCheck } from "lucide-react";

const standards = [
  {
    code: "STD-01",
    icon: Binary,
    title: "Sıfır halüsinasyon",
    body: "Klinik ve operasyonel karar yolunda üretken model çıktısı yer almaz. Her uyarı, sürümlenmiş ve izlenebilir bir kuraldan türetilir; aynı girdi her zaman aynı çıktıyı üretir.",
    mechanism: "Deterministik kural motoru",
  },
  {
    code: "STD-02",
    icon: History,
    title: "Değiştirilemez denetim izi",
    body: "Her değerlendirme, karar ve kullanıcı müdahalesi yalnızca eklenebilir kayıtlara yazılır. Kayıtlar sonradan düzenlenemez; karar bağlamı denetim anında eksiksiz yeniden kurulabilir.",
    mechanism: "Append-only audit log",
  },
  {
    code: "STD-03",
    icon: UserCheck,
    title: "İnsan denetimi",
    body: "Sistemler öneri ve risk sinyali üretir; nihai kararı yetkili klinisyen veya operasyon uzmanı verir. Onay, ret ve gerekçe aynı kayıt zincirine bağlanır.",
    mechanism: "Human-in-the-loop",
  },
  {
    code: "STD-04",
    icon: FileText,
    title: "Açıklanabilirlik",
    body: "Her risk skoru ve uyarı; tetikleyen kural, etkilenen parametre ve eşik değeriyle birlikte sunulur. Gerekçesi gösterilemeyen skor üretilmez.",
    mechanism: "Bileşen bazlı skor açıklaması",
  },
  {
    code: "STD-05",
    icon: Network,
    title: "Birlikte çalışabilirlik",
    body: "Klinik veri modeli HL7 FHIR R4 kaynakları üzerine kurgulanır; kurumsal sistemlerle standart arayüzler üzerinden veri alışverişi hedeflenir.",
    mechanism: "HL7 FHIR R4",
  },
  {
    code: "STD-06",
    icon: LockKeyhole,
    title: "Erişim ve izolasyon",
    body: "Rol tabanlı erişim kontrolüyle her kullanıcı yalnızca yetkisi dahilindeki veriye ulaşır; multi-tenant mimaride kurum verileri birbirinden izole tutulur.",
    mechanism: "RBAC · Multi-tenant",
  },
];

export default function StandardsGrid() {
  const reduced = useReducedMotion();

  return (
    <div className="grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.08] sm:grid-cols-2 lg:grid-cols-3">
      {standards.map(({ code, icon: Icon, title, body, mechanism }, i) => (
        <motion.div
          key={code}
          initial={reduced ? false : { opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, delay: (i % 3) * 0.08 }}
          className="group relative flex flex-col bg-navy-850 p-6 transition-colors duration-150 ease-out hover:bg-navy-800 sm:p-8"
        >
          <div className="flex items-center justify-between">
            <Icon
              className="h-5 w-5 text-white/40 transition-colors duration-150 ease-out group-hover:text-teal-300"
              strokeWidth={1.6}
            />
            <span className="font-mono text-[10.5px] tracking-[0.16em] text-white/25">{code}</span>
          </div>
          <h3 className="mt-6 text-lg font-medium tracking-tight text-white">{title}</h3>
          <p className="mt-2.5 text-sm leading-relaxed text-white/55">{body}</p>
          <div className="mt-auto pt-6">
            <span className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-white/60">
              <span className="h-px w-4 bg-teal-300/50 transition-all duration-150 ease-out group-hover:w-7" />
              {mechanism}
            </span>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
