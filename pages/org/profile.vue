<template>
  <v-container class="pa-6">
    <div class="d-flex align-center justify-space-between ga-3 flex-wrap mb-6">
      <div class="min-w-0">
        <h1 class="text-h5 font-weight-black ma-0">Organization Profile</h1>
        <div class="text-body-2 text-medium-emphasis mt-1">
          Read-only organization information and key members.
        </div>
      </div>

      <v-btn
        rounded="lg"
        variant="outlined"
        prepend-icon="lucide:arrow-left"
        to="/org"
      >
        Back to Dashboard
      </v-btn>
    </div>

    <div v-if="uiState === 'loading'">
      <v-skeleton-loader type="card" class="rounded-xl" />
      <v-skeleton-loader type="table" class="rounded-xl mt-6" />
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

    <div v-else-if="uiState === 'empty'">
      <v-card rounded="xl" variant="outlined" class="pa-6">
        <div class="d-flex align-center ga-3">
          <v-avatar color="primary" variant="tonal" size="40">
            <v-icon icon="lucide:building-2" />
          </v-avatar>
          <div>
            <div class="text-subtitle-1 font-weight-bold">
              No organization found
            </div>
            <div class="text-body-2 text-medium-emphasis">
              Your account doesn't have an organization context.
            </div>
          </div>
        </div>
      </v-card>
    </div>

    <div v-else>
      <v-row>
        <v-col cols="12" md="5">
          <v-card rounded="xl" variant="outlined">
            <v-card-title class="d-flex align-center ga-3">
              <v-avatar color="primary" variant="tonal">
                <v-icon icon="lucide:building-2" />
              </v-avatar>
              <div class="min-w-0">
                <div class="text-subtitle-1 font-weight-bold">
                  {{ org?.name }}
                </div>
                <div class="text-caption text-medium-emphasis">
                  Code: {{ org?.code }}
                </div>
              </div>
            </v-card-title>
            <v-divider />
            <v-card-text class="pa-5">
              <v-list density="comfortable" class="pa-0">
                <v-list-item class="px-0">
                  <v-list-item-title class="text-caption text-medium-emphasis"
                    >Status</v-list-item-title
                  >
                  <template #append>
                    <v-chip
                      size="small"
                      variant="tonal"
                      :color="org?.status === 'active' ? 'primary' : 'warning'"
                    >
                      {{ org?.status }}
                    </v-chip>
                  </template>
                </v-list-item>

                <v-divider class="my-2" />

                <v-list-item class="px-0">
                  <v-list-item-title class="text-caption text-medium-emphasis"
                    >Type</v-list-item-title
                  >
                  <template #append>
                    <div class="text-body-2 font-weight-medium text-capitalize">
                      {{ org?.type }}
                    </div>
                  </template>
                </v-list-item>

                <v-divider class="my-2" />

                <v-list-item class="px-0">
                  <v-list-item-title class="text-caption text-medium-emphasis"
                    >Timezone</v-list-item-title
                  >
                  <template #append>
                    <div class="text-body-2 font-weight-medium">
                      {{ org?.timezone }}
                    </div>
                  </template>
                </v-list-item>

                <v-divider class="my-2" />

                <v-list-item class="px-0">
                  <v-list-item-title class="text-caption text-medium-emphasis"
                    >Created</v-list-item-title
                  >
                  <template #append>
                    <div class="text-body-2 font-weight-medium">
                      {{ formatDate(org?.created_at || "") }}
                    </div>
                  </template>
                </v-list-item>

                <v-divider class="my-2" />

                <v-list-item class="px-0">
                  <v-list-item-title class="text-caption text-medium-emphasis"
                    >Updated</v-list-item-title
                  >
                  <template #append>
                    <div class="text-body-2 font-weight-medium">
                      {{ formatDate(org?.updated_at || "") }}
                    </div>
                  </template>
                </v-list-item>
              </v-list>
            </v-card-text>
          </v-card>
        </v-col>

        <v-col cols="12" md="7">
          <v-card rounded="xl" variant="outlined">
            <v-card-title
              class="d-flex align-center justify-space-between ga-3 flex-wrap"
            >
              <div class="min-w-0">
                <div class="text-subtitle-1 font-weight-bold">
                  Organization Users
                </div>
                <div class="text-caption text-medium-emphasis">
                  Read-only members in your organization
                </div>
              </div>

              <v-btn
                rounded="lg"
                variant="text"
                append-icon="lucide:arrow-right"
                to="/org/users"
              >
                View all
              </v-btn>
            </v-card-title>
            <v-divider />

            <v-data-table
              :headers="headers"
              :items="usersPreview"
              item-key="id"
              density="comfortable"
              class="sb-table"
            >
              <template #item.status="{ item }">
                <v-chip
                  size="small"
                  variant="tonal"
                  :color="
                    item.status === 'active'
                      ? 'primary'
                      : item.status === 'invited'
                        ? 'info'
                        : 'warning'
                  "
                >
                  {{ item.status }}
                </v-chip>
              </template>

              <template #item.last_login_at="{ item }">
                <div class="text-body-2">
                  {{
                    item.last_login_at
                      ? formatDateTime(item.last_login_at)
                      : "—"
                  }}
                </div>
              </template>

              <template #no-data>
                <div class="pa-6 text-center text-medium-emphasis">
                  No users found.
                </div>
              </template>
            </v-data-table>
          </v-card>
        </v-col>
      </v-row>
    </div>
  </v-container>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useHead } from "#imports";

