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
      <v-navigation-drawer v-model="drawer" temporary>
        <v-toolbar color="white" class="px-4">
          <SuperBaziLogo height="24" />
        </v-toolbar>

        <v-list nav>
          <v-list-item
            v-for="(item, index) in menuItems"
            :key="index"
            @click="goTo(item.to)"
          >
            <template #prepend>
              <v-avatar size="20" class="rounded-0 mr-2">
                <v-icon :icon="item.icon" size="20" />
              </v-avatar>
            </template>
            <v-list-item-title class="text-body-1">
              {{ item.name }}
            </v-list-item-title>
          </v-list-item>
        </v-list>
        <template #append>
          <v-divider />
          <div class="drawer-bottom pa-4">
            <!-- Language (v-menu) -->
            <div class="d-flex align-center justify-space-between mb-6">
              <div class="text-caption text-medium-emphasis">Language</div>

              <v-menu location="top end" offset="10">
                <template #activator="{ props }">
                  <v-btn
                    v-bind="props"
                    variant="outlined"
                    rounded="lg"
                    size="small"
                    class="lang-btn"
                  >
                    <span class="me-2">{{ currentOption.flag }}</span>
                    <span class="font-weight-medium">
                      {{ currentOption.label }}
                    </span>
                    <v-icon icon="mdi-chevron-down" class="ms-2" />
                  </v-btn>
                </template>

                <v-card variant="flat">
                  <v-list density="compact">
                    <v-list-item
                      v-for="opt in options"
                      :key="opt.code"
                      @click="onSelectLocale(opt.code)"
                    >
                      <template #prepend>
                        <span class="me-2">{{ opt.flag }}</span>
                      </template>

                      <v-list-item-title>{{ opt.label }}</v-list-item-title>

                      <template #append>
                        <v-icon v-if="opt.code === locale" icon="mdi-check" />
                      </template>
                    </v-list-item>
                  </v-list>
                </v-card>
              </v-menu>
            </div>

            <!-- Optional: quick sign in button inside drawer (nice UX) -->
            <v-btn
              block
              rounded
              color="primary"
              variant="flat"
              class="font-weight-bold"
              :to="localePath(`/auth/${toSlug(t('nav.login'))}`)"
              @click="drawer = false"
            >
              Sign In
            </v-btn>
          </div>
        </template>
      </v-navigation-drawer>

      <v-app-bar app flat>
        <v-btn
          icon
          variant="text"
          @click.stop="drawer = !drawer"
          aria-label="Toggle Navigation Menu"
          class="mr-2"
        >
          <v-icon icon="lucide:menu" size="24"></v-icon>
        </v-btn>
        <SuperBaziLogo height="24" />

        <v-spacer></v-spacer>
        <v-btn
          rounded
          color="primary"
          variant="outlined"
          :to="localePath(`/auth/${toSlug(t('nav.login'))}`)"
          class="font-weight-bold mr-3"
        >
          Sign In
        </v-btn>
      </v-app-bar>

      <v-main>
        <slot />
      </v-main>
      <BaseFooter />
    </template>
  </v-app>
</template>

<script setup lang="ts">
import { useRouter, useRoute } from "vue-router";
import { ref, computed, onMounted } from "vue";
import { toSlug } from "~/utils/slug.util";

// Nuxt i18n composables
const { t, locale, locales, setLocale } = useI18n();

const localePath = useLocalePath();
const router = useRouter();
const route = useRoute();
const hydrated = ref(false);
const drawer = ref(false);

/** Menu types */
type SubMenu = { name: string; to: string; icon?: string };
type MenuItem = {
  name: string;
  to: string;
  icon?: string;
  children: SubMenu[];
};

/**
 * Locale type derived from i18n locales array
 * (keeps TS safe without hardcoding unions)
 */
type AppLocale = typeof locale.value;

/**
 * Build language options for your menu UI.
 * Uses `locales` from nuxt-i18n, but adds your flag + label.
 */
type LangOption = {
  code: AppLocale;
  label: string;
  flag: string;
};

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
      code,
      label: code.toUpperCase(),
      flag: "🌐",
    }
  );
});

const menuItems = computed(() => [
  {
    name: t("nav.home"),
    to: localePath({ path: "/", hash: "#home" }),
    icon: "ri:home-3-line",
    children: [],
  },
  {
    name: t("nav.features"),
    to: localePath({ path: "/", hash: "#key-features" }),
    icon: "ri:sparkling-2-line",
    children: [],
  },
  {
    name: t("nav.pricing"),
    to: localePath({ path: "/", hash: "#pricing" }),
    icon: "ri:price-tag-3-line",
    children: [],
  },
  {
    name: t("nav.faq"),
    to: localePath({ path: "/", hash: "#faq" }),
    icon: "ri:question-answer-line",
    children: [],
  },
]);

/** Smooth scroll */
const goTo = async (target: string) => {
  // anchor like "#pricing"
  const isAnchor = target.startsWith("#") && isValidCssSelector(target);

  if (isAnchor) {
    const homePath = localePath("/");

    // if not on homepage, go there with hash (localized)
    if (route.path !== homePath) {
      await router.push(localePath({ path: "/", hash: target }));
    } else {
      document
        .querySelector(target)
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  } else {
    // normal route -> localize it
    await router.push(localePath(target));
  }

  drawer.value = false;
};

const isValidCssSelector = (selectorString: string) => {
  if (typeof selectorString !== "string" || selectorString.trim() === "")
    return false;
  try {
    document.querySelector(selectorString);
    return true;
  } catch {
    return false;
  }
};

async function onSelectLocale(v: AppLocale) {
  // nuxt-i18n setLocale triggers routing change when needed
  await setLocale(v);
  drawer.value = false;
}

onMounted(() => {
  hydrated.value = true;
});
</script>

<style scoped lang="scss">
.lang-btn {
  text-transform: none;
  letter-spacing: normal;
  color: inherit;
  border-color: rgba(0, 0, 0, 0.15) !important;
}
</style>
