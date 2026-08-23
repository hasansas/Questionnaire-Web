<template>
  <v-container class="pa-6">
    <!-- Page Header -->
    <div class="d-flex align-center justify-space-between ga-3 flex-wrap mb-6">
      <div class="min-w-0">
        <h1 class="text-h5 font-weight-black ma-0">Report Detail</h1>
        <div class="text-body-2 text-medium-emphasis mt-1">
          <span v-if="reportMeta">
            {{ reportMeta.questionnaire_title }} &bull; v{{
              reportMeta.questionnaire_version
            }}
          </span>
          <span v-else>—</span>
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

        <v-menu v-if="uiState === 'ready'" location="bottom end" offset="8">
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
          <v-card rounded="xl" variant="outlined" class="pa-1">
            <v-list density="comfortable" class="pa-0">
              <v-list-item rounded="lg" @click="handleExport('pdf')">
                <template #prepend>
                  <v-icon icon="lucide:file" size="18" class="me-2" />
                </template>
                <v-list-item-title>Export PDF</v-list-item-title>
              </v-list-item>
              <v-list-item rounded="lg" @click="handleExport('json')">
                <template #prepend>
                  <v-icon icon="lucide:braces" size="18" class="me-2" />
                </template>
                <v-list-item-title>Export JSON</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-card>
        </v-menu>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="uiState === 'loading'">
      <v-skeleton-loader type="card" class="rounded-xl mb-4" />
      <v-row>
        <v-col cols="12" md="4">
          <v-skeleton-loader type="card" class="rounded-xl" />
        </v-col>
        <v-col cols="12" md="8">
          <v-skeleton-loader type="card" class="rounded-xl" />
        </v-col>
      </v-row>
    </div>

    <!-- Error -->
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

    <!-- Not found -->
    <div v-else-if="uiState === 'empty'">
      <v-card rounded="xl" variant="outlined" class="pa-6">
        <div class="d-flex align-center ga-3">
          <v-avatar color="warning" variant="tonal" size="40">
            <v-icon icon="lucide:search-x" />
          </v-avatar>
          <div>
            <div class="text-subtitle-1 font-weight-bold">Report not found</div>
            <div class="text-body-2 text-medium-emphasis">
              No report found for ID
              <span class="font-weight-medium">{{ id }}</span
              >.
            </div>
          </div>
        </div>
      </v-card>
    </div>

    <!-- Ready -->
    <div v-else-if="uiState === 'ready' && reportMeta">
      <!-- Attempt summary -->
      <v-card rounded="xl" variant="outlined" class="pa-5 mb-4">
        <!-- Header row -->
        <div class="d-flex align-start flex-wrap ga-3">
          <div class="min-w-0">
            <div class="text-subtitle-1 font-weight-black">
              {{ reportMeta.questionnaire_title }}
            </div>
            <div class="text-body-2 text-medium-emphasis mt-1">
              {{ reportMeta.questionnaire_code }}
            </div>
          </div>

          <v-chip
            variant="tonal"
            class="px-3"
            :color="reportMeta.status === 'submitted' ? 'primary' : 'warning'"
          >
            <v-icon
              :icon="
                reportMeta.status === 'submitted'
                  ? 'lucide:badge-check'
                  : 'lucide:clock'
              "
              size="16"
              class="me-1"
            />
            {{
              reportMeta.status === "submitted" ? "Submitted" : "In Progress"
            }}
          </v-chip>

          <v-spacer />

          <v-chip variant="tonal" class="px-3">
            <v-icon icon="lucide:tag" size="16" class="me-1" />
            v{{ reportMeta.questionnaire_version }}
          </v-chip>
        </div>

        <v-divider class="my-4" />

        <!-- Stat cards -->
        <v-row>
          <v-col cols="12" sm="6" md="3">
            <v-card rounded="xl" variant="outlined" class="pa-4 h-100">
              <div class="d-flex align-center justify-space-between">
                <div class="min-w-0">
                  <div class="text-caption text-medium-emphasis">Code</div>
                  <div class="text-subtitle-2 font-weight-black mt-1">
                    {{ reportMeta.questionnaire_code }}
                  </div>
                </div>
                <v-avatar
                  size="40"
                  rounded="lg"
                  color="primary"
                  variant="tonal"
                >
                  <v-icon icon="lucide:hash" size="18" />
                </v-avatar>
              </div>
            </v-card>
          </v-col>

          <v-col cols="12" sm="6" md="3">
            <v-card rounded="xl" variant="outlined" class="pa-4 h-100">
              <div class="d-flex align-center justify-space-between">
                <div class="min-w-0">
                  <div class="text-caption text-medium-emphasis">Version</div>
                  <div class="text-h6 font-weight-black mt-1">
                    v{{ reportMeta.questionnaire_version }}
                  </div>
                </div>
                <v-avatar size="40" rounded="lg" color="info" variant="tonal">
                  <v-icon icon="lucide:tag" size="18" />
                </v-avatar>
              </div>
            </v-card>
          </v-col>

          <v-col cols="12" sm="6" md="3">
            <v-card rounded="xl" variant="outlined" class="pa-4 h-100">
              <div class="d-flex align-center justify-space-between">
                <div class="min-w-0">
                  <div class="text-caption text-medium-emphasis">Started</div>
                  <div class="text-subtitle-2 font-weight-black mt-1">
                    {{ formatDateTime(reportMeta.started_at) }}
                  </div>
                </div>
                <v-avatar
                  size="40"
                  rounded="lg"
                  color="success"
                  variant="tonal"
                >
                  <v-icon icon="lucide:play-circle" size="18" />
                </v-avatar>
              </div>
            </v-card>
          </v-col>

          <v-col cols="12" sm="6" md="3">
            <v-card rounded="xl" variant="outlined" class="pa-4 h-100">
              <div class="d-flex align-center justify-space-between">
                <div class="min-w-0">
                  <div class="text-caption text-medium-emphasis">Submitted</div>
                  <div class="text-subtitle-2 font-weight-black mt-1">
                    {{
                      reportMeta.submitted_at
                        ? formatDateTime(reportMeta.submitted_at)
                        : "—"
                    }}
                  </div>
                </div>
                <v-avatar
                  size="40"
                  rounded="lg"
                  color="warning"
                  variant="tonal"
                >
                  <v-icon icon="lucide:send" size="18" />
                </v-avatar>
              </div>
            </v-card>
          </v-col>
        </v-row>
      </v-card>

      <!-- In progress — no result yet -->
      <v-card v-if="!result" rounded="xl" variant="outlined">
        <v-card-text class="pa-6">
          <div class="d-flex align-center ga-3">
            <v-avatar color="warning" variant="tonal" size="40">
              <v-icon icon="lucide:clock" />
            </v-avatar>
            <div>
              <div class="text-subtitle-1 font-weight-bold">In Progress</div>
              <div class="text-body-2 text-medium-emphasis">
                This attempt has not been submitted yet. Results will appear
                once the respondent completes the questionnaire.
              </div>
            </div>
          </div>
        </v-card-text>
      </v-card>

      <!-- Result summary -->
      <v-row v-else>
        <!-- Left column: meta + user info -->
        <v-col cols="12" md="3">
          <!-- User info snapshot (only when result exists) -->
          <v-card
            v-if="result && Object.keys(result.user_info_snapshot).length"
            rounded="xl"
            variant="outlined"
          >
            <v-card-text class="pa-5">
              <div class="d-flex align-center ga-3 mb-4">
                <v-avatar
                  size="44"
                  rounded="lg"
                  color="primary"
                  variant="tonal"
                >
                  <v-icon icon="lucide:user" size="20" />
                </v-avatar>
                <div>
                  <div class="text-subtitle-2 font-weight-bold">
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
                  v-for="(val, key) in result.user_info_snapshot"
                  :key="key"
                  class="px-0"
                >
                  <template #prepend>
                    <v-avatar
                      size="32"
                      color="primary"
                      variant="tonal"
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
            </v-card-text>
          </v-card>

          <!-- Answers CTA -->
          <v-card
            v-if="result && result.answers_snapshot.length"
            rounded="xl"
            variant="outlined"
            class="pa-5 mt-4"
          >
            <div class="d-flex align-center ga-3 mb-4">
              <v-avatar size="44" rounded="lg" color="primary" variant="tonal">
                <v-icon icon="lucide:message-square-text" size="20" />
              </v-avatar>
              <div>
                <div class="text-subtitle-2 font-weight-bold">
                  Response Answers
                </div>
                <div class="text-body-2 text-medium-emphasis">
                  {{ result.answers_snapshot.length }} answered questions
                  captured at submission time.
                </div>
              </div>
            </div>
            <v-btn
              color="primary"
              rounded="lg"
              block
              prepend-icon="lucide:list"
              @click="answersDialog = true"
            >
              View Answers
            </v-btn>
          </v-card>

          <!-- Report public URL -->
          <v-card
            v-if="result && publicReportUrl"
            rounded="xl"
            variant="outlined"
            class="pa-5 mt-4"
          >
            <div class="d-flex align-center ga-3 mb-4">
              <v-avatar size="44" rounded="lg" color="info" variant="tonal">
                <v-icon icon="lucide:external-link" size="20" />
              </v-avatar>
              <div class="min-w-0">
                <div class="text-subtitle-2 font-weight-bold">
                  Report Public URL
                </div>
                <div class="text-body-2 text-medium-emphasis">
                  Public result page for this attempt.
                </div>
              </div>
            </div>

            <div class="public-url-box mb-3">
              {{ publicReportUrl }}
            </div>

            <div class="d-flex ga-2">
              <v-btn
                color="primary"
                rounded="lg"
                variant="tonal"
                class="flex-grow-1"
                prepend-icon="lucide:copy"
                @click="copyPublicReportUrl"
              >
                Copy
              </v-btn>
              <v-btn
                rounded="lg"
                variant="outlined"
                icon="lucide:external-link"
                :href="publicReportUrl"
                target="_blank"
                rel="noopener noreferrer"
              />
            </div>
          </v-card>
        </v-col>

        <!-- Right column: meta + user info -->
        <v-col cols="12" md="9">
          <v-card rounded="xl" variant="outlined">
            <v-card-text class="pa-5">
              <div
                class="d-flex align-center justify-space-between ga-2 mb-4 flex-wrap"
              >
                <div class="d-flex align-center ga-3">
                  <v-avatar
                    size="44"
                    rounded="lg"
                    color="primary"
                    variant="tonal"
                  >
                    <v-icon icon="lucide:sparkles" size="20" />
                  </v-avatar>
                  <div>
                    <div class="text-subtitle-2 font-weight-bold">Result</div>
                    <div class="text-body-2 text-medium-emphasis">
                      Computed {{ formatDateTime(result.computed_at) }}
                    </div>
                  </div>
                </div>
                <v-chip
                  size="default"
                  rounded="lg"
                  variant="tonal"
                  color="primary"
                  class="font-weight-bold"
                >
                  {{ result.result_label }}
                </v-chip>
              </div>

              <div class="text-body-2 mb-5" style="line-height: 1.7">
                {{ result.meaning_snapshot }}
              </div>

              <template v-if="result.recommendations_snapshot.length">
                <div class="text-subtitle-2 font-weight-bold mb-2">
                  Recommendations
                </div>
                <div class="reco-list mb-5">
                  <div
                    v-for="(r, idx) in result.recommendations_snapshot"
                    :key="idx"
                    class="reco-item"
                  >
                    <v-icon
                      icon="lucide:check-circle-2"
                      size="16"
                      color="primary"
                      class="flex-shrink-0 mt-1"
                    />
                    <span class="text-body-2">{{ r }}</span>
                  </div>
                </div>
              </template>

              <v-divider class="mb-5" />

              <!-- Scores: total -->
              <template v-if="result.scoring_type === 'total_score'">
                <div class="text-subtitle-2 font-weight-bold mb-3">Score</div>
                <v-card
                  rounded="xl"
                  variant="tonal"
                  color="primary"
                  class="pa-4"
                >
                  <div class="d-flex align-center justify-space-between">
                    <div>
                      <div class="text-h4 font-weight-black">
                        {{ result.scores_json.total }}
                      </div>
                      <div class="text-caption text-medium-emphasis">
                        Total Score
                      </div>
                    </div>
                    <v-chip
                      size="small"
                      rounded="lg"
                      variant="flat"
                      color="primary"
                    >
                      {{ result.bands_json.total_band }}
                    </v-chip>
                  </div>
                </v-card>
              </template>

              <!-- Scores: multi-dimension -->
              <template v-else-if="result.scoring_type === 'multi_dimension'">
                <div class="text-subtitle-2 font-weight-bold mb-3">
                  Dimension Scores
                </div>

                <v-row align="center">
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
                        <div class="d-flex align-center ga-3 min-w-0">
                          <span
                            class="score-dot"
                            :style="{ background: dimensionColor(index) }"
                          />
                          <div class="min-w-0">
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

                <!-- Per-dimension band meaning breakdown -->
                <template v-if="result.dimension_meanings?.length">
                  <div class="text-subtitle-2 font-weight-bold mt-6 mb-3">
                    Dimension Breakdown
                  </div>

                  <div class="d-flex flex-column ga-4">
                    <v-card
                      v-for="dm in result.dimension_meanings"
                      :key="dm.dimensionKey"
                      rounded="lg"
                      variant="outlined"
                      class="pa-4 pa-md-5"
                    >
                      <div class="d-flex align-center ga-2 flex-wrap mb-3">
                        <span class="text-body-2 font-weight-bold">
                          {{ dm.dimensionLabel || dm.dimensionKey }}
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
                        class="text-body-2 mb-3"
                        style="line-height: 1.7"
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
                        <div class="reco-list">
                          <div
                            v-for="(r, idx) in dm.recommendations"
                            :key="idx"
                            class="reco-item"
                          >
                            <v-icon
                              icon="lucide:check-circle-2"
                              size="16"
                              color="primary"
                              class="flex-shrink-0 mt-1"
                            />
                            <span class="text-body-2">{{ r }}</span>
                          </div>
                        </div>
                      </template>
                    </v-card>
                  </div>
                </template>
              </template>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </div>

    <!-- Answers Dialog -->
    <v-dialog v-model="answersDialog" max-width="640" scrollable>
      <v-card rounded="xl">
        <v-card-title
          class="d-flex align-center justify-space-between pa-5 pb-4"
        >
          <div>
            <div class="text-subtitle-1 font-weight-bold">Answers</div>
            <div v-if="result" class="text-caption text-medium-emphasis">
              {{ result.answers_snapshot.length }} items
            </div>
          </div>
          <v-btn
            icon="lucide:x"
            size="small"
            variant="text"
            rounded="lg"
            @click="answersDialog = false"
          />
        </v-card-title>
        <v-divider />
        <v-card-text class="pa-5" style="max-height: 60vh">
          <template v-if="result">
            <div
              v-for="(a, idx) in result.answers_snapshot"
              :key="a.question_code"
              :class="{ 'mt-4': idx > 0 }"
            >
              <div class="d-flex align-start ga-3">
                <v-avatar
                  size="24"
                  variant="tonal"
                  color="primary"
                  class="flex-shrink-0 mt-1"
                >
                  <span class="text-caption font-weight-bold">{{
                    idx + 1
                  }}</span>
                </v-avatar>
                <div class="min-w-0 flex-grow-1">
                  <div class="text-body-2 font-weight-medium mb-2">
                    {{ a.question_text }}
                  </div>
                  <div class="d-flex align-center ga-2 flex-wrap">
                    <v-chip
                      size="x-small"
                      rounded="lg"
                      variant="tonal"
                      color="primary"
                    >
                      {{ a.selected_label }}
                    </v-chip>
                    <span class="text-caption text-medium-emphasis"
                      >Score: {{ a.score_value }}</span
                    >
                    <span
                      v-if="a.dimension_key"
                      class="text-caption text-medium-emphasis text-capitalize"
                    >
                      &bull; {{ a.dimension_key }}
                    </span>
                  </div>
                </div>
              </div>
              <v-divider
                v-if="idx < result.answers_snapshot.length - 1"
                class="mt-4"
              />
            </div>
          </template>
        </v-card-text>
        <v-divider />
        <v-card-actions class="pa-4 justify-end">
          <v-btn rounded="lg" variant="outlined" @click="answersDialog = false"
            >Close</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useHead, useRoute } from "#imports";

