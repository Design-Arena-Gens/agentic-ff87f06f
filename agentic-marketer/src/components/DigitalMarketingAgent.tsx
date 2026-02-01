"use client";

import { useMemo, useState } from "react";

type MarketingGoal = "brand" | "lead" | "sales" | "retention";

type FormState = {
  brandName: string;
  industry: string;
  goal: MarketingGoal;
  budget: number;
  tone: string;
  audience: string;
};

type CampaignPlay = {
  id: string;
  name: string;
  description: string;
  channels: string[];
  deliverables: string[];
  kpi: string;
  budgetShare: number;
  cadence: string;
};

type WeeklyPlan = {
  day: string;
  focus: string;
  action: string;
  metric: string;
};

type Insight = {
  title: string;
  detail: string;
};

const INDUSTRY_PRESETS: Record<
  string,
  {
    differentiator: string;
    audienceAngle: string;
    quickWins: Insight[];
  }
> = {
  ecommerce: {
    differentiator:
      "Highlight kecepatan fulfillment, kemudahan checkout, dan social proof dari pelanggan.",
    audienceAngle:
      "Soroti limited-time offer dan bundling untuk menciptakan urgensi.",
    quickWins: [
      {
        title: "Optimalkan remarketing",
        detail:
          "Sinkronkan katalog produk ke Meta Ads dan jalankan kampanye dynamic product ads dengan segmentasi pengguna abandon cart.",
      },
      {
        title: "Kolaborasi influencer micro",
        detail:
          "Aktifkan 3-5 micro influencer di TikTok untuk membuat konten review produk dengan CTA voucher unik.",
      },
    ],
  },
  b2b: {
    differentiator:
      "Tekankan proof of value melalui studi kasus, demo langsung, dan ROI calculator.",
    audienceAngle:
      "Segmentasikan pesan berdasarkan persona pengambil keputusan dan champion operasional.",
    quickWins: [
      {
        title: "Bangun nurture flow",
        detail:
          "Gunakan email automation dengan konten edukasi 3 tahap: problem, solusi, bukti sosial.",
      },
      {
        title: "Retargeting berbasis intent",
        detail:
          "Kombinasikan LinkedIn Ads dan Google Display untuk audiens yang mengunjungi halaman pricing atau demo.",
      },
    ],
  },
  saas: {
    differentiator:
      "Tampilkan fitur unggulan dan manfaat kompetitif yang mempercepat workflow pengguna.",
    audienceAngle:
      "Tonjolkan success story pelanggan dengan angka yang mudah diingat.",
    quickWins: [
      {
        title: "Live onboarding webinars",
        detail:
          "Jadwalkan webinar mingguan dengan sesi Q&A dan tawarkan free extended trial bagi peserta.",
      },
      {
        title: "Product tutorial series",
        detail:
          "Produksi micro-video 60 detik untuk menonjolkan quick wins fitur dan distribusikan di social + email.",
      },
    ],
  },
  hospitality: {
    differentiator:
      "Pertegas pengalaman unik, kenyamanan, dan ulasan tamu terbaik.",
    audienceAngle:
      "Gunakan visual emosional dan cerita yang menonjolkan momen spesial.",
    quickWins: [
      {
        title: "UGC & review amplification",
        detail:
          "Kurasi konten tamu, repost di kanal social, dan gunakan sebagai bahan ads dengan CTA booking.",
      },
      {
        title: "Geo-target flash deals",
        detail:
          "Aktifkan kampanye geo-target pada radius 20km dengan penawaran staycation akhir pekan.",
      },
    ],
  },
};

