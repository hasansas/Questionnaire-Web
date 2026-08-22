<template>
  <div>
    <section class="step-hero">
      <v-container class="main-container">
        <!-- Loading -->
        <div v-if="uiState === 'loading'">
          <v-card rounded="xl" variant="outlined" class="pa-6 pa-md-8">
            <v-skeleton-loader type="heading, text, text" />
            <v-row class="mt-4">
              <v-col cols="12" md="8">
                <v-skeleton-loader type="image, paragraph, paragraph" />
              </v-col>
              <v-col cols="12" md="4">
                <v-skeleton-loader type="paragraph, paragraph, paragraph" />
              </v-col>
            </v-row>
          </v-card>
        </div>

        <!-- Error -->
        <v-card
          v-else-if="uiState === 'error'"
          rounded="xl"
          class="pa-10 pa-md-16 my-10 my-md-16 text-center sb-card"
        >
          <v-avatar
            size="64"
            color="error"
            variant="outlined"
            class="mx-auto mb-4"
          >
            <v-icon icon="lucide:alert-circle" size="28" />
          </v-avatar>

          <div class="text-h6 text-md-h5 font-weight-bold">
            Unable to load result
          </div>

          <div
            class="text-body-2 text-medium-emphasis mt-3 mx-auto max-width-narrow"
          >
            {{
              localError ||
              "We could not load your questionnaire result. Please try again or restart the questionnaire."
            }}
          </div>

          <div class="d-flex justify-center ga-3 flex-wrap mt-6">
            <v-btn color="primary" rounded="lg" @click="loadResult">
              Try again
            </v-btn>

            <v-btn
              variant="outlined"
              rounded="lg"
              :to="localePath(`/q/${code}/user-info`)"
            >
              Restart questionnaire
            </v-btn>
          </div>
        </v-card>

        <!-- Empty -->
        <v-card
          v-else-if="uiState === 'empty'"
          rounded="xl"
          class="pa-10 pa-md-16 my-10 my-md-16 text-center sb-card"
        >
          <v-avatar
            size="64"
            color="primary"
            variant="outlined"
            class="mx-auto mb-4"
          >
            <v-icon icon="lucide:file-search" size="28" />
          </v-avatar>

          <div class="text-h6 text-md-h5 font-weight-bold">
            Result not available yet
          </div>

          <div
            class="text-body-2 text-medium-emphasis mt-3 mx-auto max-width-narrow"
          >
            Your questionnaire result could not be found. Please complete the
            questionnaire first or restart the process.
          </div>

          <div class="d-flex justify-center ga-3 flex-wrap mt-6">
            <v-btn color="primary" rounded="lg" :to="localePath(`/q/${code}`)">
              Back to questionnaire
            </v-btn>

            <v-btn
              variant="outlined"
              rounded="lg"
              :to="localePath(`/q/${code}/user-info`)"
            >
              Restart
            </v-btn>
          </div>
        </v-card>

        <!-- Data -->
        <div v-else>
          <v-card
            variant="flat"
            color="transparent"
            class="mt-10 mt-md-16 mb-8"
          >
            <div
              class="d-flex flex-wrap align-center justify-space-between ga-4"
            >
              <div class="min-width-0">
                <div class="d-flex align-center ga-2 mb-3">
                  <v-chip color="success" variant="outlined" rounded="lg">
                    <v-icon icon="lucide:badge-check" size="16" class="me-1" />
                    Completed
                  </v-chip>

                  <v-chip variant="outlined" rounded="lg">
                    {{ scoringTypeLabel }}
                  </v-chip>
                </div>

                <h1 class="text-h4 text-md-h3 font-weight-bold mb-2">
                  Your Result
                </h1>

                <div class="text-body-1 text-medium-emphasis">
                  {{ resultLabelText }}
                </div>
              </div>

              <div class="text-start text-md-end">
                <div class="text-caption text-medium-emphasis mb-1">
                  Computed at
                </div>
                <div class="text-body-2 font-weight-medium">
                  {{ formattedComputedAt }}
                </div>
              </div>
            </div>
          </v-card>
        </div>
      </v-container>
    </section>

    <section v-if="uiState === 'data'" class="pb-10 pb-md-16">
      <v-container class="main-container">
        <v-row>
          <!-- Main content -->
          <v-col cols="12" md="8">
            <!-- Summary -->
            <v-card rounded="xl" variant="outlined" class="pa-6 pa-md-8 mb-6">
              <div class="d-flex align-start ga-4">
                <v-avatar size="52" color="primary" variant="outlined">
                  <v-icon icon="lucide:sparkles" />
                </v-avatar>

                <div class="min-width-0">
                  <div class="text-h6 font-weight-bold mb-2">
                    Interpretation summary
                  </div>
                  <div class="text-body-1 text-medium-emphasis leading-relaxed">
                    {{
                      result.overallMeaning?.description ||
                      "No summary available."
                    }}
                  </div>
                </div>
              </div>
            </v-card>

            <!-- Scores -->
            <v-card rounded="xl" variant="outlined" class="pa-6 pa-md-8 mb-6">
              <div class="d-flex align-center ga-3 mb-5">
                <v-avatar size="44" color="primary" variant="outlined">
                  <v-icon icon="lucide:bar-chart-3" />
                </v-avatar>
                <div>
                  <div class="text-h6 font-weight-bold">Score breakdown</div>
                  <div class="text-body-2 text-medium-emphasis">
                    Dimension scores and interpretation bands
                  </div>
                </div>
              </div>

              <v-row v-if="isMultiDimension" align="center">
                <v-col cols="12" md="6">
                  <ClientOnly>
                    <apexchart
                      type="radar"
                      height="320"
                      :options="radarOptions"
                      :series="radarSeries"
                    />
                  </ClientOnly>
                </v-col>

                <v-col cols="12" md="6">
                  <div class="d-flex flex-column">
                    <div
                      v-for="(item, index) in scoreItems"
                      :key="item.key"
                      class="d-flex align-center justify-space-between ga-3 score-row"
                    >
                      <div class="d-flex align-center ga-3 min-width-0">
                        <span
                          class="score-dot"
                          :style="{ background: dimensionColor(index) }"
                        />
                        <div class="min-width-0">
                          <div class="text-body-2 font-weight-bold">
                            {{ item.label }}
                          </div>
                          <div class="text-caption text-medium-emphasis">
                            {{ formatBand(item.band) }}
                          </div>
                        </div>
                      </div>

                      <div class="text-h6 font-weight-bold">
                        {{ item.score }}
                      </div>
                    </div>
                  </div>
                </v-col>
              </v-row>

              <v-row v-else>
                <v-col
                  v-for="item in scoreItems"
                  :key="item.key"
                  cols="12"
                  sm="4"
                >
                  <v-card
                    rounded="lg"
                    variant="outlined"
                    class="pa-4 score-card"
                  >
                    <div class="d-flex justify-space-between align-start ga-4">
                      <div class="min-width-0">
                        <div class="text-overline text-medium-emphasis mb-1">
                          {{ item.label }}
                        </div>
                        <div class="text-h5 font-weight-bold">
                          {{ item.score }}
                        </div>
                      </div>

                      <v-chip
                        size="small"
                        rounded="lg"
                        :color="bandColor(item.band)"
                        variant="flat"
                      >
                        {{ formatBand(item.band) }}
                      </v-chip>
                    </div>
                  </v-card>
                </v-col>
              </v-row>
            </v-card>

            <!-- Dimension breakdown -->
            <v-card
              v-if="
                result.scoringTypeSnapshot !== 'total_score' &&
                result.dimensionMeanings?.length
              "
              rounded="xl"
              variant="outlined"
              class="pa-6 pa-md-8 mb-6"
            >
              <div class="d-flex align-center ga-3 mb-5">
                <v-avatar size="44" color="primary" variant="outlined">
                  <v-icon icon="lucide:layers" />
                </v-avatar>
                <div>
                  <div class="text-h6 font-weight-bold">
                    Dimension breakdown
                  </div>
                  <div class="text-body-2 text-medium-emphasis">
                    What each dimension's score means for you
                  </div>
                </div>
              </div>

              <div class="d-flex flex-column ga-4">
                <v-card
                  v-for="dm in result.dimensionMeanings ?? []"
                  :key="dm.dimensionKey"
                  rounded="lg"
                  variant="outlined"
                  class="pa-4 pa-md-5"
                >
                  <div class="d-flex align-center ga-2 flex-wrap mb-3">
                    <span class="text-subtitle-1 font-weight-bold">
                      {{ dm.dimensionLabel || formatKeyLabel(dm.dimensionKey) }}
                    </span>
                    <v-chip
                      size="x-small"
                      rounded="lg"
                      variant="tonal"
                      color="primary"
                    >
                      {{ dm.score }}
                    </v-chip>
                    <v-chip
                      v-if="dm.band"
                      size="x-small"
                      rounded="lg"
                      :color="bandColor(dm.band)"
                      variant="flat"
                    >
                      {{ formatBand(dm.band) }}
                    </v-chip>
                  </div>

                  <div
                    v-if="dm.resultLabel"
                    class="text-subtitle-2 font-weight-bold mb-2"
                  >
                    {{ dm.resultLabel }}
                  </div>
                  <div
                    v-if="dm.description"
                    class="text-body-2 text-medium-emphasis mb-3 leading-relaxed"
                  >
                    {{ dm.description }}
                  </div>
                  <div v-else class="text-body-2 text-medium-emphasis mb-3">
                    No interpretation configured for this band yet.
                  </div>

                  <template v-if="dm.recommendations?.length">
                    <div
                      class="text-caption font-weight-bold text-medium-emphasis mb-2"
                    >
                      Recommendations
                    </div>
                    <div class="d-flex flex-column ga-2">
                      <div
                        v-for="(r, idx) in dm.recommendations"
                        :key="idx"
                        class="d-flex align-start ga-2"
                      >
                        <v-icon
                          icon="lucide:check-circle-2"
                          size="16"
                          color="primary"
                          class="flex-shrink-0 mt-1"
                        />
                        <span class="text-body-2 text-medium-emphasis">{{
                          r
                        }}</span>
                      </div>
                    </div>
                  </template>
                </v-card>
              </div>
            </v-card>

            <!-- Recommendations -->
            <v-card rounded="xl" variant="outlined" class="pa-6 pa-md-8">
              <div class="d-flex align-center ga-3 mb-5">
                <v-avatar size="44" color="primary" variant="outlined">
                  <v-icon icon="lucide:list-checks" />
                </v-avatar>
                <div>
                  <div class="text-h6 font-weight-bold">Recommendations</div>
                  <div class="text-body-2 text-medium-emphasis">
                    Suggested next steps based on your result
                  </div>
                </div>
              </div>

              <div
                v-if="recommendations.length"
                class="d-flex flex-column ga-3"
              >
                <v-card
                  v-for="(item, index) in recommendations"
                  :key="`${index}-${item}`"
                  rounded="lg"
                  variant="outlined"
                  class="pa-4"
                >
                  <div class="d-flex align-start ga-3">
                    <v-avatar size="28" color="primary" variant="flat">
                      <span class="text-caption font-weight-bold">
                        {{ index + 1 }}
                      </span>
                    </v-avatar>
                    <div class="text-body-2 text-medium-emphasis">
                      {{ item }}
                    </div>
                  </div>
                </v-card>
              </div>

              <v-alert v-else type="info" variant="outlined" rounded="lg">
                No recommendations are available for this result yet.
              </v-alert>
            </v-card>
          </v-col>

          <!-- Sidebar -->
          <v-col cols="12" md="4">
            <v-card
              v-if="Object.keys(result.userInfoSnapshot || {}).length"
              rounded="xl"
              variant="outlined"
              class="pa-6 mb-6"
            >
              <div class="d-flex align-center ga-3 mb-4">
                <v-avatar size="44" color="primary" variant="outlined">
                  <v-icon icon="lucide:user" />
                </v-avatar>
                <div>
                  <div class="text-subtitle-1 font-weight-bold">
                    Respondent Info
                  </div>
                  <div class="text-body-2 text-medium-emphasis">
                    Snapshot at submission
                  </div>
                </div>
              </div>

              <v-divider class="my-4" />

              <v-list density="compact" class="pa-0" bg-color="transparent">
                <v-list-item
                  v-for="(val, key) in result.userInfoSnapshot"
                  :key="key"
                  class="px-0"
                >
                  <template #prepend>
                    <v-avatar
                      size="32"
                      color="primary"
                      variant="tonal"
                      rounded="lg"
                    >
                      <v-icon :icon="userInfoIcon(String(key))" size="16" />
                    </v-avatar>
                  </template>

                  <div class="d-flex justify-space-between align-center ga-3">
                    <span class="text-body-2 text-medium-emphasis">
                      {{ key }}
                    </span>
                    <span class="text-body-2 font-weight-medium text-end">
                      {{ String(val) }}
                    </span>
                  </div>
                </v-list-item>
              </v-list>
            </v-card>

            <v-card rounded="xl" variant="outlined" class="pa-6 mb-6">
              <div class="d-flex align-center ga-3">
                <v-avatar size="44" color="primary" variant="outlined">
                  <v-icon icon="lucide:file-text" />
                </v-avatar>
                <div>
                  <div class="text-subtitle-1 font-weight-bold">
                    Result overview
                  </div>
                  <div class="text-body-2 text-medium-emphasis">
                    Snapshot of this questionnaire outcome
                  </div>
                </div>
              </div>

              <v-divider class="my-4" />

              <div class="text-body-2">
                <div
                  class="d-flex justify-space-between align-center mb-3 ga-3"
                >
                  <span class="text-medium-emphasis">Label</span>
                  <span class="font-weight-medium text-end">
                    {{ resultLabelText }}
                  </span>
                </div>

                <div
                  class="d-flex justify-space-between align-center mb-3 ga-3"
                >
                  <span class="text-medium-emphasis">Scoring type</span>
                  <span class="font-weight-medium text-end">
                    {{ scoringTypeLabel }}
                  </span>
                </div>

                <div
                  class="d-flex justify-space-between align-center mb-3 ga-3"
                >
                  <span class="text-medium-emphasis">Dimensions</span>
                  <span class="font-weight-medium">
                    {{ scoreItems.length }}
                  </span>
                </div>

                <div class="d-flex justify-space-between align-center ga-3">
                  <span class="text-medium-emphasis">Updated</span>
                  <span class="font-weight-medium text-end">
                    {{ formattedUpdatedAt }}
                  </span>
                </div>
              </div>

              <v-divider class="my-4" />

              <div class="d-flex flex-column ga-3">
                <v-btn
                  color="primary"
                  rounded="lg"
                  block
                  :to="localePath(`/q/${code}`)"
                >
                  View questionnaire
                </v-btn>

                <v-btn variant="outlined" rounded="lg" block @click="restart">
                  Retake questionnaire
                </v-btn>
              </div>
            </v-card>

            <v-card rounded="xl" variant="outlined" class="pa-6">
              <div class="d-flex align-center ga-3">
                <v-avatar size="44" color="primary" variant="outlined">
                  <v-icon icon="lucide:shield-check" />
                </v-avatar>
                <div>
                  <div class="text-subtitle-1 font-weight-bold">
                    Session note
                  </div>
                  <div class="text-body-2 text-medium-emphasis">
                    Result was generated from your saved attempt
                  </div>
                </div>
              </div>

              <v-divider class="my-4" />

              <div class="text-body-2 text-medium-emphasis">
                This page shows the computed result for this questionnaire
                attempt. It's linked to your attempt ID, so this link stays
                accessible even after your session ends. You can retake the
                questionnaire if you want to submit a new set of answers.
              </div>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { storeToRefs } from "pinia";
