<template>
  <v-app>
    <v-layout class="h-100">
      <!-- Sidebar / Drawer -->
      <v-navigation-drawer
        v-model="drawer"
        :rail="rail"
        :permanent="mdAndUp"
        :temporary="!mdAndUp"
        width="280"
        rail-width="84"
        class="sb-drawer"
      >
        <OrgSidebar
          :rail="rail"
          :active-path="route.path"
          @toggle-rail="toggleRail"
        />
      </v-navigation-drawer>

      <!-- Main -->
      <v-main>
        <!-- Top Bar -->
        <v-app-bar flat height="64" class="sb-appbar" density="comfortable">
          <div class="d-flex align-center w-100 px-4 ga-2">
            <!-- Mobile drawer toggle -->
            <v-btn
              v-if="!mdAndUp"
              icon
              variant="text"
              @click="drawer = !drawer"
            >
              <v-icon icon="lucide:menu" />
            </v-btn>

            <!-- Rail toggle (desktop) -->
            <v-btn v-else icon variant="text" @click="toggleRail">
              <v-icon
                :icon="
                  rail ? 'lucide:panel-left-open' : 'lucide:panel-left-close'
                "
              />
            </v-btn>

            <v-divider vertical class="mx-1" />

            <div class="min-w-0">
              <div class="text-subtitle-2 font-weight-bold text-truncate">
                Org Console
              </div>
              <div class="text-caption text-medium-emphasis text-truncate">
                {{ pageSubtitle }}
              </div>
            </div>

            <v-spacer />

            <!-- Right actions -->
            <div class="d-flex align-center ga-2">
              <v-btn
                icon
                variant="text"
                @click="notify('Notifications (UI only)')"
              >
                <v-icon icon="lucide:bell" />
              </v-btn>

              <v-menu location="bottom end" offset="10">
                <template #activator="{ props }">
                  <v-btn
                    v-bind="props"
                    variant="text"
                    class="px-2"
                    rounded="lg"
                  >
                    <v-avatar
                      size="28"
                      color="primary"
                      variant="tonal"
                      class="me-2"
                    >
                      <v-icon icon="lucide:user" size="16" />
                    </v-avatar>
                    <span
                      class="text-body-2 font-weight-medium d-none d-sm-inline"
                    >
                      Org Viewer
                    </span>
                    <v-icon icon="lucide:chevron-down" class="ms-2" size="18" />
                  </v-btn>
                </template>

                <v-card rounded="xl" variant="outlined" class="sb-menu">
                  <v-list density="comfortable" class="py-1">
                    <v-list-item to="/org/profile">
                      <template #prepend>
                        <v-icon icon="lucide:building-2" class="me-2" />
                      </template>
                      <v-list-item-title
                        >Organization Profile</v-list-item-title
                      >
                    </v-list-item>

                    <v-list-item to="/org/settings">
                      <template #prepend>
                        <v-icon icon="lucide:settings" class="me-2" />
                      </template>
                      <v-list-item-title>Settings</v-list-item-title>
                    </v-list-item>

                    <v-divider class="my-2" />

                    <v-list-item @click="handleLogout">
                      <template #prepend>
                        <v-icon icon="lucide:log-out" class="me-2" />
                      </template>
                      <v-list-item-title>Sign out</v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-card>
              </v-menu>
            </div>
          </div>
        </v-app-bar>

        <!-- Page content -->
        <div class="sb-content">
          <slot />
        </div>

        <v-snackbar v-model="snack.open" timeout="1400" location="bottom">
          {{ snack.text }}
        </v-snackbar>
      </v-main>
    </v-layout>
  </v-app>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useDisplay } from "vuetify";
import { useRoute } from "vue-router";
import OrgSidebar from "~/components/org/OrgSidebar.vue";

const route = useRoute();
const { mdAndUp } = useDisplay();

const authStore = useAuthStore();
const userStore = useUsersStore();
const drawer = ref(true);
const rail = ref(false);

watch(
  () => mdAndUp.value,
  (isDesktop) => {
    // Default: drawer open on desktop, closed on mobile
    drawer.value = isDesktop;
    // Keep rail mode only meaningful on desktop
    if (!isDesktop) rail.value = false;
  },
  { immediate: true },
);

function toggleRail() {
  // Only allow rail toggle on desktop
  if (!mdAndUp.value) return;
  rail.value = !rail.value;
}

const pageSubtitle = computed(() => {
  const p = route.path;
  if (p.startsWith("/org/reports")) return "Reports";
  if (p.startsWith("/org/questionnaires")) return "Questionnaires";
  if (p.startsWith("/org/users")) return "Users";
  if (p.startsWith("/org/profile")) return "Organization Profile";
  if (p.startsWith("/org/settings")) return "Settings";
  return "Dashboard";
});

const snack = ref({ open: false, text: "" });
function notify(text: string) {
  snack.value = { open: true, text };
}

function handleLogout() {
  authStore.logout();
}
</script>

<style lang="scss" scoped>
.sb-drawer {
  border-right: 1px solid rgba(0, 0, 0, 0.08);
}

.sb-appbar {
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
}

.sb-content {
  min-height: calc(100vh - 64px);
}

.sb-menu {
  min-width: 220px;
}
</style>
