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
                    {{ result.meaningSnapshot || "No summary available." }}
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

              <v-row>
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
                This page shows the latest computed result for your
                questionnaire attempt. You can restart the questionnaire if you
                want to submit a new set of answers.
              </div>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
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

const { item: attempt, resultItem } = storeToRefs(attemptStore);

const code = computed(() => String(route.params.code || "").trim());

const attemptCookie = useCookie<any>(`q-attempt:${code.value}`, {
  sameSite: "lax",
  path: "/",
});

const attemptId = computed(() =>
  String(attemptCookie.value?.attemptId || attempt.value?.id || "").trim(),
);

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
  Array.isArray(result.value?.recommendationsSnapshot)
    ? result.value.recommendationsSnapshot.filter((item) =>
        String(item || "").trim(),
      )
    : [],
);

const scoreItems = computed(() => {
  const scores = result.value?.scoresJson || {};
  const bands = result.value?.bandsJson || {};

  return Object.keys(scores).map((key) => ({
    key,
    label: formatKeyLabel(key),
    score: Number(scores[key] || 0),
    band: String(bands[key] || "").trim(),
  }));
});

const resultLabelText = computed(() =>
  String(result.value?.resultLabel || "Result available").trim(),
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

function readResultFromSession(): QuestionnaireAttemptResultModel | null {
  if (!import.meta.client) return null;

  try {
    const raw = sessionStorage.getItem(`q-result:${code.value}`);
    if (!raw) return null;

    const parsed = JSON.parse(raw);
    if (!parsed?.result?.id) return null;

    return parsed.result as QuestionnaireAttemptResultModel;
  } catch {
    return null;
  }
}

async function loadResult() {
  isPageLoading.value = true;
  localError.value = null;
  hasLoaded.value = false;

  try {
    const cached = readResultFromSession();

    if (cached?.id) {
      localResult.value = cached;
      hasLoaded.value = true;
      isPageLoading.value = false;
      return;
    }

    if (!attemptId.value) {
      localResult.value = createDefaultQuestionnaireAttemptResult();
      hasLoaded.value = false;
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
    sessionStorage.removeItem(`q-result:${code.value}`);
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

onMounted(loadResult);
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
</style>
