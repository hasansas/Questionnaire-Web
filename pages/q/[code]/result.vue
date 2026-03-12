<!-- /pages/q/[code]/result.vue -->
<template>
  <div>
    <!-- Header -->
    <section class="result-hero">
      <v-container class="main-container">
        <!-- Loading -->
        <div v-if="uiState === 'loading'">
          <v-skeleton-loader type="heading, text, text" />
          <v-row class="mt-6">
            <v-col cols="12" md="8">
              <v-card rounded="xl" variant="outlined" class="pa-6">
                <v-skeleton-loader type="text, text, text, text" />
              </v-card>
            </v-col>
            <v-col cols="12" md="4">
              <v-card rounded="xl" variant="outlined" class="pa-6">
                <v-skeleton-loader type="avatar, text, actions" />
              </v-card>
            </v-col>
          </v-row>
        </div>

        <!-- Error -->
        <v-alert
          v-else-if="uiState === 'error'"
          type="error"
          variant="tonal"
          rounded="xl"
        >
          Unable to load result.
        </v-alert>

        <!-- Empty -->
        <v-card
          v-else-if="uiState === 'empty'"
          rounded="xl"
          variant="outlined"
          class="pa-8 text-center"
        >
          <v-avatar
            size="56"
            color="primary"
            variant="tonal"
            class="mx-auto mb-3"
          >
            <v-icon icon="lucide:alert-circle" />
          </v-avatar>
          <div class="text-h6 font-weight-bold">Result not available</div>
          <div
            class="text-body-2 text-medium-emphasis mt-2 mx-auto max-width-narrow"
          >
            We couldn’t find a submitted attempt for this questionnaire in your
            current browser session. Please start the questionnaire again.
          </div>

          <div class="d-flex flex-column flex-sm-row justify-center ga-3 mt-6">
            <v-btn rounded="xl" color="primary" :to="localePath(`/q/${code}`)">
              Start again
            </v-btn>
            <v-btn
              rounded="xl"
              variant="outlined"
              :to="localePath('/organizations')"
            >
              Browse organizations
            </v-btn>
          </div>
        </v-card>

        <!-- Data -->
        <div v-else>
          <v-breadcrumbs
            :items="breadcrumbs"
            class="px-0 mb-3"
            density="compact"
          >
            <template #divider>
              <v-icon icon="mdi-chevron-right" />
            </template>
          </v-breadcrumbs>

          <v-row class="align-center">
            <v-col cols="12" md="8">
              <div class="d-flex align-center ga-3 mb-3">
                <v-avatar size="56" color="primary" variant="tonal">
                  <v-icon
                    :icon="
                      showResult ? 'lucide:badge-check' : 'lucide:party-popper'
                    "
                  />
                </v-avatar>

                <div class="min-width-0">
                  <h1
                    class="text-h4 text-md-h3 font-weight-bold mb-1 text-truncate"
                  >
                    {{ headerTitle }}
                  </h1>
                  <div class="text-body-2 text-medium-emphasis">
                    {{ q!.title }}
                  </div>
                </div>
              </div>

              <p class="text-body-1 text-medium-emphasis mb-0 result-subtitle">
                {{ headerSubtitle }}
              </p>

              <div class="d-flex flex-wrap ga-2 mt-5">
                <v-chip
                  size="small"
                  variant="outlined"
                  class="text-medium-emphasis"
                >
                  <v-icon icon="lucide:clock" size="16" class="me-1" />
                  Submitted {{ submittedTimeLabel }}
                </v-chip>

                <v-chip
                  size="small"
                  variant="outlined"
                  class="text-medium-emphasis"
                >
                  <v-icon icon="lucide:target" size="16" class="me-1" />
                  {{ scoringLabel }}
                </v-chip>

                <v-chip
                  size="small"
                  :color="showResult ? 'primary' : undefined"
                  :variant="showResult ? 'tonal' : 'outlined'"
                  class="text-medium-emphasis"
                >
                  <v-icon
                    :icon="showResult ? 'lucide:eye' : 'lucide:eye-off'"
                    size="16"
                    class="me-1"
                  />
                  {{ showResult ? "Result shown" : "Result hidden" }}
                </v-chip>
              </div>
            </v-col>

            <v-col cols="12" md="4">
              <v-card
                rounded="xl"
                variant="outlined"
                class="pa-6 result-summary"
              >
                <div class="text-subtitle-1 font-weight-bold mb-1">
                  Next steps
                </div>
                <div class="text-body-2 text-medium-emphasis mb-4">
                  Choose what you want to do next.
                </div>

                <v-btn
                  rounded="xl"
                  color="primary"
                  block
                  :to="localePath('/organizations')"
                >
                  Take another questionnaire
                </v-btn>

                <v-btn
                  rounded="xl"
                  variant="outlined"
                  class="mt-3"
                  block
                  @click="openSampleReport"
                >
                  <v-icon icon="lucide:file-text" size="18" class="me-2" />
                  View sample report
                </v-btn>

                <v-btn
                  rounded="xl"
                  variant="text"
                  class="mt-2"
                  block
                  :to="localePath(`/q/${code}`)"
                >
                  Back to questionnaire
                </v-btn>
              </v-card>
            </v-col>
          </v-row>
        </div>
      </v-container>
    </section>

    <!-- Result content (only if show_result_to_user === true) -->
    <section v-if="uiState === 'data'">
      <v-container class="main-container">
        <v-row>
          <!-- Left content -->
          <v-col cols="12" md="8">
            <!-- If results visible -->
            <template v-if="showResult">
              <v-card rounded="xl" variant="outlined" class="pa-6 mb-6">
                <div class="d-flex align-start ga-3">
                  <v-avatar size="40" color="primary" variant="tonal">
                    <v-icon icon="lucide:sparkles" />
                  </v-avatar>
                  <div class="min-width-0">
                    <div class="text-subtitle-1 font-weight-bold mb-1">
                      {{ meaning?.result_label || "Your result" }}
                    </div>
                    <div class="text-body-2 text-medium-emphasis">
                      {{ meaning?.description || defaultMeaningDescription }}
                    </div>
                  </div>
                </div>

                <v-divider class="my-5" />

                <div class="text-subtitle-2 font-weight-bold mb-3">
                  Recommendations
                </div>

                <v-row>
                  <v-col
                    v-for="(rec, idx) in recommendations"
                    :key="idx"
                    cols="12"
                    sm="6"
                  >
                    <v-card
                      rounded="xl"
                      variant="tonal"
                      color="primary"
                      class="pa-4 h-100"
                    >
                      <div class="d-flex align-start ga-3">
                        <v-avatar
                          size="28"
                          color="primary"
                          variant="flat"
                          class="rec-dot"
                        >
                          <v-icon icon="lucide:check" size="16" />
                        </v-avatar>
                        <div class="text-body-2 font-weight-medium">
                          {{ rec }}
                        </div>
                      </div>
                    </v-card>
                  </v-col>
                </v-row>
              </v-card>

              <!-- Score summary -->
              <v-card rounded="xl" variant="outlined" class="pa-6">
                <div class="d-flex align-center ga-3 mb-4">
                  <v-avatar size="40" color="primary" variant="tonal">
                    <v-icon icon="lucide:bar-chart-3" />
                  </v-avatar>
                  <div>
                    <div class="text-subtitle-1 font-weight-bold">
                      Score summary
                    </div>
                    <div class="text-body-2 text-medium-emphasis">
                      {{ scoringSummaryHint }}
                    </div>
                  </div>
                </div>

                <v-divider class="mb-5" />

                <!-- Total score -->
                <template v-if="isTotalScore">
                  <v-row>
                    <v-col cols="12" sm="6">
                      <v-card rounded="xl" variant="tonal" class="pa-5">
                        <div class="text-caption text-medium-emphasis">
                          Total score
                        </div>
                        <div class="text-h4 font-weight-bold mt-1">
                          {{ attempt!.scoring?.total_score ?? "—" }}
                        </div>
                      </v-card>
                    </v-col>
                    <v-col cols="12" sm="6">
                      <v-card rounded="xl" variant="outlined" class="pa-5">
                        <div class="text-caption text-medium-emphasis">
                          Band
                        </div>
                        <div class="text-h6 font-weight-bold mt-1">
                          {{ attempt!.scoring?.total_band?.band_level ?? "—" }}
                        </div>
                        <div class="text-caption text-medium-emphasis mt-1">
                          Range: {{ totalBandRange }}
                        </div>
                      </v-card>
                    </v-col>
                  </v-row>
                </template>

                <!-- Multi-dimension -->
                <template v-else>
                  <v-alert
                    type="info"
                    variant="tonal"
                    rounded="xl"
                    class="mb-5"
                  >
                    Dominant dimension:
                    <strong>{{
                      attempt!.scoring?.dominant_dimension?.name ?? "—"
                    }}</strong>
                    ({{ attempt!.scoring?.dominant_dimension?.score ?? "—" }})
                  </v-alert>

                  <v-row>
                    <v-col
                      v-for="item in dimensionItems"
                      :key="item.key"
                      cols="12"
                      sm="6"
                    >
                      <v-card rounded="xl" variant="outlined" class="pa-5">
                        <div class="d-flex align-center justify-space-between">
                          <div
                            class="text-subtitle-2 font-weight-bold text-truncate"
                          >
                            {{ item.name }}
                          </div>
                          <v-chip size="small" variant="tonal" color="primary">
                            {{ item.band }}
                          </v-chip>
                        </div>

                        <div class="text-caption text-medium-emphasis mt-2">
                          Score
                        </div>
                        <div class="text-h5 font-weight-bold">
                          {{ item.score }}
                        </div>
                      </v-card>
                    </v-col>
                  </v-row>
                </template>
              </v-card>
            </template>

            <!-- If results hidden -->
            <template v-else>
              <v-card rounded="xl" variant="outlined" class="pa-8">
                <div class="d-flex align-start ga-3">
                  <v-avatar size="44" color="primary" variant="tonal">
                    <v-icon icon="lucide:mail-check" />
                  </v-avatar>
                  <div>
                    <div class="text-h6 font-weight-bold mb-1">
                      Thank you for submitting
                    </div>
                    <div class="text-body-2 text-medium-emphasis">
                      Your submission has been recorded. Results and reporting
                      are handled by the organization’s workflow.
                    </div>
                  </div>
                </div>

                <v-divider class="my-5" />

                <v-alert type="info" variant="tonal" rounded="xl">
                  If you need confirmation, please contact the program
                  coordinator or your organization admin.
                </v-alert>

                <div class="d-flex flex-column flex-sm-row ga-3 mt-6">
                  <v-btn
                    rounded="xl"
                    color="primary"
                    :to="localePath('/organizations')"
                  >
                    Take another questionnaire
                  </v-btn>
                  <v-btn
                    rounded="xl"
                    variant="outlined"
                    @click="openSampleReport"
                  >
                    View sample report
                  </v-btn>
                </div>
              </v-card>
            </template>
          </v-col>

          <!-- Right sidebar -->
          <v-col cols="12" md="4">
            <v-card rounded="xl" variant="outlined" class="pa-6 mb-6">
              <div class="d-flex align-center ga-3">
                <v-avatar size="40" color="primary" variant="tonal">
                  <v-icon icon="lucide:user" />
                </v-avatar>
                <div>
                  <div class="text-subtitle-1 font-weight-bold">Respondent</div>
                  <div class="text-body-2 text-medium-emphasis">
                    Session snapshot
                  </div>
                </div>
              </div>

              <v-divider class="my-4" />

              <div class="text-body-2 text-medium-emphasis">
                <div
                  v-for="row in userInfoRows"
                  :key="row.label"
                  class="d-flex justify-space-between ga-4 mb-2"
                >
                  <span class="text-truncate">{{ row.label }}</span>
                  <span class="font-weight-medium text-truncate text-right">{{
                    row.value
                  }}</span>
                </div>
              </div>

              <v-divider class="my-4" />

              <v-btn
                rounded="xl"
                variant="outlined"
                block
                @click="clearSession"
              >
                <v-icon icon="lucide:trash-2" size="18" class="me-2" />
                Clear session data
              </v-btn>

              <div class="text-caption text-medium-emphasis mt-3">
                Clears draft/user info/result snapshots for this questionnaire
                in this browser.
              </div>
            </v-card>

            <v-card rounded="xl" variant="outlined" class="pa-6">
              <div class="d-flex align-center ga-3">
                <v-avatar size="40" color="primary" variant="tonal">
                  <v-icon icon="lucide:shield" />
                </v-avatar>
                <div>
                  <div class="text-subtitle-1 font-weight-bold">Privacy</div>
                  <div class="text-body-2 text-medium-emphasis">
                    Organization data boundary
                  </div>
                </div>
              </div>

              <v-divider class="my-4" />

              <div class="text-body-2 text-medium-emphasis">
                SB Questionnaire stores your attempt snapshot in this browser
                session for demo purposes. In production, organizations can
                export and audit results in their dashboards.
              </div>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </section>

    <!-- Sample Report Dialog (placeholder) -->
    <v-dialog v-model="sampleDialog" max-width="820">
      <v-card rounded="xl">
        <v-card-title class="px-6 pt-6">
          <div class="d-flex align-center justify-space-between ga-3">
            <div>
              <div class="text-h6 font-weight-bold">Sample report</div>
              <div class="text-body-2 text-medium-emphasis mt-1">
                Placeholder preview for Phase 1 (download disabled).
              </div>
            </div>
            <v-btn icon variant="text" @click="sampleDialog = false">
              <v-icon icon="lucide:x" />
            </v-btn>
          </div>
        </v-card-title>

        <v-card-text class="px-6">
          <v-card rounded="xl" variant="outlined" class="pa-6">
            <div class="d-flex align-center ga-3 mb-3">
              <v-avatar size="40" color="primary" variant="tonal">
                <v-icon icon="lucide:file-text" />
              </v-avatar>
              <div>
                <div class="font-weight-bold">Export-ready PDF report</div>
                <div class="text-body-2 text-medium-emphasis">
                  Includes overview, scoring summary, interpretation, and
                  recommendations.
                </div>
              </div>
            </div>

            <v-skeleton-loader type="image, text, text, text" />
          </v-card>

          <v-alert type="info" variant="tonal" rounded="xl" class="mt-4">
            Download is disabled in this mock. Wire it to your real export
            pipeline later.
          </v-alert>
        </v-card-text>

        <v-card-actions class="px-6 pb-6">
          <v-btn rounded="xl" variant="text" @click="sampleDialog = false"
            >Close</v-btn
          >
          <v-spacer />
          <v-btn rounded="xl" color="primary" disabled>
            <v-icon icon="lucide:download" size="18" class="me-2" />
            Download (disabled)
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-snackbar v-model="snack.show" :timeout="2200">
      {{ snack.text }}
      <template #actions>
        <v-btn variant="text" @click="snack.show = false">Close</v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import * as mock from "~/utils/mockPublicData";