type UiState = "loading" | "error" | "empty" | "ready";

interface ReportMeta {
  id: string;
  questionnaire_code: string;
  questionnaire_title: string;
  questionnaire_version: number;
  status: "submitted" | "in_progress";
  started_at: string;
  submitted_at: string | null;
}

interface AnswerItem {
  question_code: string;
  question_text: string;
  selected_label: string;
  score_value: number;
  dimension_key?: string;
}

interface DimensionMeaning {
  dimensionKey: string;
  dimensionLabel?: string | null;
  score: number;
  band: string | null;
  resultLabel: string | null;
  description: string | null;
  recommendations: string[] | null;
}

interface ResultBase {
  computed_at: string;
  result_label: string;
  meaning_snapshot: string;
  recommendations_snapshot: string[];
  user_info_snapshot: Record<string, unknown>;
  answers_snapshot: AnswerItem[];
}

interface ResultTotal extends ResultBase {
  scoring_type: "total_score";
  scores_json: { total: number };
  bands_json: { total_band: string };
}

interface ResultMulti extends ResultBase {
  scoring_type: "multi_dimension";
  scores_json: Record<string, number>;
  bands_json: Record<string, string>;
  dimension_meanings: DimensionMeaning[];
}

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
const config = useRuntimeConfig();
const api = useApiService();
const auth = useAuthStore();

