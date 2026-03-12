<!-- /pages/q/[code]/take.vue -->
<template>
  <div>
    <!-- Header -->
    <section class="step-hero">
      <v-container class="main-container">
        <!-- Loading -->
        <div v-if="uiState === 'loading'">
          <v-skeleton-loader type="heading, text, text" />
          <v-row class="ga-4 mt-4">
            <v-col cols="12" md="8">
              <v-card rounded="xl" variant="outlined" class="pa-6">
                <v-skeleton-loader type="text, text, text, actions" />
              </v-card>
            </v-col>
            <v-col cols="12" md="4">
              <v-card rounded="xl" variant="outlined" class="pa-6">
                <v-skeleton-loader type="avatar, text, text, text" />
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
          Unable to load questionnaire.
        </v-alert>

        <!-- Empty / Not Found -->
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
            <v-icon icon="lucide:search-x" />
          </v-avatar>
          <div class="text-h6 font-weight-bold">Questionnaire not found</div>
          <div
            class="text-body-2 text-medium-emphasis mt-2 mx-auto max-width-narrow"
          >
            The questionnaire code “{{ code }}” does not exist, is not
            published, or has no questions.
          </div>
          <v-btn
            class="mt-5"
            rounded="xl"
            color="primary"
            :to="localePath('/organizations')"
          >
            Browse organizations
          </v-btn>
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

          <div class="d-flex flex-wrap align-center justify-space-between ga-4">
            <div class="min-width-0">
              <h1
                class="text-h5 text-md-h4 font-weight-bold mb-1 text-truncate"
              >
                {{ isReview ? "Review & Submit" : "Answer the questions" }}
              </h1>
              <div class="text-body-2 text-medium-emphasis">
                {{ q!.title }} • Step 2 of 2
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

          <div class="mt-5">
            <div class="d-flex justify-space-between align-center mb-2">
              <div class="text-caption text-medium-emphasis">
                <template v-if="!isReview">
                  Question <strong>{{ currentIdx + 1 }}</strong> of
                  <strong>{{ questions.length }}</strong>
                </template>
                <template v-else> Review your answers </template>
              </div>
              <div class="text-caption text-medium-emphasis">
                {{ answeredCount }}/{{ questions.length }} answered
              </div>
            </div>
            <v-progress-linear
              :model-value="progressValue"
              height="8"
              rounded
              color="primary"
            />
          </div>
        </div>
      </v-container>
    </section>

    <!-- Content -->
    <section v-if="uiState === 'data'">
      <v-container class="main-container">
        <v-row>
          <!-- Main -->
          <v-col cols="12" md="8">
            <!-- Question step -->
            <v-card
              v-if="!isReview"
              rounded="xl"
              variant="outlined"
              class="pa-6"
            >
              <div class="d-flex align-start ga-3 mb-4">
                <v-avatar size="40" color="primary" variant="tonal">
                  <v-icon icon="lucide:check-square" />
                </v-avatar>
                <div class="min-width-0">
                  <div class="text-subtitle-1 font-weight-bold mb-1">
                    {{
                      currentQuestion!.question_text ||
                      currentQuestion!.title ||
                      `Question ${currentIdx + 1}`
                    }}
                  </div>
                  <div class="text-body-2 text-medium-emphasis">
                    Select one option to continue.
                    <span
                      v-if="isRequired(currentQuestion!)"
                      class="ms-1 font-weight-medium"
                    >
                      Required
                    </span>
                  </div>
                </div>
              </div>

              <v-divider class="mb-5" />

              <v-radio-group
                v-model="answers[currentQuestionId]"
                :mandatory="isRequired(currentQuestion!)"
                class="mt-1"
              >
                <v-radio
                  v-for="opt in currentOptions"
                  :key="String(opt.id)"
                  :label="
                    String(opt.option_text ?? opt.label ?? opt.title ?? '')
                  "
                  :value="String(opt.id)"
                  class="py-2"
                />
              </v-radio-group>

              <v-alert
                v-if="showMissingAnswer"
                type="warning"
                variant="tonal"
                rounded="xl"
                class="mt-4"
              >
                Please select an option to continue.
              </v-alert>

              <!-- Desktop actions -->
              <div
                class="d-none d-md-flex align-center justify-space-between mt-8"
              >
                <v-btn rounded="xl" variant="text" @click="goBack">
                  <v-icon icon="lucide:arrow-left" size="18" class="me-2" />
                  Back
                </v-btn>

                <div class="d-flex ga-3">
                  <v-btn rounded="xl" variant="outlined" @click="saveDraft">
                    Save draft
                  </v-btn>
                  <v-btn rounded="xl" color="primary" @click="goNext">
                    {{
                      currentIdx === questions.length - 1 ? "Review" : "Next"
                    }}
                    <v-icon icon="lucide:arrow-right" size="18" class="ms-2" />
                  </v-btn>
                </div>
              </div>
            </v-card>

            <!-- Review step -->
            <v-card v-else rounded="xl" variant="outlined" class="pa-6">
              <div class="d-flex align-start ga-3 mb-4">
                <v-avatar size="40" color="primary" variant="tonal">
                  <v-icon icon="lucide:clipboard-check" />
                </v-avatar>
                <div>
                  <div class="text-subtitle-1 font-weight-bold mb-1">
                    Review your answers
                  </div>
                  <div class="text-body-2 text-medium-emphasis">
                    You can edit any answer before submitting.
                  </div>
                </div>
              </div>

              <v-divider class="mb-5" />

              <v-card
                v-for="(qq, i) in questions"
                :key="String(qq.id)"
                rounded="xl"
                variant="outlined"
                class="pa-4 mb-4"
              >
                <div class="d-flex align-start justify-space-between ga-3">
                  <div class="min-width-0">
                    <div class="text-body-2 text-medium-emphasis mb-1">
                      Question {{ i + 1 }}
                      <span v-if="isRequired(qq)" class="ms-1">• Required</span>
                    </div>
                    <div class="font-weight-medium">
                      {{ qq.question_text || qq.title || `Question ${i + 1}` }}
                    </div>

                    <div class="text-body-2 text-medium-emphasis mt-2">
                      <span class="font-weight-medium">Answer:</span>
                      <span v-if="answerLabel(String(qq.id))">
                        {{ answerLabel(String(qq.id)) }}
                      </span>
                      <span v-else class="text-error">Not answered</span>
                    </div>
                  </div>

                  <v-btn
                    size="small"
                    rounded="xl"
                    variant="text"
                    @click="editQuestion(i)"
                  >
                    <v-icon icon="lucide:edit-3" size="18" class="me-2" />
                    Edit
                  </v-btn>
                </div>
              </v-card>

              <v-alert
                v-if="hasMissingRequired"
                type="warning"
                variant="tonal"
                rounded="xl"
                class="mt-2"
              >
                Some required questions are not answered. Please edit and
                complete them before submitting.
              </v-alert>

              <!-- Desktop actions -->
              <div
                class="d-none d-md-flex align-center justify-space-between mt-8"
              >
                <v-btn rounded="xl" variant="text" @click="backToLastQuestion">
                  <v-icon icon="lucide:arrow-left" size="18" class="me-2" />
                  Back
                </v-btn>

                <div class="d-flex ga-3">
                  <v-btn rounded="xl" variant="outlined" @click="saveDraft">
                    Save draft
                  </v-btn>
                  <v-btn
                    rounded="xl"
                    color="primary"
                    :disabled="hasMissingRequired"
                    @click="confirmSubmit = true"
                  >
                    Submit
                    <v-icon icon="lucide:send" size="18" class="ms-2" />
                  </v-btn>
                </div>
              </div>
            </v-card>
          </v-col>

          <!-- Sidebar -->
          <v-col cols="12" md="4">
            <v-card rounded="xl" variant="outlined" class="pa-6 mb-6">
              <div class="d-flex align-center ga-3">
                <v-avatar size="40" color="primary" variant="tonal">
                  <v-icon icon="lucide:info" />
                </v-avatar>
                <div>
                  <div class="text-subtitle-1 font-weight-bold">
                    Session summary
                  </div>
                  <div class="text-body-2 text-medium-emphasis">
                    Anonymous attempt snapshot
                  </div>
                </div>
              </div>

              <v-divider class="my-4" />

              <div class="text-body-2 text-medium-emphasis">
                <div class="d-flex justify-space-between align-center mb-2">
                  <span>Questions</span>
                  <span class="font-weight-medium">{{ questions.length }}</span>
                </div>
                <div class="d-flex justify-space-between align-center mb-2">
                  <span>Answered</span>
                  <span class="font-weight-medium">{{ answeredCount }}</span>
                </div>
                <div class="d-flex justify-space-between align-center mb-2">
                  <span>Scoring</span>
                  <span class="font-weight-medium">
                    {{
                      q!.scoring_type === "multi_dimension"
                        ? "Multi-dimension"
                        : "Total score"
                    }}
                  </span>
                </div>
                <div class="d-flex justify-space-between align-center">
                  <span>Result page</span>
                  <span class="font-weight-medium">
                    {{ q!.show_result_to_user ? "Shown" : "Not shown" }}
                  </span>
                </div>
              </div>

              <v-divider class="my-4" />

              <v-btn rounded="xl" variant="outlined" block @click="saveDraft">
                <v-icon icon="lucide:save" size="18" class="me-2" />
                Save draft
              </v-btn>

              <v-btn
                class="mt-3"
                rounded="xl"
                variant="text"
                block
                @click="restart"
              >
                Restart questionnaire
              </v-btn>

              <div class="text-caption text-medium-emphasis mt-3">
                Draft is saved in this browser session only.
              </div>
            </v-card>

            <v-card rounded="xl" variant="outlined" class="pa-6">
              <div class="d-flex align-center ga-3">
                <v-avatar size="40" color="primary" variant="tonal">
                  <v-icon icon="lucide:shield" />
                </v-avatar>
                <div>
                  <div class="text-subtitle-1 font-weight-bold">
                    Data handling
                  </div>
                  <div class="text-body-2 text-medium-emphasis">
                    Professional reporting workflow
                  </div>
                </div>
              </div>

              <v-divider class="my-4" />

              <div class="text-body-2 text-medium-emphasis">
                Your responses are stored for this session and processed based
                on the organization’s scoring rules and meanings.
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
      rounded="xl"
      variant="outlined"
    >
      <div class="d-flex align-center justify-space-between ga-3 pa-3">
        <v-btn rounded="xl" variant="text" @click="goBack">
          <v-icon icon="lucide:arrow-left" size="18" class="me-2" />
          Back
        </v-btn>

        <v-btn v-if="!isReview" rounded="xl" color="primary" @click="goNext">
          {{ currentIdx === questions.length - 1 ? "Review" : "Next" }}
          <v-icon icon="lucide:arrow-right" size="18" class="ms-2" />
        </v-btn>

        <v-btn
          v-else
          rounded="xl"
          color="primary"
          :disabled="hasMissingRequired"
          @click="confirmSubmit = true"
        >
          Submit
          <v-icon icon="lucide:send" size="18" class="ms-2" />
        </v-btn>
      </div>
    </v-card>

    <!-- Submit confirm dialog -->
    <v-dialog v-model="confirmSubmit" max-width="640">
      <v-card rounded="xl">
        <v-card-title class="px-6 pt-6">
          <div class="d-flex align-center justify-space-between ga-3">
            <div>
              <div class="text-h6 font-weight-bold">Submit questionnaire?</div>
              <div class="text-body-2 text-medium-emphasis mt-1">
                You won’t be able to change answers after submission.
              </div>
            </div>
            <v-btn icon variant="text" @click="confirmSubmit = false">
              <v-icon icon="lucide:x" />
            </v-btn>
          </div>
        </v-card-title>

        <v-card-text class="px-6">
          <v-alert type="info" variant="tonal" rounded="xl">
            {{
              q!.show_result_to_user
                ? "A result page will be shown after you submit."
                : "You will see a thank-you page after you submit. Results are handled by the organization."
            }}
          </v-alert>

          <div class="text-body-2 text-medium-emphasis mt-4">
            Answered <strong>{{ answeredCount }}</strong> of
            <strong>{{ questions.length }}</strong> questions.
          </div>
        </v-card-text>

        <v-card-actions class="px-6 pb-6">
          <v-btn rounded="xl" variant="text" @click="confirmSubmit = false"
            >Cancel</v-btn
          >
          <v-spacer />
          <v-btn
            rounded="xl"
            color="primary"
            :loading="submitting"
            @click="submit"
          >
            Submit
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
import { computed, onMounted, reactive, ref, watch } from "vue";
import * as mock from "~/utils/mockPublicData";

