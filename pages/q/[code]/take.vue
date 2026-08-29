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
              localError ||
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
              <div class="d-flex align-start ga-3 mb-5">
                <v-avatar size="40" color="primary" variant="tonal">
                  <v-icon icon="lucide:check-square" />
                </v-avatar>

                <div class="min-width-0">
                  <div
                    v-if="question.text"
                    class="question-text"
                    v-html="question.text"
                  />
                  <div v-else class="question-text">
                    Question {{ progress.currentQuestionNumber }}
                  </div>
                </div>
              </div>

              <v-img
                v-if="questionImageUrl"
                :src="questionImageUrl"
                rounded="lg"
                max-height="360"
                class="mb-5"
                cover
              />

              <v-img
                v-if="questionContentImageUrl"
                :src="questionContentImageUrl"
                rounded="lg"
                max-height="360"
                class="mb-5"
                cover
              />

              <v-divider class="mb-5" />

              <v-radio-group v-model="selectedValue" class="mt-1" hide-details>
                <v-card
                  v-for="opt in question.options"
                  :key="optionValue(opt)"
                  rounded="lg"
                  variant="outlined"
                  class="pa-3 mb-3 option-row"
                  :class="{
                    'option-row--selected': selectedValue === optionValue(opt),
                  }"
                  @click="selectedValue = optionValue(opt)"
                >
                  <div class="d-flex align-center ga-3">
                    <v-avatar size="24">
                      <v-radio
                        :value="optionValue(opt)"
                        density="compact"
                        hide-details
                        color="primary"
                      />
                    </v-avatar>
                    <v-avatar rounded="lg" size="64">
                      <v-img
                        v-if="isImageOption(opt)"
                        :src="optionImageSrc(opt)"
                        aspect-ratio="1"
                        cover
                      />
                    </v-avatar>
                    <span class="text-body-1 flex-grow-1">
                      {{ opt.label }}
                    </span>
                  </div>
                </v-card>
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
                  :disabled="isProcessing || submitLoading"
                  @click="goBack"
                >
                  <v-icon icon="lucide:arrow-left" size="18" class="me-2" />
                  {{ progress.isFirstQuestion ? "Back" : "Previous" }}
                </v-btn>
                <v-spacer />
                <v-btn
                  rounded="lg"
                  color="primary"
                  :loading="saveAnswerLoading || submitLoading || isProcessing"
                  :disabled="
                    (question.isRequired &&
                      !String(selectedValue || '').trim()) ||
                    isProcessing ||
                    submitLoading
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
            <v-card
              v-if="attempt.userInfo.fields.length"
              rounded="lg"
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
                    Provided for this session
                  </div>
                </div>
              </div>

              <v-divider class="my-4" />

              <v-list density="compact" class="pa-0" bg-color="transparent">
                <v-list-item
                  v-for="field in attempt.userInfo.fields"
                  :key="field.key"
                  class="px-0"
                >
                  <template #prepend>
                    <v-avatar
                      size="32"
                      color="primary"
                      variant="tonal"
                      rounded="lg"
                    >
                      <v-icon :icon="userInfoIcon(field.key)" size="16" />
                    </v-avatar>
                  </template>

                  <div class="d-flex justify-space-between align-center ga-3">
                    <span class="text-body-2 text-medium-emphasis">
                      {{ field.label || formatKeyLabel(field.key) }}
                    </span>
                    <span class="text-body-2 font-weight-medium text-end">
                      {{ field.value }}
                    </span>
                  </div>
                </v-list-item>
              </v-list>
            </v-card>

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
        <v-btn
          v-if="!progress.isFirstQuestion"
          rounded="lg"
          variant="text"
          :disabled="isProcessing || submitLoading"
          @click="goBack"
        >
          <v-icon icon="lucide:arrow-left" size="18" class="me-2" />
          {{ progress.isFirstQuestion ? "Back" : "Previous" }}
        </v-btn>

        <v-btn
          rounded="lg"
          color="primary"
          :loading="saveAnswerLoading || submitLoading || isProcessing"
          :disabled="
            (question.isRequired && !String(selectedValue || '').trim()) ||
            isProcessing ||
            submitLoading
          "
          @click="goNext"
        >
          {{ progress.isLastQuestion ? "Finish" : "Next" }}
          <v-icon icon="lucide:arrow-right" size="18" class="ms-2" />
        </v-btn>
      </div>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import { storeToRefs } from "pinia";

