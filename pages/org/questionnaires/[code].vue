<template>
  <v-container class="pa-6">
    <div class="d-flex align-center justify-space-between ga-3 flex-wrap mb-6">
      <div class="min-w-0">
        <h1 class="text-h5 font-weight-black ma-0">Questionnaire Detail</h1>
        <div class="text-body-2 text-medium-emphasis mt-1">
          {{ questionnaire?.title ?? "—" }}
        </div>
      </div>

      <div class="d-flex align-center ga-2 flex-wrap justify-end">
        <v-btn
          rounded="lg"
          variant="outlined"
          prepend-icon="lucide:arrow-left"
          to="/org/questionnaires"
        >
          Back
        </v-btn>
        <v-btn
          v-if="questionnaire"
          rounded="lg"
          color="primary"
          prepend-icon="lucide:file-text"
          :to="`/org/reports?questionnaire=${questionnaire.code}`"
        >
          View Reports
        </v-btn>
      </div>
    </div>

    <div v-if="uiState === 'loading'">
      <v-skeleton-loader type="card" class="rounded-xl" />
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

    <div v-else-if="uiState === 'empty' || !questionnaire">
      <v-card rounded="xl" variant="outlined" class="pa-6">
        <div class="d-flex align-center ga-3">
          <v-avatar color="primary" variant="tonal" size="40">
            <v-icon icon="lucide:clipboard-list" />
          </v-avatar>
          <div>
            <div class="text-subtitle-1 font-weight-bold">
              Questionnaire not found
            </div>
            <div class="text-body-2 text-medium-emphasis">
              The code <span class="font-weight-medium">{{ code }}</span> does
              not exist.
            </div>
          </div>
        </div>
      </v-card>
    </div>

    <div v-else>
      <v-card rounded="xl" variant="outlined">
        <v-card-text class="pa-5">
          <div class="d-flex align-center justify-space-between ga-3 flex-wrap">
            <div class="min-w-0">
              <div class="text-subtitle-1 font-weight-bold">
                {{ questionnaire.title }}
              </div>
              <div class="text-body-2 text-medium-emphasis mt-1">
                {{ questionnaire.description }}
              </div>
            </div>
            <div class="d-flex ga-2 flex-wrap">
              <v-chip size="small" variant="tonal" color="primary">{{
                questionnaire.language
              }}</v-chip>
              <v-chip
                size="small"
                variant="tonal"
                :color="
                  questionnaire.status === 'published' ? 'primary' : 'warning'
                "
              >
                {{ questionnaire.status }}
              </v-chip>
              <v-chip size="small" variant="tonal"
                >v{{ questionnaire.version }}</v-chip
              >
            </div>
          </div>

          <v-divider class="my-4" />

          <v-row>
            <v-col cols="12" md="4">
              <div class="text-caption text-medium-emphasis">Scoring type</div>
              <div class="text-body-2 font-weight-medium mt-1">
                {{
                  questionnaire.scoring_type === "multi_dimension"
                    ? "Multi-dimension"
                    : "Total score"
                }}
              </div>
            </v-col>
            <v-col cols="12" md="4">
              <div class="text-caption text-medium-emphasis">
                Show result to user
              </div>
              <div class="text-body-2 font-weight-medium mt-1">
                {{ questionnaire.show_result_to_user ? "Yes" : "No" }}
              </div>
            </v-col>
            <v-col cols="12" md="4">
              <div class="text-caption text-medium-emphasis">
                Share link (UI)
              </div>
              <div class="d-flex align-center ga-2 mt-1">
                <v-text-field
                  :model-value="shareLink"
                  variant="outlined"
                  rounded="lg"
                  density="comfortable"
                  hide-details
                  readonly
                />
                <v-btn
                  rounded="lg"
                  variant="outlined"
                  prepend-icon="lucide:copy"
                  @click="copyLink"
                >
                  Copy
                </v-btn>
              </div>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>

      <v-card rounded="xl" variant="outlined" class="mt-6">
        <v-tabs v-model="tab" color="primary" class="px-2">
          <v-tab value="questions">Questions</v-tab>
          <v-tab value="userInfo">User Info Config</v-tab>
          <v-tab value="bands">Bands</v-tab>
          <v-tab value="meanings">Meanings</v-tab>
        </v-tabs>
        <v-divider />

        <v-window v-model="tab">
          <v-window-item value="questions">
            <v-card-text class="pa-5">
              <div class="d-flex align-center justify-space-between mb-3">
                <div class="text-subtitle-2 font-weight-bold">
                  Questions Preview
                </div>
                <v-chip size="small" variant="tonal"
                  >{{ questions.length }} questions</v-chip
                >
              </div>

              <v-card
                v-for="q in questions"
                :key="q.id"
                rounded="xl"
                variant="outlined"
                class="pa-4 mb-3"
              >
                <div class="d-flex align-start justify-space-between ga-3">
                  <div class="min-w-0">
                    <div class="text-body-1 font-weight-medium">
                      {{ q.text }}
                    </div>
                    <div class="text-caption text-medium-emphasis mt-1">
                      Code: {{ q.code }} • Type: {{ q.question_type }} •
                      Required: {{ q.is_required ? "Yes" : "No" }}
                    </div>
                  </div>
                  <v-chip size="small" variant="tonal"
                    >#{{ q.sort_order }}</v-chip
                  >
                </div>

                <v-divider class="my-3" />

                <v-list density="compact" class="pa-0">
                  <v-list-item v-for="o in q.options" :key="o.id" class="px-0">
                    <template #prepend>
                      <v-icon icon="lucide:circle" size="14" class="me-2" />
                    </template>
                    <v-list-item-title>{{ o.label }}</v-list-item-title>
                    <template #append>
                      <v-chip size="x-small" variant="tonal">{{
                        o.score_value
                      }}</v-chip>
                    </template>
                  </v-list-item>
                </v-list>
              </v-card>

              <div
                v-if="questions.length === 0"
                class="text-body-2 text-medium-emphasis"
              >
                No questions configured.
              </div>
            </v-card-text>
          </v-window-item>

          <v-window-item value="userInfo">
            <v-card-text class="pa-5">
              <div class="text-subtitle-2 font-weight-bold mb-3">
                User Info Fields
              </div>

              <v-data-table
                :headers="userInfoHeaders"
                :items="userInfoConfigs"
                item-key="id"
                density="comfortable"
                class="sb-table"
              >
                <template #item.is_required="{ item }">
                  <v-chip
                    size="small"
                    variant="tonal"
                    :color="item.is_required ? 'primary' : 'secondary'"
                  >
                    {{ item.is_required ? "Required" : "Optional" }}
                  </v-chip>
                </template>

                <template #item.overrides_json="{ item }">
                  <div class="text-body-2 text-medium-emphasis">
                    {{ item.overrides_json ? "Has overrides" : "—" }}
                  </div>
                </template>

                <template #no-data>
                  <div class="pa-6 text-center text-medium-emphasis">
                    No user info config.
                  </div>
                </template>
              </v-data-table>
            </v-card-text>
          </v-window-item>

          <v-window-item value="bands">
            <v-card-text class="pa-5">
              <div class="text-subtitle-2 font-weight-bold mb-3">
                Score Bands
              </div>

              <v-row>
                <v-col cols="12" md="6" v-for="b in bands" :key="b.id">
                  <v-card rounded="xl" variant="outlined" class="pa-4">
                    <div class="d-flex align-center justify-space-between">
                      <div class="min-w-0">
                        <div class="text-body-1 font-weight-medium">
                          {{ b.label }}
                        </div>
                        <div class="text-caption text-medium-emphasis mt-1">
                          Scope: {{ b.scope
                          }}{{
                            b.dimension_key
                              ? ` • Dimension: ${b.dimension_key}`
                              : ""
                          }}
                        </div>
                      </div>
                      <v-chip size="small" variant="tonal"
                        >{{ b.min_score }} - {{ b.max_score }}</v-chip
                      >
                    </div>
                  </v-card>
                </v-col>
              </v-row>

              <div
                v-if="bands.length === 0"
                class="text-body-2 text-medium-emphasis"
              >
                No bands configured.
              </div>
            </v-card-text>
          </v-window-item>

          <v-window-item value="meanings">
            <v-card-text class="pa-5">
              <div class="text-subtitle-2 font-weight-bold mb-3">
                Meanings Rules
              </div>

              <v-card
                v-for="m in meanings"
                :key="m.id"
                rounded="xl"
                variant="outlined"
                class="pa-4 mb-3"
              >
                <div class="d-flex align-center justify-space-between ga-3">
                  <div class="min-w-0">
                    <div class="text-body-1 font-weight-medium">
                      {{ m.result_label }}
                    </div>
                    <div class="text-caption text-medium-emphasis mt-1">
                      Rule: {{ m.rule_type }} • Priority: {{ m.priority }} •
                      Active: {{ m.is_active ? "Yes" : "No" }}
                    </div>
                  </div>
                  <v-chip size="small" variant="tonal"
                    >#{{ m.priority }}</v-chip
                  >
                </div>

                <v-divider class="my-3" />

                <div class="text-body-2">{{ m.description }}</div>

                <div class="text-caption text-medium-emphasis mt-3">
                  Recommendations
                </div>
                <v-list density="compact" class="pa-0">
                  <v-list-item
                    v-for="(rec, idx) in m.recommendations"
                    :key="idx"
                    class="px-0"
                  >
                    <template #prepend>
                      <v-icon icon="lucide:check" class="me-2" />
                    </template>
                    <v-list-item-title>{{ rec }}</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-card>

              <div
                v-if="meanings.length === 0"
                class="text-body-2 text-medium-emphasis"
              >
                No meanings configured.
              </div>
            </v-card-text>
          </v-window-item>
        </v-window>
      </v-card>
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