type UiState = "loading" | "error" | "data" | "empty";
type AnyQuestionnaire = Record<string, any>;
type AnyQuestion = Record<string, any>;
type AnyOption = Record<string, any>;
type AnyDimension = Record<string, any>;
type AnyBand = Record<string, any>;
type AnyMeaning = Record<string, any>;

const route = useRoute();
const localePath = useLocalePath();

const code = computed(() => String(route.params.code || ""));

useHead(() => ({
  title: `Answer Questionnaire — ${code.value} | SB Questionnaire`,
  meta: [
    {
      name: "description",
      content:
        "Answer single-choice questions, submit, and view results (if enabled) on SB Questionnaire.",
    },
  ],
}));

/** Mock access (defensive) */
const questionnairesRaw = computed<AnyQuestionnaire[]>(() => {
  const qs = (mock as any).questionnaires;
  return Array.isArray(qs) ? qs : [];
});
const questionsRaw = computed<AnyQuestion[]>(() => {
  const qq = (mock as any).questionnaire_questions;
  return Array.isArray(qq) ? qq : [];
});
const optionsRaw = computed<AnyOption[]>(() => {
  const oo = (mock as any).questionnaire_options;
  return Array.isArray(oo) ? oo : [];
});
const dimensionsRaw = computed<AnyDimension[]>(() => {
  const dd = (mock as any).questionnaire_dimensions;
  return Array.isArray(dd) ? dd : [];
});
const bandsRaw = computed<AnyBand[]>(() => {
  const bb = (mock as any).questionnaire_score_bands;
  return Array.isArray(bb) ? bb : [];
});
const meaningsRaw = computed<AnyMeaning[]>(() => {
  const mm = (mock as any).questionnaire_meanings;
  return Array.isArray(mm) ? mm : [];
});

