<template>
  <div>
    <!-- ──────────────────────────────── Hero ──────────────────────────────── -->
    <section class="sb-section sbq-hero">
      <v-container class="main-container">
        <v-row align="center" class="py-16" dense>
          <v-col cols="12" md="6" class="pr-md-12">
            <v-chip
              variant="tonal"
              color="primary"
              size="small"
              rounded="lg"
              class="mb-5 font-weight-medium"
            >
              <v-icon icon="lucide:sparkles" size="14" class="me-1" />
              Assessment Platform
            </v-chip>

            <h1 class="sbq-hero-title">
              Turn Questionnaires Into Decisions,
              <span class="text-primary">Not Spreadsheets.</span>
            </h1>

            <p class="text-body-1 text-medium-emphasis mt-4 sbq-hero-sub">
              SB Questionnaire helps organizations collect, analyze, and
              generate actionable results from any type of assessment — all from
              a single platform.
            </p>

            <div class="d-flex flex-wrap align-center ga-3 mt-8">
              <v-btn
                color="primary"
                variant="flat"
                rounded="lg"
                size="large"
                append-icon="lucide:arrow-right"
              >
                Request a Demo
              </v-btn>
              <v-btn variant="outlined" rounded="lg" size="large">
                Try a sample form
              </v-btn>
            </div>

            <div class="d-flex flex-wrap align-center ga-5 mt-6 text-body-2 text-medium-emphasis">
              <div class="d-flex align-center ga-2">
                <v-icon size="16" icon="lucide:check-circle-2" color="primary" />
                <span>No credit card required</span>
              </div>
              <div class="d-flex align-center ga-2">
                <v-icon size="16" icon="lucide:clock-3" color="primary" />
                <span>Free for 14 days</span>
              </div>
              <div class="d-flex align-center ga-2">
                <v-icon size="16" icon="lucide:shield-check" color="primary" />
                <span>SOC 2 compliant</span>
              </div>
            </div>
          </v-col>

          <v-col cols="12" md="6">
            <v-card rounded="xl" variant="outlined" class="sbq-hero-card pa-5">
              <div class="d-flex align-center justify-space-between mb-4">
                <div class="text-subtitle-2 font-weight-bold">Live Dashboard</div>
                <v-chip size="x-small" color="success" variant="tonal" rounded="lg">
                  <v-icon icon="lucide:circle" size="8" class="me-1" />
                  Live
                </v-chip>
              </div>

              <v-card
                v-for="item in heroBullets"
                :key="item.title"
                variant="outlined"
                rounded="lg"
                class="mb-3 pa-3"
              >
                <div class="d-flex align-center ga-3">
                  <v-avatar size="32" rounded="lg" color="primary" variant="tonal">
                    <v-icon size="16" :icon="item.icon" />
                  </v-avatar>
                  <div class="min-w-0 flex-grow-1">
                    <div class="text-body-2 font-weight-semibold">{{ item.title }}</div>
                    <div class="text-caption text-medium-emphasis">{{ item.subtitle }}</div>
                  </div>
                  <v-chip size="x-small" variant="tonal" color="primary" rounded="lg">
                    {{ item.stat }}
                  </v-chip>
                </div>
              </v-card>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </section>

    <!-- ──────────────────────── Stats bar ──────────────────────── -->
    <section class="sbq-stats-bar">
      <v-container class="main-container">
        <v-row justify="center" dense>
          <v-col
            v-for="s in stats"
            :key="s.label"
            cols="6"
            sm="3"
            class="text-center py-8"
          >
            <div class="sbq-stat-value">{{ s.value }}</div>
            <div class="text-body-2 text-medium-emphasis mt-1">{{ s.label }}</div>
          </v-col>
        </v-row>
      </v-container>
    </section>

    <!-- ──────────────────── Pain + platform bullets ──────────────────── -->
    <section class="sb-section">
      <v-container class="main-container">
        <div class="section-label">The Challenge</div>
        <h2 class="section-heading">
          Collecting answers is easy.<br class="d-none d-md-block" />
          Turning them into insight is hard.
        </h2>

        <v-row class="mt-10">
          <v-col
            v-for="card in insightCards"
            :key="card.title"
            cols="12"
            sm="6"
            md="3"
          >
            <v-card rounded="xl" variant="outlined" class="pa-5 h-100">
              <v-avatar size="40" rounded="lg" color="primary" variant="tonal">
                <v-icon size="18" :icon="card.icon" />
              </v-avatar>
              <div class="text-subtitle-2 font-weight-bold mt-4">{{ card.title }}</div>
              <div class="text-body-2 text-medium-emphasis mt-2">{{ card.desc }}</div>
            </v-card>
          </v-col>
        </v-row>

        <v-row class="mt-16" justify="center">
          <v-col cols="12" md="10">
            <v-card rounded="xl" variant="outlined" class="pa-8">
              <v-row align="center" dense>
                <v-col cols="12" md="5">
                  <div class="section-label">Platform</div>
                  <h3 class="text-h5 font-weight-black mt-2">
                    Everything you need, end-to-end.
                  </h3>
                  <p class="text-body-2 text-medium-emphasis mt-2">
                    From creation to reporting — no infrastructure required.
                  </p>
                </v-col>
                <v-col cols="12" md="7">
                  <div class="platform-grid">
                    <div
                      v-for="(p, i) in platformBullets"
                      :key="i"
                      class="d-flex align-center ga-2 text-body-2"
                    >
                      <v-icon size="16" icon="lucide:check-circle-2" color="primary" class="flex-shrink-0" />
                      <span class="text-medium-emphasis">{{ p }}</span>
                    </div>
                  </div>
                </v-col>
              </v-row>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </section>

    <!-- ──────────────────────────── Steps ──────────────────────────────── -->
    <section class="sb-section sbq-band">
      <v-container class="main-container">
        <div class="section-label text-center">How It Works</div>
        <h2 class="section-heading text-center">Launch in three simple steps.</h2>
        <p class="section-sub text-center">
          From setup to insights — fast, confident, and repeatable.
        </p>

        <v-row class="mt-10">
          <v-col
            v-for="(s, idx) in steps"
            :key="s.title"
            cols="12"
            md="4"
          >
            <v-card rounded="xl" variant="outlined" class="pa-6 h-100">
              <div class="d-flex align-center ga-3 mb-4">
                <v-avatar size="40" rounded="lg" color="primary" variant="tonal">
                  <v-icon size="18" :icon="s.icon" />
                </v-avatar>
                <div class="sbq-step-num">{{ String(idx + 1).padStart(2, '0') }}</div>
              </div>
              <div class="text-subtitle-1 font-weight-bold">{{ s.title }}</div>
              <div class="text-body-2 text-medium-emphasis mt-2">{{ s.desc }}</div>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </section>

    <!-- ──────────────────── Built for real-world ──────────────────── -->
    <section class="sb-section">
      <v-container class="main-container">
        <div class="section-label">Reliability</div>
        <h2 class="section-heading">Built for real-world assessments.</h2>

        <v-row class="mt-10">
          <v-col
            v-for="c in builtCards"
            :key="c.title"
            cols="12"
            sm="6"
            md="3"
          >
            <v-card rounded="xl" variant="outlined" class="pa-5 h-100">
              <v-avatar size="40" rounded="lg" color="primary" variant="tonal">
                <v-icon size="18" :icon="c.icon" />
              </v-avatar>
              <div class="text-subtitle-2 font-weight-bold mt-4">{{ c.title }}</div>
              <div class="text-body-2 text-medium-emphasis mt-2">{{ c.desc }}</div>
            </v-card>
          </v-col>
        </v-row>

        <div class="mt-16">
          <div class="section-label text-center">Who It's For</div>
          <h3 class="text-h5 font-weight-black text-center mt-2">
            Made for schools, universities, and partner programs.
          </h3>
        </div>

        <v-row class="mt-8" dense>
          <v-col
            v-for="a in audiences"
            :key="a.title"
            cols="12"
            md="4"
          >
            <v-card rounded="xl" variant="outlined" class="pa-6 h-100">
              <div class="d-flex align-center ga-3 mb-3">
                <v-avatar size="44" rounded="lg" color="primary" variant="tonal">
                  <v-icon size="20" :icon="a.icon" />
                </v-avatar>
                <div class="text-subtitle-2 font-weight-bold">{{ a.title }}</div>
              </div>
              <div class="text-body-2 text-medium-emphasis">{{ a.desc }}</div>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </section>

    <!-- ──────────────────────────── Pricing ──────────────────────────────── -->
    <section class="sb-section sbq-band">
      <v-container class="main-container">
        <div class="section-label text-center">Pricing</div>
        <h2 class="section-heading text-center">Pricing that fits your organization.</h2>
        <p class="section-sub text-center">
          Choose a plan based on your size, assessment needs, and reporting requirements.
        </p>

        <v-row class="mt-10" justify="center">
          <v-col
            v-for="plan in pricing"
            :key="plan.name"
            cols="12"
            md="4"
          >
            <v-card
              rounded="xl"
              variant="outlined"
              class="pa-6 h-100"
              :class="{ 'sbq-pricing-featured': plan.featured }"
            >
              <div class="d-flex align-center justify-space-between mb-4">
                <div class="text-subtitle-2 font-weight-bold">{{ plan.name }}</div>
                <v-chip
                  v-if="plan.badge"
                  size="small"
                  color="primary"
                  variant="tonal"
                  rounded="lg"
                  class="font-weight-bold"
                >
                  {{ plan.badge }}
                </v-chip>
              </div>

              <div class="d-flex align-baseline ga-1 mb-1">
                <div class="text-h4 font-weight-black">{{ plan.price }}</div>
                <div v-if="plan.period" class="text-body-2 text-medium-emphasis">/{{ plan.period }}</div>
              </div>
              <div class="text-body-2 text-medium-emphasis mb-5">{{ plan.subtitle }}</div>

              <v-divider class="mb-5" />

              <div class="d-flex flex-column ga-3 mb-8">
                <div
                  v-for="(f, i) in plan.features"
                  :key="i"
                  class="d-flex align-center ga-2 text-body-2"
                >
                  <v-icon size="16" icon="lucide:check-circle-2" color="primary" class="flex-shrink-0" />
                  <span class="text-medium-emphasis">{{ f }}</span>
                </div>
              </div>

              <v-btn
                block
                rounded="lg"
                :color="plan.featured ? 'primary' : undefined"
                :variant="plan.featured ? 'flat' : 'outlined'"
              >
                {{ plan.cta }}
              </v-btn>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </section>

    <!-- ──────────────────────────── FAQ ──────────────────────────────── -->
    <section class="sb-section">
      <v-container class="main-container">
        <div class="section-label text-center">FAQ</div>
        <h2 class="section-heading text-center">Frequently asked questions.</h2>
        <p class="section-sub text-center">
          Quick answers about configuration, scoring, exports, and more.
        </p>

        <v-row justify="center" class="mt-10">
          <v-col cols="12" md="8">
            <v-expansion-panels flat variant="accordion" class="faq-panels">
              <v-expansion-panel v-for="(q, i) in faqs" :key="i">
                <v-expansion-panel-title class="text-subtitle-2 font-weight-semibold">
                  {{ q.q }}
                </v-expansion-panel-title>
                <v-expansion-panel-text class="text-body-2 text-medium-emphasis">
                  {{ q.a }}
                </v-expansion-panel-text>
              </v-expansion-panel>
            </v-expansion-panels>
          </v-col>
        </v-row>
      </v-container>
    </section>

    <!-- ──────────────────────────── Bottom CTA ──────────────────────────────── -->
    <section class="sb-section">
      <v-container class="main-container">
        <v-card rounded="xl" class="sbq-cta pa-8 pa-md-14 text-center">
          <div class="sbq-cta-inner">
            <v-chip
              variant="outlined"
              size="small"
              rounded="lg"
              class="mb-5 sbq-cta-chip font-weight-medium"
            >
              <v-icon icon="lucide:rocket" size="14" class="me-1" />
              Get Started Today
            </v-chip>
            <h2 class="text-h4 font-weight-black text-white mb-3">
              Ready to run assessments with confidence?
            </h2>
            <p class="text-body-1 sbq-cta-sub mx-auto">
              From first response to final report — collect, score, and analyze
              with reliable workflows your team can trust.
            </p>
            <div class="d-flex flex-wrap justify-center ga-3 mt-8">
              <v-btn color="primary" variant="flat" rounded="lg" size="large">
                Request a Demo
              </v-btn>
              <v-btn variant="outlined" rounded="lg" size="large" class="sbq-cta-outline">
                View Sample Report
              </v-btn>
            </div>
          </div>
        </v-card>
      </v-container>
    </section>
  </div>