const id = computed(() => (route.params.id ?? "").toString());

const uiState = ref<UiState>("loading");
const errorMessage = ref("");
const reportMeta = ref<ReportMeta | null>(null);
const result = ref<ReportResult | null>(null);
const answersDialog = ref(false);

const publicReportUrl = computed(() => {
  if (!reportMeta.value?.questionnaire_code || !id.value) return "";

  const publicConfig = config.public as Record<string, unknown>;
  const baseUrl = String(
    publicConfig.WEB_BASE_URL ||
      publicConfig.webBaseUrl ||
      publicConfig.APP_PUBLIC_BASE_URL ||
      publicConfig.i18nBaseUrl ||
      "",
  )
    .trim()
    .replace(/\/+$/, "");

  if (!baseUrl) return "";

  return `${baseUrl}/q/${reportMeta.value.questionnaire_code}/result/${id.value}`;
});

function formatDateTime(iso: string | null): string {
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

function prettyKey(k: string): string {
  return k.replace(/_/g, " ");
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

const dimensionLabelByKey = computed(() => {
  const map: Record<string, string> = {};
  if (result.value && result.value.scoring_type === "multi_dimension") {
    for (const dm of result.value.dimension_meanings ?? []) {
      if (dm.dimensionKey && dm.dimensionLabel) {
        map[dm.dimensionKey] = dm.dimensionLabel;
      }
    }
  }
  return map;
});

const scoreItems = computed(() => {
  if (!result.value || result.value.scoring_type !== "multi_dimension") {
    return [];
  }

  const scores = result.value.scores_json;
  const bands = result.value.bands_json;

  return Object.keys(scores).map((key) => ({
    key,
    label: dimensionLabelByKey.value[key] || formatKeyLabel(key),
    score: Number(scores[key] || 0),
    band: String(bands[key] || "").trim(),
  }));
});

const radarSeries = computed(() => {
  if (!result.value || result.value.scoring_type !== "multi_dimension") {
    return [];
  }
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
  stroke: { width: 1 },
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

function handleExport(format: "pdf" | "json"): void {
  console.info(`[Report] export as ${format}`);
}

async function copyPublicReportUrl(): Promise<void> {
  if (!publicReportUrl.value) return;

  await navigator.clipboard.writeText(publicReportUrl.value);
}

async function load(): Promise<void> {
  uiState.value = "loading";
  errorMessage.value = "";
  reportMeta.value = null;
  result.value = null;

  try {
    const orgId = auth.auth.organizationId;
    const res: ApiResult<{ meta: ReportMeta; result: ReportResult | null }> =
      await api.get(`/v1/organizations/${orgId}/reports/${id.value}`);

    if (!res.success) {
      const msg = (res.error as any)?.message;
      if (
        (res.error as any)?.statusCode === 404 ||
        msg?.toLowerCase().includes("not found")
      ) {
        uiState.value = "empty";
      } else {
        uiState.value = "error";
        errorMessage.value = msg || "Failed to load report.";
      }
      return;
    }

    reportMeta.value = res.data.meta;
    result.value = res.data.result;
    uiState.value = "ready";
  } catch (e: any) {
    uiState.value = "error";
    errorMessage.value = e?.message || "Failed to load report detail.";
  }
}

onMounted(load);
</script>

<style lang="scss" scoped>
.respondent-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 16px;
}

.detail-label {
  font-size: 0.75rem;
  color: rgba(var(--v-theme-on-surface), 0.6);
  flex-shrink: 0;
}

.detail-value {
  font-size: 0.875rem;
  text-align: right;
  word-break: break-word;
}

.reco-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.reco-item {
  display: flex;
  align-items: flex-start;
  gap: 8px;
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

.public-url-box {
  padding: 10px 12px;
  border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
  border-radius: 10px;
  background: rgba(var(--v-theme-surface-variant), 0.36);
  color: rgb(var(--v-theme-on-surface));
  font-size: 0.8125rem;
  line-height: 1.45;
  overflow-wrap: anywhere;
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