type Questionnaire = {
  id: string;
  code: string;
  title: string;
  description: string;
  language: string;
  status: "published" | "archived" | "draft";
  version: number;
  scoring_type: "multi_dimension" | "total_score";
  show_result_to_user: boolean;
  created_at: string;
  updated_at: string;
};

type Option = {
  id: string;
  label: string;
  score_value: number;
  sort_order: number;
};

type Question = {
  id: string;
  questionnaire_id: string;
  code: string;
  text: string;
  question_type: "single_choice";
  is_required: boolean;
  sort_order: number;
  meta: any;
  options: Option[];
};

type UserInfoConfigRow = {
  id: string;
  key: string;
  label: string;
  field_type: string;
  is_required: boolean;
  sort_order: number;
  overrides_json: any;
};

type Band = {
  id: string;
  scope: "dimension" | "total";
  dimension_key?: string | null;
  label: string;
  min_score: number;
  max_score: number;
  sort_order: number;
};

type Meaning = {
  id: string;
  rule_type: "dominant_dimension" | "band_combo" | "fallback";
  rule_json: any;
  result_label: string;
  description: string;
  recommendations: string[];
  priority: number;
  is_active: boolean;
};

useHead({
  title: "Questionnaire Detail • Org Console",
  meta: [
    {
      name: "description",
      content: "Read-only questionnaire detail and previews.",
    },
  ],
});

