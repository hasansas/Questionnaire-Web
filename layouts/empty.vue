<template>
  <v-app>
    <v-main class="sb-bg">
      <slot />
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
// This layout does not need a script block unless you have
// specific layout-level logic to run.
</script>

<style lang="scss" scoped>
.sb-bg {
  min-height: 100vh;
  background:
    radial-gradient(
      1200px 600px at 20% 10%,
      rgba(99, 102, 241, 0.14),
      transparent 55%
    ),
    radial-gradient(
      900px 520px at 85% 30%,
      rgba(16, 185, 129, 0.1),
      transparent 55%
    ),
    radial-gradient(
      900px 520px at 50% 95%,
      rgba(245, 158, 11, 0.1),
      transparent 55%
    ),
    linear-gradient(
      180deg,
      rgba(255, 255, 255, 1) 0%,
      rgba(249, 250, 251, 1) 100%
    );
}
</style>
