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
        <v-col cols="12" md="4">
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

              <div
                v-for="(val, key) in result.user_info_snapshot"
                :key="key"
                class="mb-3"
              >
                <div
                  class="text-caption text-medium-emphasis text-capitalize mb-1"
                >
                  {{ prettyKey(String(key)) }}
                </div>
                <div class="text-body-2 font-weight-medium">
                  {{ String(val) }}
                </div>
              </div>
            </v-card-text>
          </v-card>
        </v-col>

        <!-- Right column: meta + user info -->
        <v-col cols="12" md="8">
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

                <ClientOnly>
                  <apexchart
                    type="radar"
                    height="280"
                    :options="radarOptions"
                    :series="radarSeries"
                  />
                </ClientOnly>

                <v-row dense class="mt-2">
                  <v-col
                    v-for="(score, dim) in result.scores_json"
                    :key="dim"
                    cols="12"
                    sm="6"
                    md="4"
                  >
                    <v-card rounded="xl" variant="outlined" class="pa-4">
                      <div class="d-flex align-center justify-space-between">
                        <div class="min-w-0">
                          <div
                            class="text-body-2 font-weight-bold text-capitalize"
                          >
                            {{ dim }}
                          </div>
                          <div class="text-caption text-medium-emphasis mt-1">
                            {{ result.bands_json[dim] ?? "—" }}
                          </div>
                        </div>
                        <v-chip
                          size="small"
                          rounded="lg"
                          variant="tonal"
                          color="primary"
                        >
                          {{ score }}
                        </v-chip>
                      </div>
                    </v-card>
                  </v-col>
                </v-row>

                <!-- Per-dimension band meaning breakdown -->
                <template v-if="result.dimension_meanings?.length">
                  <div class="text-subtitle-2 font-weight-bold mt-6 mb-3">
                    Dimension Breakdown
                  </div>
                  <v-expansion-panels variant="accordion" rounded="lg">
                    <v-expansion-panel
                      v-for="dm in result.dimension_meanings"
                      :key="dm.dimensionKey"
                    >
                      <v-expansion-panel-title>
                        <div class="d-flex align-center ga-2 flex-wrap">
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
                            variant="tonal"
                            class="text-capitalize"
                          >
                            {{ dm.band }}
                          </v-chip>
                        </div>
                      </v-expansion-panel-title>
                      <v-expansion-panel-text>
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
                        <div
                          v-else
                          class="text-body-2 text-medium-emphasis mb-3"
                        >
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
                      </v-expansion-panel-text>
                    </v-expansion-panel>
                  </v-expansion-panels>
                </template>
              </template>
            </v-card-text>
          </v-card>

          <!-- Answers CTA -->
          <v-card
            v-if="result && result.answers_snapshot.length"
            rounded="xl"
            variant="outlined"
            class="pa-5 mt-4"
          >
            <div
              class="d-flex align-center justify-space-between ga-4 flex-wrap"
            >
              <div class="d-flex align-center ga-3">
                <v-avatar
                  size="44"
                  rounded="lg"
                  color="primary"
                  variant="tonal"
                >
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
                prepend-icon="lucide:list"
                @click="answersDialog = true"
              >
                View Answers
              </v-btn>
            </div>
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
const api = useApiService();
const auth = useAuthStore();

const id = computed(() => (route.params.id ?? "").toString());

const uiState = ref<UiState>("loading");
const errorMessage = ref("");
const reportMeta = ref<ReportMeta | null>(null);
const result = ref<ReportResult | null>(null);
const answersDialog = ref(false);

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

function prettyKey(k: string): string {
  return k.replace(/_/g, " ");
}

function capitalize(k: string): string {
  return k.charAt(0).toUpperCase() + k.slice(1);
}

const radarSeries = computed(() => {
  if (!result.value || result.value.scoring_type !== "multi_dimension") {
    return [];
  }
  return [
    {
      name: "Score",
      data: Object.values(result.value.scores_json),
    },
  ];
});

const radarOptions = computed(() => {
  const categories =
    result.value && result.value.scoring_type === "multi_dimension"
      ? Object.keys(result.value.scores_json).map(capitalize)
      : [];

  return {
    chart: {
      type: "radar",
      toolbar: { show: false },
    },
    xaxis: {
      categories,
      labels: { style: { fontSize: "12px" } },
    },
    yaxis: { show: false },
    colors: ["#6366f1"],
    fill: { opacity: 0.3 },
    stroke: { width: 2 },
    markers: { size: 4 },
    dataLabels: { enabled: false },
  };
});

function handleExport(format: "pdf" | "json"): void {
  console.info(`[Report] export as ${format}`);
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
</style>