</template>

<script setup lang="ts">
const stats = [
  { value: "10,000+", label: "Assessments run" },
  { value: "500+", label: "Organizations" },
  { value: "98%", label: "Satisfaction rate" },
  { value: "< 5 min", label: "Avg. setup time" },
];

const heroBullets = [
  {
    icon: "lucide:line-chart",
    title: "Student scores",
    subtitle: "Track results over time",
    stat: "+12%",
  },
  {
    icon: "lucide:layers",
    title: "Custom reports",
    subtitle: "Download PDF or CSV",
    stat: "PDF",
  },
  {
    icon: "lucide:badge-check",
    title: "Real-time analytics",
    subtitle: "Insights while collecting",
    stat: "Live",
  },
  {
    icon: "lucide:workflow",
    title: "Dashboard tracking",
    subtitle: "From setup to outcomes",
    stat: "360°",
  },
];

const insightCards = [
  {
    icon: "lucide:scan-text",
    title: "Randomize questions",
    desc: "Scramble the question order to reduce memorization and improve assessment integrity.",
  },
  {
    icon: "lucide:library",
    title: "Standardized instruments",
    desc: "Use built-in validated question sets or create your own reusable assessments.",
  },
  {
    icon: "lucide:bar-chart-3",
    title: "Reporting at every level",
    desc: "From per-student breakdowns to cohort-wide trends, get reports that actually drive action.",
  },
  {
    icon: "lucide:shield-check",
    title: "Live response controls",
    desc: "Pause, restart, and monitor live sessions with complete control and visibility.",
  },
];