/** UI state */
const uiState = ref<UiState>("loading");
const q = ref<AnyQuestionnaire | null>(null);
const questions = ref<AnyQuestion[]>([]);

onMounted(() => {
  load();
});

watch(code, () => load());

function load() {
  uiState.value = "loading";
  q.value = null;
  questions.value = [];

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

      const qid = String(q.value.id);
      const qs = questionsRaw.value
        .filter((qq: any) => String(qq.questionnaire_id) === qid)
        .filter(
          (qq: any) =>
            String(qq.question_type || "single_choice") === "single_choice",
        )
        .sort(
          (a: any, b: any) =>
            Number(a.sort_order ?? 999) - Number(b.sort_order ?? 999),
        );

      if (!qs.length) {
        uiState.value = "empty";
        return;
      }

      questions.value = qs;
      hydrateDraft();
      uiState.value = "data";
    } catch {
      uiState.value = "error";
    }
  }, 280);
}

/** Breadcrumbs */
const breadcrumbs = computed(() => [
  { title: "Home", to: localePath("/") },
  { title: "Questionnaire", to: localePath(`/q/${code.value}`) },
  { title: "Answer", disabled: true },
]);

/** Progress / nav state */
const currentIdx = ref(0); // 0..questions.length (review is length)
const showMissingAnswer = ref(false);

