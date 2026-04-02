<template>
  <v-container class="pa-6">
    <div class="d-flex align-center justify-space-between ga-3 flex-wrap mb-6">
      <div class="min-w-0">
        <h1 class="text-h5 font-weight-black ma-0">Report Detail</h1>
        <div class="text-body-2 text-medium-emphasis mt-1">
          {{
            reportMeta
              ? `${reportMeta.questionnaire_title} • ${reportMeta.id}`
              : "—"
          }}
        </div>
      </div>

      <div class="d-flex align-center ga-2 flex-wrap justify-end">
        <v-btn
          rounded="lg"
          variant="outlined"
          prepend-icon="lucide:arrow-left"
          to="/org/reports"
        >
          Back
        </v-btn>

        <v-menu>
          <template #activator="{ props }">
            <v-btn
              v-bind="props"
              rounded="lg"
              variant="outlined"
              prepend-icon="lucide:download"
            >
              Export
            </v-btn>
          </template>

          <v-card rounded="xl" variant="outlined" class="pa-2">
            <v-list density="comfortable" class="pa-0">
              <v-list-item @click="toast('Export PDF (UI only)')">
                <template #prepend>
                  <v-icon icon="lucide:file" class="me-2" />
                </template>
                <v-list-item-title>Export PDF</v-list-item-title>
              </v-list-item>
              <v-list-item @click="toast('Export JSON (UI only)')">
                <template #prepend>
                  <v-icon icon="lucide:braces" class="me-2" />
                </template>
                <v-list-item-title>Export JSON</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-card>
        </v-menu>
      </div>
    </div>

    <div v-if="uiState === 'loading'">
      <v-skeleton-loader type="card" class="rounded-xl" />
      <v-skeleton-loader type="card" class="rounded-xl mt-6" />
      <v-skeleton-loader type="card" class="rounded-xl mt-6" />
    </div>

    <div v-else-if="uiState === 'error'">
      <v-alert type="error" variant="tonal" rounded="lg" class="mb-4">
        {{ errorMessage }}
      </v-alert>
      <v-btn
        rounded="lg"
        color="primary"
        prepend-icon="lucide:refresh-cw"
        @click="load"
      >
        Retry
      </v-btn>
    </div>

    <div v-else-if="uiState === 'empty' || !reportMeta || !result">
      <v-card rounded="xl" variant="outlined" class="pa-6">
        <div class="d-flex align-center ga-3">
          <v-avatar color="primary" variant="tonal" size="40">
            <v-icon icon="lucide:inbox" />
          </v-avatar>
          <div>
            <div class="text-subtitle-1 font-weight-bold">Report not found</div>
            <div class="text-body-2 text-medium-emphasis">
              The report ID
              <span class="font-weight-medium">{{ id }}</span> does not exist.
            </div>
          </div>
        </div>
      </v-card>
    </div>

    <div v-else>
      <v-row>
        <v-col cols="12" md="5">
          <v-card rounded="xl" variant="outlined">
            <v-card-title
              class="d-flex align-center justify-space-between ga-3 flex-wrap"
            >
              <div class="min-w-0">
                <div class="text-subtitle-1 font-weight-bold">Attempt</div>
                <div class="text-caption text-medium-emphasis">
                  Submitted:
                  {{
                    reportMeta.submitted_at
                      ? formatDateTime(reportMeta.submitted_at)
                      : "—"
                  }}
                </div>
              </div>
              <v-chip size="small" variant="tonal" color="primary">{{
                reportMeta.status
              }}</v-chip>
            </v-card-title>
            <v-divider />
            <v-card-text class="pa-5">
              <v-list density="comfortable" class="pa-0">
                <v-list-item class="px-0">
                  <v-list-item-title class="text-caption text-medium-emphasis"
                    >Questionnaire</v-list-item-title
                  >
                  <template #append>
                    <div class="text-body-2 font-weight-medium">
                      {{ reportMeta.questionnaire_title }}
                    </div>
                  </template>
                </v-list-item>

                <v-divider class="my-2" />

                <v-list-item class="px-0">
                  <v-list-item-title class="text-caption text-medium-emphasis"
                    >Version</v-list-item-title
                  >
                  <template #append>
                    <div class="text-body-2 font-weight-medium">
                      v{{ reportMeta.questionnaire_version }}
                    </div>
                  </template>
                </v-list-item>

                <v-divider class="my-2" />

                <v-list-item class="px-0">
                  <v-list-item-title class="text-caption text-medium-emphasis"
                    >Started</v-list-item-title
                  >
                  <template #append>
                    <div class="text-body-2 font-weight-medium">
                      {{ formatDateTime(reportMeta.started_at) }}
                    </div>
                  </template>
                </v-list-item>

                <v-divider class="my-2" />

                <v-list-item class="px-0">
                  <v-list-item-title class="text-caption text-medium-emphasis"
                    >Computed</v-list-item-title
                  >
                  <template #append>
                    <div class="text-body-2 font-weight-medium">
                      {{ formatDateTime(result.computed_at) }}
                    </div>
                  </template>
                </v-list-item>
              </v-list>
            </v-card-text>
          </v-card>

          <v-card rounded="xl" variant="outlined" class="mt-6">
            <v-card-title
              class="d-flex align-center justify-space-between ga-3 flex-wrap"
            >
              <div class="min-w-0">
                <div class="text-subtitle-1 font-weight-bold">User Info</div>
                <div class="text-caption text-medium-emphasis">
                  Snapshot captured at submission
                </div>
              </div>
            </v-card-title>
            <v-divider />
            <v-card-text class="pa-5">
              <v-row>
                <v-col
                  cols="12"
                  md="6"
                  v-for="(val, key) in result.user_info_snapshot"
                  :key="key"
                >
                  <div
                    class="text-caption text-medium-emphasis text-capitalize"
                  >
                    {{ prettyKey(key) }}
                  </div>
                  <div class="text-body-2 font-weight-medium mt-1">
                    {{ String(val) }}
                  </div>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>

        <v-col cols="12" md="7">
          <v-card rounded="xl" variant="outlined">
            <v-card-title
              class="d-flex align-center justify-space-between ga-3 flex-wrap"
            >
              <div class="min-w-0">
                <div class="text-subtitle-1 font-weight-bold">Result</div>
                <div class="text-caption text-medium-emphasis">
                  Computed interpretation (mock)
                </div>
              </div>
              <v-chip size="small" variant="tonal" color="primary">{{
                result.result_label
              }}</v-chip>
            </v-card-title>
            <v-divider />
            <v-card-text class="pa-5">
              <div class="text-body-2">{{ result.meaning_snapshot }}</div>

              <div class="text-caption text-medium-emphasis mt-4">
                Recommendations
              </div>
              <v-list density="compact" class="pa-0">
                <v-list-item
                  v-for="(r, idx) in result.recommendations_snapshot"
                  :key="idx"
                  class="px-0"
                >
                  <template #prepend>
                    <v-icon icon="lucide:check" class="me-2" />
                  </template>
                  <v-list-item-title>{{ r }}</v-list-item-title>
                </v-list-item>
              </v-list>

              <v-divider class="my-4" />

              <div class="text-subtitle-2 font-weight-bold mb-2">Scores</div>

              <v-alert
                v-if="result.scoring_type === 'total_score'"
                type="info"
                variant="tonal"
                rounded="lg"
                class="mb-3"
              >
                Total score:
                <span class="font-weight-bold">{{
                  result.scores_json.total
                }}</span>
                <span class="ms-2">({{ result.bands_json.total_band }})</span>
              </v-alert>

              <v-row v-else>
                <v-col
                  cols="12"
                  md="6"
                  v-for="(score, dim) in result.scores_json.dimensions"
                  :key="dim"
                >
                  <v-card rounded="xl" variant="outlined" class="pa-4">
                    <div class="d-flex align-center justify-space-between">
                      <div class="min-w-0">
                        <div
                          class="text-body-1 font-weight-medium text-capitalize"
                        >
                          {{ dim }}
                        </div>
                        <div class="text-caption text-medium-emphasis mt-1">
                          Band: {{ result.bands_json.dimensions[dim] ?? "—" }}
                        </div>
                      </div>
                      <v-chip size="small" variant="tonal">{{ score }}</v-chip>
                    </div>
                  </v-card>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>

          <v-card rounded="xl" variant="outlined" class="mt-6">
            <v-card-title class="text-subtitle-1 font-weight-bold"
              >Answers (Summary)</v-card-title
            >
            <v-divider />
            <v-card-text class="pa-5">
              <v-card
                v-for="a in result.answers_snapshot"
                :key="a.question_code"
                rounded="xl"
                variant="outlined"
                class="pa-4 mb-3"
              >
                <div class="text-body-2 font-weight-medium">
                  {{ a.question_text }}
                </div>
                <div class="text-caption text-medium-emphasis mt-1">
                  Selected: {{ a.selected_label }}
                </div>
              </v-card>

              <div
                v-if="result.answers_snapshot.length === 0"
                class="text-body-2 text-medium-emphasis"
              >
                No answers captured.
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </div>

    <v-snackbar v-model="snack.open" timeout="1400" location="bottom">
      {{ snack.text }}
    </v-snackbar>
  </v-container>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useHead, useRoute } from "#imports";