import { useQuestionnaireAttemptStore } from "~/stores/questionnaire-attempt";
import {
  createDefaultQuestionnaireAttemptResult,
  type QuestionnaireAttemptResultModel,
} from "~/models/questionnaire-attempt-result.model";

definePageMeta({
  layout: "empty",
});

type UiState = "loading" | "error" | "data" | "empty";

const route = useRoute();
const localePath = useLocalePath();
const attemptStore = useQuestionnaireAttemptStore();
const snack = useAppSnackbar();

const { resultItem } = storeToRefs(attemptStore);

const code = computed(() => String(route.params.code || "").trim());
const attemptId = computed(() => String(route.params.attemptId || "").trim());

const localResult = ref<QuestionnaireAttemptResultModel>(
  createDefaultQuestionnaireAttemptResult(),
);
const isPageLoading = ref(true);
const localError = ref<string | null>(null);
const hasLoaded = ref(false);

const result = computed(() => localResult.value);

const uiState = computed<UiState>(() => {
  if (isPageLoading.value) return "loading";
  if (localError.value) return "error";
  if (!hasLoaded.value || !result.value?.id) return "empty";
  return "data";
});

const recommendations = computed(() =>
  Array.isArray(result.value?.overallMeaning?.recommendations)
    ? result.value.overallMeaning.recommendations.filter((item: string) =>
        String(item || "").trim(),
      )
    : [],
);