const route = useRoute();
const code = computed(() => (route.params.code ?? "").toString());

const uiState = ref<UiState>("loading");
const errorMessage = ref("");

const questionnaire = ref<Questionnaire | null>(null);
const questions = ref<Question[]>([]);
const userInfoConfigs = ref<UserInfoConfigRow[]>([]);
const bands = ref<Band[]>([]);
const meanings = ref<Meaning[]>([]);

const tab = ref<"questions" | "userInfo" | "bands" | "meanings">("questions");

const userInfoHeaders = [
  { title: "Field", key: "label", sortable: false },
  { title: "Key", key: "key", sortable: false },
  { title: "Type", key: "field_type", sortable: false },
  { title: "Required", key: "is_required", sortable: false },
  { title: "Sort", key: "sort_order", sortable: false },
  { title: "Overrides", key: "overrides_json", sortable: false },
];

const snack = ref({ open: false, text: "" });

const shareLink = computed(() => {
  const origin =
    typeof window !== "undefined"
      ? window.location.origin
      : "https://example.com";
  return `${origin}/q/${code.value}`;
});

function toast(text: string) {
  snack.value = { open: true, text };
}

async function copyLink() {
  try {
    await navigator.clipboard.writeText(shareLink.value);
    toast("Link copied");
  } catch {
    toast("Copy failed");
  }
}

