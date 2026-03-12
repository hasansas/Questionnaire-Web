<template>
  <div>
    <!-- Header -->
    <section class="step-hero">
      <v-container class="main-container">
        <!-- Loading -->
        <div v-if="uiState === 'loading'">
          <v-skeleton-loader type="heading, text, text" />
          <v-row class="mt-4">
            <v-col cols="12" md="8">
              <v-card rounded="lg" variant="outlined" class="pa-6">
                <v-skeleton-loader type="text, text, text, actions" />
              </v-card>
            </v-col>
            <v-col cols="12" md="4">
              <v-card rounded="lg" variant="outlined" class="pa-6">
                <v-skeleton-loader type="avatar, text, text, text" />
              </v-card>
            </v-col>
          </v-row>
        </div>

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
            Unable to load questionnaire session
          </div>

          <div
            class="text-body-2 text-medium-emphasis mt-2 mx-auto max-width-narrow"
          >
            {{
              combinedError ||
              "This questionnaire session could not be opened. Please try again or restart from the questionnaire link."
            }}
          </div>

          <div class="d-flex justify-center ga-3 flex-wrap mt-5">
            <v-btn color="primary" rounded="lg" @click="loadData">
              Try again
            </v-btn>

            <v-btn
              variant="outlined"
              rounded="lg"
              :to="localePath(`/q/${code}`)"
            >
              Back to questionnaire
            </v-btn>
          </div>
        </v-card>

        <!-- Empty -->
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
            <v-icon icon="lucide:file-search" />
          </v-avatar>

          <div class="text-h6 font-weight-bold">
            Questionnaire session not found
          </div>

          <div
            class="text-body-2 text-medium-emphasis mt-2 mx-auto max-width-narrow"
          >
            Your questionnaire session may have expired or is no longer valid.
            Please restart from the respondent information page.
          </div>

          <div class="d-flex justify-center ga-3 flex-wrap mt-5">
            <v-btn
              color="primary"
              rounded="lg"
              :to="localePath(`/q/${code}/user-info`)"
            >
              Restart questionnaire
            </v-btn>
          </div>
        </v-card>

        <!-- Data -->
        <div v-else>
          <v-card variant="flat" color="transparent" class="mt-16 mb-8">
            <div
              class="d-flex flex-wrap align-center justify-space-between ga-4"
            >
              <div class="min-width-0">
                <h1
                  class="text-h5 text-md-h4 font-weight-bold mb-1 text-truncate"
                >
                  Answer the questions
                </h1>
                <div class="text-body-2 text-medium-emphasis">
                  {{ questionnaire.title }} • Step 2 of 2
                </div>
              </div>

              <v-chip
                size="small"
                variant="outlined"
                class="text-medium-emphasis"
              >
                <v-icon icon="lucide:clock" size="16" class="me-1" />
                ~{{ estimatedMinutes }} min
              </v-chip>
            </div>

            <div class="mt-8">
              <div class="d-flex justify-space-between align-center mb-2">
                <div class="text-caption text-medium-emphasis">
                  Question
                  <strong>{{ progress.currentQuestionNumber || 1 }}</strong>
                  of
                  <strong>{{ progress.totalQuestions || 0 }}</strong>
                </div>
                <div class="text-caption text-medium-emphasis">
                  {{ progress.answeredQuestions }}/{{ progress.totalQuestions }}
                  answered
                </div>
              </div>

              <v-progress-linear
                :model-value="progressValue"
                height="8"
                rounded
                color="primary"
              />
            </div>
          </v-card>
        </div>
      </v-container>
    </section>

    <!-- Content -->
    <section v-if="uiState === 'data'">
      <v-container class="main-container">
        <v-row class="mt-8">
          <!-- Main -->
          <v-col cols="12" md="8">
            <v-card rounded="lg" variant="outlined" class="pa-6">
              <div class="d-flex align-start ga-3 mb-4">
                <v-avatar size="40" color="primary" variant="tonal">
                  <v-icon icon="lucide:check-square" />
                </v-avatar>

                <div class="min-width-0">
                  <div class="text-subtitle-1 font-weight-bold mb-1">
                    {{
                      question.text ||
                      `Question ${progress.currentQuestionNumber}`
                    }}
                  </div>

                  <!-- <div class="text-body-2 text-medium-emphasis">
                    {{ question.description || questionHint }}
                    <span
                      v-if="question.isRequired"
                      class="ms-1 font-weight-medium"
                    >
                      Required
                    </span>
                  </div> -->
                </div>
              </div>

              <v-divider class="mb-5" />

              <v-radio-group v-model="selectedValue" class="mt-1">
                <v-radio
                  v-for="opt in question.options"
                  :key="optionValue(opt)"
                  :label="opt.label"
                  :value="optionValue(opt)"
                  class="py-2"
                />
              </v-radio-group>

              <v-alert
                v-if="showMissingAnswer"
                type="warning"
                variant="tonal"
                rounded="lg"
                class="mt-4"
              >
                Please select an option to continue.
              </v-alert>

              <div
                class="d-none d-md-flex align-center justify-space-between mt-8"
              >
                <v-btn
                  v-if="!progress.isFirstQuestion"
                  rounded="lg"
                  variant="text"
                  @click="goBack"
                >
                  <v-icon icon="lucide:arrow-left" size="18" class="me-2" />
                  {{ progress.isFirstQuestion ? "Back" : "Previous" }}
                </v-btn>
                <v-spacer />
                <v-btn
                  rounded="lg"
                  color="primary"
                  :loading="saveAnswerLoading"
                  :disabled="
                    question.isRequired && !String(selectedValue || '').trim()
                  "
                  @click="goNext"
                >
                  {{ progress.isLastQuestion ? "Finish" : "Next" }}
                  <v-icon icon="lucide:arrow-right" size="18" class="ms-2" />
                </v-btn>
              </div>
            </v-card>
          </v-col>

          <!-- Sidebar -->
          <v-col cols="12" md="4">
            <v-card rounded="lg" variant="outlined" class="pa-6 mb-6">
              <div class="d-flex align-center ga-3">
                <v-avatar size="40" color="primary" variant="tonal">
                  <v-icon icon="lucide:info" />
                </v-avatar>
                <div>
                  <div class="text-subtitle-1 font-weight-bold">
                    Session summary
                  </div>
                  <div class="text-body-2 text-medium-emphasis">
                    Current questionnaire progress
                  </div>
                </div>
              </div>

              <v-divider class="my-4" />

              <div class="text-body-2 text-medium-emphasis">
                <div class="d-flex justify-space-between align-center mb-2">
                  <span>Questions</span>
                  <span class="font-weight-medium">
                    {{ progress.totalQuestions }}
                  </span>
                </div>

                <div class="d-flex justify-space-between align-center mb-2">
                  <span>Answered</span>
                  <span class="font-weight-medium">
                    {{ progress.answeredQuestions }}
                  </span>
                </div>

                <div class="d-flex justify-space-between align-center mb-2">
                  <span>Scoring</span>
                  <span class="font-weight-medium">
                    {{ scoringLabel }}
                  </span>
                </div>

                <div class="d-flex justify-space-between align-center">
                  <span>Result page</span>
                  <span class="font-weight-medium">
                    {{ questionnaire.showResultToUser ? "Shown" : "Hidden" }}
                  </span>
                </div>
              </div>

              <v-divider class="my-4" />

              <v-btn
                class="mt-3"
                rounded="lg"
                variant="outlined"
                block
                @click="restart"
              >
                Restart questionnaire
              </v-btn>

              <div class="text-caption text-medium-emphasis mt-3">
                Your session is kept temporarily so you can continue where you
                left off.
              </div>
            </v-card>

            <v-card rounded="lg" variant="outlined" class="pa-6">
              <div class="d-flex align-center ga-3">
                <v-avatar size="40" color="primary" variant="tonal">
                  <v-icon icon="lucide:shield" />
                </v-avatar>
                <div>
                  <div class="text-subtitle-1 font-weight-bold">
                    Data handling
                  </div>
                  <div class="text-body-2 text-medium-emphasis">
                    Structured questionnaire workflow
                  </div>
                </div>
              </div>

              <v-divider class="my-4" />

              <div class="text-body-2 text-medium-emphasis">
                Your responses are saved to the questionnaire attempt and can be
                continued during the active session.
              </div>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </section>

    <!-- Mobile sticky actions -->
    <v-card
      v-if="uiState === 'data'"
      class="d-md-none mobile-actions"
      rounded="lg"
      variant="outlined"
    >
      <div class="d-flex align-center justify-space-between ga-3 pa-3">
        <v-btn rounded="lg" variant="text" @click="goBack">
          <v-icon icon="lucide:arrow-left" size="18" class="me-2" />
          {{ progress.isFirstQuestion ? "Back" : "Previous" }}
        </v-btn>

        <v-btn
          rounded="lg"
          color="primary"
          :loading="saveAnswerLoading"
          @click="goNext"
        >
          {{ progress.isLastQuestion ? "Finish" : "Next" }}
          <v-icon icon="lucide:arrow-right" size="18" class="ms-2" />
        </v-btn>
      </div>
    </v-card>

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
import { computed, onMounted, ref, watch } from "vue";
import { storeToRefs } from "pinia";
import { useQuestionnaireAttemptStore } from "~/stores/questionnaire-attempt";