const GOAL_PLAYS: Record<MarketingGoal, CampaignPlay[]> = {
  brand: [
    {
      id: "signature-story",
      name: "Signature Story Launch",
      description:
        "Bangun narasi utama brand dan distribusikan melalui konten storytelling multi-kanal.",
      channels: ["TikTok Organic", "Instagram Reels", "YouTube Shorts"],
      deliverables: ["3 video hero", "6 konten pendukung", "Landing page story"],
      kpi: "Reach, Engagement Rate, Share of Voice",
      budgetShare: 0.4,
      cadence: "Konten harian selama 10 hari pertama",
    },
    {
      id: "thought-leadership",
      name: "Thought Leadership Sprint",
      description:
        "Posisikan brand sebagai pemimpin industri melalui artikel, event online, dan PR digital.",
      channels: ["LinkedIn Ads", "Blog SEO", "Online Event"],
      deliverables: ["4 artikel pillar", "1 webinar", "Press kit"],
      kpi: "Branded Search Lift, PR Mentions",
      budgetShare: 0.35,
      cadence: "Aktivasi 2x/minggu",
    },
    {
      id: "community-flywheel",
      name: "Community Flywheel",
      description:
        "Bangun komunitas brand melalui program loyalitas dan aktivitas user-generated content.",
      channels: ["Discord/WhatsApp", "Email Community", "Instagram Stories"],
      deliverables: ["Launching campaign", "UGC challenge", "Member spotlight"],
      kpi: "Community Growth, Participation Rate",
      budgetShare: 0.25,
      cadence: "Engagement harian",
    },
  ],
  lead: [
    {
      id: "lead-magnet",
      name: "Lead Magnet Engine",
      description:
        "Kembangkan konten premium dan nurture funnel untuk mengumpulkan prospek berkualitas.",
      channels: ["LinkedIn Ads", "Meta Lead Ads", "Email Automation"],
      deliverables: ["Ebook / toolkit", "Landing page", "Email nurture 6 seri"],
      kpi: "Cost Per Lead, MQL Rate",
      budgetShare: 0.36,
      cadence: "Distribusi paid + organic mingguan",
    },
    {
      id: "webinar-pipeline",
      name: "Interactive Webinar Pipeline",
      description:
        "Sajikan webinar interaktif dengan CTA demo / konsultasi eksklusif.",
      channels: ["Zoom Webinar", "LinkedIn Live", "YouTube"],
      deliverables: ["Agenda edukatif", "Panel tamu", "Follow-up kit"],
      kpi: "Registrasi, Attendance Rate, SQL Conversion",
      budgetShare: 0.34,
      cadence: "Event utama 2x/bulan + follow-up automation",
    },
    {
      id: "conversion-ads",
      name: "Conversion Optimized Ads",
      description:
        "Drive prospek siap beli melalui ads dengan penawaran trial atau konsultasi gratis.",
      channels: ["Google Search", "Meta Ads", "Programmatic"],
      deliverables: ["Variasi ad copy", "Landing page AB test", "Form tracking"],
      kpi: "CPL, Conversion Rate, ROAS",
      budgetShare: 0.3,
      cadence: "Optimasi 2x/minggu",
    },
  ],
  sales: [
    {
      id: "promo-acceleration",
      name: "Promo Acceleration",
      description:
        "Luncurkan kampanye promosi bernilai tinggi dengan urgency dan social proof.",
      channels: ["Meta Ads", "TikTok Ads", "Push Notification"],
      deliverables: ["Offer matrix", "Countdown assets", "Promo landing"],
      kpi: "Sales Volume, ROAS, Checkout Rate",
      budgetShare: 0.4,
      cadence: "Flight 14 hari dengan daily optimization",
    },
    {
      id: "creator-collab",
      name: "Creator Collaboration Sprint",
      description:
        "Aktifkan kolaborasi dengan content creator untuk review produk dan live selling.",
      channels: ["TikTok Shop Live", "Instagram Live", "YouTube Collab"],
      deliverables: ["Brief kreatif", "Kode promo unik", "Live shopping kit"],
      kpi: "Sales Attribution, CAC, Viewers to Purchase",
      budgetShare: 0.33,
      cadence: "Live selling 3x/minggu",
    },
    {
      id: "retarget-automation",
      name: "Smart Retargeting Automation",
      description:
        "Bangun automation untuk pengguna yang mengunjungi produk namun belum checkout.",
      channels: ["Meta Ads", "Email", "SMS"],
      deliverables: ["Segmentasi audience", "Template dynamic", "Offer rotation"],
      kpi: "Return Visitor Rate, ROAS remarketing, Recovery Rate",
      budgetShare: 0.27,
      cadence: "Always-on dengan optimasi mingguan",
    },
  ],
  retention: [
    {
      id: "loyalty-loop",
      name: "Loyalty Loop",
      description:
        "Perkuat loyalitas pelanggan melalui program reward personal dan konten eksklusif.",
      channels: ["Email", "Mobile App", "Community Hub"],
      deliverables: ["Segmen loyal", "Reward path", "Playbook referral"],
      kpi: "Repeat Purchase Rate, NPS, Referral Rate",
      budgetShare: 0.34,
      cadence: "Campaign 2x/bulan + automation harian",
    },
    {
      id: "winback-series",
      name: "Winback Automations",
      description:
        "Aktifkan kembali pelanggan dorman dengan penawaran personal dan edukasi produk.",
      channels: ["Email", "SMS", "Paid Retargeting"],
      deliverables: ["Segment dorman", "3-step winback", "Offer personalization"],
      kpi: "Reactivation Rate, Revenue per user",
      budgetShare: 0.33,
      cadence: "3 gelombang selama 21 hari",
    },
    {
      id: "voice-of-customer",
      name: "Voice of Customer Program",
      description:
        "Kumpulkan feedback pelanggan dan ubah menjadi konten testimoni + improvement loop.",
      channels: ["Survey", "UGC", "Product Update Email"],
      deliverables: ["Survey tematik", "Library testimoni", "Insight report"],
      kpi: "Response Rate, CSAT, Churn Rate",
      budgetShare: 0.33,
      cadence: "Survey bulanan + konten mingguan",
    },
  ],
};