type UiState = "loading" | "error" | "data" | "empty";
type AnyQuestionnaire = Record<string, any>;

const route = useRoute();
const localePath = useLocalePath();

const code = computed(() => String(route.params.code || ""));

useHead(() => ({
  title: `Result — ${code.value} | SB Questionnaire`,
  meta: [
    {
      name: "description",
      content:
        "View questionnaire result (if enabled) or see submission confirmation on SB Questionnaire.",
    },
  ],
}));

/** Mock access (defensive) */
const questionnairesRaw = computed<AnyQuestionnaire[]>(() => {
  const qs = (mock as any).questionnaires;
  return Array.isArray(qs) ? qs : [];
});

/** UI state */
const uiState = ref<UiState>("loading");
const q = ref<AnyQuestionnaire | null>(null);
const attempt = ref<any | null>(null);

onMounted(() => {
  load();
});

function load() {
  uiState.value = "loading";
  q.value = null;
  attempt.value = null;

  window.setTimeout(() => {
    try {
      const found = questionnairesRaw.value.find(
        (it) => String(it.code) === code.value,
      );
      const published =
        found && String(found.status || "").toLowerCase() === "published";
      q.value = published ? found : null;

      if (!q.value) {
        uiState.value = "empty";
        return;
      }

      // attempt snapshot is stored by take.vue
      const raw = readSessionJson(storageKeyAttempt(code.value));
      attempt.value = raw;

      if (!attempt.value) {
        uiState.value = "empty";
        return;
      }

      uiState.value = "data";
    } catch {
      uiState.value = "error";
    }
  }, 260);
}

