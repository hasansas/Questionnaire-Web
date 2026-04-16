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
        <v-col cols="12" sm="6" md="4" lg v-for="n in 5" :key="n">
          <v-skeleton-loader type="card" class="rounded-xl" />
        </v-col>
      </v-row>

      <v-row class="mt-2">
        <v-col cols="12" md="8">
          <v-skeleton-loader type="card" height="240" class="rounded-xl" />
        </v-col>
        <v-col cols="12" md="4">
          <v-skeleton-loader type="card" height="240" class="rounded-xl" />
        </v-col>
      </v-row>

      <v-card class="mt-4" rounded="xl" variant="outlined">
        <v-card-title class="d-flex align-center justify-space-between">
          <v-skeleton-loader type="heading" width="180" />
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
      <!-- KPI Cards -->
      <v-row>
        <v-col
          v-for="kpi in kpiCards"
          :key="kpi.label"
          cols="12"
          sm="6"
          md="4"
          lg
        >
          <v-card rounded="xl" variant="outlined" class="pa-4 h-100">
            <div class="d-flex align-center justify-space-between ga-3">
              <div class="min-w-0">
                <div class="text-caption text-medium-emphasis">
                  {{ kpi.label }}
                </div>
                <div class="text-h5 font-weight-black mt-1">
                  {{ kpi.value }}
                </div>
              </div>
              <v-avatar :color="kpi.color" variant="tonal" size="40">
                <v-icon :icon="kpi.icon" />
              </v-avatar>
            </div>
          </v-card>
        </v-col>
      </v-row>

      <!-- Charts -->
      <v-row class="mt-2">
        <!-- Submissions Trend -->
        <v-col cols="12" md="8">
          <v-card rounded="xl" variant="outlined" class="pa-4">
            <div class="text-subtitle-1 font-weight-bold mb-1">
              Submissions Trend
            </div>
            <div class="text-caption text-medium-emphasis mb-3">
              Daily submission count over time
            </div>
            <div
              v-if="stats.submissions_trend.length === 0"
              class="text-body-2 text-medium-emphasis py-10 text-center"
            >
              No trend data available yet.
            </div>
            <ClientOnly v-else>
              <apexchart
                type="area"
                height="180"
                :options="trendOptions"
                :series="trendSeries"
              />
            </ClientOnly>
          </v-card>
        </v-col>

        <!-- Result Distribution -->
        <v-col cols="12" md="4">
          <v-card rounded="xl" variant="outlined" class="pa-4 h-100">
            <div class="text-subtitle-1 font-weight-bold mb-1">
              Result Distribution
            </div>
            <div class="text-caption text-medium-emphasis mb-4">
              Breakdown by result label
            </div>
            <div
              v-if="stats.result_distribution.length === 0"
              class="text-body-2 text-medium-emphasis py-10 text-center"
            >
              No distribution data yet.
            </div>
            <div v-else class="d-flex flex-column ga-4">
              <div
                v-for="item in stats.result_distribution"
                :key="item.label"
              >
                <div
                  class="d-flex align-center justify-space-between ga-2 mb-1"
                >
                  <span
                    class="text-caption text-truncate"
                    style="max-width: 80%"
                  >
                    {{ item.label }}
                  </span>
                  <span class="text-caption font-weight-bold text-no-wrap">
                    {{ item.count }}
                  </span>
                </div>
                <v-progress-linear
                  :model-value="(item.count / totalDistribution) * 100"
                  color="primary"
                  rounded
                  height="6"
                  bg-color="surface-variant"
                />
              </div>
            </div>
          </v-card>
        </v-col>
      </v-row>

      <!-- Recent Attempts -->
      <v-card class="mt-4" rounded="xl" variant="outlined">
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
          :items="stats.recent_attempts"
          item-key="id"
          density="comfortable"
          class="sb-table"
        >
          <template #item.user="{ item }">
            <div>
              <div class="text-body-2 font-weight-medium">
                {{ item.user.name }}
              </div>
              <div class="text-caption text-medium-emphasis">
                {{ item.user.email }}
              </div>
            </div>
          </template>

          <template #item.submitted_at="{ item }">
            <div class="text-body-2">
              {{ formatDateTime(item.submitted_at) }}
            </div>
          </template>

          <template #item.result_label="{ item }">
            <v-chip
              v-if="item.result_label"
              size="small"
              variant="tonal"
              color="primary"
            >
              {{ item.result_label }}
            </v-chip>
            <span v-else class="text-medium-emphasis">—</span>
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
import { useAuthStore } from "~/stores/auth";

