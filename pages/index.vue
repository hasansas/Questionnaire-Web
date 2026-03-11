<!-- /pages/index.vue -->
<template>
  <div>
    <!-- Hero -->
    <section class="sb-section sbq-hero">
      <v-container class="main-container">
        <v-row align="center" class="py-10" dense>
          <v-col cols="12" md="6" class="pr-md-10">
            <div class="text-h1 text-md-h2 font-weight-bold sbq-hero-title">
              Turn Questionnaires Into Decisions,
              <span class="text-primary">Not Spreadsheets.</span>
            </div>

            <div
              class="text-body-1 text-medium-emphasis mt-4"
              style="max-width: 560px"
            >
              SB Questionnaire helps organizations collect, analyze, and
              generate actionable results from any type of assessment — all from
              a single, beautiful platform.
            </div>

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

            <div
              class="d-flex flex-wrap align-center ga-5 mt-8 text-body-2 text-medium-emphasis"
            >
              <div class="d-flex align-center ga-2">
                <v-icon
                  size="18"
                  icon="lucide:check-circle-2"
                  color="primary"
                />
                <span>No credit card required</span>
              </div>
              <div class="d-flex align-center ga-2">
                <v-icon size="18" icon="lucide:clock-3" color="primary" />
                <span>Free for 14 days</span>
              </div>
            </div>
          </v-col>

          <v-col cols="12" md="6">
            <v-card rounded="xl" variant="outlined" class="pa-4 sbq-hero-card">
              <div class="d-flex align-center mb-2">
                <v-icon icon="lucide:chart-column" size="18" color="primary" />
                <div class="text-caption text-medium-emphasis ml-2">
                  What you’ll see
                </div>
              </div>
              <v-card
                v-for="(item, i) in heroBullets"
                :key="i"
                variant="outlined"
                rounded="lg"
                class="mt-3 pa-2"
              >
                <v-list-item class="px-2">
                  <template #prepend>
                    <v-avatar size="28" class="sbq-bullet">
                      <v-icon size="16" :icon="item.icon" color="primary" />
                    </v-avatar>
                  </template>
                  <v-list-item-title class="text-body-2 font-weight-semibold">
                    {{ item.title }}
                  </v-list-item-title>
                  <v-list-item-subtitle
                    class="text-caption text-medium-emphasis"
                  >
                    {{ item.subtitle }}
                  </v-list-item-subtitle>
                </v-list-item>
              </v-card>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </section>

    <!-- Section: Insight is hard -->
    <section class="sb-section">
      <v-container class="main-container">
        <div class="text-h2 font-weight-bold text-center">
          Collecting answers is easy. Turning<br class="d-none d-md-block" />
          them into insight is hard.
        </div>

        <v-row class="mt-10">
          <v-col
            cols="12"
            md="3"
            v-for="card in insightCards"
            :key="card.title"
          >
            <v-card rounded="xl" variant="outlined" class="pa-5 h-100">
              <v-avatar size="36" class="sbq-icon">
                <v-icon size="18" :icon="card.icon" color="primary" />
              </v-avatar>
              <div class="text-subtitle-1 font-weight-bold mt-4">
                {{ card.title }}
              </div>
              <div class="text-body-2 text-medium-emphasis mt-2">
                {{ card.desc }}
              </div>
            </v-card>
          </v-col>
        </v-row>

        <v-row class="mt-8" justify="center" dense>
          <v-col cols="12" md="8">
            <div class="text-center mt-12">
              <div class="text-h4 font-weight-bold">
                Everything you need to run assessments end-to-end.
              </div>
              <div class="text-body-2 text-medium-emphasis mt-2">
                SB Questionnaire brings together all the tools your organization
                needs — from creation and delivery to reporting — all without
                building any infrastructure.
              </div>
            </div>
            <div class="pa-6 mt-8">
              <v-card variant="outlined" rounded="xl">
                <div v-for="(p, i) in platformBullets">
                  <div class="d-flex align-center text-body-2 py-4 px-6">
                    <v-icon
                      size="18"
                      icon="lucide:check"
                      color="primary"
                      class="mr-4"
                    />
                    <span class="text-medium-emphasis">{{ p }}</span>
                  </div>
                  <v-divider
                    v-if="i < platformBullets.length - 1"
                    class="my-0"
                  />
                </div>
              </v-card>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </section>

    <!-- Steps -->
    <section class="sb-section sbq-band">
      <v-container class="main-container">
        <div class="text-h2 font-weight-bold text-center">
          Launch in three simple steps.
        </div>
        <div class="text-body-2 text-medium-emphasis text-center mt-2">
          From setup to insights — fast, confident, and repeatable.
        </div>

        <v-row class="mt-10">
          <v-col cols="12" md="4" v-for="(s, idx) in steps" :key="s.title">
            <div class="text-center px-4">
              <v-avatar size="54" class="sbq-step-icon">
                <v-icon size="22" :icon="s.icon" color="primary" />
              </v-avatar>
              <div class="text-subtitle-2 text-primary font-weight-bold mt-4">
                STEP {{ idx + 1 }}
              </div>
              <div class="text-h6 font-weight-bold mt-1">
                {{ s.title }}
              </div>
              <div class="text-body-2 text-medium-emphasis mt-2">
                {{ s.desc }}
              </div>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </section>

    <!-- Built for real-world -->
    <section class="sb-section">
      <v-container class="main-container">
        <div class="text-h2 font-weight-bold text-center">
          Built for real-world assessments.
        </div>

        <v-row class="mt-10">
          <v-col cols="12" md="3" v-for="c in builtCards" :key="c.title">
            <v-card rounded="xl" variant="outlined" class="pa-5 h-100">
              <v-avatar size="36" class="sbq-icon">
                <v-icon size="18" :icon="c.icon" color="primary" />
              </v-avatar>
              <div class="text-subtitle-1 font-weight-bold mt-4">
                {{ c.title }}
              </div>
              <div class="text-body-2 text-medium-emphasis mt-2">
                {{ c.desc }}
              </div>
            </v-card>
          </v-col>
        </v-row>

        <div class="text-center mt-16">
          <div class="text-h4 font-weight-bold">
            Made for schools, universities, and partner programs.
          </div>
        </div>

        <v-row class="mt-8" dense>
          <v-col cols="12" md="4" v-for="a in audiences" :key="a.title">
            <v-card
              rounded="xl"
              variant="outlined"
              class="text-center pa-6 h-100"
            >
              <v-avatar size="48" variant="tonal" color="primary">
                <v-icon size="18" :icon="a.icon" color="primary" />
              </v-avatar>
              <div class="text-subtitle-1 font-weight-bold mt-2">
                {{ a.title }}
              </div>
              <div class="text-body-2 text-medium-emphasis mt-3">
                {{ a.desc }}
              </div>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </section>

    <!-- Pricing -->
    <section class="sb-section sbq-band">
      <v-container class="main-container">
        <div class="text-h2 font-weight-bold text-center">
          Pricing that fits your organization.
        </div>
        <div class="text-body-2 text-medium-emphasis text-center mt-2">
          Choose a plan based on your size, assessment needs, and reporting
          requirements.
        </div>

        <v-row class="mt-10" justify="center">
          <v-col cols="12" md="4" v-for="plan in pricing" :key="plan.name">
            <v-card
              rounded="xl"
              :variant="plan.featured ? 'flat' : 'outlined'"
              :class="plan.featured ? 'sbq-pricing-featured' : 'bg-white'"
              class="pa-6 h-100"
            >
              <div class="d-flex align-center justify-space-between">
                <div class="text-subtitle-2 font-weight-bold">
                  {{ plan.name }}
                </div>
                <v-chip
                  v-if="plan.badge"
                  size="small"
                  color="primary"
                  variant="tonal"
                  class="font-weight-bold"
                >
                  {{ plan.badge }}
                </v-chip>
              </div>

              <div class="mt-4">
                <div class="d-flex align-baseline ga-2">
                  <div class="text-h4 font-weight-bold">{{ plan.price }}</div>
                  <div
                    v-if="plan.period"
                    class="text-body-2 text-medium-emphasis"
                  >
                    /{{ plan.period }}
                  </div>
                </div>
                <div class="text-body-2 text-medium-emphasis mt-2">
                  {{ plan.subtitle }}
                </div>
              </div>

              <v-divider class="my-5" />

              <div class="d-flex flex-column ga-3">
                <div
                  v-for="(f, i) in plan.features"
                  :key="i"
                  class="d-flex align-center ga-2 text-body-2"
                >
                  <v-icon size="18" icon="lucide:check" color="primary" />
                  <span class="text-medium-emphasis">{{ f }}</span>
                </div>
              </div>

              <div class="mt-8">
                <v-btn
                  block
                  rounded="lg"
                  class="text-none"
                  :color="plan.featured ? 'primary' : undefined"
                  :variant="plan.featured ? 'flat' : 'outlined'"
                >
                  {{ plan.cta }}
                </v-btn>
              </div>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </section>

    <!-- FAQ -->
    <section class="sb-section faq-section">
      <v-container class="main-container">
        <div class="text-h2 font-weight-bold text-center">
          Frequently asked questions
        </div>
        <div class="text-body-2 text-medium-emphasis text-center mt-2">
          Quick answers about configuration, scoring, exports, and more.
        </div>

        <v-row justify="center" class="mt-10" dense>
          <v-col cols="12" md="8">
            <v-expansion-panels flat variant="accordion" class="faq-panels">
              <v-expansion-panel v-for="(q, i) in faqs" :key="i">
                <v-expansion-panel-title
                  class="text-subtitle-2 font-weight-semibold"
                >
                  {{ q.q }}
                </v-expansion-panel-title>
                <v-expansion-panel-text
                  class="text-body-2 text-medium-emphasis"
                >
                  {{ q.a }}
                </v-expansion-panel-text>
              </v-expansion-panel>
            </v-expansion-panels>
          </v-col>
        </v-row>
      </v-container>
    </section>

    <!-- Bottom CTA -->
    <section class="sb-section">
      <v-container class="main-container">
        <v-card rounded="xl" class="sbq-cta text-center pa-8 pa-md-12">
          <div class="text-h3 text-md-h5 font-weight-bold text-white">
            Ready to run assessments with confidence?
          </div>
          <v-row>
            <v-col cols="12" md="6" class="mx-auto">
              <div class="text-body-2 text-white mt-3" style="opacity: 0.85">
                From first response to final report — collect, score, and
                analyze with reliable workflows your team can trust.
              </div>
            </v-col>
          </v-row>
          <div class="d-flex flex-wrap justify-md-center ga-3 mt-16">
            <v-btn color="primary" variant="flat" rounded="lg" size="large">
              Request a Demo
            </v-btn>
            <v-btn
              variant="outlined"
              rounded="lg"
              size="large"
              class="sbq-cta-outline"
            >
              View Sample Report
            </v-btn>
          </div>
        </v-card>
      </v-container>
    </section>
  </div>