definePageMeta({
  layout: "empty",
});

type UiState = "loading" | "error" | "data" | "empty";

const route = useRoute();
const localePath = useLocalePath();
const attemptStore = useQuestionnaireAttemptStore();

const {
  item: attempt,
  currentQuestionSession,
  questionLoading,
  questionLoaded,
  questionError,
  saveAnswerLoading,
  saveAnswerError,
} = storeToRefs(attemptStore);

const code = computed(() => String(route.params.code || "").trim());

const questionnaire = computed(
  () => currentQuestionSession.value.questionnaire,
);
const progress = computed(() => currentQuestionSession.value.progress);
const question = computed(() => currentQuestionSession.value.question);

const attemptCookie = useCookie<any>(`q-attempt:${code.value}`, {
  sameSite: "lax",
  path: "/",
});

const attemptId = computed(() =>
  String(attemptCookie.value?.attemptId || attempt.value?.id || "").trim(),
);

const combinedError = computed(
  () => questionError.value || saveAnswerError.value || null,
);

const uiState = computed<UiState>(() => {
  if (questionLoading.value) return "loading";
  if (combinedError.value) return "error";

  if (
    !questionLoaded.value ||
    !attemptId.value ||
    !questionnaire.value?.id ||
    !question.value?.id
  ) {
    return "empty";
  }

  return "data";
});