const isReview = computed(() => currentIdx.value >= questions.value.length);
const currentQuestion = computed(() =>
  isReview.value ? null : questions.value[currentIdx.value] || null,
);
const currentQuestionId = computed(() =>
  String(currentQuestion.value?.id ?? ""),
);

const answers = reactive<Record<string, string>>({}); // questionId -> optionId (string)

const answeredCount = computed(() => {
  const ids = questions.value.map((qq) => String(qq.id));
  return ids.filter((id) =>
    Boolean(answers[id] && String(answers[id]).trim() !== ""),
  ).length;
});

const progressValue = computed(() => {
  if (!questions.value.length) return 0;
  // show progress based on answered ratio, not position
  return Math.round((answeredCount.value / questions.value.length) * 100);
});

/** Options for current question */
const currentOptions = computed<AnyOption[]>(() => {
  const qid = currentQuestionId.value;
  if (!qid) return [];
  return optionsRaw.value
    .filter((o: any) => String(o.question_id) === qid)
    .sort(
      (a: any, b: any) =>
        Number(a.sort_order ?? 999) - Number(b.sort_order ?? 999),
    );
});

/** Helpers */
function isRequired(qq: AnyQuestion) {
  return Boolean(qq.is_required ?? qq.required ?? true);
}

const estimatedMinutes = computed(() => {
  const minutes = Math.ceil(questions.value.length / 4);
  return Math.max(1, minutes);
});

