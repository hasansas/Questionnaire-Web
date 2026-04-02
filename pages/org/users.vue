<template>
  <v-container class="pa-6">
    <div class="d-flex align-center justify-space-between ga-3 flex-wrap mb-6">
      <div class="min-w-0">
        <h1 class="text-h5 font-weight-black ma-0">Organization Users</h1>
        <div class="text-body-2 text-medium-emphasis mt-1">
          Read-only list of users in your organization.
        </div>
      </div>

      <v-btn
        rounded="lg"
        variant="outlined"
        prepend-icon="lucide:building-2"
        to="/org/profile"
      >
        Organization Profile
      </v-btn>
    </div>

    <v-card rounded="xl" variant="outlined" class="mb-4">
      <v-card-text class="pa-4">
        <v-row>
          <v-col cols="12" md="6">
            <v-text-field
              v-model="search"
              label="Search users"
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

          <v-col cols="12" md="3">
            <v-select
              v-model="roleFilter"
              :items="roleOptions"
              label="Role"
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
          :items="filteredUsers"
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
                item.last_login_at ? formatDateTime(item.last_login_at) : "—"
              }}
            </div>
          </template>

          <template #no-data>
            <div class="pa-6 text-center">
              <div class="text-subtitle-1 font-weight-bold mb-1">
                No users found
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
  title: "Organization Users • Questionnaire App",
  meta: [
    { name: "description", content: "Read-only organization users list." },
  ],
});

const uiState = ref<UiState>("loading");
const errorMessage = ref("");

const users = ref<OrgUser[]>([]);

const search = ref("");
const statusFilter = ref<string | null>(null);
const roleFilter = ref<string | null>(null);

const statusOptions = ["active", "invited", "disabled"];
const roleOptions = ["org_viewer", "org_admin"];

const headers = [
  { title: "Name", key: "name", sortable: false },
  { title: "Email", key: "email", sortable: false },
  { title: "Role", key: "role", sortable: false },
  { title: "Status", key: "status", sortable: false },
  { title: "Last login", key: "last_login_at", sortable: false },
];

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

const filteredUsers = computed(() => {
  const q = search.value.trim().toLowerCase();
  return users.value.filter((u) => {
    const matchSearch =
      !q ||
      u.name.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q);
    const matchStatus = !statusFilter.value || u.status === statusFilter.value;
    const matchRole = !roleFilter.value || u.role === roleFilter.value;
    return matchSearch && matchStatus && matchRole;
  });
});

async function load() {
  uiState.value = "loading";
  errorMessage.value = "";

  try {
    await new Promise((r) => setTimeout(r, 350));

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
      {
        id: "ou_005",
        organization_id: "org_089b8bc2",
        email: "disabled@alpha.example",
        name: "Disabled Account",
        role: "org_viewer",
        status: "disabled",
        last_login_at: "2026-01-04T09:00:00Z",
        created_at: "2026-01-02T09:00:00Z",
        updated_at: "2026-01-04T09:00:00Z",
      },
    ];

    uiState.value = users.value.length ? "ready" : "empty";
  } catch (e: any) {
    uiState.value = "error";
    errorMessage.value = e?.message || "Failed to load organization users.";
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
