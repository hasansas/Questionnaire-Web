<template>
  <v-container class="pa-6">
    <div class="d-flex align-center justify-space-between ga-3 flex-wrap mb-6">
      <div class="min-w-0">
        <h1 class="text-h5 font-weight-black ma-0">Organization Dashboard</h1>
        <div class="text-body-2 text-medium-emphasis mt-1">
          Overview of reports and questionnaires for your organization.
        </div>
      </div>

      <div class="d-flex align-center ga-2 flex-wrap justify-end">
        <v-btn
          rounded="lg"
          variant="outlined"
          prepend-icon="lucide:clipboard-list"
          to="/org/questionnaires"
        >
          View Questionnaires
        </v-btn>
        <v-btn
          rounded="lg"
          color="primary"
          prepend-icon="lucide:file-text"
          to="/org/reports"
        >
          View Reports
        </v-btn>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="uiState === 'loading'">
      <v-row>
        <v-col cols="12" md="3" v-for="n in 4" :key="n">
          <v-skeleton-loader type="card" class="rounded-xl" />
        </v-col>
      </v-row>

      <v-card class="mt-6" rounded="xl" variant="outlined">
        <v-card-title class="d-flex align-center justify-space-between">
          <div class="text-subtitle-1 font-weight-bold">Recent Reports</div>
        </v-card-title>
        <v-divider />
        <v-card-text>
          <v-skeleton-loader type="table" />
        </v-card-text>
      </v-card>
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

    <!-- Empty -->
    <div v-else-if="uiState === 'empty'">
      <v-card rounded="xl" variant="outlined" class="pa-6">
        <div class="d-flex align-center ga-3 mb-2">
          <v-avatar color="primary" variant="tonal" size="40">
            <v-icon icon="lucide:inbox" />
          </v-avatar>
          <div class="min-w-0">
            <div class="text-subtitle-1 font-weight-bold">No data yet</div>
            <div class="text-body-2 text-medium-emphasis">
              Once submissions come in, you'll see KPIs and recent reports here.
            </div>
          </div>
        </div>

        <div class="d-flex ga-2 flex-wrap mt-4">
          <v-btn
            rounded="lg"
            color="primary"
            prepend-icon="lucide:clipboard-list"
            to="/org/questionnaires"
          >
            Browse Questionnaires
          </v-btn>
          <v-btn
            rounded="lg"
            variant="outlined"
            prepend-icon="lucide:file-text"
            to="/org/reports"
          >
            Open Reports
          </v-btn>
        </div>
      </v-card>
    </div>

    <!-- Data -->
    <div v-else>
      <v-row>
        <v-col cols="12" md="3">
          <v-card rounded="xl" variant="outlined" class="pa-4">
            <div class="d-flex align-center justify-space-between">
              <div>
                <div class="text-caption text-medium-emphasis">
                  Published Questionnaires
                </div>
                <div class="text-h5 font-weight-black mt-1">
                  {{ kpis.publishedQuestionnaires }}
                </div>
              </div>
              <v-avatar color="primary" variant="tonal">
                <v-icon icon="lucide:clipboard-list" />
              </v-avatar>
            </div>
          </v-card>
        </v-col>

        <v-col cols="12" md="3">
          <v-card rounded="xl" variant="outlined" class="pa-4">
            <div class="d-flex align-center justify-space-between">
              <div>
                <div class="text-caption text-medium-emphasis">
                  Submitted Reports
                </div>
                <div class="text-h5 font-weight-black mt-1">
                  {{ kpis.totalReports }}
                </div>
              </div>
              <v-avatar color="primary" variant="tonal">
                <v-icon icon="lucide:file-text" />
              </v-avatar>
            </div>
          </v-card>
        </v-col>

        <v-col cols="12" md="3">
          <v-card rounded="xl" variant="outlined" class="pa-4">
            <div class="d-flex align-center justify-space-between">
              <div>
                <div class="text-caption text-medium-emphasis">Last 7 Days</div>
                <div class="text-h5 font-weight-black mt-1">
                  {{ kpis.last7Days }}
                </div>
              </div>
              <v-avatar color="primary" variant="tonal">
                <v-icon icon="lucide:calendar-days" />
              </v-avatar>
            </div>
          </v-card>
        </v-col>

        <v-col cols="12" md="3">
          <v-card rounded="xl" variant="outlined" class="pa-4">
            <div class="d-flex align-center justify-space-between">
              <div class="min-w-0">
                <div class="text-caption text-medium-emphasis">
                  Most Common Result
                </div>
                <div
                  class="text-subtitle-1 font-weight-black mt-1 text-truncate"
                >
                  {{ kpis.mostCommonResultLabel ?? "—" }}
                </div>
              </div>
              <v-avatar color="primary" variant="tonal">
                <v-icon icon="lucide:sparkles" />
              </v-avatar>
            </div>
          </v-card>
        </v-col>
      </v-row>

      <v-card class="mt-6" rounded="xl" variant="outlined">
        <v-card-title
          class="d-flex align-center justify-space-between ga-3 flex-wrap"
        >
          <div class="min-w-0">
            <div class="text-subtitle-1 font-weight-bold">Recent Reports</div>
            <div class="text-caption text-medium-emphasis">
              Latest submitted attempts
            </div>
          </div>

          <v-btn
            rounded="lg"
            variant="text"
            to="/org/reports"
            append-icon="lucide:arrow-right"
          >
            View all
          </v-btn>
        </v-card-title>
        <v-divider />

        <v-data-table
          :headers="recentHeaders"
          :items="recentRows"
          item-key="id"
          density="comfortable"
          class="sb-table"
        >
          <template #item.submitted_at="{ item }">
            <div class="text-body-2">
              {{ formatDateTime(item.submitted_at) }}
            </div>
          </template>

          <template #item.result_label="{ item }">
            <v-chip size="small" variant="tonal" color="primary">
              {{ item.result_label }}
            </v-chip>
          </template>

          <template #item.actions="{ item }">
            <v-btn
              size="small"
              variant="text"
              rounded="lg"
              prepend-icon="lucide:external-link"
              :to="`/org/reports/${item.id}`"
            >
              Open
            </v-btn>
          </template>

          <template #no-data>
            <div class="pa-6 text-center text-medium-emphasis">
              No reports yet.
            </div>
          </template>
        </v-data-table>
      </v-card>
    </div>
  </v-container>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useHead } from "#imports";

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

