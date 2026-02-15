<template>
  <v-app>
    <div class="sb-error-bg">
      <v-main class="sb-error-main">
        <v-container class="sb-error-shell">
          <v-card rounded="xl" class="sb-error-card" elevation="0">
            <v-card-text class="pa-8 pa-sm-10">
              <!-- Header -->
              <div class="d-flex flex-column align-center text-center">
                <v-avatar
                  rounded="xl"
                  size="64"
                  class="sb-error-avatar mb-5"
                  color="primary"
                  variant="tonal"
                >
                  <v-icon :icon="icon" size="30" />
                </v-avatar>

                <v-chip
                  size="small"
                  rounded="lg"
                  variant="tonal"
                  class="sb-error-chip mb-3"
                >
                  {{ statusCode }} · {{ statusLabel }}
                </v-chip>

                <h1 class="text-h5 text-sm-h4 font-weight-black mb-2">
                  {{ title }}
                </h1>

                <p class="text-body-2 text-sm-body-1 text-medium-emphasis mb-0">
                  {{ description }}
                </p>
              </div>

              <v-divider class="my-7" />

              <!-- Actions -->
              <div class="d-flex flex-wrap justify-center ga-3">
                <v-btn rounded color="primary" size="large" @click="goHome">
                  <v-icon icon="lucide:home" class="mr-2" />
                  Go to Home
                </v-btn>

                <v-btn rounded variant="outlined" size="large" @click="goBack">
                  <v-icon icon="lucide:arrow-left" class="mr-2" />
                  Go Back
                </v-btn>
              </div>

              <!-- Meta (optional, clean) -->
              <div v-if="showMeta" class="sb-error-meta mt-8 text-left">
                <div class="text-caption text-medium-emphasis mb-2">
                  Details
                </div>

                <div class="text-body-2">
                  <div v-if="errorUrl">
                    <span class="text-medium-emphasis">URL:</span>
                    <span class="ml-1 font-weight-medium">{{ errorUrl }}</span>
                  </div>

                  <div v-if="errorMessage">
                    <span class="text-medium-emphasis">Message:</span>
                    <span class="ml-1 font-weight-medium">{{
                      errorMessage
                    }}</span>
                  </div>
                </div>
              </div>
            </v-card-text>
          </v-card>

          <!-- Footer -->
          <div class="text-center mt-6">
            <div class="text-caption text-medium-emphasis">
              © {{ new Date().getFullYear() }} SuperBazi · Master Your Energy.
              Transform Your Life.
            </div>
          </div>
        </v-container>
      </v-main>
    </div>
  </v-app>
</template>

<script setup lang="ts">
const props = defineProps<{
  error: {
    statusCode?: number;
    statusMessage?: string;
    message?: string;
    url?: string;
    data?: any;
  };
}>();

const statusCode = computed(() => props.error?.statusCode ?? 500);
const is404 = computed(() => statusCode.value === 404);

const title = computed(() =>
  is404.value ? "Page not found" : "Something went wrong"
);
const description = computed(() => {
  if (is404.value) {
    return "The page you’re looking for doesn’t exist, or the link is outdated.";
  }
  return "We hit an unexpected issue. Please return to the homepage.";
});

const statusLabel = computed(() => (is404.value ? "Not Found" : "Error"));
const icon = computed(() =>
  is404.value ? "lucide:compass" : "lucide:triangle-alert"
);

const errorUrl = computed(() => props.error?.url ?? "");
const errorMessage = computed(
  () => props.error?.statusMessage || props.error?.message || ""
);
const showMeta = computed(() => !!errorUrl.value || !!errorMessage.value);

function goHome() {
  clearError({ redirect: "/" });
}

function goBack() {
  if (import.meta.client && window.history.length > 1) {
    window.history.back();
    return;
  }
  clearError({ redirect: "/" });
}
</script>

<style scoped>
.sb-error-bg {
  min-height: 100vh;
  background: radial-gradient(
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

/* ✅ true vertical center */
.sb-error-main {
  min-height: 100vh;
  display: flex;
  align-items: center;
}

.sb-error-shell {
  max-width: 880px;
}

.sb-error-card {
  border: 1px solid rgba(17, 24, 39, 0.08);
  box-shadow: 0 10px 30px rgba(17, 24, 39, 0.06), 0 1px 0 rgba(17, 24, 39, 0.02);
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(8px);
}

.sb-error-avatar {
  border: 1px solid rgba(17, 24, 39, 0.06);
}

.sb-error-chip {
  font-weight: 700;
  letter-spacing: 0.2px;
}

.sb-error-meta {
  padding: 14px 16px;
  border-radius: 14px;
  border: 1px dashed rgba(17, 24, 39, 0.14);
  background: rgba(249, 250, 251, 0.7);
}
</style>