type UiState = "loading" | "error" | "empty" | "ready";

type ReportMeta = {
  id: string;
  questionnaire_code: string;
  questionnaire_title: string;
  questionnaire_version: number;
  status: "submitted" | "started";
  started_at: string;
  submitted_at: string | null;
};

type ResultTotal = {
  scoring_type: "total_score";
  computed_at: string;
  result_label: string;
  meaning_snapshot: string;
  recommendations_snapshot: string[];
  user_info_snapshot: Record<string, any>;
  scores_json: { total: number };
  bands_json: { total_band: string };
  answers_snapshot: Array<{
    question_code: string;
    question_text: string;
    selected_label: string;
    score_value: number;
  }>;
};

type ResultMulti = {
  scoring_type: "multi_dimension";
  computed_at: string;
  result_label: string;
  meaning_snapshot: string;
  recommendations_snapshot: string[];
  user_info_snapshot: Record<string, any>;
  scores_json: { dimensions: Record<string, number> };
  bands_json: { dimensions: Record<string, string> };
  answers_snapshot: Array<{
    question_code: string;
    question_text: string;
    selected_label: string;
    score_value: number;
    dimension_key: string;
  }>;
};

type ReportResult = ResultTotal | ResultMulti;

useHead({
  title: "Report Detail • Org Console",
  meta: [
    {
      name: "description",
      content: "Organization report detail and interpretation.",
    },
  ],
});