const selectedValue = ref<string>("");
const showMissingAnswer = ref(false);
const snack = ref({ show: false, text: "" });

const questionHint = computed(() => {
  return String(question.value?.meta?.hint || "Select one answer to continue.");
});

const estimatedMinutes = computed(() => {
  if (
    typeof questionnaire.value?.estimatedTimeMinutes === "number" &&
    questionnaire.value.estimatedTimeMinutes > 0
  ) {
    return questionnaire.value.estimatedTimeMinutes;
  }

  const fallback = Math.ceil((progress.value?.totalQuestions || 0) / 4);
  return Math.max(1, fallback || 1);
});

const progressValue = computed(() => {
  const total = Number(progress.value?.totalQuestions || 0);
  const answered = Number(progress.value?.answeredQuestions || 0);

  if (!total) return 0;
  return Math.round((answered / total) * 100);
});

const scoringLabel = computed(() => {
  switch (questionnaire.value?.scoringType) {
    case "multi_dimension":
      return "Multi-dimension";
    case "banded":
      return "Band-based";
    default:
      return "Total score";
  }
});

function notify(text: string) {
  snack.value = { show: true, text };
}

function syncSelectedFromSavedAnswer() {
  const saved = question.value?.savedAnswer;

  if (!saved) {
    selectedValue.value = "";
    return;
  }

  if (questionnaire.value?.optionsMode === "fixed") {
    selectedValue.value = String(saved.fixedOptionKey || "");
    return;
  }

  selectedValue.value = String(saved.optionId || "");
}

function syncSelectedFromQuestion(sessionQuestion?: any, optionsMode?: string) {
  const targetQuestion = sessionQuestion || question.value;
  const mode = optionsMode || questionnaire.value?.optionsMode;
  const saved = targetQuestion?.savedAnswer;

  if (!saved) {
    selectedValue.value = "";
    return;
  }

  if (mode === "fixed") {
    selectedValue.value = String(saved.fixedOptionKey || "");
    return;
  }

  selectedValue.value = String(saved.optionId || "");
}

function optionValue(opt: any) {
  if (questionnaire.value?.optionsMode === "fixed") {
    return String(opt.key || "");
  }
  return String(opt.id || "");
}

