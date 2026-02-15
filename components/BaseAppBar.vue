<template>
  <ClientOnly>
    <v-app-bar
      :elevation="appBarElevated ? 4 : 0"
      :class="['superbazi-appbar', appBarElevated ? 'elevated' : '']"
      height="72"
      flat
    >
      <v-container class="main-container d-flex align-center">
        <!-- Brand -->
        <NuxtLink
          to="/"
          class="brand-logo d-flex align-center ga-2 text-decoration-none"
        >
          <!-- Keep your logo if you want -->
          <AppLogo />
        </NuxtLink>

        <v-spacer />

        <!-- Desktop menu -->
        <div v-if="mdAndUp" class="d-flex align-center ga-1 me-2">
          <div v-for="(item, index) in menuItems" :key="index">
            <v-menu
              v-if="item.children && item.children.length > 0"
              open-on-hover
              location="bottom"
              offset="8"
              transition="fade-transition"
            >
              <template #activator="{ props }">
                <v-btn
                  v-bind="props"
                  append-icon="mdi-chevron-down"
                  rounded
                  :variant="isActive(item) ? 'flat' : 'text'"
                  density="comfortable"
                  class="text-body-2 text-medium-emphasis"
                >
                  {{ item.name }}
                </v-btn>
              </template>

              <v-card flat rounded="lg" min-width="220">
                <v-list>
                  <v-list-item
                    v-for="(subMenu, i) in item.children"
                    :key="i"
                    :value="subMenu"
                    color="primary"
                    @click="goTo(subMenu.to)"
                  >
                    <template #prepend>
                      <v-icon
                        v-if="subMenu.icon"
                        :icon="subMenu.icon"
                        size="20"
                      />
                    </template>

                    <v-list-item-title class="text-body-2">
                      {{ subMenu.name }}
                    </v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-card>
            </v-menu>

            <v-btn
              v-else
              rounded
              :variant="isActive(item) ? 'flat' : 'text'"
              density="comfortable"
              class="text-body-2 text-medium-emphasis"
              @click="goTo(item.to)"
            >
              {{ item.name }}
            </v-btn>
          </div>
        </div>

        <!-- Mobile hamburger -->
        <v-btn
          v-else
          icon
          variant="text"
          aria-label="Open menu"
          @click="drawer = true"
        >
          <v-icon icon="mdi-menu" />
        </v-btn>

        <!-- Right CTA -->
        <v-spacer />

        <v-btn variant="text" density="comfortable" class="text-body-2">
          Log in
        </v-btn>
        <v-btn color="primary" variant="flat" rounded="lg" class="text-none">
          Request a Demo
        </v-btn>
      </v-container>

      <!-- Mobile drawer -->
      <v-navigation-drawer
        v-model="drawer"
        location="right"
        temporary
        width="320"
      >
        <div class="pa-4">
          <div class="d-flex align-center justify-space-between ga-3 mb-3">
            <div class="text-subtitle-1 font-weight-bold">Menu</div>
            <v-btn
              icon
              variant="text"
              @click="drawer = false"
              aria-label="Close menu"
            >
              <v-icon icon="mdi-close" />
            </v-btn>
          </div>

          <v-divider class="mb-3" />

          <v-list nav>
            <v-list-item
              v-for="(item, i) in flatMenuItems"
              :key="i"
              :title="item.name"
              :subtitle="item.subtitle"
              @click="() => handleMobileNav(item.to)"
            >
              <template #prepend>
                <v-icon v-if="item.icon" :icon="item.icon" />
              </template>
            </v-list-item>
          </v-list>

          <v-divider class="my-3" />

          <!-- Language (mobile) -->
          <div class="text-caption text-medium-emphasis mb-2">Language</div>
          <v-select
            v-model="mobileLocale"
            :items="options"
            item-title="label"
            item-value="code"
            variant="outlined"
            rounded="lg"
            hide-details
            density="comfortable"
            @update:model-value="setLocale"
          >
            <template #selection="{ item }">
              <span class="me-2">{{ item.raw.flag }}</span>
              <span>{{ item.raw.label }}</span>
            </template>
            <template #item="{ props, item }">
              <v-list-item v-bind="props">
                <template #prepend>
                  <span class="me-2">{{ item.raw.flag }}</span>
                </template>
                <v-list-item-title>{{ item.raw.label }}</v-list-item-title>
              </v-list-item>
            </template>
          </v-select>

          <v-btn
            class="mt-4"
            color="primary"
            rounded="xl"
            size="large"
            block
            @click="
              () => {
                drawer = false;
                emitRequestDemo();
              }
            "
          >
            Request a Demo
          </v-btn>
        </div>
      </v-navigation-drawer>
    </v-app-bar>
  </ClientOnly>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from "vue";
import { useDisplay } from "vuetify";
import { useRouter, useRoute } from "vue-router";

const { mdAndUp } = useDisplay();
const router = useRouter();
const route = useRoute();

// Nuxt i18n composables
const { t, locale, locales, setLocale } = useI18n();
const localePath = useLocalePath();

/** UI state */
const langMenu = ref(false);
const drawer = ref(false);

// Scroll effect + active section
const appBarElevated = ref(false);
const currentSection = ref<string>("top");