/** Breadcrumbs */
const breadcrumbs = computed(() => [
  { title: "Home", to: localePath("/") },
  { title: "Questionnaire", to: localePath(`/q/${code.value}`) },
  { title: "Result", disabled: true },
]);

/** Show result? */
const showResult = computed(() => Boolean(q.value?.show_result_to_user));

const isTotalScore = computed(
  () =>
    String(attempt.value?.scoring_type || q.value?.scoring_type || "") ===
    "total_score",
);

const scoringLabel = computed(() =>
  isTotalScore.value ? "Total score" : "Multi-dimension scoring",
);

const submittedTimeLabel = computed(() => {
  const iso = String(
    attempt.value?.submitted_at ?? attempt.value?.submittedAt ?? "",
  );
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString();
});

/** Header */
const headerTitle = computed(() =>
  showResult.value ? "Your result" : "Submission received",
);
const headerSubtitle = computed(() =>
  showResult.value
    ? "Here is your outcome summary and recommendations based on your responses."
    : "Thank you. Your responses have been recorded and will be processed by the organization.",
);

/** Meaning */
const meaning = computed(() => attempt.value?.scoring?.meaning ?? null);
const defaultMeaningDescription =
  "Your responses have been scored automatically. This outcome is generated using the organization’s scoring and interpretation rules.";