</template>

<script setup lang="ts">
const navItems = ["Forms", "Features", "Pricing", "FAQ"];

const heroBullets = [
  {
    icon: "lucide:line-chart",
    title: "Student scores",
    subtitle: "Track results over time",
  },
  {
    icon: "lucide:layers",
    title: "Custom reports",
    subtitle: "Download PDF or CSV",
  },
  {
    icon: "lucide:badge-check",
    title: "Real-time analytics",
    subtitle: "Insights while collecting",
  },
  {
    icon: "lucide:workflow",
    title: "Dashboard-level tracking",
    subtitle: "From setup to outcomes",
  },
];

const brands = ["Stanford", "MIT", "Harvard", "Yale", "Princeton"];

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
    desc: "Pause, restart, and monitor live assessment sessions with complete control and visibility.",
  },
];

const platformBullets = [
  "Choose from a growing form library",
  "Use variable format options",
  "Customize and name scoring bands",
  "Handle both numeric scoring and qualitative data",
  "Single import and export of data",
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
/* Keep CSS minimal; rely on Vuetify classes for everything else */

.sbq-hero {
  margin-top: -72px;
  padding-top: 164px;
  padding-bottom: 72x;
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    inset: -2px;
    background:
      radial-gradient(
        980px 560px at 14% 20%,
        rgba(var(--v-theme-primary), 0.18),
        transparent 56%
      ),
      radial-gradient(
        760px 520px at 84% 18%,
        rgba(var(--v-theme-primary), 0.1),
        transparent 62%
      ),
      linear-gradient(
        180deg,
        rgba(var(--v-theme-surface), 0.72),
        rgba(var(--v-theme-surface), 1)
      );
    pointer-events: none;
  }

  &::after {
    content: "";
    position: absolute;
    inset: 0;
    background-image: radial-gradient(rgba(0, 0, 0, 0.08) 1px, transparent 1px);
    background-size: 18px 18px;
    opacity: 0.1;
    pointer-events: none;
    mix-blend-mode: overlay;
  }

  > .v-container {
    position: relative;
    z-index: 1;
  }
}

