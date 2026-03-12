<template>
  <div>
    <!-- HERO -->
    <section class="page-header">
      <v-container class="main-container">
        <!-- Loading -->
        <v-row v-if="uiState === 'loading'" align="center">
          <v-col cols="12" md="8">
            <v-skeleton-loader type="heading, text, text" />
          </v-col>
          <v-col cols="12" md="4">
            <v-card rounded="lg" variant="outlined" class="pa-6">
              <v-skeleton-loader type="avatar, text, text, actions" />
            </v-card>
          </v-col>
        </v-row>

        <!-- Error -->
        <v-card
          v-else-if="uiState === 'error'"
          rounded="lg"
          class="pa-16 my-16 text-center sb-card"
        >
          <v-avatar
            size="56"
            color="error"
            variant="tonal"
            class="mx-auto mb-3"
          >
            <v-icon icon="lucide:alert-circle" />
          </v-avatar>

          <div class="text-h6 font-weight-bold">
            Unable to load questionnaire
          </div>

          <div
            class="text-body-2 text-medium-emphasis mt-2 mx-auto max-width-narrow"
          >
            {{
              store.error ||
              "Something went wrong while loading this questionnaire. Please try again in a moment or use the original link provided by the organization."
            }}
          </div>

          <div class="d-flex justify-center ga-3 flex-wrap mt-5">
            <v-btn color="primary" rounded="lg" @click="loadData">
              Try again
            </v-btn>

            <v-btn variant="outlined" rounded="lg" @click="copyLink">
              <v-icon icon="lucide:link" size="18" class="me-2" />
              Copy link
            </v-btn>
          </div>
        </v-card>

        <!-- Empty / Not found -->
        <v-card
          v-else-if="uiState === 'empty'"
          rounded="lg"
          class="pa-16 my-16 text-center sb-card"
        >
          <v-avatar
            size="56"
            color="primary"
            variant="tonal"
            class="mx-auto mb-3"
          >
            <v-icon icon="lucide:search-x" />
          </v-avatar>
          <div class="text-h6 font-weight-bold">Questionnaire not found</div>
          <div
            class="text-body-2 text-medium-emphasis mt-2 mx-auto max-width-narrow"
          >
            The questionnaire link “{{ code }}” is invalid or no longer
            available. Please contact the organization for the correct access
            link.
          </div>
        </v-card>

        <!-- Data -->
        <div v-else>
          <v-row align="center">
            <v-col cols="12" md="8">
              <div class="d-flex align-center ga-3 mb-4">
                <v-avatar size="56" variant="tonal" rounded="lg">
                  <v-icon icon="lucide:clipboard-list" />
                </v-avatar>

                <div class="min-width-0">
                  <div class="text-body-2 text-medium-emphasis mb-1">
                    {{ orgName }}
                  </div>

                  <h1
                    class="text-h4 text-md-h3 font-weight-bold mb-1 text-truncate"
                  >
                    {{ q.title }}
                  </h1>

                  <div class="text-body-1 text-medium-emphasis">
                    {{ qMetaLine }}
                  </div>
                </div>
              </div>

              <p class="text-body-1 text-medium-emphasis mb-0 q-hero-subtitle">
                {{ heroDescription }}
              </p>

              <div class="d-flex flex-wrap ga-2 mt-5">
                <v-chip
                  size="small"
                  variant="outlined"
                  class="text-medium-emphasis"
                >
                  <v-icon icon="lucide:languages" size="16" class="me-1" />
                  {{ languageLabel }}
                </v-chip>

                <v-chip
                  size="small"
                  variant="outlined"
                  class="text-medium-emphasis"
                >
                  <v-icon icon="lucide:clock" size="16" class="me-1" />
                  ~{{ estimatedMinutes }} min
                </v-chip>

                <v-chip
                  size="small"
                  variant="outlined"
                  class="text-medium-emphasis"
                >
                  <v-icon icon="lucide:list-checks" size="16" class="me-1" />
                  {{ questionCount }} questions
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
                  v-if="q.optionsMode"
                  size="small"
                  variant="outlined"
                  class="text-medium-emphasis"
                >
                  <v-icon
                    icon="lucide:sliders-horizontal"
                    size="16"
                    class="me-1"
                  />
                  {{ optionsModeLabel }}
                </v-chip>

                <v-chip
                  size="small"
                  :color="q.showResultToUser ? 'primary' : undefined"
                  :variant="q.showResultToUser ? 'tonal' : 'outlined'"
                  class="text-medium-emphasis"
                >
                  <v-icon
                    :icon="q.showResultToUser ? 'lucide:eye' : 'lucide:eye-off'"
                    size="16"
                    class="me-1"
                  />
                  {{
                    q.showResultToUser
                      ? "Result available after submit"
                      : "Submission confirmation only"
                  }}
                </v-chip>
              </div>
            </v-col>

            <v-col cols="12" md="4">
              <v-card rounded="lg" variant="outlined" class="pa-6 q-summary">
                <div class="d-flex align-start ga-3">
                  <v-avatar
                    size="40"
                    color="primary"
                    variant="tonal"
                    rounded="lg"
                    class="mt-2"
                  >
                    <v-icon icon="lucide:list-checks" />
                  </v-avatar>
                  <div>
                    <div class="text-subtitle-1 font-weight-bold">
                      Before you begin
                    </div>
                    <div class="text-body-2 text-medium-emphasis">
                      Review the instructions, prepare a few quiet minutes, then
                      continue to the respondent information form.
                    </div>
                  </div>
                </div>

                <v-divider class="my-4" />

                <div class="d-flex justify-space-between align-center mb-2">
                  <div class="text-caption text-medium-emphasis">
                    Organization
                  </div>
                  <div class="text-body-2 font-weight-medium text-right">
                    {{ orgName }}
                  </div>
                </div>

                <div class="d-flex justify-space-between align-center mb-2">
                  <div class="text-caption text-medium-emphasis">Questions</div>
                  <div class="text-h6 font-weight-bold">
                    {{ questionCount }}
                  </div>
                </div>

                <div class="d-flex justify-space-between align-center mb-2">
                  <div class="text-caption text-medium-emphasis">
                    Estimated time
                  </div>
                  <div class="text-body-2 font-weight-medium">
                    ~{{ estimatedMinutes }} min
                  </div>
                </div>

                <div class="d-flex justify-space-between align-center mb-4">
                  <div class="text-caption text-medium-emphasis">
                    Result access
                  </div>
                  <div class="text-body-2 font-weight-medium text-right">
                    {{
                      q.showResultToUser
                        ? "Shown after submit"
                        : "Handled by organization"
                    }}
                  </div>
                </div>

                <v-btn
                  variant="flat"
                  color="primary"
                  rounded="lg"
                  block
                  @click="begin"
                >
                  Begin questionnaire
                </v-btn>

                <v-btn
                  class="mt-3"
                  variant="outlined"
                  rounded="lg"
                  block
                  @click="openShare"
                >
                  <v-icon icon="lucide:share-2" size="18" class="me-2" />
                  Share link
                </v-btn>
              </v-card>
            </v-col>
          </v-row>
        </div>
      </v-container>
    </section>

    <!-- DETAILS -->
    <section v-if="uiState === 'data'" class="sb-section">
      <v-container class="main-container">
        <v-row>
          <!-- Left: What to expect -->
          <v-col cols="12" md="8">
            <h2 class="text-h5 text-md-h4 font-weight-bold mb-6">
              What to expect
            </h2>

            <v-row>
              <v-col cols="12" sm="6">
                <v-card rounded="lg" variant="outlined" class="pa-6 h-100">
                  <div class="d-flex align-center ga-3 mb-3">
                    <v-avatar size="40" color="primary" variant="tonal">
                      <v-icon icon="lucide:id-card" />
                    </v-avatar>
                    <div class="text-subtitle-1 font-weight-bold">
                      Respondent information
                    </div>
                  </div>
                  <div class="text-body-2 text-medium-emphasis">
                    Before answering the questionnaire, you’ll complete a short
                    respondent form. This helps {{ orgName }} identify and
                    manage responses properly.
                  </div>
                </v-card>
              </v-col>

              <v-col cols="12" sm="6">
                <v-card rounded="lg" variant="outlined" class="pa-6 h-100">
                  <div class="d-flex align-center ga-3 mb-3">
                    <v-avatar size="40" color="primary" variant="tonal">
                      <v-icon icon="lucide:check-square" />
                    </v-avatar>
                    <div class="text-subtitle-1 font-weight-bold">
                      Clear question flow
                    </div>
                  </div>
                  <div class="text-body-2 text-medium-emphasis">
                    You’ll answer one item at a time using a simple, guided
                    flow. Each question is designed to make completion easy and
                    consistent.
                  </div>
                </v-card>
              </v-col>

              <v-col cols="12" sm="6">
                <v-card rounded="lg" variant="outlined" class="pa-6 h-100">
                  <div class="d-flex align-center ga-3 mb-3">
                    <v-avatar size="40" color="primary" variant="tonal">
                      <v-icon icon="lucide:bar-chart-3" />
                    </v-avatar>
                    <div class="text-subtitle-1 font-weight-bold">
                      {{ scoringCardTitle }}
                    </div>
                  </div>
                  <div class="text-body-2 text-medium-emphasis">
                    {{ scoringCardDescription }}
                  </div>
                </v-card>
              </v-col>

              <v-col cols="12" sm="6">
                <v-card rounded="lg" variant="outlined" class="pa-6 h-100">
                  <div class="d-flex align-center ga-3 mb-3">
                    <v-avatar size="40" color="primary" variant="tonal">
                      <v-icon
                        :icon="
                          q.showResultToUser ? 'lucide:eye' : 'lucide:send'
                        "
                      />
                    </v-avatar>
                    <div class="text-subtitle-1 font-weight-bold">
                      {{
                        q.showResultToUser
                          ? "Immediate result page"
                          : "Submission confirmation"
                      }}
                    </div>
                  </div>
                  <div class="text-body-2 text-medium-emphasis">
                    {{
                      q.showResultToUser
                        ? "After submission, your result will appear automatically based on the configured scoring logic."
                        : `After submission, you will see a confirmation page. Final review and follow-up will be handled by ${orgName}.`
                    }}
                  </div>
                </v-card>
              </v-col>
            </v-row>

            <v-card rounded="lg" variant="outlined" class="pa-6 mt-6">
              <div class="d-flex align-center ga-3 mb-3">
                <v-avatar size="40" color="primary" variant="tonal">
                  <v-icon icon="lucide:scroll-text" />
                </v-avatar>
                <div>
                  <div class="text-subtitle-1 font-weight-bold">
                    Instructions
                  </div>
                  <div class="text-body-2 text-medium-emphasis">
                    Please read before starting
                  </div>
                </div>
              </div>

              <div class="text-body-2 text-medium-emphasis">
                {{ instructionsText }}
              </div>
            </v-card>
          </v-col>

          <!-- Right: Tips -->
          <v-col cols="12" md="4">
            <v-card rounded="lg" variant="outlined" class="pa-6">
              <div class="d-flex align-center ga-3">
                <v-avatar size="40" color="primary" variant="tonal">
                  <v-icon icon="lucide:lightbulb" />
                </v-avatar>
                <div>
                  <div class="text-subtitle-1 font-weight-bold">Tips</div>
                  <div class="text-body-2 text-medium-emphasis">
                    For the best response quality
                  </div>
                </div>
              </div>

              <v-divider class="my-4" />

              <v-list class="bg-transparent" lines="one">
                <v-list-item>
                  <template #prepend>
                    <v-icon icon="lucide:check" class="text-medium-emphasis" />
                  </template>
                  <v-list-item-title class="text-body-2">
                    Answer based on your real condition, not what you think is
                    the “best” answer.
                  </v-list-item-title>
                </v-list-item>

                <v-list-item>
                  <template #prepend>
                    <v-icon icon="lucide:check" class="text-medium-emphasis" />
                  </template>
                  <v-list-item-title class="text-body-2">
                    Set aside around {{ estimatedMinutes }} minute{{
                      estimatedMinutes > 1 ? "s" : ""
                    }}
                    so you can complete it in one sitting.
                  </v-list-item-title>
                </v-list-item>

                <v-list-item>
                  <template #prepend>
                    <v-icon icon="lucide:check" class="text-medium-emphasis" />
                  </template>
                  <v-list-item-title class="text-body-2">
                    Avoid refreshing or closing the page while answering.
                  </v-list-item-title>
                </v-list-item>

                <v-list-item>
                  <template #prepend>
                    <v-icon icon="lucide:check" class="text-medium-emphasis" />
                  </template>
                  <v-list-item-title class="text-body-2">
                    If you are unsure, choose the option that feels most
                    accurate overall.
                  </v-list-item-title>
                </v-list-item>
              </v-list>

              <v-btn
                class="mt-2"
                color="primary"
                rounded="lg"
                block
                @click="begin"
              >
                Begin questionnaire
              </v-btn>

              <v-btn
                class="mt-3"
                variant="outlined"
                rounded="lg"
                block
                @click="copyLink"
              >
                <v-icon icon="lucide:link" size="18" class="me-2" />
                Copy link
              </v-btn>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </section>

    <!-- Share dialog -->
    <v-dialog v-model="shareDialog" max-width="640">
      <v-card rounded="lg">
        <v-card-title class="px-6 pt-6">
          <div class="d-flex align-center justify-space-between ga-3">
            <div>
              <div class="text-h6 font-weight-bold">Share questionnaire</div>
              <div class="text-body-2 text-medium-emphasis mt-1">
                Copy this link and send it to respondents.
              </div>
            </div>
            <v-btn icon variant="text" @click="shareDialog = false">
              <v-icon icon="lucide:x" />
            </v-btn>
          </div>
        </v-card-title>

        <v-card-text class="px-6">
          <v-text-field
            :model-value="shareUrl"
            label="Share link"
            variant="outlined"
            rounded="lg"
            readonly
            hide-details
          >
            <template #append-inner>
              <v-btn
                variant="text"
                @click="copyText(shareUrl)"
                aria-label="Copy share link"
              >
                <v-icon icon="lucide:copy" />
              </v-btn>
            </template>
          </v-text-field>

          <v-alert class="mt-4" type="info" variant="tonal" rounded="lg">
            Respondents will fill in their information first, continue through
            the questionnaire, and then submit their answers for scoring.
          </v-alert>
        </v-card-text>

        <v-card-actions class="px-6 pb-6">
          <v-btn variant="text" rounded="lg" @click="shareDialog = false">
            Close
          </v-btn>
          <v-spacer />
          <v-btn color="primary" rounded="lg" @click="copyText(shareUrl)">
            Copy link
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Snack -->
    <v-snackbar v-model="snack.show" :timeout="2200">
      {{ snack.text }}
      <template #actions>
        <v-btn variant="text" @click="snack.show = false">Close</v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, watch } from "vue";
