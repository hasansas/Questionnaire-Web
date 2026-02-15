<template>
  <v-app>
    <v-main class="sb-auth-main">
      <v-card v-if="isMobile" flat color="transparent" class="flex-grow-1">
        <v-card
          flat
          color="transparent"
          class="d-flex align-center justify-center"
          height="100%"
        >
          <NuxtLink to="/">
            <SuperBaziLogo variant="logo-2" height="72" />
          </NuxtLink>
        </v-card>
      </v-card>

      <v-card
        flat
        :width="isMobile ? '100%' : '440'"
        class="pa-8 superbazi-card"
        :rounded="isMobile ? 't-xl b-0' : ''"
      >
        <div class="d-flex flex-column align-center mb-8">
          <NuxtLink v-if="!isMobile" to="/" class="brand-logo mt-4 mb-8">
            <SuperBaziLogo variant="logo-2" height="72" />
          </NuxtLink>

          <v-card-title class="text-h5 font-weight-bold pa-0 mb-2">
            Password reset
          </v-card-title>

          <v-card-subtitle class="text-center text-medium-emphasis">
            Confirm your reset request to continue.
          </v-card-subtitle>
        </div>

        <!-- Invalid / Missing code -->
        <v-alert
          v-if="!verificationCode"
          variant="tonal"
          border="start"
          color="red"
          icon="ri-alert-line"
          class="mb-4"
        >
          Reset code is missing or invalid.
        </v-alert>

        <!-- Success state -->
        <div v-else-if="success" class="text-center">
          <v-avatar
            size="56"
            rounded="xl"
            color="success"
            variant="tonal"
            class="mb-4"
          >
            <v-icon icon="lucide:check" size="26" />
          </v-avatar>

          <div class="text-h6 font-weight-black mb-2">Reset confirmed</div>
          <div class="text-body-2 text-medium-emphasis mb-4">
            Your password reset request has been verified. You can now log in.
          </div>

          <!-- ✅ Add here -->
          <div
            class="d-flex align-center justify-center ga-2 text-caption text-medium-emphasis mb-6"
          >
            <v-icon icon="lucide:info" size="16" />
            <span>Please check your email inbox or spam folder.</span>
          </div>

          <v-btn rounded color="primary" size="large" block to="/auth/login">
            Go to login
          </v-btn>
        </div>

        <!-- Action state -->
        <v-form
          v-else
          ref="formRef"
          v-model="formValid"
          @submit.prevent="handleReset"
        >
          <v-alert
            v-if="errorMessage"
            variant="tonal"
            border="start"
            color="red"
            icon="ri-alert-line"
            class="mb-4"
          >
            {{ errorMessage }}
          </v-alert>

          <v-btn
            rounded
            color="primary"
            variant="flat"
            block
            size="large"
            type="submit"
            :loading="loading"
            :disabled="!verificationCode"
            class="mb-4"
          >
            Confirm reset
          </v-btn>

          <div class="text-center text-caption text-medium-emphasis">
            Changed your mind?
            <NuxtLink
              to="/auth/login"
              class="text-primary text-decoration-none"
            >
              Back to login
            </NuxtLink>
          </div>
        </v-form>
      </v-card>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { useAuthStore } from "@/stores/auth";

definePageMeta({ layout: "empty" });

// defineI18nRoute({
//   paths: {
//     en: "/auth/reset-password/:code",
//     id: "/auth/reset-password/:code",
//   },
// });

const { isMobile } = useIsMobile();
const auth = useAuthStore();

const route = useRoute();
const verificationCode = computed(
  () => String(route.params.code || "").trim() || null
);

const loading = ref(false);
const success = ref(false);
const errorMessage = ref<string | null>(null);

const formValid = ref(true);
const formRef = ref<any>(null);

async function handleReset() {
  if (!verificationCode.value) return;

  loading.value = true;
  errorMessage.value = null;

  const res: ApiResult = await auth.resetPassword({
    verificationCode: verificationCode.value,
  });

  if (!res.success) {
    loading.value = false;
    errorMessage.value =
      typeof res.error === "object"
        ? res.error.message || "Reset password failed."
        : String(res.error);
    return;
  }

  success.value = true;
  loading.value = false;
}
</script>

<style scoped>
.sb-auth-main {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 24px;
}

.brand-logo {
  height: 100%;
  width: auto;
}
</style>
