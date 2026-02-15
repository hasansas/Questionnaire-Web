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
        <QuickSetup v-if="!user.preference.preferencesCompleted" />
        <template v-else>
          <!-- Main content area -->
          <v-main class="bg-white">
            <slot />
          </v-main>
          <v-bottom-navigation height="64" grow class="sb-bottom-nav">
            <v-btn
              v-for="item in navItems"
              :key="item.value"
              color="primary"
              :value="item.value"
              :to="item.to"
              :aria-label="item.label"
            >
              <v-icon :icon="item.icon" size="22" />
              <span>{{ item.label }}</span>
            </v-btn>
          </v-bottom-navigation>

          <!-- <v-bottom-navigation v-model="model" app fixed class="g-nav">
            <v-btn
              v-for="item in navItems"
              :key="item.value"
              class="g-nav__btn"
              :class="{ 'is-active': model === item.value }"
              variant="text"
              color="primary"
              rounded="xl"
              :value="item.value"
              :to="item.to"
              :aria-label="item.label"
              :aria-current="model === item.value ? 'page' : undefined"
              :ripple="false"
            >
              <v-icon :icon="item.icon" size="22" class="g-nav__icon" />
              <span v-if="model === item.value" class="g-nav__label">{{
                item.label
              }}</span>
            </v-btn>
          </v-bottom-navigation> -->
        </template>
      </template>
    </template>
  </v-app>
</template>

<script setup lang="ts">
import { ref } from "vue";

type NavKey = "home" | "report" | "profile" | "mySpace";
type NavItem = { value: NavKey; to: string; label: string; icon: string };

const navItems: NavItem[] = [
  { value: "home", to: "/dashboard", label: "Home", icon: "lucide:home" },
  {
    value: "report",
    to: "/dashboard/report",
    label: "Report",
    icon: "lucide:square-chart-gantt",
  },
  {
    value: "profile",
    to: "/dashboard/profiles",
    label: "Profile",
    icon: "lucide:users",
  },
  {
    value: "mySpace",
    to: "/dashboard/my-space",
    label: "My Space",
    icon: "lucide:orbit",
  },
];

const authStore = useAuthStore();
const userStore = useUsersStore();
const user = computed(() => userStore.user);
const hydrated = ref(false);

useNotification(authStore.auth.id);

onMounted(() => {
  hydrated.value = true;
});
</script>

<style scoped lang="scss">
.sb-bottom-nav {
  position: fixed !important;
  border-top: 1px solid rgba(0, 0, 0, 0.05);
  backdrop-filter: saturate(120%) blur(8px);
  background-color: white;
  box-shadow: 0 -4px 12px rgba(15, 23, 42, 0.04); // light top shadow
  z-index: 1000; /* Ensure it stays above other content */
  border-radius: 24px 24px 0 0;

  .v-btn--active {
    background-color: transparent !important;
    box-shadow: none;
  }

  :deep(.v-btn__overlay) {
    background: transparent !important;
  }
}

// Global Navigation Container Styling
.g-nav {
  // padding: 4px 16px calc(env(safe-area-inset-bottom) + 4px);
  position: fixed !important;
  bottom: 0 !important;
  padding: 8px 16px;
  border-top: 1px solid rgba(0, 0, 0, 0.04);
  backdrop-filter: saturate(120%) blur(8px);
  background-color: white;
  box-shadow: 0 -4px 12px rgba(15, 23, 42, 0.04); // light top shadow
  z-index: 1000; /* Ensure it stays above other content */

  :deep(.v-bottom-navigation__content) {
    gap: 8px;
    justify-content: space-between;
  }
}

// Base Button Styles (Inactive State)
.g-nav__btn {
  height: 40px !important;
  min-width: 72px !important; /* Circular size for inactive icon */
  padding: 0 !important; /* No padding needed for inactive state */
  text-transform: none;
  letter-spacing: 0;
  font-weight: 600;
  background: transparent;
  box-shadow: none !important;
  flex-grow: 0; /* Prevents buttons from equally distributing width */

  // Control the internal content box for the horizontal pill
  :deep(.v-btn__content) {
    margin-top: 4px;
    display: flex;
    flex-direction: row; // Base is row, for both active and inactive
    align-items: center;
    justify-content: center;
    gap: 0; // Base gap is 0
    // Control transition for the content shift effect
    transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
    transform: translateY(0);
  }

  // Icon styling for inactive state
  .g-nav__icon {
    opacity: 0.6;
    color: var(--v-theme-on-surface); /* Inactive color */
    transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.25s ease;
  }

  // Label is hidden by v-if, but style it for consistency
  .g-nav__label {
    display: none; /* v-if handles hiding, but good practice */
  }
}

// Active State (Horizontal Pill)
.g-nav__btn.is-active {
  /* Let Vuetify's internal flex determine the expanded width */
  min-width: 0;
  padding: 0 16px !important;
  flex-grow: 1; /* Allow active button to take up necessary space */
  max-width: 50%; /* Cap the maximum width to prevent over-expansion */

  // Set the background color for the pill
  background-color: color-mix(in srgb, var(--v-theme-primary) 12%, transparent);
  box-shadow: 0 4px 10px rgba(var(--v-theme-primary-rgb), 0.1) !important;

  // Active content: Add gap and a slight lift effect
  :deep(.v-btn__content) {
    gap: 8px; /* Space between icon and label */
    transform: translateY(-2px); /* Subtle lift */
  }

  // Active Icon: Change color and add slight scale animation
  .g-nav__icon {
    opacity: 1;
    color: var(--v-theme-primary);
    transform: scale(1.05);
  }

  // Active Label: Style for visibility
  .g-nav__label {
    display: inline-block;
    font-size: 15px;
    color: var(--v-theme-primary);
    opacity: 1;
    white-space: nowrap;
    overflow: hidden;
    transition: opacity 0.2s ease, max-width 0.2s ease;
  }
}

/* Ensure the ripple effect doesn't interfere with the design */
.g-nav__btn:before {
  display: none;
}
</style>