const recommendations = computed<string[]>(() => {
  const recs = meaning.value?.recommendations;
  if (Array.isArray(recs) && recs.length) return recs;
  // fallback
  return [
    "Review the summary and note the key outcome label.",
    "Share your result with your coordinator if required.",
    "Use the recommendations as a checklist for next steps.",
    "Retake the questionnaire later if your situation changes.",
  ];
});

/** Score summary helpers */
const scoringSummaryHint = computed(() => {
  return isTotalScore.value
    ? "Your total score is mapped into a band for interpretation."
    : "Scores are summed per dimension to identify a dominant area and band levels.";
});

const totalBandRange = computed(() => {
  const band = attempt.value?.scoring?.total_band;
  const min = band?.min_score;
  const max = band?.max_score;
  if (min == null && max == null) return "—";
  if (min != null && max != null) return `${min}–${max}`;
  if (min != null) return `≥ ${min}`;
  return `≤ ${max}`;
});

const dimensionItems = computed(() => {
  const bands = attempt.value?.scoring?.dimension_bands || {};
  return Object.values(bands).map((b: any) => ({
    key: String(b.key ?? ""),
    name: String(b.dimension_name ?? b.name ?? b.key ?? "Dimension"),
    score: Number(b.score ?? 0),
    band: String(b.band_level ?? "—"),
  }));
});