const hasMissingRequired = computed(() => {
  for (const qq of questions.value) {
    if (!isRequired(qq)) continue;
    const qid = String(qq.id);
    if (!answers[qid]) return true;
  }
  return false;
});

function answerLabel(questionId: string) {
  const optId = answers[questionId];
  if (!optId) return "";
  const opt = optionsRaw.value.find((o: any) => String(o.id) === String(optId));
  return String(opt?.option_text ?? opt?.label ?? opt?.title ?? "");
}

/** Navigation */
function goBack() {
  showMissingAnswer.value = false;

  if (isReview.value) {
    backToLastQuestion();
    return;
  }

  if (currentIdx.value > 0) {
    currentIdx.value -= 1;
    return;
  }

  // first question -> go back to user-info
  navigateTo(localePath(`/q/${code.value}/user-info`));
}

function goNext() {
  showMissingAnswer.value = false;

  if (isReview.value) return;

  const qq = currentQuestion.value;
  if (!qq) return;

  const qid = String(qq.id);
  const required = isRequired(qq);
  const selected = answers[qid];

  if (required && (!selected || String(selected).trim() === "")) {
    showMissingAnswer.value = true;
    notify("Please select an option to continue");
    return;
  }

  if (currentIdx.value >= questions.value.length - 1) {
    currentIdx.value = questions.value.length; // review
  } else {
    currentIdx.value += 1;
  }

  persistDraft();
}

function editQuestion(idx: number) {
  if (idx < 0 || idx >= questions.value.length) return;
  currentIdx.value = idx;
}

function backToLastQuestion() {
  currentIdx.value = Math.max(0, questions.value.length - 1);
}

function restart() {
  for (const qq of questions.value) {
    answers[String(qq.id)] = "";
  }
  currentIdx.value = 0;
  persistDraft(true);
  notify("Restarted");
}

/** Draft persistence (session) */
function storageKeyDraft(codeStr: string) {
  return `sbq:draft:${codeStr}`;
}
function storageKeyUserInfo(codeStr: string) {
  return `sbq:user_info:${codeStr}`;
}
function storageKeyAttempt(codeStr: string) {
  return `sbq:attempt:${codeStr}`;
}

function hydrateDraft() {
  if (!import.meta.client) return;

  // Ensure keys exist
  for (const qq of questions.value) {
    const qid = String(qq.id);
    if (!(qid in answers)) answers[qid] = "";
  }

  try {
    const raw = sessionStorage.getItem(storageKeyDraft(code.value));
    if (!raw) return;
    const parsed = JSON.parse(raw);
    const map = parsed?.answers || {};
    for (const [qid, oid] of Object.entries(map)) {
      answers[String(qid)] = String(oid || "");
    }
    const idx = Number(parsed?.currentIdx ?? 0);
    currentIdx.value = Number.isFinite(idx)
      ? Math.max(0, Math.min(idx, questions.value.length))
      : 0;
  } catch {
    // ignore
  }
}

function persistDraft(reset = false) {
  if (!import.meta.client) return;
  try {
    const payload = {
      code: code.value,
      questionnaire_id: String(q.value?.id || ""),
      answers: reset ? {} : { ...answers },
      currentIdx: reset ? 0 : currentIdx.value,
      updated_at: new Date().toISOString(),
    };
    sessionStorage.setItem(
      storageKeyDraft(code.value),
      JSON.stringify(payload),
    );
  } catch {
    // ignore
  }
}