type UiState = "loading" | "error" | "empty" | "ready";

type Org = {
  id: string;
  code: string;
  name: string;
  type: string;
  status: "active" | "inactive";
  timezone: string;
  created_at: string;
  updated_at: string;
};

type OrgUser = {
  id: string;
  organization_id: string;
  email: string;
  name: string;
  role: "org_viewer" | "org_admin";
  status: "active" | "invited" | "disabled";
  last_login_at: string | null;
  created_at: string;
  updated_at: string;
};

useHead({
  title: "Organization Profile • Questionnaire App",
  meta: [
    { name: "description", content: "View organization profile information." },
  ],
});

const uiState = ref<UiState>("loading");
const errorMessage = ref("");

const org = ref<Org | null>(null);
const users = ref<OrgUser[]>([]);

const headers = [
  { title: "Name", key: "name", sortable: false },
  { title: "Email", key: "email", sortable: false },
  { title: "Role", key: "role", sortable: false },
  { title: "Status", key: "status", sortable: false },
  { title: "Last login", key: "last_login_at", sortable: false },
];

const usersPreview = computed(() => users.value.slice(0, 5));

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "2-digit",
    });
  } catch {
    return iso;
  }
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

async function load() {
  uiState.value = "loading";
  errorMessage.value = "";

  try {
    await new Promise((r) => setTimeout(r, 350));

    org.value = {
      id: "org_089b8bc2",
      code: "ALPHA",
      name: "Alpha Wellness Clinic",
      type: "clinic",
      status: "active",
      timezone: "Asia/Jakarta",
      created_at: "2026-01-01T09:00:00Z",
      updated_at: "2026-01-10T09:00:00Z",
    };

    users.value = [
      {
        id: "ou_001",
        organization_id: "org_089b8bc2",
        email: "lia@alpha.example",
        name: "Lia Hartono",
        role: "org_viewer",
        status: "active",
        last_login_at: "2026-01-18T08:00:00Z",
        created_at: "2026-01-05T08:00:00Z",
        updated_at: "2026-01-18T08:00:00Z",
      },
      {
        id: "ou_002",
        organization_id: "org_089b8bc2",
        email: "dimas@alpha.example",
        name: "Dimas Putra",
        role: "org_viewer",
        status: "active",
        last_login_at: "2026-01-16T02:20:00Z",
        created_at: "2026-01-06T08:00:00Z",
        updated_at: "2026-01-16T02:20:00Z",
      },
      {
        id: "ou_003",
        organization_id: "org_089b8bc2",
        email: "admin@alpha.example",
        name: "Org Admin (Read-only)",
        role: "org_admin",
        status: "active",
        last_login_at: "2026-01-17T12:00:00Z",
        created_at: "2026-01-02T08:00:00Z",
        updated_at: "2026-01-17T12:00:00Z",
      },
      {
        id: "ou_004",
        organization_id: "org_089b8bc2",
        email: "new@alpha.example",
        name: "New Member",
        role: "org_viewer",
        status: "invited",
        last_login_at: null,
        created_at: "2026-01-18T09:00:00Z",
        updated_at: "2026-01-18T09:00:00Z",
      },
    ];

    uiState.value = org.value ? "ready" : "empty";
  } catch (e: any) {
    uiState.value = "error";
    errorMessage.value = e?.message || "Failed to load organization profile.";
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
