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
      <BaseAppBar />
      <v-main>
        <slot />
      </v-main>
      <BaseFooter />
    </template>
  </v-app>
</template>

<script setup lang="ts">
const hydrated = ref(false);

onMounted(() => {
  hydrated.value = true;
});
</script>