const AUDIENCE_ARCHETYPES: Record<
  string,
  { headline: string; motivators: string[]; friction: string[] }
> = {
  "profesional muda": {
    headline: "Profesional muda digital savvy yang mencari solusi serba cepat.",
    motivators: [
      "Suka efisiensi dan kemudahan akses lewat mobile",
      "Mengapresiasi brand yang punya value dan pengalaman seamless",
      "Merespons baik pesan visual dinamis dan interaktif",
    ],
    friction: [
      "Skeptis terhadap klaim berlebihan",
      "Membandingkan harga dan review sebelum action",
      "Cepat beralih jika onboarding terlalu panjang",
    ],
  },
  "pemilik bisnis": {
    headline:
      "Pemilik bisnis yang fokus pada hasil konkret dan efisiensi biaya.",
    motivators: [
      "Ingin bukti ROI dan contoh nyata keberhasilan",
      "Menghargai layanan yang responsif dan profesional",
      "Tertarik pada fitur yang otomatis dan menghemat waktu",
    ],
    friction: [
      "Hati-hati terhadap komitmen kontrak panjang",
      "Butuh jaminan support jika ada masalah",
      "Sensitif terhadap pricing yang tidak transparan",
    ],
  },
  "orang tua muda": {
    headline:
      "Orang tua muda yang mencari solusi praktis dan aman untuk keluarga.",
    motivators: [
      "Mengutamakan keamanan dan kualitas",
      "Suka rekomendasi komunitas dan testimoni",
      "Merespons promosi bundling dan penawaran hemat",
    ],
    friction: [
      "Butuh edukasi jelas sebelum mencoba produk baru",
      "Sensitif terhadap harga",
      "Mencari layanan pelanggan yang mudah dihubungi",
    ],
  },
};

const GOAL_METRICS: Record<MarketingGoal, Insight[]> = {
  brand: [
    {
      title: "Brand Lift",
      detail:
        "Targetkan kenaikan 25% di pencarian bermerek dalam 8 minggu. Pantau Google Trends + Search Console.",
    },
    {
      title: "Engagement Deep Dive",
      detail:
        "Optimalkan format konten storytelling yang mencapai >8% engagement rate di TikTok & Instagram.",
    },
  ],
  lead: [
    {
      title: "Lead Quality Framework",
      detail:
        "Gunakan kriteria MQL berbasis intent (CTA yang diklik, halaman yang dikunjungi) untuk memprioritaskan follow-up.",
    },
    {
      title: "Conversion Velocity",
      detail:
        "Pantau durasi dari first touch ke MQL; targetkan penurunan 20% dengan nurture automation.",
    },
  ],
  sales: [
    {
      title: "ROAS Sentinel",
      detail:
        "Set alert jika ROAS turun di bawah 3x selama 48 jam dan trigger rotasi kreatif secara otomatis.",
    },
    {
      title: "Offer Stack Optimization",
      detail:
        "Bandingkan performa bundling vs voucher individu dan pertahankan varian dengan GMV tertinggi.",
    },
  ],
  retention: [
    {
      title: "Churn Health Score",
      detail:
        "Segmentasikan pelanggan berdasarkan perilaku penggunaan dan intervensi sebelum mereka inactive 30 hari.",
    },
    {
      title: "Referral Momentum",
      detail:
        "Dorong referral dengan insentif dua arah dan ukur referensi pelanggan dengan NPS >= 8.",
    },
  ],
};

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);