type UiState = "loading" | "error" | "empty" | "ready";

interface RecentAttemptUser {
  name: string;
  email: string;
}

interface RecentAttempt {
  id: string;
  questionnaire_code: string;
  questionnaire_title: string;
  questionnaire_version: number;
  submitted_at: string;
  result_label: string;
  user: RecentAttemptUser;
}

interface ResultDistributionItem {
  label: string;
  count: number;
}

interface SubmissionsTrendItem {
  date: string;
  count: number;
}

interface DashboardStats {
  published_questionnaires: number;
  total_reports: number;
  last_7_days: number;
  in_progress: number;
  total_members: number;
  submissions_trend: SubmissionsTrendItem[];
  result_distribution: ResultDistributionItem[];
  recent_attempts: RecentAttempt[];
}

useHead({
  title: "Org Dashboard • Questionnaire App",
  meta: [
    {
      name: "description",
      content: "Organization dashboard overview: KPIs and recent reports.",
    },
  ],
});

const api = useApiService();
const authStore = useAuthStore();

const uiState = ref<UiState>("loading");
const errorMessage = ref("");

const stats = ref<DashboardStats>({
  published_questionnaires: 0,
  total_reports: 0,
  last_7_days: 0,
  in_progress: 0,
  total_members: 0,
  submissions_trend: [],
  result_distribution: [],
  recent_attempts: [],
});

const kpiCards = computed(() => [
  {
    label: "Published Questionnaires",
    value: stats.value.published_questionnaires,
    icon: "lucide:clipboard-list",
    color: "primary",
  },
  {
    label: "Submitted Reports",
    value: stats.value.total_reports,
    icon: "lucide:file-text",
    color: "primary",
  },
  {
    label: "Last 7 Days",
    value: stats.value.last_7_days,
    icon: "lucide:calendar-days",
    color: "primary",
  },
  {
    label: "In Progress",
    value: stats.value.in_progress,
    icon: "lucide:loader",
    color: "warning",
  },
  {
    label: "Total Members",
    value: stats.value.total_members,
    icon: "lucide:users",
    color: "primary",
  },
]);

const totalDistribution = computed(() =>
  stats.value.result_distribution.reduce((sum, d) => sum + d.count, 0) || 1,
);

const trendSeries = computed(() => [
  {
    name: "Submissions",
    data: stats.value.submissions_trend.map((t) => t.count),
  },
]);

const trendOptions = computed(() => ({
  chart: {
    type: "area",
    toolbar: { show: false },
    zoom: { enabled: false },
  },
  dataLabels: { enabled: false },
  stroke: { curve: "smooth", width: 2 },
  fill: {
    type: "gradient",
    gradient: { opacityFrom: 0.2, opacityTo: 0 },
  },
  xaxis: {
    categories: stats.value.submissions_trend.map((t) => t.date),
    labels: {
      rotate: -30,
      style: { fontSize: "11px" },
    },
  },
  yaxis: {
    min: 0,
    labels: { style: { fontSize: "11px" } },
    tickAmount: 4,
  },
  colors: ["#6366f1"],
  grid: { borderColor: "#e5e7eb" },
  tooltip: { x: { format: "yyyy-MM-dd" } },
}));

const recentHeaders = [
  { title: "User", key: "user", sortable: false },
  { title: "Submitted", key: "submitted_at", sortable: false },
  { title: "Questionnaire", key: "questionnaire_title", sortable: false },
  { title: "Result", key: "result_label", sortable: false },
  { title: "", key: "actions", sortable: false, align: "end" as const },
];

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

async function load(): Promise<void> {
  uiState.value = "loading";
  errorMessage.value = "";

  try {
    const orgId = authStore.auth.organizationId;
    const res: ApiResult<DashboardStats> = await api.get(
      `/v1/organizations/${orgId}/stats/dashboard`,
    );

    if (!res.success) {
      throw new Error(
        (res.error as any)?.message || "Failed to load dashboard.",
      );
    }

    stats.value = res.data;

    const hasData =
      res.data.published_questionnaires > 0 ||
      res.data.total_reports > 0 ||
      res.data.total_members > 0;

    uiState.value = hasData ? "ready" : "empty";
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