function saveDraft() {
  persistDraft();
  notify("Draft saved");
}

/** Submit + scoring */
const confirmSubmit = ref(false);
const submitting = ref(false);

async function submit() {
  if (!q.value) return;
  if (hasMissingRequired.value) {
    notify("Please complete required questions");
    confirmSubmit.value = false;
    return;
  }

  submitting.value = true;
  try {
    const attempt = computeAttemptSnapshot();
    saveAttemptSnapshot(attempt);

    // Clear draft after submission (optional but cleaner)
    if (import.meta.client)
      sessionStorage.removeItem(storageKeyDraft(code.value));

    confirmSubmit.value = false;
    notify("Submitted");
    navigateTo(localePath(`/q/${code.value}/result`));
  } catch {
    notify("Submit failed");
  } finally {
    submitting.value = false;
  }
}

function saveAttemptSnapshot(attempt: any) {
  if (!import.meta.client) return;
  sessionStorage.setItem(
    storageKeyAttempt(code.value),
    JSON.stringify(attempt),
  );
}

/**
 * Deterministic scoring engine (mock)
 * - multi_dimension: sum option score_value per dimension, dominant dimension, dimension bands, meaning resolution
 * - total_score: sum all score_value, total band, meaning resolution
 *
 * It tries to match a variety of possible fields in mock shapes to stay robust.
 */
function computeAttemptSnapshot() {
  const questionnaire = q.value!;
  const qid = String(questionnaire.id);

  // user info snapshot (from step 1)
  const userInfo = readSessionJson(storageKeyUserInfo(code.value)) || {};

  // answers snapshot
  const answersList = questions.value.map((qq) => {
    const questionId = String(qq.id);
    const optionId = String(answers[questionId] || "");
    const option =
      optionsRaw.value.find((o: any) => String(o.id) === optionId) || null;
    const score = Number(option?.score_value ?? option?.score ?? 0);
    return {
      question_id: questionId,
      option_id: optionId || null,
      score_value: score,
    };
  });

  const scoringType = String(questionnaire.scoring_type || "total_score");

  const base = {
    code: code.value,
    questionnaire_id: qid,
    scoring_type: scoringType,
    submitted_at: new Date().toISOString(),
    user_info: userInfo,
    answers: answersList,
  };

  if (scoringType === "multi_dimension") {
    const dimScores = computeDimensionScores();
    const dominant = computeDominantDimension(dimScores);
    const dimBands = computeDimensionBands(dimScores);
    const meaning = resolveMeaningMultiDimension(dominant, dimBands);

    return {
      ...base,
      scoring: {
        dimension_scores: dimScores,
        dominant_dimension: dominant,
        dimension_bands: dimBands,
        meaning,
      },
    };
  }

  // total_score
  const total = answersList.reduce(
    (sum, a) => sum + Number(a.score_value || 0),
    0,
  );
  const totalBand = computeTotalBand(total);
  const meaning = resolveMeaningTotal(totalBand);

  return {
    ...base,
    scoring: {
      total_score: total,
      total_band: totalBand,
      meaning,
    },
  };
}

/** Dimension scoring */
function computeDimensionScores() {
  const scores: Record<string, number> = {};

  for (const qq of questions.value) {
    const qid = String(qq.id);
    const optId = String(answers[qid] || "");
    const opt = optionsRaw.value.find((o: any) => String(o.id) === optId);
    const score = Number(opt?.score_value ?? opt?.score ?? 0);

    // dimension id might be on question or option
    const dimId = String(
      qq.dimension_id ??
        qq.questionnaire_dimension_id ??
        opt?.dimension_id ??
        opt?.questionnaire_dimension_id ??
        "",
    ).trim();

    // dimension code fallback
    const dimCode = String(
      qq.dimension_code ?? opt?.dimension_code ?? qq.dimension ?? "",
    ).trim();

    const key = dimId || dimCode || "unknown";
    scores[key] = (scores[key] || 0) + score;
  }

  return scores;
}