import { storeToRefs } from "pinia";

const route = useRoute();
const localePath = useLocalePath();
const store = useOrganizationQuestionnaireStore();

const { item, loading, loaded } = storeToRefs(store);

const code = computed(() => String(route.params.code || "").trim());

const org = computed(() => item.value.organization);
const q = computed(() => item.value.questionnaire);
const assignment = computed(() => item.value.assignment);

type UiState = "loading" | "error" | "data" | "empty";
const uiState = computed<UiState>(() => {
  if (loading.value) return "loading";
  if (store.error) return "error";
  if (!loaded.value || !q.value?.id || !q.value?.code || !q.value?.title) {
    return "empty";
  }
  return "data";
});

const orgName = computed(() => org.value?.name || "Organization");

const questionCount = computed(() => {
  if (
    typeof q.value?.totalQuestions === "number" &&
    q.value.totalQuestions > 0
  ) {
    return q.value.totalQuestions;
  }
  return 0;
});

const estimatedMinutes = computed(() => {
  if (
    typeof q.value?.estimatedTimeMinutes === "number" &&
    q.value.estimatedTimeMinutes > 0
  ) {
    return q.value.estimatedTimeMinutes;
  }

  const fallback = Math.ceil(questionCount.value / 4);
  return Math.max(1, fallback || 1);
});