.sbq-hero-title {
  letter-spacing: -0.02em;
}

.sbq-hero-accent {
  color: rgb(var(--v-theme-primary));
}

.sbq-hero-card {
  background: #fff;
}

.sbq-logo {
  background: rgba(var(--v-theme-primary), 0.12);
  color: rgb(var(--v-theme-primary));
}

.sbq-icon {
  background: rgba(var(--v-theme-primary), 0.12);
  border-radius: 8px !important;
}

.sbq-bullet {
  background: rgba(var(--v-theme-primary), 0.1);
}

.sbq-step-icon {
  background: rgba(var(--v-theme-primary), 0.12);
}

.sbq-band {
  background: #f6f7f9;
}

.sbq-brand {
  opacity: 0.55;
  font-weight: 600;
}

.sbq-pricing-featured {
  border: 1px solid rgba(var(--v-theme-primary), 0.35) !important;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.06);
}

.sbq-cta {
  background: #111827; /* deep neutral like screenshot CTA */
  color: #fff;
}

.sbq-cta-outline {
  border-color: rgba(255, 255, 255, 0.35) !important;
  color: #fff !important;
}

.faq-section {
  background-color: #fff;
  .faq-panels {
    .v-expansion-panel {
      background-color: #f9fafb;
      border: 1px solid var(--color-border);
      margin-bottom: 8px;
      border-radius: 16px !important;
    }
    .v-expansion-panel-title--active {
      border-bottom: 1px solid var(--color-border);
    }
    @media (max-width: 600px) {
      .v-expansion-panel-title {
        padding: 32px !important;
      }

      // .v-expansion-panel-text {
      //   font-size: 0.9rem;
      // }
    }
  }
}
</style>
