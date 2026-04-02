<template>
  <v-container class="pa-6">
    <div class="d-flex align-center justify-space-between ga-3 flex-wrap mb-6">
      <div class="min-w-0">
        <h1 class="text-h5 font-weight-black ma-0">Questionnaires</h1>
        <div class="text-body-2 text-medium-emphasis mt-1">
          Browse published questionnaires available to your organization.
        </div>
      </div>

      <v-btn
        rounded="lg"
        variant="outlined"
        prepend-icon="lucide:file-text"
        to="/org/reports"
      >
        View Reports
      </v-btn>
    </div>

    <v-card rounded="xl" variant="outlined" class="mb-4">
      <v-card-text class="pa-4">
        <v-row>
          <v-col cols="12" md="7">
            <v-text-field
              v-model="search"
              label="Search questionnaires"
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
              v-model="languageFilter"
              :items="languages"
              label="Language"
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
          <template #item.status="{ item }">
            <v-chip
              size="small"
              variant="tonal"
              :color="item.status === 'published' ? 'primary' : 'warning'"
            >
              {{ item.status }}
            </v-chip>
          </template>

          <template #item.show_result_to_user="{ item }">
            <v-chip
              size="small"
              variant="tonal"
              :color="item.show_result_to_user ? 'primary' : 'secondary'"
            >
              {{ item.show_result_to_user ? "Yes" : "No" }}
            </v-chip>
          </template>

          <template #item.actions="{ item }">
            <v-btn
              size="small"
              rounded="lg"
              variant="text"
              prepend-icon="lucide:external-link"
              :to="`/org/questionnaires/${item.code}`"
            >
              View
            </v-btn>
          </template>

          <template #no-data>
            <div class="pa-6 text-center">
              <div class="text-subtitle-1 font-weight-bold mb-1">
                No questionnaires found
              </div>
              <div class="text-body-2 text-medium-emphasis">
                Try adjusting your search or filters.
              </div>
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

useHead({
  title: "Questionnaires • Org Console",
  meta: [{ name: "description", content: "Organization questionnaires list." }],
});

const uiState = ref<UiState>("loading");
const errorMessage = ref("");

const items = ref<Questionnaire[]>([]);

const search = ref("");
const languageFilter = ref<string | null>(null);
const statusFilter = ref<Questionnaire["status"] | null>("published");

const languages = ["en", "id"];
const statusOptions: Array<Questionnaire["status"]> = [
  "published",
  "archived",
  "draft",
];

const headers = [
  { title: "Title", key: "title", sortable: false },
  { title: "Language", key: "language", sortable: false },
  { title: "Status", key: "status", sortable: false },
  { title: "Version", key: "version", sortable: false },
  { title: "Scoring", key: "scoring_type", sortable: false },
  { title: "Show result", key: "show_result_to_user", sortable: false },
  { title: "", key: "actions", sortable: false, align: "end" as const },
];

const filteredItems = computed(() => {
  const q = search.value.trim().toLowerCase();
  return items.value
    .filter((i) => !statusFilter.value || i.status === statusFilter.value)
    .filter((i) => !languageFilter.value || i.language === languageFilter.value)
    .filter((i) => {
      if (!q) return true;
      return (
        i.title.toLowerCase().includes(q) ||
        i.code.toLowerCase().includes(q) ||
        i.description.toLowerCase().includes(q)
      );
    })
    .sort((a, b) => a.title.localeCompare(b.title));
});

async function load() {
  uiState.value = "loading";
  errorMessage.value = "";

  try {
    await new Promise((r) => setTimeout(r, 350));
    items.value = [
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
    uiState.value = items.value.length ? "ready" : "empty";
  } catch (e: any) {
    uiState.value = "error";
    errorMessage.value = e?.message || "Failed to load questionnaires.";
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
