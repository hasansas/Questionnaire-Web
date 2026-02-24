<template>
  <div class="d-flex flex-column h-100 pa-3">
    <div class="d-flex align-center ga-3 px-2 py-2">
      <div :class="rail ? 'mx-2' : ''">
        <v-avatar :size="rail ? 26 : 34" color="#0cad43">
          <v-avatar :size="rail ? 24 : 32">
            <img
              src="/images/SB Questionnaire-icon.png"
              alt="SB Questionnaire icon"
              height="100%"
            />
          </v-avatar>
        </v-avatar>
      </div>

      <div v-if="!rail" class="min-w-0">
        <div class="font-weight-black text-body-1">SB Questionnaire</div>
        <div class="text-caption text-medium-emphasis">Org Console</div>
      </div>
    </div>

    <v-divider class="sb-divider my-2" />

    <div class="px-1">
      <v-list nav density="comfortable" class="py-1 px-0">
        <v-list-subheader v-if="!rail" class="text-overline">
          Main
        </v-list-subheader>

        <v-tooltip
          v-for="item in navItems"
          :key="item.name"
          :text="item.name"
          location="end"
          :disabled="!rail"
          open-delay="150"
        >
          <template #activator="{ props: tipProps }">
            <v-list-item
              v-bind="tipProps"
              :to="item.to"
              :active="route.path === item.to"
              active-class="nav-link--active"
            >
              <template #prepend>
                <v-avatar size="20" class="rounded-0 mx-2">
                  <v-icon
                    :icon="item.icon"
                    size="20"
                    :color="route.path === item.to ? 'primary' : ''"
                  />
                </v-avatar>
              </template>

              <v-list-item-title v-if="!rail">{{
                item.name
              }}</v-list-item-title>
            </v-list-item>
          </template>
        </v-tooltip>

        <v-divider v-if="rail" class="sb-divider my-2" />
        <v-list-subheader v-if="!rail" class="text-overline">
          Settings
        </v-list-subheader>

        <v-tooltip
          v-for="item in settingNavItems"
          :key="item.name"
          :text="item.name"
          location="end"
          :disabled="!rail"
          open-delay="150"
        >
          <template #activator="{ props: tipProps }">
            <v-list-item
              v-bind="tipProps"
              :to="item.to"
              :active="route.path === item.to"
              active-class="nav-link--active"
            >
              <template #prepend>
                <v-avatar size="20" class="rounded-0 mx-2">
                  <v-icon
                    :icon="item.icon"
                    size="20"
                    :color="route.path === item.to ? 'primary' : ''"
                  />
                </v-avatar>
              </template>

              <v-list-item-title v-if="!rail">{{
                item.name
              }}</v-list-item-title>
            </v-list-item>
          </template>
        </v-tooltip>
      </v-list>
    </div>

    <v-spacer />

    <v-divider class="sb-divider my-2" />
    <v-list nav density="comfortable" class="py-1">
      <v-list-item>
        <template #prepend>
          <v-avatar size="20" class="rounded-0 mx-2">
            <v-icon icon="lucide:info" size="20" />
          </v-avatar>
        </template>
        <v-list-item-title>About</v-list-item-title>
      </v-list-item>
    </v-list>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";

type MenuItem = {
  name: string;
  to: string;
  icon?: string;
  children: any[];
};

defineProps<{
  rail: boolean;
  activePath: string;
}>();

defineEmits<{
  (e: "toggle-rail"): void;
}>();

const route = useRoute();

const navItems = computed<MenuItem[]>(() => [
  { name: "Dashboard", to: "/org", icon: "lucide:home", children: [] },
  {
    name: "Reports",
    to: "/org/reports",
    icon: "lucide:file-text",
    children: [],
  },
  {
    name: "Questionnaires",
    to: "/org/questionnaires",
    icon: "lucide:clipboard-list",
    children: [],
  },
  {
    name: "Organization Profile",
    to: "/org/profile",
    icon: "lucide:building-2",
    children: [],
  },
  { name: "Users", to: "/org/users", icon: "lucide:users", children: [] },
]);

const settingNavItems = computed<MenuItem[]>(() => [
  {
    name: "Settings",
    to: "/org/settings",
    icon: "lucide:settings",
    children: [],
  },
]);
</script>

<style lang="scss" scoped>
.nav-link:hover,
.nav-link--active {
  background: var(--color-primary-soften) !important;
  color: var(--color-primary) !important;

  .v-icon {
    color: var(--color-primary) !important;
  }
}
</style>