const dimensionLabelByKey = computed(() => {
  const map: Record<string, string> = {};
  for (const dm of result.value?.dimensionMeanings ?? []) {
    if (dm.dimensionKey && dm.dimensionLabel) {
      map[dm.dimensionKey] = dm.dimensionLabel;
    }
  }
  return map;
});

const scoreItems = computed(() => {
  const scores = result.value?.scoresJson || {};
  const bands = result.value?.bandsJson || {};

  return Object.keys(scores).map((key) => ({
    key,
    label: dimensionLabelByKey.value[key] || formatKeyLabel(key),
    score: Number(scores[key] || 0),
    band: String(bands[key] || "").trim(),
  }));
});

const resultLabelText = computed(() =>
  String(
    result.value?.overallMeaning?.resultLabel || "Result available",
  ).trim(),
);

const scoringTypeLabel = computed(() => {
  switch (result.value?.scoringTypeSnapshot) {
    case "multi_dimension":
      return "Multi-dimension";
    case "banded":
      return "Band-based";
    default:
      return "Total score";
  }
});

const formattedComputedAt = computed(() =>
  formatDateTime(result.value?.computedAt),
);

const formattedUpdatedAt = computed(() =>
  formatDateTime(result.value?.updatedAt),
);

function notifyError(text: string) {
  snack.open(text, { color: "error" });
}