const scoringLabel = computed(() => {
  switch (q.value?.scoringType) {
    case "multi_dimension":
      return "Multi-dimension scoring";
    case "banded":
      return "Band-based scoring";
    default:
      return "Total score";
  }
});

const optionsModeLabel = computed(() => {
  switch (q.value?.optionsMode) {
    case "fixed":
      return "Fixed answer options";
    case "per_question":
      return "Per-question options";
    default:
      return "Answer options configured";
  }
});

const languageLabel = computed(() => {
  const lang = String(q.value?.language || "").toLowerCase();

  if (lang === "id") return "Bahasa Indonesia";
  if (lang === "en") return "English";

  return String(q.value?.language || "-").toUpperCase();
});

const heroDescription = computed(() => {
  if (q.value?.description?.trim()) return q.value.description.trim();

  return `This questionnaire is provided by ${orgName.value} to help collect structured responses in a clear and guided format. Please read the instructions carefully and answer each question honestly.`;
});

const qMetaLine = computed(() => {
  const pieces: string[] = [];

  pieces.push(scoringLabel.value);

  if (questionCount.value > 0) {
    pieces.push(`${questionCount.value} questions`);
  }

  if (estimatedMinutes.value > 0) {
    pieces.push(`~${estimatedMinutes.value} min`);
  }

  return pieces.join(" • ");
});