const platformBullets = [
  "Choose from a growing form library",
  "Use variable format options",
  "Customize and name scoring bands",
  "Handle numeric scoring and qualitative data",
  "Single import and export of data",
  "Role-based access and permissions",
];

const steps = [
  {
    icon: "lucide:sliders-horizontal",
    title: "Create & configure",
    desc: "Build your questionnaire from scratch or pick a validated template. Add sections, logic, branching, and custom fields.",
  },
  {
    icon: "lucide:send",
    title: "Distribute & collect",
    desc: "Share via link, QR, or email. Monitor responses in real time and send reminders automatically.",
  },
  {
    icon: "lucide:pie-chart",
    title: "Analyze & report",
    desc: "Visualize results instantly with automated scoring. Export to PDF, CSV, or integrate with your systems.",
  },
];

const builtCards = [
  {
    icon: "lucide:badge-check",
    title: "Regulated & rigorous",
    desc: "Made for assessments with audit trails and clear workflows.",
  },
  {
    icon: "lucide:settings-2",
    title: "Flexible configuration",
    desc: "Control timing, scoring, logic, and visibility at every level.",
  },
  {
    icon: "lucide:repeat-2",
    title: "Repeatable assessments",
    desc: "Run recurring evaluations with historical tracking built in.",
  },
  {
    icon: "lucide:zap",
    title: "Rapid deployment",
    desc: "Go from idea to live assessment in minutes, not weeks.",
  },
];