function computeDominantDimension(dimScores: Record<string, number>) {
  const entries = Object.entries(dimScores);
  if (!entries.length) return null;

  entries.sort((a, b) => {
    const diff = Number(b[1]) - Number(a[1]);
    if (diff !== 0) return diff;
    // tie-break: stable by key
    return String(a[0]).localeCompare(String(b[0]));
  });

  const key = entries[0][0];
  const dim = findDimension(key);
  return {
    key,
    id: dim?.id ? String(dim.id) : null,
    code: dim?.code ? String(dim.code) : null,
    name: String(dim?.name ?? dim?.title ?? key),
    score: Number(entries[0][1]),
  };
}

function computeDimensionBands(dimScores: Record<string, number>) {
  const out: Record<string, any> = {};

  for (const [key, score] of Object.entries(dimScores)) {
    const dim = findDimension(key);
    const dimId = String(dim?.id ?? key);

    const band = bandsRaw.value
      .filter(
        (b: any) =>
          String(b.scope ?? b.score_band_scope ?? "").toLowerCase() ===
          "dimension",
      )
      .filter(
        (b: any) =>
          String(b.dimension_id ?? b.questionnaire_dimension_id ?? "") ===
          dimId,
      )
      .find((b: any) => inRange(score, b.min_score, b.max_score));

    out[key] = {
      key,
      dimension_id: dim?.id ? String(dim.id) : null,
      dimension_name: String(dim?.name ?? dim?.title ?? key),
      score: Number(score),
      band_level: String(band?.band_level ?? band?.level ?? band?.label ?? "—"),
      band_id: band?.id ? String(band.id) : null,
    };
  }

  return out;
}

/** Total band */
function computeTotalBand(totalScore: number) {
  const band = bandsRaw.value
    .filter(
      (b: any) =>
        String(b.scope ?? b.score_band_scope ?? "").toLowerCase() === "total",
    )
    .find((b: any) => inRange(totalScore, b.min_score, b.max_score));

  return {
    score: totalScore,
    band_level: String(band?.band_level ?? band?.level ?? band?.label ?? "—"),
    band_id: band?.id ? String(band.id) : null,
    min_score: band?.min_score ?? null,
    max_score: band?.max_score ?? null,
  };
}

/** Meaning resolution */
function resolveMeaningMultiDimension(
  dominant: any,
  dimBands: Record<string, any>,
) {
  const qid = String(q.value?.id ?? "");

  const meanings = meaningsRaw.value.filter(
    (m: any) => String(m.questionnaire_id) === qid,
  );

  // 1) band_combo
  const comboCandidates = meanings.filter(
    (m: any) => String(m.rule_type) === "band_combo",
  );
  for (const m of comboCandidates) {
    const combo = (m.band_combo_json ??
      m.band_combo ??
      m.rule_json ??
      null) as any;
    if (combo && matchBandCombo(combo, dimBands)) return normalizeMeaning(m);
  }

  // 2) dominant_dimension
  const domCandidates = meanings.filter(
    (m: any) => String(m.rule_type) === "dominant_dimension",
  );
  for (const m of domCandidates) {
    const mDimId = String(m.dimension_id ?? m.questionnaire_dimension_id ?? "");
    const mDimCode = String(m.dimension_code ?? "");
    if (
      (mDimId && dominant?.id && mDimId === String(dominant.id)) ||
      (mDimCode && dominant?.code && mDimCode === String(dominant.code)) ||
      (mDimId && dominant?.key && mDimId === String(dominant.key)) ||
      (mDimCode && dominant?.key && mDimCode === String(dominant.key))
    ) {
      return normalizeMeaning(m);
    }
  }

  // 3) fallback
  const fallback = meanings.find(
    (m: any) => String(m.rule_type) === "fallback",
  );
  return normalizeMeaning(fallback) || null;
}

function resolveMeaningTotal(totalBand: any) {
  const qid = String(q.value?.id ?? "");
  const meanings = meaningsRaw.value.filter(
    (m: any) => String(m.questionnaire_id) === qid,
  );

  // 1) band_combo (using total band)
  const comboCandidates = meanings.filter(
    (m: any) => String(m.rule_type) === "band_combo",
  );
  for (const m of comboCandidates) {
    const combo = (m.band_combo_json ??
      m.band_combo ??
      m.rule_json ??
      null) as any;
    if (combo && matchTotalBandCombo(combo, totalBand))
      return normalizeMeaning(m);
  }

  // 2) fallback
  const fallback = meanings.find(
    (m: any) => String(m.rule_type) === "fallback",
  );
  return normalizeMeaning(fallback) || null;
}