type AttemptRow = {
  id: string;
  questionnaire_id: string;
  questionnaire_code: string;
  questionnaire_title: string;
  questionnaire_version: number;
  organization_id: string;
  status: "submitted" | "started";
  started_at: string;
  submitted_at: string | null;
  result_label: string | null;
};

useHead({
  title: "Org Dashboard • Questionnaire App",
  meta: [
    {
      name: "description",
      content: "Organization dashboard overview: KPIs and recent reports.",
    },
  ],
});

const uiState = ref<UiState>("loading");
const errorMessage = ref("");

const currentOrgId = "org_089b8bc2";

const questionnaires: Questionnaire[] = [
  {
    id: "q_01",
    code: "stress-check",
    title: "Stress Check (7 mins)",
    description: "A quick assessment to understand your current stress level.",
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
  {
    id: "q_03",
    code: "sleep-quality",
    title: "Sleep Quality (5 mins)",
    description: "A short questionnaire about sleep patterns and habits.",
    language: "id",
    status: "archived",
    version: 1,
    scoring_type: "total_score",
    show_result_to_user: false,
    created_at: "2026-01-03T09:00:00Z",
    updated_at: "2026-01-11T09:00:00Z",
  },
];

const attempts: AttemptRow[] = [
  {
    id: "att_1001",
    questionnaire_id: "q_01",
    questionnaire_code: "stress-check",
    questionnaire_title: "Stress Check (7 mins)",
    questionnaire_version: 1,
    organization_id: currentOrgId,
    status: "submitted",
    started_at: "2026-01-12T02:10:00Z",
    submitted_at: "2026-01-12T02:17:00Z",
    result_label: "Moderate Stress",
  },
  {
    id: "att_1002",
    questionnaire_id: "q_02",
    questionnaire_code: "energy-balance",
    questionnaire_title: "Energy Balance (10 mins)",
    questionnaire_version: 2,
    organization_id: currentOrgId,
    status: "submitted",
    started_at: "2026-01-15T06:10:00Z",
    submitted_at: "2026-01-15T06:25:00Z",
    result_label: "Earth Dominant",
  },
  {
    id: "att_1003",
    questionnaire_id: "q_02",
    questionnaire_code: "energy-balance",
    questionnaire_title: "Energy Balance (10 mins)",
    questionnaire_version: 2,
    organization_id: currentOrgId,
    status: "submitted",
    started_at: "2026-01-18T10:00:00Z",
    submitted_at: "2026-01-18T10:12:00Z",
    result_label: "Metal Dominant",
  },
];

function formatDateTime(iso: string | null) {
  if (!iso) return "—";
  try {
    const d = new Date(iso);
    return d.toLocaleString(undefined, {
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

const publishedQuestionnaires = computed(() =>
  questionnaires.filter((q) => q.status === "published"),
);

const submittedAttempts = computed(() =>
  attempts
    .filter(
      (a) =>
        a.organization_id === currentOrgId &&
        a.status === "submitted" &&
        a.submitted_at,
    )
    .sort((a, b) => (b.submitted_at ?? "").localeCompare(a.submitted_at ?? "")),
);

const last7DaysCount = computed(() => {
  const now = new Date();
  const since = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  return submittedAttempts.value.filter(
    (a) => a.submitted_at && new Date(a.submitted_at) >= since,
  ).length;
});

const mostCommonResultLabel = computed(() => {
  const freq = new Map<string, number>();
  for (const a of submittedAttempts.value) {
    if (!a.result_label) continue;
    freq.set(a.result_label, (freq.get(a.result_label) ?? 0) + 1);
  }
  let best: { label: string; count: number } | null = null;
  for (const [label, count] of freq.entries()) {
    if (!best || count > best.count) best = { label, count };
  }
  return best?.label ?? null;
});

const kpis = computed(() => ({
  publishedQuestionnaires: publishedQuestionnaires.value.length,
  totalReports: submittedAttempts.value.length,
  last7Days: last7DaysCount.value,
  mostCommonResultLabel: mostCommonResultLabel.value,
}));

const recentHeaders = [
  { title: "Submitted", key: "submitted_at", sortable: false },
  { title: "Questionnaire", key: "questionnaire_title", sortable: false },
  { title: "Result", key: "result_label", sortable: false },
  { title: "", key: "actions", sortable: false, align: "end" as const },
];

const recentRows = computed(() => submittedAttempts.value.slice(0, 10));

async function load() {
  uiState.value = "loading";
  errorMessage.value = "";
  try {
    await new Promise((r) => setTimeout(r, 450));
    const hasAny =
      publishedQuestionnaires.value.length > 0 ||
      submittedAttempts.value.length > 0;
    uiState.value = hasAny ? "ready" : "empty";
  } catch (e: any) {
    uiState.value = "error";
    errorMessage.value = e?.message || "Failed to load dashboard.";
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