async function loadData() {
  if (!attemptId.value) return;
  const session = await attemptStore.getCurrentQuestion(attemptId.value);
  if (session?.question?.id) {
    syncSelectedFromSavedAnswer();
  }
}

onMounted(loadData);
watch(
  () => question.value?.id,
  () => {
    syncSelectedFromSavedAnswer();
    showMissingAnswer.value = false;
  },
);

useHead(() => ({
  title:
    uiState.value === "data"
      ? `${questionnaire.value.title} | Take Questionnaire`
      : `Take Questionnaire — ${code.value}`,
  meta: [
    {
      name: "description",
      content:
        uiState.value === "data"
          ? `Continue answering ${questionnaire.value.title}.`
          : "Continue your questionnaire session.",
    },
  ],
}));

async function saveCurrentAnswer(showSuccess = true) {
  showMissingAnswer.value = false;

  if (!attemptId.value || !question.value?.id) {
    notify("Questionnaire session is not available.");
    return null;
  }

  if (question.value.isRequired && !String(selectedValue.value || "").trim()) {
    showMissingAnswer.value = true;
    notify("Please select an option to continue.");
    return null;
  }

  const payload =
    questionnaire.value?.optionsMode === "fixed"
      ? {
          attemptId: attemptId.value,
          answers: [
            {
              questionId: question.value.id,
              fixedOptionKey: String(selectedValue.value || "").trim(),
            },
          ],
        }
      : {
          attemptId: attemptId.value,
          answers: [
            {
              questionId: question.value.id,
              optionId: String(selectedValue.value || "").trim(),
            },
          ],
        };

  const result = await attemptStore.saveAnswer(payload);

  if (!result?.saved) {
    notify(saveAnswerError.value || "Failed to save answer.");
    return null;
  }

  if (showSuccess) {
    notify("Progress saved");
  }

  return result;
}

async function goNext() {
  const saved = await saveCurrentAnswer(false);
  if (!saved) return;

  const nextQuestionId = String(saved.nextQuestionId || "").trim();

  if (nextQuestionId) {
    const session = await attemptStore.getQuestionById(
      attemptId.value,
      nextQuestionId,
    );

    if (!session?.question?.id) {
      notify(questionError.value || "Failed to load next question.");
      return;
    }

    syncSelectedFromQuestion(
      session.question,
      session.questionnaire.optionsMode,
    );
    return;
  }

  notify("Questionnaire completed.");
  navigateTo(localePath(`/q/${code.value}/result`));
}

async function goBack() {
  showMissingAnswer.value = false;

  if (!attemptId.value) {
    notify("Questionnaire session is not available.");
    return;
  }

  const prevQuestionId = String(question.value?.prevQuestionId || "").trim();

  if (!prevQuestionId) {
    navigateTo(localePath(`/q/${code.value}/user-info`));
    return;
  }

  const session = await attemptStore.getQuestionById(
    attemptId.value,
    prevQuestionId,
  );

  if (!session?.question?.id) {
    notify(questionError.value || "Failed to load previous question.");
    return;
  }

  syncSelectedFromQuestion(session.question, session.questionnaire.optionsMode);
  showMissingAnswer.value = false;
}

function restart() {
  const cookie = useCookie(`q-attempt:${code.value}`, {
    sameSite: "lax",
    path: "/",
  });
  cookie.value = null;

  if (import.meta.client) {
    sessionStorage.removeItem(`q-user-info:${code.value}`);
  }

  navigateTo(localePath(`/q/${code.value}/user-info`));
}
</script>

<style lang="scss" scoped>
.step-hero {
  position: relative;
  overflow: hidden;
  border-bottom: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));

  &::before {
    content: "";
    position: absolute;
    inset: -2px;
    background:
      radial-gradient(
        900px 520px at 14% 18%,
        rgba(var(--v-theme-primary), 0.16),
        transparent 56%
      ),
      radial-gradient(
        720px 520px at 86% 20%,
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

.max-width-narrow {
  max-width: 720px;
}

.min-width-0 {
  min-width: 0;
}

.mobile-actions {
  position: sticky;
  bottom: 12px;
  margin: 0 12px 12px;
  z-index: 10;
  backdrop-filter: blur(10px);
  background-color: rgba(var(--v-theme-surface), 0.9);
}
</style>
