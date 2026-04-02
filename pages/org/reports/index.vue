<template>
  <v-container class="pa-6">
    <div class="d-flex align-center justify-space-between ga-3 flex-wrap mb-6">
      <div class="min-w-0">
        <h1 class="text-h5 font-weight-black ma-0">Reports</h1>
        <div class="text-body-2 text-medium-emphasis mt-1">
          Review submitted questionnaire attempts for your organization.
        </div>
      </div>

      <div class="d-flex align-center ga-2 flex-wrap justify-end">
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
              <v-list-item @click="toast('Export CSV (UI only)')">
                <template #prepend>
                  <v-icon icon="lucide:file-down" class="me-2" />
                </template>
                <v-list-item-title>Export CSV</v-list-item-title>
              </v-list-item>
              <v-list-item @click="toast('Export Excel (UI only)')">
                <template #prepend>
                  <v-icon icon="lucide:file-spreadsheet" class="me-2" />
                </template>
                <v-list-item-title>Export Excel</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-card>
        </v-menu>

        <v-btn
          rounded="lg"
          variant="outlined"
          prepend-icon="lucide:clipboard-list"
          to="/org/questionnaires"
        >
          Questionnaires
        </v-btn>
      </div>
    </div>

    <v-card rounded="xl" variant="outlined" class="mb-4">
      <v-card-text class="pa-4">
        <v-row>
          <v-col cols="12" md="5">
            <v-text-field
              v-model="search"
              label="Search by questionnaire or result"
              prepend-inner-icon="lucide:search"
              variant="outlined"
              rounded="lg"
              density="comfortable"
              hide-details
              clearable
            />
          </v-col>

          <v-col cols="12" md="3">
            <v-select
              v-model="questionnaireFilter"
              :items="questionnaireItems"
              item-title="title"
              item-value="code"
              label="Questionnaire"
              variant="outlined"
              rounded="lg"
              density="comfortable"
              hide-details
              clearable
            />
          </v-col>

          <v-col cols="12" md="2">
            <v-select
              v-model="resultLabelFilter"
              :items="resultLabelOptions"
              label="Result label"
              variant="outlined"
              rounded="lg"
              density="comfortable"
              hide-details
              clearable
            />
          </v-col>

          <v-col cols="12" md="2">
            <v-select
              v-model="statusFilter"
              :items="statusOptions"
              label="Status"
              variant="outlined"
              rounded="lg"
              density="comfortable"
              hide-details
              clearable
            />
          </v-col>
        </v-row>

        <v-row class="mt-1">
          <v-col cols="12" md="3">
            <v-text-field
              v-model="dateFrom"
              label="From (YYYY-MM-DD)"
              variant="outlined"
              rounded="lg"
              density="comfortable"
              hide-details
              placeholder="2026-01-01"
            />
          </v-col>

          <v-col cols="12" md="3">
            <v-text-field
              v-model="dateTo"
              label="To (YYYY-MM-DD)"
              variant="outlined"
              rounded="lg"
              density="comfortable"
              hide-details
              placeholder="2026-01-31"
            />
          </v-col>

          <v-col
            cols="12"
            md="6"
            class="d-flex align-center justify-end ga-2 flex-wrap"
          >
            <v-btn
              rounded="lg"
              variant="text"
              prepend-icon="lucide:rotate-ccw"
              @click="resetFilters"
            >
              Reset filters
            </v-btn>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <div v-if="uiState === 'loading'">
      <v-skeleton-loader type="table" class="rounded-xl" />
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

    <div v-else>
      <v-card rounded="xl" variant="outlined">
        <v-data-table
          :headers="headers"
          :items="filteredItems"
          item-key="id"
          density="comfortable"
          class="sb-table"
        >
          <template #item.submitted_at="{ item }">
            <div class="text-body-2">
              {{ item.submitted_at ? formatDateTime(item.submitted_at) : "—" }}
            </div>
          </template>

          <template #item.status="{ item }">
            <v-chip
              size="small"
              variant="tonal"
              :color="item.status === 'submitted' ? 'primary' : 'secondary'"
            >
              {{ item.status }}
            </v-chip>
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
              rounded="lg"
              variant="text"
              prepend-icon="lucide:external-link"
              :to="`/org/reports/${item.id}`"
            >
              Open
            </v-btn>
          </template>

          <template #no-data>
            <div class="pa-6 text-center">
              <div class="text-subtitle-1 font-weight-bold mb-1">
                No reports found
              </div>
              <div class="text-body-2 text-medium-emphasis">
                Try adjusting your filters or date range.
              </div>
            </div>
          </template>
        </v-data-table>
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

type QuestionnaireLite = {
  code: string;
  title: string;
};

type ReportRow = {
  id: string;
  questionnaire_code: string;
  questionnaire_title: string;
  questionnaire_version: number;
  status: "submitted" | "started";
  started_at: string;
  submitted_at: string | null;
  result_label: string | null;
};