const deriveAudienceKey = (audience: string) => {
  const normalized = audience.trim().toLowerCase();
  if (!normalized) return "profesional muda";
  if (normalized.includes("profesional") || normalized.includes("executive")) {
    return "profesional muda";
  }
  if (normalized.includes("bisnis") || normalized.includes("umkm")) {
    return "pemilik bisnis";
  }
  if (normalized.includes("orang tua") || normalized.includes("ibu")) {
    return "orang tua muda";
  }
  return "profesional muda";
};

const buildWeeklyPlan = (campaigns: CampaignPlay[], goal: MarketingGoal) => {
  const focusMap: Record<MarketingGoal, WeeklyPlan[]> = {
    brand: [
      {
        day: "Senin",
        focus: "Kickoff & Narasi Utama",
        action: "Rilis hero content + teaser paid ads",
        metric: "Reach & Sentimen Komentar",
      },
      {
        day: "Rabu",
        focus: "Community Amplification",
        action: "UGC challenge + curator story",
        metric: "UGC posts & Story mentions",
      },
      {
        day: "Jumat",
        focus: "Thought Leadership",
        action: "Publish artikel + live session Q&A",
        metric: "Artikel views & peserta live",
      },
    ],
    lead: [
      {
        day: "Senin",
        focus: "Lead Magnet Launch",
        action: "Distribusi konten premium + Ads cold audience",
        metric: "Lead masuk & CPL",
      },
      {
        day: "Rabu",
        focus: "Nurture Optimization",
        action: "A/B test email nurture dan CTA",
        metric: "Open rate & klik ke halaman demo",
      },
      {
        day: "Kamis",
        focus: "Webinar / Live Demo",
        action: "Event live dengan CTA konsultasi",
        metric: "Attendance rate & demo request",
      },
    ],
    sales: [
      {
        day: "Selasa",
        focus: "Promo Push",
        action: "Refresh kreatif ads & push notif blast",
        metric: "CTR, checkout rate",
      },
      {
        day: "Kamis",
        focus: "Creator Live Selling",
        action: "Live commerce 60 menit dengan bundling eksklusif",
        metric: "Viewers → transaksi",
      },
      {
        day: "Sabtu",
        focus: "Remarketing Booster",
        action: "Aktifkan automation abandon cart",
        metric: "Recovered revenue",
      },
    ],
    retention: [
      {
        day: "Senin",
        focus: "Segmentation Sync",
        action: "Update lifecycle segment + trigger reward",
        metric: "Active users by segment",
      },
      {
        day: "Rabu",
        focus: "Experience Storytelling",
        action: "Publish success story + upsell offer",
        metric: "Content clicks & upsell rate",
      },
      {
        day: "Jumat",
        focus: "Loyalty Moment",
        action: "Program referral + event komunitas mini",
        metric: "Referral submissions",
      },
    ],
  };

  return focusMap[goal].map((plan, idx) => ({
    ...plan,
    action: `${plan.action}. Fokus kampanye: ${campaigns[idx % campaigns.length]?.name ?? "Eksperimen Kanal"}`,
  }));
};

const buildMessagingPillars = (form: FormState) => [
  {
    label: "Emosi",
    narrative: `${form.brandName || "Brand"} menghadirkan pengalaman ${form.tone} yang membuat audiens merasa diperhatikan sejak interaksi pertama.`,
  },
  {
    label: "Rasional",
    narrative: `Tunjukkan bukti nyata: demo, testimoni, dan data performa yang relevan untuk industri ${form.industry}.`,
  },
  {
    label: "Urgensi",
    narrative:
      "Berikan CTA jelas dengan penawaran waktu terbatas atau slot terbatas untuk mendorong aksi cepat.",
  },
];