// ---- Locale options
type AppLocale = typeof locale.value;
type LangOption = { code: AppLocale; label: string; flag: string };

const options = computed<LangOption[]>(() => {
  const list = (locales.value as any[]) || [];
  return list.map((l) => {
    const code = String(l.code) as AppLocale;
    const flag = code === "en" ? "🇺🇸" : code === "id" ? "🇮🇩" : "🌐";
    const label = l.name || code.toUpperCase();
    return { code, label, flag };
  });
});

const currentOption = computed(() => {
  const code = String(locale.value);
  return (
    options.value.find((o) => o.code === code) ||
    options.value[0] || {
      code: code as AppLocale,
      label: code.toUpperCase(),
      flag: "🌐",
    }
  );
});

const mobileLocale = ref<AppLocale>(locale.value as AppLocale);
watch(
  () => locale.value,
  (val) => (mobileLocale.value = val as AppLocale),
);

// ---- Menu types
type SubMenu = { name: string; to: string; icon?: string; subtitle?: string };
type MenuItem = {
  name: string;
  to: string;
  icon?: string;
  children: SubMenu[];
};

// IMPORTANT: use anchor targets that exist in /pages/index.vue
const menuItems = computed<MenuItem[]>(() => [
  {
    name: t("nav.home"),
    to: "#top",
    icon: "mdi-home-outline",
    children: [],
  },
  {
    name: t("nav.features"),
    to: "#features",
    icon: "mdi-sparkles",
    children: [],
  },
  {
    name: t("nav.pricing"),
    to: "#pricing",
    icon: "mdi-tag-outline",
    children: [],
  },
  {
    name: t("nav.faq"),
    to: "#faq",
    icon: "mdi-help-circle-outline",
    children: [],
  },
]);

// Flatten for mobile drawer
const flatMenuItems = computed<SubMenu[]>(() => {
  const flat: SubMenu[] = [];
  for (const m of menuItems.value) {
    if (m.children?.length) {
      flat.push({ name: m.name, to: m.to, icon: m.icon, subtitle: "" });
      for (const c of m.children) flat.push(c);
    } else {
      flat.push({ name: m.name, to: m.to, icon: m.icon, subtitle: "" });
    }
  }
  // Optional: add orgs directory
  flat.push({
    name: "Organizations",
    to: "/organizations",
    icon: "mdi-domain",
    subtitle: "Browse partners",
  });
  return flat;
});

/** Navigation */
const isAnchor = (target: string) =>
  target.startsWith("#") && isValidCssSelector(target);

const goTo = async (target: string) => {
  // Normalize localized "/#hash" into "#hash"
  const hashFromUrl = extractHash(target);
  const anchor = hashFromUrl ? `#${hashFromUrl}` : target;

  // Anchor scroll
  if (isAnchor(anchor)) {
    const homePath = localePath("/");

    // If not on homepage, route to homepage with hash
    if (route.path !== homePath) {
      await router.push(localePath({ path: "/", hash: anchor }));
      return;
    }

    document
      .querySelector(anchor)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
    return;
  }

  // Otherwise treat as route (localized)
  await router.push(localePath(target));
};

const handleMobileNav = async (to: string) => {
  drawer.value = false;
  await goTo(to);
};

function extractHash(input: string): string | null {
  // accepts "#pricing" OR "/#pricing" OR localized url ".../#pricing"
  const idx = input.indexOf("#");
  if (idx === -1) return null;
  return input.slice(idx + 1) || null;
}

function isValidCssSelector(selectorString: string) {
  if (typeof selectorString !== "string" || selectorString.trim() === "")
    return false;
  try {
    document.querySelector(selectorString);
    return true;
  } catch {
    return false;
  }
}

/** Active state */
function isActive(item: MenuItem) {
  const hash = typeof route.hash === "string" ? route.hash : "";
  if (item.to.startsWith("#")) {
    // prefer scroll-based active section when on homepage
    if (route.path === localePath("/"))
      return `#${currentSection.value}` === item.to;
    // fallback to hash
    return hash === item.to;
  }
  return false;
}

/** Scroll handling for elevation + active section */
const sectionIds = [
  "#top",
  "#problem",
  "#features",
  "#pricing",
  "#faq",
  "#final-cta",
];

const handleScroll = () => {
  const isHome = route.path === localePath("/");
  appBarElevated.value = !isHome ? true : window.scrollY > 16;
  if (!isHome) return;

  // determine current section
  for (let i = sectionIds.length - 1; i >= 0; i--) {
    const el = document.querySelector(sectionIds[i]) as HTMLElement | null;
    if (!el) continue;
    const top = el.offsetTop;
    if (window.scrollY + 120 >= top) {
      currentSection.value = sectionIds[i].slice(1);
      break;
    }
  }
};

onMounted(() => {
  handleScroll();
  window.addEventListener("scroll", handleScroll, { passive: true });
});

onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
});

/**
 * CTA: emit request demo (if BaseAppBar is used inside page, easiest is window event)
 * Your landing page can listen and open the dialog.
 */
function emitRequestDemo() {
  // dispatch a lightweight event the landing page can listen to
  window.dispatchEvent(new CustomEvent("sbq:request-demo"));
}
</script>