function userInfoIcon(key: string) {
  const text = String(key || "").toLowerCase();

  if (/email/.test(text)) return "lucide:mail";
  if (/phone|mobile|whatsapp|wa\b/.test(text)) return "lucide:phone";
  if (/name/.test(text)) return "lucide:user";
  if (/gender/.test(text)) return "lucide:venus-and-mars";
  if (/age|birth|dob/.test(text)) return "lucide:cake";
  if (/address|location|city|country/.test(text)) return "lucide:map-pin";
  if (/company|organization|office/.test(text)) return "lucide:building-2";
  if (/job|role|position|occupation/.test(text)) return "lucide:briefcase";
  if (/education|school|university/.test(text)) return "lucide:graduation-cap";
  if (/date|time/.test(text)) return "lucide:calendar";

  return "lucide:info";
}

function formatKeyLabel(value: string) {
  const text = String(value || "").trim();
  if (!text) return "-";

  return text
    .replace(/[_-]+/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function formatBand(value: string) {
  const text = String(value || "").trim();
  if (!text) return "-";

  return text.charAt(0).toUpperCase() + text.slice(1);
}

const isMultiDimension = computed(
  () => result.value?.scoringTypeSnapshot === "multi_dimension",
);

const radarSeries = computed(() => {
  if (!isMultiDimension.value) return [];
  return [
    {
      name: "Score",
      data: scoreItems.value.map((item) => item.score),
    },
  ];
});

const radarOptions = computed(() => ({
  chart: {
    type: "radar",
    toolbar: { show: false },
  },
  xaxis: {
    categories: scoreItems.value.map((item) => [
      item.key,
      formatBand(item.band),
    ]),
    labels: { style: { fontSize: "12px" } },
  },
  yaxis: { show: false },
  colors: ["#6366f1"],
  fill: { opacity: 0.3 },
  stroke: { width: 2 },
  markers: { size: 4 },
  dataLabels: { enabled: false },
  plotOptions: {
    radar: {
      polygons: {
        strokeColors: "#9ca3af",
        connectorColors: "#e5e7eb",
        fill: {
          colors: ["white", "white"],
        },
      },
    },
  },
}));

const dimensionColorPalette = [
  "#ef4444",
  "#f97316",
  "#6b7280",
  "#3b82f6",
  "#10b981",
  "#a855f7",
  "#eab308",
  "#14b8a6",
];

function dimensionColor(index: number) {
  return dimensionColorPalette[index % dimensionColorPalette.length];
}

function bandColor(value: string) {
  const band = String(value || "")
    .trim()
    .toLowerCase();

  if (band === "high") return "success";
  if (band === "medium") return "warning";
  if (band === "low") return "error";

  return "primary";
}

function formatDateTime(value?: string) {
  const text = String(value || "").trim();
  if (!text) return "-";

  try {
    return new Intl.DateTimeFormat("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(text));
  } catch {
    return text;
  }
}

async function loadResult() {
  isPageLoading.value = true;
  localError.value = null;
  hasLoaded.value = false;

  if (!attemptId.value) {
    localResult.value = createDefaultQuestionnaireAttemptResult();
    hasLoaded.value = false;
    isPageLoading.value = false;
    return;
  }

  try {
    // Reuse the just-submitted result already in the store (set by
    // take.vue right before navigating here) to avoid a redundant
    // round-trip. Always falls through to a live fetch otherwise —
    // e.g. a shared link, a different browser, or after a page reload
    // where Pinia state has reset.
    if (
      resultItem.value?.id &&
      resultItem.value.attemptId === attemptId.value
    ) {
      localResult.value = resultItem.value;
      hasLoaded.value = true;
      isPageLoading.value = false;
      return;
    }

    const response = await attemptStore.getAttemptResult(attemptId.value);

    if (!response?.id) {
      localResult.value = createDefaultQuestionnaireAttemptResult();
      hasLoaded.value = false;
      return;
    }

    localResult.value = response;
    hasLoaded.value = true;
  } catch (err: any) {
    localError.value =
      err?.response?.data?.message ||
      err?.message ||
      "Failed to load questionnaire result.";
    notifyError(localError.value ?? "Failed to load questionnaire result.");
    hasLoaded.value = false;
  } finally {
    isPageLoading.value = false;
  }
}

function restart() {
  const cookie = useCookie(`q-attempt:${code.value}`, {
    sameSite: "lax",
    path: "/",
  });
  cookie.value = null;

  attemptStore.resetState();

  if (import.meta.client) {
    sessionStorage.removeItem(`q-user-info:${code.value}`);
  }

  navigateTo(localePath(`/q/${code.value}/user-info`));
}

useHead(() => ({
  title:
    uiState.value === "data"
      ? `${resultLabelText.value} | Questionnaire Result`
      : `Questionnaire Result — ${code.value}`,
  meta: [
    {
      name: "description",
      content:
        uiState.value === "data"
          ? `View your questionnaire result for ${code.value}.`
          : "View your questionnaire result.",
    },
  ],
}));

// `immediate: true` covers the initial mount; the watch itself covers
// navigating between two different attemptId URLs without a full
// page reload (Vue Router reuses this component instance).
watch(attemptId, loadResult, { immediate: true });
</script>

<style scoped>
.max-width-narrow {
  max-width: 560px;
}

.leading-relaxed {
  line-height: 1.75;
}

.score-card {
  min-height: 110px;
}

.score-row {
  padding-block: 10px;
  border-bottom: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
}

.score-row:last-child {
  border-bottom: none;
}

.score-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  flex-shrink: 0;
}

/* only target the top label (first one in radar) */
:deep(.apexcharts-xaxis-label:first-of-type) {
  transform: translateY(-16px) !important;
}

:deep(.apexcharts-xaxis-label tspan:nth-child(1)) {
  text-transform: uppercase;
  fill: #666 !important;
  font-weight: 700;
}
</style>