const route = useRoute();
const id = computed(() => (route.params.id ?? "").toString());

const uiState = ref<UiState>("loading");
const errorMessage = ref("");

const reportMeta = ref<ReportMeta | null>(null);
const result = ref<ReportResult | null>(null);

const snack = ref({ open: false, text: "" });
function toast(text: string) {
  snack.value = { open: true, text };
}

function formatDateTime(iso: string | null) {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleString(undefined, {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

function prettyKey(k: string) {
  return k.replace(/_/g, " ");
}

async function load() {
  uiState.value = "loading";
  errorMessage.value = "";

  try {
    await new Promise((r) => setTimeout(r, 450));

    const rows: Array<{ meta: ReportMeta; res: ReportResult }> = [
      {
        meta: {
          id: "att_1001",
          questionnaire_code: "stress-check",
          questionnaire_title: "Stress Check (7 mins)",
          questionnaire_version: 1,
          status: "submitted",
          started_at: "2026-01-12T02:10:00Z",
          submitted_at: "2026-01-12T02:17:00Z",
        },
        res: {
          scoring_type: "total_score",
          computed_at: "2026-01-12T02:17:10Z",
          result_label: "Moderate Stress",
          meaning_snapshot: "Some stress is present. Consider recovery habits.",
          recommendations_snapshot: [
            "Schedule breaks",
            "Light exercise",
            "Sleep consistency",
          ],
          user_info_snapshot: {
            full_name: "Anonymous User",
            email: "anon@example.com",
            organization: "Alpha Wellness Clinic",
          },
          scores_json: { total: 6 },
          bands_json: { total_band: "Moderate Stress" },
          answers_snapshot: [
            {
              question_code: "Q1",
              question_text: "How often do you feel overwhelmed?",
              selected_label: "Sometimes",
              score_value: 2,
            },
            {
              question_code: "Q2",
              question_text: "How well have you been sleeping recently?",
              selected_label: "Okay",
              score_value: 2,
            },
          ],
        },
      },
      {
        meta: {
          id: "att_1002",
          questionnaire_code: "energy-balance",
          questionnaire_title: "Energy Balance (10 mins)",
          questionnaire_version: 2,
          status: "submitted",
          started_at: "2026-01-15T06:10:00Z",
          submitted_at: "2026-01-15T06:25:00Z",
        },
        res: {
          scoring_type: "multi_dimension",
          computed_at: "2026-01-15T06:25:10Z",
          result_label: "Earth Dominant",
          meaning_snapshot:
            "You tend to be steady, consistent, and supportive.",
          recommendations_snapshot: [
            "Keep routines stable",
            "Focus on sustainable habits",
            "Avoid over-commitment",
          ],
          user_info_snapshot: {
            full_name: "Anonymous User",
            organization: "Alpha Wellness Clinic",
          },
          scores_json: { dimensions: { earth: 7, metal: 5 } },
          bands_json: {
            dimensions: { earth: "Balanced", metal: "High Focus" },
          },
          answers_snapshot: [
            {
              question_code: "Q1",
              question_text: "You prefer to plan before acting.",
              selected_label: "Agree",
              score_value: 3,
              dimension_key: "metal",
            },
            {
              question_code: "Q2",
              question_text: "You feel grounded when routines are stable.",
              selected_label: "Strongly agree",
              score_value: 4,
              dimension_key: "earth",
            },
          ],
        },
      },
    ];

    const found = rows.find((r) => r.meta.id === id.value) ?? null;
    if (!found) {
      uiState.value = "empty";
      return;
    }

    reportMeta.value = found.meta;
    result.value = found.res;
    uiState.value = "ready";
  } catch (e: any) {
    uiState.value = "error";
    errorMessage.value = e?.message || "Failed to load report detail.";
  }
}

onMounted(load);
</script>