async function load() {
  uiState.value = "loading";
  errorMessage.value = "";

  try {
    await new Promise((r) => setTimeout(r, 450));

    const all: Questionnaire[] = [
      {
        id: "q_01",
        code: "stress-check",
        title: "Stress Check (7 mins)",
        description:
          "A quick assessment to understand your current stress level.",
        language: "en",
        status: "published",
        version: 1,
        scoring_type: "total_score",
        show_result_to_user: true,
        created_at: "2026-01-02T09:00:00Z",
        updated_at: "2026-01-05T09:00:00Z",
      },
      {
        id: "q_02",
        code: "energy-balance",
        title: "Energy Balance (10 mins)",
        description: "Explore energy distribution across key dimensions.",
        language: "en",
        status: "published",
        version: 2,
        scoring_type: "multi_dimension",
        show_result_to_user: true,
        created_at: "2026-01-03T09:00:00Z",
        updated_at: "2026-01-12T09:00:00Z",
      },
    ];

    const found = all.find((q) => q.code === code.value) ?? null;
    questionnaire.value = found;

    if (!found) {
      uiState.value = "empty";
      return;
    }

    if (found.code === "stress-check") {
      questions.value = [
        {
          id: "qq_001",
          questionnaire_id: found.id,
          code: "Q1",
          text: "How often do you feel overwhelmed?",
          question_type: "single_choice",
          is_required: true,
          sort_order: 1,
          meta: {},
          options: [
            { id: "qo_001", label: "Rarely", score_value: 1, sort_order: 1 },
            { id: "qo_002", label: "Sometimes", score_value: 2, sort_order: 2 },
            { id: "qo_003", label: "Often", score_value: 3, sort_order: 3 },
            {
              id: "qo_004",
              label: "Almost always",
              score_value: 4,
              sort_order: 4,
            },
          ],
        },
        {
          id: "qq_002",
          questionnaire_id: found.id,
          code: "Q2",
          text: "How well have you been sleeping recently?",
          question_type: "single_choice",
          is_required: true,
          sort_order: 2,
          meta: {},
          options: [
            { id: "qo_005", label: "Great", score_value: 1, sort_order: 1 },
            { id: "qo_006", label: "Okay", score_value: 2, sort_order: 2 },
            { id: "qo_007", label: "Poor", score_value: 3, sort_order: 3 },
          ],
        },
      ];

      userInfoConfigs.value = [
        {
          id: "uic_01",
          key: "full_name",
          label: "Full name",
          field_type: "text",
          is_required: true,
          sort_order: 1,
          overrides_json: null,
        },
        {
          id: "uic_02",
          key: "email",
          label: "Email",
          field_type: "email",
          is_required: true,
          sort_order: 2,
          overrides_json: null,
        },
        {
          id: "uic_03",
          key: "organization",
          label: "Organization",
          field_type: "select",
          is_required: true,
          sort_order: 3,
          overrides_json: null,
        },
      ];

      bands.value = [
        {
          id: "b_01",
          scope: "total",
          label: "Low Stress",
          min_score: 2,
          max_score: 4,
          sort_order: 1,
        },
        {
          id: "b_02",
          scope: "total",
          label: "Moderate Stress",
          min_score: 5,
          max_score: 7,
          sort_order: 2,
        },
        {
          id: "b_03",
          scope: "total",
          label: "High Stress",
          min_score: 8,
          max_score: 10,
          sort_order: 3,
        },
      ];

      meanings.value = [
        {
          id: "m_01",
          rule_type: "fallback",
          rule_json: {},
          result_label: "Moderate Stress",
          description: "Some stress is present. Consider recovery habits.",
          recommendations: [
            "Schedule breaks",
            "Light exercise",
            "Sleep consistency",
          ],
          priority: 100,
          is_active: true,
        },
      ];
    } else {
      questions.value = [
        {
          id: "qq_101",
          questionnaire_id: found.id,
          code: "Q1",
          text: "You prefer to plan before acting.",
          question_type: "single_choice",
          is_required: true,
          sort_order: 1,
          meta: { dimension_key: "metal" },
          options: [
            {
              id: "qo_101",
              label: "Strongly disagree",
              score_value: 1,
              sort_order: 1,
            },
            { id: "qo_102", label: "Disagree", score_value: 2, sort_order: 2 },
            { id: "qo_103", label: "Agree", score_value: 3, sort_order: 3 },
            {
              id: "qo_104",
              label: "Strongly agree",
              score_value: 4,
              sort_order: 4,
            },
          ],
        },
        {
          id: "qq_102",
          questionnaire_id: found.id,
          code: "Q2",
          text: "You feel grounded when routines are stable.",
          question_type: "single_choice",
          is_required: true,
          sort_order: 2,
          meta: { dimension_key: "earth" },
          options: [
            {
              id: "qo_105",
              label: "Strongly disagree",
              score_value: 1,
              sort_order: 1,
            },
            { id: "qo_106", label: "Disagree", score_value: 2, sort_order: 2 },
            { id: "qo_107", label: "Agree", score_value: 3, sort_order: 3 },
            {
              id: "qo_108",
              label: "Strongly agree",
              score_value: 4,
              sort_order: 4,
            },
          ],
        },
      ];

      userInfoConfigs.value = [
        {
          id: "uic_11",
          key: "full_name",
          label: "Full name",
          field_type: "text",
          is_required: true,
          sort_order: 1,
          overrides_json: null,
        },
        {
          id: "uic_12",
          key: "age",
          label: "Age",
          field_type: "number",
          is_required: false,
          sort_order: 2,
          overrides_json: null,
        },
        {
          id: "uic_13",
          key: "organization",
          label: "Organization",
          field_type: "select",
          is_required: true,
          sort_order: 3,
          overrides_json: null,
        },
      ];

      bands.value = [
        {
          id: "b_11",
          scope: "dimension",
          dimension_key: "metal",
          label: "High Focus",
          min_score: 6,
          max_score: 8,
          sort_order: 1,
        },
        {
          id: "b_12",
          scope: "dimension",
          dimension_key: "earth",
          label: "Balanced",
          min_score: 5,
          max_score: 8,
          sort_order: 2,
        },
      ];

      meanings.value = [
        {
          id: "m_11",
          rule_type: "dominant_dimension",
          rule_json: { dominant: "metal" },
          result_label: "Metal Dominant",
          description:
            "You thrive with structure, clarity, and disciplined focus.",
          recommendations: [
            "Prioritize planning",
            "Use checklists",
            "Avoid perfectionism",
          ],
          priority: 10,
          is_active: true,
        },
        {
          id: "m_12",
          rule_type: "dominant_dimension",
          rule_json: { dominant: "earth" },
          result_label: "Earth Dominant",
          description: "You tend to be steady, consistent, and supportive.",
          recommendations: [
            "Keep routines stable",
            "Focus on sustainable habits",
            "Avoid over-commitment",
          ],
          priority: 20,
          is_active: true,
        },
      ];
    }

    uiState.value = "ready";
  } catch (e: any) {
    uiState.value = "error";
    errorMessage.value = e?.message || "Failed to load questionnaire detail.";
  }
}

onMounted(load);
</script>

<style lang="scss" scoped>
:deep(.sb-table .v-data-table__td),
:deep(.sb-table .v-data-table__th) {
  padding-top: 12px;
  padding-bottom: 12px;
}
</style>