/** Matchers */
function matchBandCombo(combo: any, dimBands: Record<string, any>) {
  // Supported combo shapes:
  // - { dimension_id_or_key: "High", ... }
  // - { bands: { dimensionKey: "High" } }
  // - array of { dimension: <key>, band_level: <level> }
  const bandsObj = combo?.bands ?? combo;

  if (Array.isArray(bandsObj)) {
    return bandsObj.every((rule: any) => {
      const key = String(
        rule.dimension ?? rule.dimension_key ?? rule.dimension_id ?? "",
      ).trim();
      const level = String(
        rule.band_level ?? rule.level ?? rule.band ?? "",
      ).trim();
      if (!key || !level) return false;
      const target =
        dimBands[key] || dimBands[String(findDimension(key)?.id ?? "")];
      return (
        String(target?.band_level ?? "").toLowerCase() === level.toLowerCase()
      );
    });
  }

  if (bandsObj && typeof bandsObj === "object") {
    return Object.entries(bandsObj).every(([k, v]) => {
      const key = String(k).trim();
      const level = String(v).trim();
      const target =
        dimBands[key] ||
        dimBands[String(findDimension(key)?.id ?? "")] ||
        dimBands[String(findDimensionById(key)?.id ?? "")];
      return (
        String(target?.band_level ?? "").toLowerCase() === level.toLowerCase()
      );
    });
  }

  return false;
}

function matchTotalBandCombo(combo: any, totalBand: any) {
  // Supported combo shapes:
  // - { total: "High" } or { band_level: "High" }
  // - { bands: { total: "High" } }
  const obj = combo?.bands ?? combo;
  const desired = String(
    obj?.total ?? obj?.band_level ?? obj?.level ?? obj?.band ?? "",
  ).trim();
  if (!desired) return false;
  return (
    String(totalBand?.band_level ?? "").toLowerCase() === desired.toLowerCase()
  );
}

function normalizeMeaning(m: any) {
  if (!m) return null;
  return {
    id: m.id ? String(m.id) : null,
    result_label: String(m.result_label ?? m.label ?? "Result"),
    description: String(m.description ?? ""),
    recommendations: Array.isArray(m.recommendations)
      ? m.recommendations.map((x: any) => String(x))
      : Array.isArray(m.recommendations_json)
        ? m.recommendations_json.map((x: any) => String(x))
        : typeof m.recommendations === "string"
          ? m.recommendations
              .split("\n")
              .map((s: string) => s.trim())
              .filter(Boolean)
          : [],
    rule_type: String(m.rule_type ?? ""),
  };
}

/** Dimension finders */
function findDimension(keyOrIdOrCode: string) {
  const key = String(keyOrIdOrCode).trim();
  if (!key) return null;

  // Try id
  const byId = dimensionsRaw.value.find((d: any) => String(d.id) === key);
  if (byId) return byId;

  // Try code
  const byCode = dimensionsRaw.value.find((d: any) => String(d.code) === key);
  if (byCode) return byCode;

  // Try name
  const byName = dimensionsRaw.value.find(
    (d: any) =>
      String(d.name ?? d.title ?? "").toLowerCase() === key.toLowerCase(),
  );
  return byName || null;
}

function findDimensionById(id: string) {
  const key = String(id).trim();
  if (!key) return null;
  return dimensionsRaw.value.find((d: any) => String(d.id) === key) || null;
}

/** Range helper */
function inRange(score: number, min: any, max: any) {
  const a = Number(min ?? Number.NEGATIVE_INFINITY);
  const b = Number(max ?? Number.POSITIVE_INFINITY);
  return score >= a && score <= b;
}

/** Read session JSON */
function readSessionJson(key: string) {
  if (!import.meta.client) return null;
  try {
    const raw = sessionStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

/** Snack */
const snack = ref({ show: false, text: "" });
function notify(text: string) {
  snack.value = { show: true, text };
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
