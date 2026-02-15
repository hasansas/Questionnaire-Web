<template>
  <v-app>
    <v-card
      v-if="!hydrated"
      flat
      height="100vh"
      class="d-flex align-center justify-center"
    >
      <div class="superbazi-loader"></div>
    </v-card>
    <template v-else>
      <v-card
        v-if="!user"
        flat
        height="100vh"
        class="d-flex align-center justify-center"
      >
        <div class="superbazi-loader"></div>
      </v-card>
      <template v-else>
        <QuickSetup
          v-if="!user.preference.preferencesCompleted"
          v-model="showQuickSetupDialog"
        />
        <div v-if="!user.preference.preferencesCompleted">QuickSetup</div>
        <template v-else>
          <ClientOnly>
            <v-navigation-drawer elevation="0" v-model="drawer" app permanent>
              <!-- Brand Header -->
              <div
                class="superbazi-brand text-h6 font-weight-black ml-4 text-primary pa-4"
              >
                <img
                  src="/images/superbazi-logo-text.png"
                  alt="SuperBazi"
                  height="24"
                />
              </div>

              <!-- Main Menu -->
              <v-list density="compact" class="pr-4">
                <v-list-subheader class="text-overline mx-4">
                  Main Menu
                </v-list-subheader>
                <v-list-item
                  v-for="item in navItems"
                  :key="item.title"
                  :to="item.to"
                  :active="route.path === item.to"
                  class="nav-link pl-6 pr-4 my-2"
                  active-class="nav-link--active"
                >
                  <template #prepend>
                    <v-avatar size="20" class="rounded-0">
                      <v-icon
                        :icon="item.icon"
                        size="20"
                        :color="route.path === item.to ? 'primary' : ''"
                      />
                    </v-avatar>
                  </template>
                  <v-list-item-title>{{ item.title }}</v-list-item-title>
                </v-list-item>
              </v-list>

              <!-- Other Menu -->
              <!-- <v-list density="compact" class="pr-4">
                <v-list-subheader class="text-overline mx-4">
                  Other
                </v-list-subheader>
                <v-list-item
                  v-for="item in otherItems"
                  :key="item.title"
                  :to="item.to"
                  :active="route.path === item.to"
                  class="nav-link pl-6 pr-4 my-2"
                  active-class="nav-link--active"
                >
                  <template #prepend>
                    <v-avatar size="20" class="rounded-0">
                      <v-icon :icon="item.icon" size="20" />
                    </v-avatar>
                  </template>
                  <v-list-item-title>{{ item.title }}</v-list-item-title>
                </v-list-item>
              </v-list> -->

              <!-- User Menu -->
              <template #append>
                <v-divider class="ma-0" />
                <v-menu
                  :close-on-content-click="false"
                  :offset="[0, 0]"
                  location="end"
                >
                  <template #activator="{ props }">
                    <v-card v-bind="props" class="rounded-0 hover-card">
                      <v-list-item
                        :title="user?.name || ''"
                        :subtitle="user?.email || ''"
                        class="pa-4"
                      >
                        <template v-slot:prepend>
                          <v-avatar size="40" color="primary">
                            <span class="text-white">
                              {{ getInitials(user?.name || "") }}
                            </span>
                          </v-avatar>
                        </template>
                      </v-list-item>
                    </v-card>
                  </template>

                  <v-card min-width="280">
                    <v-list>
                      <!-- <v-list-item>
                        <template #prepend>
                          <v-avatar size="16">
                            <v-icon icon="ri-contrast-line" size="16" />
                          </v-avatar>
                        </template>
                        <v-list-item-title>Dark mode</v-list-item-title>
                        <template #append>
                          <v-switch
                            v-model="darkmode"
                            @change="toggleDarkMode"
                            color="primary"
                            hide-details
                          />
                        </template>
                      </v-list-item>

                      <v-divider />

                      <v-list-item>
                        <template #prepend>
                          <v-avatar size="16">
                            <v-icon icon="ri-user-3-line" size="16" />
                          </v-avatar>
                        </template>
                        <v-list-item-title>Your profile</v-list-item-title>
                      </v-list-item>

                      <v-list-item>
                        <template #prepend>
                          <v-avatar size="16">
                            <v-icon icon="ri-wallet-line" size="16" />
                          </v-avatar>
                        </template>
                        <v-list-item-title>Billing</v-list-item-title>
                      </v-list-item> -->

                      <v-list-item @click="handleLogout">
                        <template #prepend>
                          <v-avatar size="16">
                            <v-icon icon="ri-logout-circle-line" size="16" />
                          </v-avatar>
                        </template>
                        <v-list-item-title>Logout</v-list-item-title>
                      </v-list-item>
                    </v-list>
                  </v-card>
                </v-menu>
              </template>
            </v-navigation-drawer>
          </ClientOnly>

          <v-main>
            <slot />
          </v-main>
        </template>
      </template>
    </template>
  </v-app>
</template>

<script setup lang="ts">
import { useRoute } from "vue-router";
import { useAuthStore } from "~/stores/auth";
import { useNotification } from "~/composables/useNotification";
import { getInitials } from "@/utils/formatters";

const authStore = useAuthStore();
const userStore = useUsersStore();
const user = computed(() => userStore.user);
const hydrated = ref(false);
const route = useRoute();
const darkmode = ref(false);
const drawer = ref(true);
const showQuickSetupDialog = ref(true);

useNotification(authStore.auth.id);

// --- Sidebar Navigation Items ---
const navItems = [
  { title: "Dashboard", icon: "lucide:layout-dashboard", to: "/dashboard" },
  { title: "Report", icon: "lucide:file-text", to: "/dashboard/report" },
  { title: "Profiles", icon: "lucide:user-circle", to: "/dashboard/profiles" },
  // {
  //   title: "Calendars",
  //   icon: "lucide:calendar-days",
  //   to: "/dashboard/calendars",
  // },
  {
    title: "Consultation",
    icon: "lucide:messages-square",
    to: "/dashboard/consultation",
  },
  { title: "Academy", icon: "lucide:graduation-cap", to: "/dashboard/academy" },
  { title: "Community", icon: "lucide:users", to: "/dashboard/community" },
  { title: "R&D", icon: "lucide:flask-round", to: "/dashboard/rnd" },
];

const otherItems = [
  { title: "Settings", icon: "lucide:settings", to: "/dashboard/settings" },
  { title: "Knowledge", icon: "lucide:book-open", to: "/dashboard/knowledge" },
  { title: "Help Center", icon: "lucide:help-circle", to: "/dashboard/help" },
];

function toggleDarkMode() {
  document.documentElement.classList.toggle("dark", darkmode.value);
}

function handleLogout() {
  authStore.logout();
}

onMounted(() => {
  hydrated.value = true;
});
</script>

<style lang="scss" scoped>
.superbazi-brand {
  letter-spacing: -0.01em;
}

.nav-link {
  border-radius: 0 1.5rem 1.5rem 0 !important;
  transition: background 0.2s, border 0.2s;
  border-left: 4px solid transparent;
  background: none !important;
}

:deep(.v-list-item__overlay) {
  background: transparent !important;
  box-shadow: none !important;
}

.nav-link:hover,
.nav-link--active {
  background: var(--color-primary-soften) !important;
  color: var(--color-primary) !important;
  position: relative;

  .v-icon {
    color: var(--color-primary) !important;
  }
}

/* Border left indicator for active */
.nav-link--active::before {
  position: absolute;
  content: "";
  bottom: 0;
  left: 0;
  width: 2px;
  height: 100%;
  background: var(--color-primary) !important;
  z-index: 10;
}

.user-card {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
}
</style>
