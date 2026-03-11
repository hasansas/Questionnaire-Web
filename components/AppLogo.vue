<template>
  <v-sheet
    :height="height"
    variant="flat"
    color="transparent"
    class="sbq-logo d-inline-flex align-center"
  >
    <!-- Icon-only -->
    <v-avatar
      v-if="variant === 'icon'"
      :size="iconSize"
      :color="toneColor"
      :variant="toneVariant"
      class="sbq-mark"
      rounded="lg"
    >
      <v-icon :icon="icon" :color="iconColor" />
    </v-avatar>

    <!-- Default / logo-2 (icon + name) -->
    <div v-else class="d-inline-flex align-center">
      <v-avatar
        :size="iconSize"
        :color="toneColor"
        :variant="toneVariant"
        class="sbq-mark"
        rounded="lg"
      >
        <v-icon :icon="icon" :color="iconColor" size="16" />
      </v-avatar>

      <div class="ms-3 d-flex flex-column">
        <span class="brand-name" :class="{ 'is-dark': dark }">
          SB Questionnaire
        </span>
        <span
          v-if="showTagline"
          class="brand-tagline"
          :class="{ 'is-dark': dark }"
        >
          {{ tagline }}
        </span>
      </div>
    </div>

    <!-- a11y -->
    <span class="sr-only">{{ alt }}</span>
  </v-sheet>
</template>

<script setup lang="ts">
type LogoVariant = "default" | "logo-2" | "icon";

const props = withDefaults(
  defineProps<{
    height?: number | string;
    variant?: LogoVariant;
    alt?: string;
    /**
     * Optional icon override if you want to swap later
     * e.g. "lucide:clipboard-check", "mdi-clipboard-check-outline"
     */
    icon?: string;
    /**
     * Show small tagline under brand name (logo-2 only)
     */
    showTagline?: boolean;
    tagline?: string;
    /**
     * Dark mode: force white text + white icon
     * Useful when logo is rendered on dark surfaces
     */
    dark?: boolean;
  }>(),
  {
    height: 32,
    variant: "default",
    alt: "SB Questionnaire",
    icon: "lucide:clipboard-list",
    showTagline: false,
    tagline: "Questionnaire to Report Platform",
    dark: false,
  },
);

const icon = props.icon;

const iconSize = computed(() => {
  const h =
    typeof props.height === "string" ? Number(props.height) : props.height;
  const base = Number.isFinite(h) ? (h as number) : 32;
  return Math.max(28, Math.min(44, Math.round(base)));
});

/**
 * Tone rules:
 * - Light surfaces: tonal primary
 * - Dark surfaces: outlined + white icon for crisp contrast
 */
const toneColor = computed(() => (props.dark ? "transparent" : "primary"));
const toneVariant = computed(() => (props.dark ? "outlined" : "flat"));
const iconColor = computed(() => (props.dark ? "white" : undefined));
</script>

<style lang="scss" scoped>
.sbq-logo {
  line-height: 1;
}

.sbq-mark {
  border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
}

.brand-name {
  font-weight: 800;
  letter-spacing: -0.02em;
  font-size: 18px;
  color: rgb(var(--v-theme-on-surface));

  &.is-dark {
    color: #fff;
  }
}

.brand-tagline {
  margin-top: 2px;
  font-size: 12px;
  opacity: 0.78;
  color: rgb(var(--v-theme-on-surface));

  &.is-dark {
    color: rgba(255, 255, 255, 0.86);
  }
}

/* Screen-reader only */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  border: 0;
}
</style>
