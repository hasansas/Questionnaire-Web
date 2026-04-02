<template>
  <v-container class="pa-6">
    <div class="d-flex align-center justify-space-between ga-3 flex-wrap mb-6">
      <div class="min-w-0">
        <h1 class="text-h5 font-weight-black ma-0">Settings</h1>
        <div class="text-body-2 text-medium-emphasis mt-1">
          Organization preferences (UI only).
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

    <div v-else-if="uiState === 'empty'">
      <v-card rounded="xl" variant="outlined" class="pa-6">
        <div class="d-flex align-center ga-3">
          <v-avatar color="primary" variant="tonal" size="40">
            <v-icon icon="lucide:settings" />
          </v-avatar>
          <div>
            <div class="text-subtitle-1 font-weight-bold">
              Settings unavailable
            </div>
            <div class="text-body-2 text-medium-emphasis">
              No organization context found.
            </div>
          </div>
        </div>
      </v-card>
    </div>

    <div v-else>
      <v-row>
        <v-col cols="12" md="6">
          <v-card rounded="xl" variant="outlined">
            <v-card-title class="d-flex align-center ga-3">
              <v-avatar color="primary" variant="tonal">
                <v-icon icon="lucide:clock" />
              </v-avatar>
              <div class="min-w-0">
                <div class="text-subtitle-1 font-weight-bold">Timezone</div>
                <div class="text-caption text-medium-emphasis">
                  Display-only preference
                </div>
              </div>
            </v-card-title>
            <v-divider />
            <v-card-text class="pa-5">
              <v-text-field
                :model-value="orgTimezone"
                label="Organization timezone"
                variant="outlined"
                rounded="lg"
                density="comfortable"
                hide-details
                readonly
              />
              <div class="text-caption text-medium-emphasis mt-3">
                Timezone is managed by admins (read-only for your role).
              </div>
            </v-card-text>
          </v-card>
        </v-col>

        <v-col cols="12" md="6">
          <v-card rounded="xl" variant="outlined">
            <v-card-title class="d-flex align-center ga-3">
              <v-avatar color="primary" variant="tonal">
                <v-icon icon="lucide:download" />
              </v-avatar>
              <div class="min-w-0">
                <div class="text-subtitle-1 font-weight-bold">
                  Export Preference
                </div>
                <div class="text-caption text-medium-emphasis">
                  UI-only selection
                </div>
              </div>
            </v-card-title>
            <v-divider />
            <v-card-text class="pa-5">
              <v-select
                v-model="exportFormat"
                :items="exportItems"
                label="Default export format"
                variant="outlined"
                rounded="lg"
                density="comfortable"
                hide-details
              />
              <div class="d-flex justify-end mt-4">
                <v-btn
                  rounded="lg"
                  color="primary"
                  prepend-icon="lucide:save"
                  @click="toast('Saved (UI only)')"
                >
                  Save
                </v-btn>
              </div>
            </v-card-text>
          </v-card>
        </v-col>

        <v-col cols="12">
          <v-card rounded="xl" variant="outlined">
            <v-card-title class="d-flex align-center ga-3">
              <v-avatar color="primary" variant="tonal">
                <v-icon icon="lucide:shield" />
              </v-avatar>
              <div class="min-w-0">
                <div class="text-subtitle-1 font-weight-bold">Access</div>
                <div class="text-caption text-medium-emphasis">
                  Your current role
                </div>
              </div>
            </v-card-title>
            <v-divider />
            <v-card-text class="pa-5">
              <v-alert type="info" variant="tonal" rounded="lg">
                You are logged in as
                <span class="font-weight-bold">org_viewer</span>. Changes are
                limited to viewing and exporting.
              </v-alert>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </div>

    <v-snackbar v-model="snack.open" timeout="1400" location="bottom">
      {{ snack.text }}
    </v-snackbar>
  </v-container>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useHead } from "#imports";

type UiState = "loading" | "error" | "empty" | "ready";

useHead({
  title: "Settings • Org Console",
  meta: [{ name: "description", content: "Organization settings (UI only)." }],
});

const uiState = ref<UiState>("loading");
const errorMessage = ref("");

const orgTimezone = ref("Asia/Jakarta");

const exportItems = ["CSV", "Excel", "PDF", "JSON"];
const exportFormat = ref("CSV");

const snack = ref({ open: false, text: "" });
function toast(text: string) {
  snack.value = { open: true, text };
}

async function load() {
  uiState.value = "loading";
  errorMessage.value = "";

  try {
    await new Promise((r) => setTimeout(r, 250));
    // If you want to simulate empty state, set this to null.
    const hasOrgContext = true;
    uiState.value = hasOrgContext ? "ready" : "empty";
  } catch (e: any) {
    uiState.value = "error";
    errorMessage.value = e?.message || "Failed to load settings.";
  }
}

onMounted(load);
</script>