definePageMeta({
  layout: "empty",
});

type UiState = "loading" | "error" | "data" | "empty";

const route = useRoute();
const localePath = useLocalePath();
const attemptStore = useQuestionnaireAttemptStore();
const snack = useAppSnackbar();

const { item: attempt, currentQuestionSession } = storeToRefs(attemptStore);

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

const isPageLoading = ref(true);
const localError = ref<string | null>(null);
const hasLoadedQuestion = ref(false);
const saveAnswerLoading = ref(false);
const submitLoading = ref(false);

const activeQuestionId = ref<string>("");
const activePrevQuestionId = ref<string>("");

const uiState = computed<UiState>(() => {
  if (isPageLoading.value) return "loading";
  if (localError.value) return "error";

  if (
    !hasLoadedQuestion.value ||
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
const isProcessing = ref(false);

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

const questionImageUrl = computed(() => {
  return question.value?.questionImageUrl || null;
});

const questionContentImageUrl = computed(() => {
  if (question.value?.questionMode !== "image") return null;
  return question.value?.imageUrl || null;
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

function notifySuccess(text: string) {
  snack.open(text, { color: "success" });
}

function notifyError(text: string) {
  snack.open(text, { color: "error" });
}

function syncActiveQuestionState(session?: any) {
  const sessionQuestion = session?.question || question.value;

  activeQuestionId.value = String(sessionQuestion?.id || "").trim();
  activePrevQuestionId.value = String(
    sessionQuestion?.prevQuestionId || "",
  ).trim();
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

function isImageOption(opt: any) {
  return Boolean(optionImageSrc(opt));
}

function optionImageSrc(opt: any): string | undefined {
  if (opt?.optionMode !== "image") return undefined;

  const imageUrl = String(opt?.imageUrl || "").trim();
  return imageUrl || undefined;
}

function formatKeyLabel(value: string) {
  const text = String(value || "").trim();
  if (!text) return "-";

  return text
    .replace(/[_-]+/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
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

async function loadData() {
  if (!attemptId.value) {
    isPageLoading.value = false;
    hasLoadedQuestion.value = false;
    localError.value = null;
    return;
  }

  isPageLoading.value = true;
  localError.value = null;
  hasLoadedQuestion.value = false;

  try {
    const session = await attemptStore.getCurrentQuestion(attemptId.value);

    if (session?.question?.id) {
      hasLoadedQuestion.value = true;
      syncActiveQuestionState(session);
      syncSelectedFromQuestion(
        session.question,
        session.questionnaire?.optionsMode,
      );
      showMissingAnswer.value = false;
    } else {
      hasLoadedQuestion.value = false;
    }
  } catch (err: any) {
    localError.value =
      err?.response?.data?.message ||
      err?.message ||
      "Failed to load questionnaire session.";
    hasLoadedQuestion.value = false;
  } finally {
    isPageLoading.value = false;
  }
}

onMounted(loadData);

watch(
  () => question.value?.id,
  (newId) => {
    if (newId) {
      activeQuestionId.value = String(newId || "").trim();
      activePrevQuestionId.value = String(
        question.value?.prevQuestionId || "",
      ).trim();

      syncSelectedFromSavedAnswer();
      showMissingAnswer.value = false;
    }
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
  const currentQuestionId = activeQuestionId.value;
  const currentAnswer = String(selectedValue.value || "").trim();

  if (!attemptId.value || !currentQuestionId) {
    notifyError("Session expired or invalid.");
    return null;
  }

  const isFixed = questionnaire.value?.optionsMode === "fixed";

  const payload = {
    attemptId: attemptId.value,
    answers: [
      {
        questionId: currentQuestionId,
        [isFixed ? "fixedOptionKey" : "optionId"]: currentAnswer,
      },
    ],
  };

  saveAnswerLoading.value = true;
  localError.value = null;

  try {
    const result = await attemptStore.saveAnswer(payload);

    if (!result) {
      throw new Error("Failed to save answer.");
    }

    if (result.saved && showSuccess) {
      notifySuccess("Progress saved");
    }

    return result;
  } catch (err: any) {
    localError.value =
      err?.response?.data?.message || err?.message || "Failed to save answer.";
    return null;
  } finally {
    saveAnswerLoading.value = false;
  }
}

async function finishAttempt() {
  if (!attemptId.value) {
    notifyError("Questionnaire session is not available.");
    return false;
  }

  submitLoading.value = true;
  localError.value = null;

  try {
    const result = await attemptStore.submitAttempt(attemptId.value);

    if (!result?.id) {
      throw new Error("Failed to submit attempt.");
    }

    notifySuccess("Questionnaire completed.");

    await navigateTo(localePath(`/q/${code.value}/result/${attemptId.value}`));
    return true;
  } catch (err: any) {
    localError.value =
      err?.response?.data?.message ||
      err?.message ||
      "Failed to submit questionnaire.";
    notifyError(localError.value || "An error occurred.");
    return false;
  } finally {
    submitLoading.value = false;
  }
}

async function goNext() {
  if (isProcessing.value || submitLoading.value) return;

  if (question.value?.isRequired && !String(selectedValue.value || "").trim()) {
    showMissingAnswer.value = true;
    return;
  }

  isProcessing.value = true;
  showMissingAnswer.value = false;
  localError.value = null;

  try {
    const savedResult = await saveCurrentAnswer(false);

    if (!savedResult || !savedResult.saved) {
      notifyError(localError.value || "Failed to save answer.");
      return;
    }

    const nextId = String(savedResult.nextQuestionId || "").trim();
    const isComplete = Boolean(savedResult?.progress?.isComplete);

    if (isComplete || !nextId) {
      await finishAttempt();
      return;
    }

    const session = await attemptStore.getQuestionById(attemptId.value, nextId);

    if (session?.question?.id) {
      hasLoadedQuestion.value = true;
      syncActiveQuestionState(session);
      syncSelectedFromQuestion(
        session.question,
        session.questionnaire.optionsMode,
      );
      showMissingAnswer.value = false;

      if (import.meta.client) {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    } else {
      hasLoadedQuestion.value = false;
      notifyError("Failed to load next question.");
    }
  } catch (err: any) {
    localError.value =
      err?.response?.data?.message ||
      err?.message ||
      "An error occurred. Please try again.";
    notifyError(localError.value || "An error occurred.");
  } finally {
    isProcessing.value = false;
    isPageLoading.value = false;
  }
}

async function goBack() {
  if (isProcessing.value || submitLoading.value) return;

  showMissingAnswer.value = false;
  localError.value = null;

  if (!attemptId.value) {
    notifyError("Questionnaire session is not available.");
    return;
  }

  const prevQuestionId = activePrevQuestionId.value;

  if (!prevQuestionId) {
    navigateTo(localePath(`/q/${code.value}/user-info`));
    return;
  }

  isProcessing.value = true;
  isPageLoading.value = true;

  try {
    const session = await attemptStore.getQuestionById(
      attemptId.value,
      prevQuestionId,
    );

    if (!session?.question?.id) {
      throw new Error("Failed to load previous question.");
    }

    hasLoadedQuestion.value = true;
    syncActiveQuestionState(session);
    syncSelectedFromQuestion(
      session.question,
      session.questionnaire.optionsMode,
    );
    showMissingAnswer.value = false;
  } catch (err: any) {
    localError.value =
      err?.response?.data?.message ||
      err?.message ||
      "Failed to load previous question.";
    notifyError(localError.value || "An error occurred.");
  } finally {
    isProcessing.value = false;
    isPageLoading.value = false;
  }
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

.question-text {
  color: rgba(var(--v-theme-on-surface), 0.92);
  font-size: 1.05rem;
  font-weight: 700;
  line-height: 1.55;

  :deep(p) {
    margin: 0 0 8px;
  }

  :deep(p:last-child) {
    margin-bottom: 0;
  }
}

.option-row {
  cursor: pointer;
  transition:
    border-color 0.15s ease,
    background-color 0.15s ease;
}

.option-row--selected {
  border-color: rgba(var(--v-theme-primary), 0.6) !important;
  background-color: rgba(var(--v-theme-primary), 0.05);
}
</style>