useHead({
  title: "Reports • Org Console",
  meta: [
    {
      name: "description",
      content: "Organization reports list with filters and export.",
    },
  ],
});

const route = useRoute();

const uiState = ref<UiState>("loading");
const errorMessage = ref("");

const search = ref("");
const questionnaireFilter = ref<string | null>(null);
const resultLabelFilter = ref<string | null>(null);
const statusFilter = ref<"submitted" | "started" | null>("submitted");

const dateFrom = ref<string>("");
const dateTo = ref<string>("");

const questionnaireItems = ref<QuestionnaireLite[]>([]);
const items = ref<ReportRow[]>([]);

const statusOptions = ["submitted", "started"];
const resultLabelOptions = [
  "Moderate Stress",
  "High Stress",
  "Low Stress",
  "Earth Dominant",
  "Metal Dominant",
];

const headers = [
  { title: "Submitted", key: "submitted_at", sortable: false },
  { title: "Questionnaire", key: "questionnaire_title", sortable: false },
  { title: "Version", key: "questionnaire_version", sortable: false },
  { title: "Status", key: "status", sortable: false },
  { title: "Result", key: "result_label", sortable: false },
  { title: "", key: "actions", sortable: false, align: "end" as const },
];

const snack = ref({ open: false, text: "" });
function toast(text: string) {
  snack.value = { open: true, text };
}

function formatDateTime(iso: string) {
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

function parseDateOnly(s: string): Date | null {
  const t = s.trim();
  if (!t) return null;
  // Expect YYYY-MM-DD
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(t);
  if (!m) return null;
  const [_, y, mo, d] = m;
  const dt = new Date(Number(y), Number(mo) - 1, Number(d));
  return isNaN(dt.getTime()) ? null : dt;
}

const filteredItems = computed(() => {
  const q = search.value.trim().toLowerCase();

  const from = parseDateOnly(dateFrom.value);
  const to = parseDateOnly(dateTo.value);
  const toEnd = to ? new Date(to.getTime() + 24 * 60 * 60 * 1000 - 1) : null;

  return items.value
    .filter((i) => !statusFilter.value || i.status === statusFilter.value)
    .filter(
      (i) =>
        !questionnaireFilter.value ||
        i.questionnaire_code === questionnaireFilter.value,
    )
    .filter(
      (i) =>
        !resultLabelFilter.value || i.result_label === resultLabelFilter.value,
    )
    .filter((i) => {
      if (!q) return true;
      return (
        i.questionnaire_title.toLowerCase().includes(q) ||
        i.questionnaire_code.toLowerCase().includes(q) ||
        (i.result_label ?? "").toLowerCase().includes(q)
      );
    })
    .filter((i) => {
      if (!i.submitted_at) return false;
      const d = new Date(i.submitted_at);
      if (from && d < from) return false;
      if (toEnd && d > toEnd) return false;
      return true;
    })
    .sort((a, b) => (b.submitted_at ?? "").localeCompare(a.submitted_at ?? ""));
});

function resetFilters() {
  search.value = "";
  questionnaireFilter.value = null;
  resultLabelFilter.value = null;
  statusFilter.value = "submitted";
  dateFrom.value = "";
  dateTo.value = "";
}

async function load() {
  uiState.value = "loading";
  errorMessage.value = "";

  try {
    await new Promise((r) => setTimeout(r, 450));

    questionnaireItems.value = [
      { code: "stress-check", title: "Stress Check (7 mins)" },
      { code: "energy-balance", title: "Energy Balance (10 mins)" },
    ];

    items.value = [
      {
        id: "att_1001",
        questionnaire_code: "stress-check",
        questionnaire_title: "Stress Check (7 mins)",
        questionnaire_version: 1,
        status: "submitted",
        started_at: "2026-01-12T02:10:00Z",
        submitted_at: "2026-01-12T02:17:00Z",
        result_label: "Moderate Stress",
      },
      {
        id: "att_1002",
        questionnaire_code: "energy-balance",
        questionnaire_title: "Energy Balance (10 mins)",
        questionnaire_version: 2,
        status: "submitted",
        started_at: "2026-01-15T06:10:00Z",
        submitted_at: "2026-01-15T06:25:00Z",
        result_label: "Earth Dominant",
      },
      {
        id: "att_1003",
        questionnaire_code: "energy-balance",
        questionnaire_title: "Energy Balance (10 mins)",
        questionnaire_version: 2,
        status: "submitted",
        started_at: "2026-01-18T10:00:00Z",
        submitted_at: "2026-01-18T10:12:00Z",
        result_label: "Metal Dominant",
      },
    ];

    // Optional pre-filter via query string: ?questionnaire=energy-balance
    const qs = (route.query.questionnaire ?? "").toString().trim();
    if (qs) questionnaireFilter.value = qs;

    uiState.value = items.value.length ? "ready" : "empty";
  } catch (e: any) {
    uiState.value = "error";
    errorMessage.value = e?.message || "Failed to load reports.";
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