const audiences = [
  {
    icon: "lucide:graduation-cap",
    title: "Schools",
    desc: "Run classroom and student programs with consistent, simple scoring.",
  },
  {
    icon: "lucide:university",
    title: "Universities",
    desc: "Support research, admissions, and student services with reliable evaluation.",
  },
  {
    icon: "lucide:handshake",
    title: "Partner programs",
    desc: "Deliver assessments across organizations with unified reporting.",
  },
];

const pricing = [
  {
    name: "Starter",
    price: "Free",
    period: null,
    subtitle: "For small teams exploring questionnaire tools.",
    features: [
      "Core question library",
      "Up to 10 questionnaires",
      "Basic analytics",
      "Email support",
    ],
    cta: "Get Started",
    featured: false,
    badge: null,
  },
  {
    name: "Growth",
    price: "$49",
    period: "mo",
    subtitle: "For mid-size organizations that need depth.",
    features: [
      "Unlimited responses",
      "Custom branding",
      "Advanced reporting",
      "Priority support",
      "API access",
    ],
    cta: "Try for Free",
    featured: true,
    badge: "Most Popular",
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: null,
    subtitle: "For institutions needing full control.",
    features: [
      "Unlimited everything",
      "SSO & compliance",
      "Dedicated onboarding",
      "SLA & enterprise support",
    ],
    cta: "Contact Sales",
    featured: false,
    badge: null,
  },
];

const faqs = [
  {
    q: "Does SB Questionnaire work for any type of survey?",
    a: "Yes — you can build academic, behavioral, program, and partner assessments with flexible formats and scoring.",
  },
  {
    q: "How does scoring work across question types?",
    a: "You can use numeric weights, bands, or qualitative mappings depending on the questionnaire configuration.",
  },
  {
    q: "Can I run repeatable programs at scale?",
    a: "Absolutely. Reuse templates, duplicate forms, and track results over time with consistent reporting.",
  },
  {
    q: "What export formats are supported?",
    a: "Common exports include PDF and CSV. You can also integrate via API on eligible plans.",
  },
  {
    q: "Is there a free plan available?",
    a: "Yes — the Starter plan is free to begin, and you can upgrade whenever you need more depth.",
  },
];
</script>

