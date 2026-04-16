<template>
  <v-container class="pa-6">
    <!-- @vue-generic {import('~/stores/org-reports').ReportRowModel} -->
    <SbResourceTableCard
      page-title="Reports"
      header-title="Attempt List"
      page-subtitle="Review submitted questionnaire attempts for your organization."
      :store="reportsStore"
      :columns="columns"
      search-placeholder="Search by name or email"
      show-filter
      empty-icon="lucide:file-text"
      empty-title="No reports found"
      empty-subtitle="Submissions will appear here once members complete questionnaires."
      :build-query="buildQuery"
      :acts-key="null"
    >
      <template #page-action>
        <v-menu location="bottom end" offset="8">
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
              <v-list-item rounded="lg" @click="handleExport('csv')">
                <template #prepend>
                  <v-icon icon="lucide:file-down" size="18" class="me-2" />
                </template>
                <v-list-item-title>Export CSV</v-list-item-title>
              </v-list-item>
              <v-list-item rounded="lg" @click="handleExport('excel')">
                <template #prepend>
                  <v-icon icon="lucide:file-spreadsheet" size="18" class="me-2" />
                </template>
                <v-list-item-title>Export Excel</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-card>
        </v-menu>
      </template>
      <!-- Columns -->
      <template #item.user="{ item }">
        <div class="min-w-0">
          <div class="text-body-2 font-weight-medium text-truncate">
            {{ item.user.name }}
          </div>
          <div class="text-caption text-medium-emphasis text-truncate">
            {{ item.user.email }}
          </div>
        </div>
      </template>

      <template #item.questionnaire="{ item }">
        <div class="min-w-0">
          <div class="text-body-2 text-truncate">
            {{ item.questionnaire_title }}
          </div>
          <div class="text-caption text-medium-emphasis text-truncate">
            v{{ item.questionnaire_version }} ·
            {{ item.questionnaire_code }}
          </div>
        </div>
      </template>

      <template #item.status="{ item }">
        <v-chip
          size="small"
          rounded="lg"
          variant="tonal"
          :color="item.status === 'submitted' ? 'primary' : 'warning'"
        >
          {{ item.status === 'submitted' ? 'Submitted' : 'In Progress' }}
        </v-chip>
      </template>

      <template #item.result_label="{ item }">
        <v-chip
          v-if="item.result_label"
          size="small"
          rounded="lg"
          variant="tonal"
          color="primary"
        >
          {{ item.result_label }}
        </v-chip>
        <span v-else class="text-medium-emphasis text-body-2">—</span>
      </template>

      <template #item.submitted_at="{ item }">
        <div class="text-body-2">
          {{ item.submitted_at ? formatDateTime(item.submitted_at) : '—' }}
        </div>
      </template>

      <template #item.actions="{ item }">
        <div class="d-flex justify-end">
          <v-btn
            size="small"
            variant="text"
            rounded="lg"
            prepend-icon="lucide:external-link"
            :to="`/org/reports/${item.id}`"
            @click.stop
          >
            View
          </v-btn>
        </div>
      </template>

      <!-- Filters drawer content -->
      <template #filters="{ draft, set }">
        <v-row dense>
          <v-col cols="12">
            <v-select
              :model-value="draft.questionnaire"
              :items="questionnaireItems"
              item-title="title"
              item-value="code"
              label="Questionnaire"
              variant="outlined"
              rounded="lg"
              density="comfortable"
              hide-details
              clearable
              class="mb-3"
              @update:model-value="set('questionnaire', $event)"
            />
          </v-col>

          <v-col cols="12">
            <v-select
              :model-value="draft.status"
              :items="statusOptions"
              label="Status"
              variant="outlined"
              rounded="lg"
              density="comfortable"
              hide-details
              clearable
              class="mb-3"
              @update:model-value="set('status', $event)"
            />
          </v-col>

          <v-col cols="12">
            <v-text-field
              :model-value="draft.resultLabel"
              label="Result label"
              variant="outlined"
              rounded="lg"
              density="comfortable"
              hide-details
              clearable
              class="mb-3"
              @update:model-value="set('resultLabel', $event)"
            />
          </v-col>

          <v-col cols="12">
            <div class="text-caption text-medium-emphasis mb-2">Date range</div>
          </v-col>

          <v-col cols="12">
            <v-text-field
              :model-value="draft.dateFrom"
              label="From (YYYY-MM-DD)"
              variant="outlined"
              rounded="lg"
              density="comfortable"
              hide-details
              clearable
              placeholder="2026-01-01"
              class="mb-3"
              @update:model-value="set('dateFrom', $event)"
            />
          </v-col>

          <v-col cols="12">
            <v-text-field
              :model-value="draft.dateTo"
              label="To (YYYY-MM-DD)"
              variant="outlined"
              rounded="lg"
              density="comfortable"
              hide-details
              clearable
              placeholder="2026-04-30"
              @update:model-value="set('dateTo', $event)"
            />
          </v-col>
        </v-row>
      </template>
    </SbResourceTableCard>
  </v-container>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useHead } from "#imports";
import { useOrgReportsStore } from "~/stores/org-reports";
import type { ReportRowModel } from "~/stores/org-reports";

useHead({
  title: "Reports • Org Console",
  meta: [
    {
      name: "description",
      content: "Organization reports list with filters and pagination.",
    },
  ],
});

const reportsStore = useOrgReportsStore();

const questionnaireItems = computed(() => reportsStore.questionnaireOptions);

const statusOptions = [
  { title: "Submitted", value: "submitted" },
  { title: "In Progress", value: "in_progress" },
];

const columns: SbTableColumn<ReportRowModel>[] = [
  { title: "User", key: "user", sortable: false },
  { title: "Questionnaire", key: "questionnaire", sortable: false },
  { title: "Status", key: "status", sortable: false },
  { title: "Result", key: "result_label", sortable: false },
  { title: "Submitted", key: "submitted_at", sortable: false },
  { title: "", key: "actions", sortable: false, align: "end" },
];

function buildQuery({
  search,
  filters,
}: {
  search: string;
  filters: Record<string, any>;
}): string | null {
  const params = new URLSearchParams();

  const limit = Number(
    reportsStore.data.pagination?.perPage ?? 20,
  );
  params.set("limit", String(limit));
  params.set("order", "submittedAt");
  params.set("sort", "DESC");

  if (search) params.set("search", search);
  if (filters.questionnaire) params.set("questionnaire", filters.questionnaire);
  if (filters.status) params.set("status", filters.status);
  if (filters.resultLabel) params.set("resultLabel", filters.resultLabel);
  if (filters.dateFrom) params.set("dateFrom", filters.dateFrom);
  if (filters.dateTo) params.set("dateTo", filters.dateTo);

  const qs = params.toString();
  return qs || null;
}

function handleExport(format: "csv" | "excel"): void {
  // TODO: wire up to export API
  console.info(`[Reports] export as ${format}`);
}

function formatDateTime(iso: string): string {
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
</script>