/** User info snapshot */
const userInfoRows = computed(() => {
  const info = attempt.value?.user_info || {};
  const entries = Object.entries(info).filter(
    ([_, v]) => v != null && String(v).trim() !== "",
  );
  const rows = entries.slice(0, 8).map(([k, v]) => ({
    label: keyToLabel(k),
    value: String(v),
  }));

  // fallback if empty
  if (!rows.length) {
    return [
      { label: "Session", value: "Anonymous" },
      { label: "Stored", value: "In this browser" },
    ];
  }
  return rows;
});

function keyToLabel(key: string): string {
  return key
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(
      /\w\S*/g,
      (w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase(),
    );
}

/** Dialogs */
const sampleDialog = ref(false);
function openSampleReport() {
  sampleDialog.value = true;
}

/** Session storage keys */
function storageKeyAttempt(codeStr: string) {
  return `sbq:attempt:${codeStr}`;
}
function storageKeyDraft(codeStr: string) {
  return `sbq:draft:${codeStr}`;
}
function storageKeyUserInfo(codeStr: string) {
  return `sbq:user_info:${codeStr}`;
}

function readSessionJson(key: string) {
  if (!import.meta.client) return null;
  try {
    const raw = sessionStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

/** Clear session */
const snack = ref({ show: false, text: "" });
function notify(text: string) {
  snack.value = { show: true, text };
}

function clearSession() {
  if (!import.meta.client) return;
  sessionStorage.removeItem(storageKeyAttempt(code.value));
  sessionStorage.removeItem(storageKeyDraft(code.value));
  sessionStorage.removeItem(storageKeyUserInfo(code.value));
  notify("Session data cleared");
  // refresh local state
  attempt.value = null;
  uiState.value = "empty";
}
</script>

<style lang="scss" scoped>
.result-hero {
  position: relative;
  overflow: hidden;
  border-bottom: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));

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

.result-summary {
  backdrop-filter: blur(10px);
  background-color: rgba(var(--v-theme-surface), 0.85);
}

.result-subtitle {
  max-width: 78ch;
}

.max-width-narrow {
  max-width: 720px;
}

.min-width-0 {
  min-width: 0;
}

.rec-dot {
  border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
}
</style>