<style scoped lang="scss">
/* ── Sections ── */
.sb-section {
  padding-top: 80px;
  padding-bottom: 80px;
}

.sbq-band {
  background: #f6f7f9;
}

/* ── Section typography helpers ── */
.section-label {
  display: inline-block;
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: rgb(var(--v-theme-primary));
  margin-bottom: 12px;

  &.text-center {
    display: block;
  }
}

.section-heading {
  font-size: clamp(1.6rem, 3.5vw, 2.4rem);
  font-weight: 900;
  line-height: 1.15;
  letter-spacing: -0.02em;
  margin-bottom: 8px;
}

.section-sub {
  font-size: 0.9375rem;
  color: rgba(var(--v-theme-on-surface), 0.6);
  max-width: 520px;
  margin-left: auto;
  margin-right: auto;
}

/* ── Hero ── */
.sbq-hero {
  margin-top: -72px;
  padding-top: 164px;
  padding-bottom: 80px;
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    inset: -2px;
    background:
      radial-gradient(980px 560px at 14% 20%, rgba(var(--v-theme-primary), 0.14), transparent 56%),
      radial-gradient(760px 520px at 84% 18%, rgba(var(--v-theme-primary), 0.08), transparent 62%),
      linear-gradient(180deg, rgba(var(--v-theme-surface), 0.72), rgba(var(--v-theme-surface), 1));
    pointer-events: none;
  }

  &::after {
    content: "";
    position: absolute;
    inset: 0;
    background-image: radial-gradient(rgba(0, 0, 0, 0.07) 1px, transparent 1px);
    background-size: 20px 20px;
    opacity: 0.08;
    pointer-events: none;
    mix-blend-mode: overlay;
  }

  > .v-container {
    position: relative;
    z-index: 1;
  }
}

.sbq-hero-title {
  font-size: clamp(2rem, 4.5vw, 3rem);
  font-weight: 900;
  line-height: 1.1;
  letter-spacing: -0.03em;
}

.sbq-hero-sub {
  max-width: 480px;
  line-height: 1.7;
}

.sbq-hero-card {
  background: rgba(var(--v-theme-surface), 0.95);
}

/* ── Steps ── */
.sbq-step-num {
  font-size: 1.5rem;
  font-weight: 900;
  letter-spacing: -0.04em;
  color: rgba(var(--v-theme-primary), 0.2);
  line-height: 1;
}

/* ── Platform checklist ── */
.platform-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;

  @media (max-width: 599px) {
    grid-template-columns: 1fr;
  }
}

/* ── Pricing ── */
.sbq-pricing-featured {
  border-color: rgba(var(--v-theme-primary), 0.4) !important;
  box-shadow: 0 8px 32px rgba(var(--v-theme-primary), 0.1);
}

/* ── FAQ ── */
.faq-panels {
  .v-expansion-panel {
    background-color: #f9fafb;
    border: 1px solid rgba(var(--v-theme-on-surface), 0.1);
    margin-bottom: 8px;
    border-radius: 16px !important;
  }

  .v-expansion-panel-title--active {
    border-bottom: 1px solid rgba(var(--v-theme-on-surface), 0.08);
  }
}

/* ── Stats bar ── */
.sbq-stats-bar {
  border-top: 1px solid rgba(var(--v-theme-on-surface), 0.08);
  border-bottom: 1px solid rgba(var(--v-theme-on-surface), 0.08);
  background: rgba(var(--v-theme-primary), 0.03);
}

.sbq-stat-value {
  font-size: clamp(1.5rem, 3vw, 2rem);
  font-weight: 900;
  letter-spacing: -0.03em;
  color: rgb(var(--v-theme-primary));
}

/* ── Bottom CTA ── */
.sbq-cta {
  background: #0f172a;
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    inset: 0;
    background:
      radial-gradient(600px 400px at 20% 50%, rgba(var(--v-theme-primary), 0.18), transparent 60%),
      radial-gradient(400px 400px at 80% 20%, rgba(var(--v-theme-primary), 0.12), transparent 60%);
    pointer-events: none;
  }
}

.sbq-cta-inner {
  position: relative;
  z-index: 1;
}

.sbq-cta-chip {
  border-color: rgba(255, 255, 255, 0.2) !important;
  color: rgba(255, 255, 255, 0.8) !important;
}

.sbq-cta-sub {
  color: rgba(255, 255, 255, 0.65);
  max-width: 480px;
  line-height: 1.7;
}

.sbq-cta-outline {
  border-color: rgba(255, 255, 255, 0.3) !important;
  color: #fff !important;
}
</style>