const scoringCardTitle = computed(() => {
  switch (q.value?.scoringType) {
    case "multi_dimension":
      return "Multi-dimension result";
    case "banded":
      return "Band-based interpretation";
    default:
      return "Automatic total scoring";
  }
});

const scoringCardDescription = computed(() => {
  switch (q.value?.scoringType) {
    case "multi_dimension":
      return "Your answers are grouped into multiple dimensions so the result can reflect different aspects of your profile more accurately.";
    case "banded":
      return "Your total score will be matched into a scoring band to determine the most relevant interpretation or outcome.";
    default:
      return "Your responses are calculated automatically into a final score based on the configured answer weights.";
  }
});

const instructionsText = computed(() => {
  if (q.value?.instructions?.trim()) return q.value.instructions.trim();

  return `Please answer all questions carefully and based on your actual condition. There are ${questionCount.value || "several"} question${questionCount.value === 1 ? "" : "s"} in this questionnaire, and it usually takes around ${estimatedMinutes.value} minute${estimatedMinutes.value > 1 ? "s" : ""} to complete.`;
});

useHead(() => ({
  title:
    uiState.value === "data"
      ? `${q.value.title} | ${orgName.value}`
      : `Questionnaire — ${code.value}`,
  meta: [
    {
      name: "description",
      content:
        uiState.value === "data"
          ? heroDescription.value
          : "Start a questionnaire through a secure shareable link.",
    },
    {
      property: "og:title",
      content:
        uiState.value === "data"
          ? `${q.value.title} | ${orgName.value}`
          : `Questionnaire — ${code.value}`,
    },
    {
      property: "og:description",
      content:
        uiState.value === "data"
          ? heroDescription.value
          : "Start a questionnaire through a secure shareable link.",
    },
  ],
}));

async function loadData() {
  if (!code.value) return;
  await store.fetchByCode(code.value);
}

onMounted(loadData);
watch(code, loadData);

/** Actions */
function begin() {
  if (!q.value?.code) return;
  navigateTo(localePath(`/q/${assignment.value.shareCode}/user-info`));
}

/** Share */
const shareDialog = ref(false);
const shareUrl = computed(() => {
  const path = localePath(`/q/${code.value}`);
  if (import.meta.client) return `${window.location.origin}${path}`;
  return path;
});

function openShare() {
  shareDialog.value = true;
}

const snack = ref({ show: false, text: "" });

function notify(text: string) {
  snack.value = { show: true, text };
}

async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    notify("Copied to clipboard");
  } catch {
    notify("Copy failed");
  }
}

function copyLink() {
  copyText(shareUrl.value);
}
</script>

<style lang="scss" scoped>
.q-summary {
  backdrop-filter: blur(10px);
  background-color: rgba(var(--v-theme-surface), 0.8);
}

.q-hero-subtitle {
  max-width: 78ch;
}

.max-width-narrow {
  max-width: 720px;
}

.min-width-0 {
  min-width: 0;
}
</style>