const budgetBand = (budget: number) => {
  if (budget <= 15_000_000) return "lean";
  if (budget <= 45_000_000) return "growth";
  return "scale";
};

const buildBudgetNotes = (budget: number, goal: MarketingGoal): Insight => {
  const band = budgetBand(budget);
  if (band === "lean") {
    return {
      title: "Prioritas kanal efisien",
      detail:
        "Fokus pada konten organik berkualitas + retargeting low cost. Maksimalkan automation untuk meminimalkan biaya operasional.",
    };
  }
  if (band === "growth") {
    return {
      title: "Skala terukur",
      detail:
        "Alokasikan 15% untuk eksperimen kreatif baru dan gunakan mix paid + automation untuk mencapai tujuan " +
        goal,
    };
  }
  return {
    title: "Dominasi share of voice",
    detail:
      "Gabungkan always-on ads dengan program kolaborasi strategis dan channel diversifikasi untuk mempercepat compound growth.",
  };
};

export default function DigitalMarketingAgent() {
  const [form, setForm] = useState<FormState>({
    brandName: "Nimbus Labs",
    industry: "saas",
    goal: "lead",
    budget: 30000000,
    tone: "visioner dan solutif",
    audience: "Profesional muda di kota besar",
  });

  const campaigns = useMemo(() => {
    const plays = GOAL_PLAYS[form.goal];
    return plays.map((play) => ({
      ...play,
      description: play.description.replace(
        "brand",
        form.brandName.toLowerCase() || "brand",
      ),
      budget: Math.round(play.budgetShare * form.budget),
    }));
  }, [form.goal, form.brandName, form.budget]);

  const weeklyPlan = useMemo(
    () => buildWeeklyPlan(campaigns, form.goal),
    [campaigns, form.goal],
  );

  const audienceProfile = useMemo(() => {
    const key = deriveAudienceKey(form.audience);
    return AUDIENCE_ARCHETYPES[key];
  }, [form.audience]);

  const messagingPillars = useMemo(
    () => buildMessagingPillars(form),
    [form.brandName, form.industry, form.tone],
  );

  const industryPreset = INDUSTRY_PRESETS[form.industry];
  const goalInsights = GOAL_METRICS[form.goal];
  const budgetInsight = buildBudgetNotes(form.budget, form.goal);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-950 to-black pb-28">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.2)_0%,_transparent_55%)]" />
        <div className="relative mx-auto flex max-w-6xl flex-col gap-16 px-6 pt-24 md:px-10">
          <header className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="max-w-3xl">
              <p className="text-sm font-semibold uppercase tracking-[0.4em] text-slate-400">
                Agen Digital Marketing
              </p>
              <h1 className="mt-4 text-4xl font-semibold leading-tight text-white md:text-5xl">
                {form.brandName || "Brand Anda"} siap melaju dengan blueprint
                marketing end-to-end.
              </h1>
              <p className="mt-5 text-lg text-slate-300 md:text-xl">
                Otomatiskan perencanaan strategi, konten, channel mix, dan KPI
                dalam satu <span className="text-sky-400">canvas eksekusi</span>{" "}
                yang bisa langsung diimplementasikan.
              </p>
            </div>
            <div className="flex flex-col gap-3 rounded-2xl border border-slate-800 bg-white/5 p-6 text-sm text-slate-200 backdrop-blur">
              <div className="font-semibold uppercase tracking-widest text-slate-400">
                Budget Bulanan
              </div>
              <div className="text-2xl font-semibold text-white">
                {formatCurrency(form.budget)}
              </div>
              <div className="text-xs text-slate-400">
                Terdistribusi otomatis ke setiap play untuk memaksimalkan hasil.
              </div>
            </div>
          </header>

          <div className="grid gap-6 md:grid-cols-[1.4fr,1fr]">
            <div className="rounded-2xl border border-slate-800 bg-white/5 p-8 backdrop-blur">
              <h2 className="text-xl font-semibold text-white">
                Setup Strategi
              </h2>
              <p className="mt-2 text-sm text-slate-400">
                Update input utama untuk mengkustomisasi rencana campaign dan
                konten.
              </p>

              <div className="mt-8 grid gap-6">
                <label className="grid gap-2 text-sm text-slate-200">
                  Nama brand
                  <input
                    className="rounded-lg border border-slate-700 bg-slate-900/60 px-4 py-3 text-base text-white outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-500/40"
                    value={form.brandName}
                    onChange={(event) =>
                      setForm((prev) => ({
                        ...prev,
                        brandName: event.target.value,
                      }))
                    }
                    placeholder="Masukkan nama brand"
                  />
                </label>

                <label className="grid gap-2 text-sm text-slate-200">
                  Industri
                  <select
                    className="rounded-lg border border-slate-700 bg-slate-900/60 px-4 py-3 text-base text-white outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-500/40"
                    value={form.industry}
                    onChange={(event) =>
                      setForm((prev) => ({
                        ...prev,
                        industry: event.target.value,
                      }))
                    }
                  >
                    <option value="saas">SaaS / Teknologi</option>
                    <option value="ecommerce">E-Commerce</option>
                    <option value="b2b">B2B Service</option>
                    <option value="hospitality">Hospitality</option>
                  </select>
                </label>

                <label className="grid gap-2 text-sm text-slate-200">
                  Tujuan utama
                  <div className="grid grid-cols-2 gap-3">
                    {(
                      [
                        ["brand", "Awareness"],
                        ["lead", "Lead Generation"],
                        ["sales", "Penjualan"],
                        ["retention", "Retensi"],
                      ] as [MarketingGoal, string][]
                    ).map(([goalKey, label]) => (
                      <button
                        key={goalKey}
                        type="button"
                        onClick={() =>
                          setForm((prev) => ({ ...prev, goal: goalKey }))
                        }
                        className={`rounded-xl px-4 py-3 text-left transition ${
                          form.goal === goalKey
                            ? "border border-sky-400 bg-sky-500/10 text-white shadow-[0_0_40px_-15px_rgba(56,189,248,0.7)]"
                            : "border border-slate-800 bg-slate-900/70 text-slate-400 hover:border-slate-700 hover:text-slate-100"
                        }`}
                      >
                        <span className="block text-sm font-semibold uppercase tracking-wide">
                          {label}
                        </span>
                        <span className="mt-1 block text-xs text-slate-400">
                          Blueprint channel & KPI akan menyesuaikan otomatis.
                        </span>
                      </button>
                    ))}
                  </div>
                </label>

                <label className="grid gap-4 text-sm text-slate-200">
                  Budget bulanan
                  <div>
                    <input
                      type="range"
                      min={10000000}
                      max={120000000}
                      step={5000000}
                      value={form.budget}
                      onChange={(event) =>
                        setForm((prev) => ({
                          ...prev,
                          budget: Number(event.target.value),
                        }))
                      }
                      className="range accent-sky-400"
                    />
                    <div className="mt-2 flex justify-between text-xs text-slate-500">
                      <span>{formatCurrency(10000000)}</span>
                      <span>{formatCurrency(form.budget)}</span>
                      <span>{formatCurrency(120000000)}</span>
                    </div>
                  </div>
                </label>

                <label className="grid gap-2 text-sm text-slate-200">
                  Karakter brand & audiens
                  <div className="grid gap-3 md:grid-cols-2">
                    <input
                      className="rounded-lg border border-slate-700 bg-slate-900/60 px-4 py-3 text-base text-white outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-500/40"
                      value={form.tone}
                      onChange={(event) =>
                        setForm((prev) => ({
                          ...prev,
                          tone: event.target.value,
                        }))
                      }
                      placeholder="Tone komunikasi"
                    />
                    <input
                      className="rounded-lg border border-slate-700 bg-slate-900/60 px-4 py-3 text-base text-white outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-500/40"
                      value={form.audience}
                      onChange={(event) =>
                        setForm((prev) => ({
                          ...prev,
                          audience: event.target.value,
                        }))
                      }
                      placeholder="Deskripsi audiens utama"
                    />
                  </div>
                </label>
              </div>
            </div>

            <aside className="flex flex-col gap-4 rounded-2xl border border-slate-800 bg-white/5 p-8 backdrop-blur">
              <h3 className="text-lg font-semibold text-white">
                Snapshot Strategi
              </h3>
              <div className="grid gap-3 text-sm text-slate-300">
                <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
                  <div className="text-xs uppercase tracking-widest text-slate-500">
                    Persona Fokus
                  </div>
                  <div className="mt-2 text-sm font-medium text-slate-200">
                    {audienceProfile.headline}
                  </div>
                </div>
                <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
                  <div className="text-xs uppercase tracking-widest text-slate-500">
                    Diferensiasi
                  </div>
                  <div className="mt-2 text-sm text-slate-200">
                    {industryPreset?.differentiator ??
                      "Tekankan value proposition utama brand dalam semua touchpoint."}
                  </div>
                </div>
                <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
                  <div className="text-xs uppercase tracking-widest text-slate-500">
                    Budget Insight
                  </div>
                  <div className="mt-2 text-sm text-slate-200">
                    {budgetInsight.detail}
                  </div>
                </div>
              </div>
              <div className="mt-4 grid gap-2 text-xs text-slate-400">
                <span className="font-semibold uppercase tracking-widest text-slate-500">
                  Quick Win Industry
                </span>
                {(industryPreset?.quickWins ?? []).map((item) => (
                  <div
                    key={item.title}
                    className="rounded-xl border border-slate-800 bg-slate-900/40 p-4 text-left text-slate-300"
                  >
                    <div className="text-sm font-medium text-sky-300">
                      {item.title}
                    </div>
                    <div className="mt-1 text-sm text-slate-300">
                      {item.detail}
                    </div>
                  </div>
                ))}
              </div>
            </aside>
          </div>
        </div>
      </section>

      <section className="relative border-t border-slate-900/60 bg-slate-950 py-20">
        <div className="mx-auto grid max-w-6xl gap-12 px-6 md:grid-cols-12 md:px-10">
          <div className="md:col-span-5">
            <h2 className="text-3xl font-semibold text-white">
              Campaign Playbook
            </h2>
            <p className="mt-3 text-base text-slate-400">
              Prioritas eksekusi berdasarkan objektif, dilengkapi deliverables
              dan indikator performa. Budget dialokasikan otomatis sesuai
              dampak.
            </p>
          </div>
          <div className="md:col-span-7 grid gap-6">
            {campaigns.map((campaign) => (
              <div
                key={campaign.id}
                className="rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900/70 to-slate-900/20 p-6 shadow-[0_20px_60px_-40px_rgba(56,189,248,0.5)]"
              >
                <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                  <div>
                    <h3 className="text-xl font-semibold text-white">
                      {campaign.name}
                    </h3>
                    <p className="text-sm text-slate-300">
                      {campaign.description}
                    </p>
                  </div>
                  <div className="rounded-full border border-sky-500/40 bg-sky-500/10 px-4 py-2 text-sm font-semibold text-sky-300">
                    {formatCurrency(campaign.budget)}
                  </div>
                </div>
                <div className="mt-4 grid gap-3 text-sm text-slate-200 md:grid-cols-3">
                  <div>
                    <span className="text-xs uppercase tracking-widest text-slate-500">
                      Channels
                    </span>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {campaign.channels.map((channel) => (
                        <span
                          key={channel}
                          className="rounded-full border border-slate-800 bg-slate-900/60 px-3 py-1 text-xs text-slate-300"
                        >
                          {channel}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <span className="text-xs uppercase tracking-widest text-slate-500">
                      Deliverables
                    </span>
                    <ul className="mt-2 list-disc space-y-1 pl-4 text-slate-300">
                      {campaign.deliverables.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <span className="text-xs uppercase tracking-widest text-slate-500">
                      KPI Utama
                    </span>
                    <p className="mt-2 text-slate-300">{campaign.kpi}</p>
                    <span className="mt-4 block text-xs text-slate-500">
                      Kadensi: {campaign.cadence}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-slate-900/60 bg-slate-950 py-20">
        <div className="mx-auto grid max-w-6xl gap-10 px-6 md:grid-cols-12 md:px-10">
          <div className="md:col-span-4">
            <h2 className="text-3xl font-semibold text-white">
              Messaging & Persona
            </h2>
            <p className="mt-3 text-base text-slate-400">
              Pilar komunikasi untuk memastikan konsistensi tone {"&"} value
              proposition di setiap channel.
            </p>
          </div>
          <div className="md:col-span-8 grid gap-6">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6">
              <h3 className="text-lg font-semibold text-sky-300">
                Profil Audiens
              </h3>
              <p className="mt-2 text-sm text-slate-300">
                {audienceProfile.headline}
              </p>
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <div>
                  <span className="text-xs uppercase tracking-widest text-slate-500">
                    Motivator Utama
                  </span>
                  <ul className="mt-2 list-disc space-y-1 pl-4 text-sm text-slate-300">
                    {audienceProfile.motivators.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <span className="text-xs uppercase tracking-widest text-slate-500">
                    Potensi Hambatan
                  </span>
                  <ul className="mt-2 list-disc space-y-1 pl-4 text-sm text-slate-300">
                    {audienceProfile.friction.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {messagingPillars.map((pillar) => (
                <div
                  key={pillar.label}
                  className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5"
                >
                  <div className="text-xs font-semibold uppercase tracking-widest text-slate-500">
                    {pillar.label}
                  </div>
                  <p className="mt-3 text-sm text-slate-300">
                    {pillar.narrative}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-slate-900/60 bg-slate-950 py-20">
        <div className="mx-auto max-w-6xl space-y-10 px-6 md:px-10">
          <header className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="text-3xl font-semibold text-white">
                Kalender Eksekusi Mingguan
              </h2>
              <p className="mt-2 text-base text-slate-400">
                Gunakan ritme mingguan ini sebagai kerangka agile sprint untuk
                tim marketing.
              </p>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-900/60 px-4 py-3 text-sm text-slate-300">
              Sync ke project management: Monday / Asana / Notion
            </div>
          </header>

          <div className="grid gap-4 md:grid-cols-3">
            {weeklyPlan.map((item) => (
              <div
                key={item.day}
                className="rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900/70 to-slate-900/30 p-5"
              >
                <div className="text-xs font-semibold uppercase tracking-widest text-slate-500">
                  {item.day}
                </div>
                <div className="mt-3 text-lg font-semibold text-white">
                  {item.focus}
                </div>
                <p className="mt-3 text-sm text-slate-300">{item.action}</p>
                <div className="mt-4 rounded-lg border border-slate-800 bg-slate-900/60 px-3 py-2 text-xs text-sky-300">
                  Fokus metric: {item.metric}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-slate-900/60 bg-slate-950 py-20">
        <div className="mx-auto grid max-w-6xl gap-10 px-6 md:grid-cols-12 md:px-10">
          <div className="md:col-span-4">
            <h2 className="text-3xl font-semibold text-white">
              Dashboard Kendali KPI
            </h2>
            <p className="mt-3 text-base text-slate-400">
              KPI prioritas berdasarkan goal. Jadikan sebagai referensi untuk
              weekly review.
            </p>
          </div>
          <div className="md:col-span-8 grid gap-4 md:grid-cols-2">
            {[budgetInsight, ...goalInsights].map((insight) => (
              <div
                key={insight.title}
                className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5"
              >
                <div className="text-xs uppercase tracking-widest text-slate-500">
                  {insight.title}
                </div>
                <p className="mt-3 text-sm text-slate-300">{insight.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-900/60 bg-black py-16">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 md:flex-row md:items-center md:justify-between md:px-10">
          <div>
            <div className="text-sm font-semibold uppercase tracking-[0.4em] text-slate-500">
              Next Action
            </div>
            <h3 className="mt-3 text-3xl font-semibold text-white">
              Sinkronkan playbook ini dengan tim growth Anda.
            </h3>
            <p className="mt-3 max-w-xl text-sm text-slate-400">
              Export insight ke workspace favorit, tentukan PIC, dan jalankan
              marketing sprint pertama dalam 48 jam.
            </p>
          </div>
          <div className="flex flex-col gap-3 md:flex-row">
            <button
              type="button"
              className="rounded-full border border-sky-500/60 bg-sky-500/10 px-6 py-3 text-sm font-semibold text-sky-300 transition hover:bg-sky-500/20"
            >
              Export ke Notion
            </button>
            <button
              type="button"
              className="rounded-full border border-slate-700 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              Bagikan ke tim
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}

