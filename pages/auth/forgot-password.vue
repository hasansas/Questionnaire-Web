<!-- /pages/auth/forgot-password.vue -->
<template>
  <v-app>
    <v-main class="sb-auth-main">
      <!-- Mobile logo block (matches your login pattern) -->
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
        :width="isMobile ? '100%' : '420'"
        class="pa-8 superbazi-card"
        :rounded="isMobile ? 't-xl b-0' : ''"
      >
        <div class="d-flex flex-column align-center mb-8">
          <NuxtLink v-if="!isMobile" to="/" class="brand-logo mt-4 mb-8">
            <SuperBaziLogo variant="logo-2" height="72" />
          </NuxtLink>

          <v-card-title class="text-h5 font-weight-bold pa-0 mb-2">
            Reset your password
          </v-card-title>
          <v-card-subtitle class="text-center text-medium-emphasis">
            Enter your email and we’ll send a reset link.
          </v-card-subtitle>
        </div>

        <!-- Success state -->
        <div v-if="success" class="text-center">
          <v-avatar
            size="56"
            rounded="xl"
            color="success"
            variant="tonal"
            class="mb-4"
          >
            <v-icon icon="lucide:check" size="26" />
          </v-avatar>

          <div class="text-h6 font-weight-black mb-2">Check your inbox</div>
          <div class="text-body-2 text-medium-emphasis mb-6">
            If an account exists for
            <span class="font-weight-bold">{{ email }}</span
            >, we’ve sent a password reset link.
          </div>
          <div
            class="d-flex align-center justify-center ga-2 text-caption text-medium-emphasis mb-6"
          >
            <v-icon icon="lucide:info" size="16" />
            <span>Didn’t see it? Check Spam or Promotions.</span>
          </div>

          <v-btn rounded color="primary" size="large" block to="/auth/login">
            Back to login
          </v-btn>

          <v-btn
            rounded
            variant="text"
            block
            class="mt-2"
            :disabled="loading || cooldown > 0"
            @click="resend"
          >
            Resend email
            <span
              v-if="cooldown > 0"
              class="ml-2 text-caption text-medium-emphasis"
            >
              ({{ cooldown }}s)
            </span>
          </v-btn>
        </div>

        <!-- Form -->
        <v-form
          v-else
          ref="formRef"
          v-model="formValid"
          @submit.prevent="handleSubmit"
        >
          <v-text-field
            rounded
            v-model="email"
            label="Email"
            placeholder="you@example.com"
            density="comfortable"
            variant="outlined"
            class="mb-4"
            :rules="[rules.required, rules.email]"
            hide-details="auto"
            required
            :disabled="loading"
          >
            <template #prepend-inner>
              <v-icon icon="lucide:mail" size="20" class="mx-2" />
            </template>
          </v-text-field>

          <v-alert
            v-if="errorMessage"
            variant="tonal"
            border="start"
            icon="ri-alert-line"
            color="red"
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
            class="mb-4"
          >
            Send reset link
          </v-btn>

          <div class="text-center text-caption text-medium-emphasis">
            Remember your password?
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
definePageMeta({ layout: "empty" });

defineI18nRoute({
  paths: {
    en: "/auth/forgot-password",
    id: "/auth/lupa-password",
  },
});

const { isMobile } = useIsMobile();
const auth = useAuthStore();
const config = useRuntimeConfig();

const email = ref("");
const loading = ref(false);
const formValid = ref(true);
const formRef = ref<any>(null);

const errorMessage = ref<string | null>(null);
const success = ref(false);

// simple resend cooldown (prevents spam clicks)
const cooldown = ref(0);
let cooldownTimer: any = null;

const rules = {
  required: (v: string) => !!v || "Field is required",
  email: (v: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || "Enter a valid email address",
};

const confirmationUrl = (config.public as any).APP_PUBLIC_BASE_URL;

async function handleSubmit() {
  const form = formRef.value;
  if (!form) return;

  const { valid } = await form.validate();
  if (!valid) return;

  loading.value = true;
  errorMessage.value = null;

  try {
    const res = await auth.forgotPassword({
      email: email.value,
      confirmationUrl: `${confirmationUrl}/auth/reset-password`,
    });

    if (!res.success) {
      errorMessage.value =
        typeof res.error === "object"
          ? res.error.message || "Failed to send reset link."
          : String(res.error);
      return;
    }

    success.value = true;
    startCooldown();
  } catch (err: any) {
    success.value = false;
    errorMessage.value =
      err?.data?.message ||
      err?.message ||
      "Failed to request password reset. Please try again.";
  } finally {
    loading.value = false;
  }
}

async function resend() {
  if (cooldown.value > 0 || loading.value) return;
  await handleSubmit();
}

function startCooldown() {
  cooldown.value = 30;
  if (cooldownTimer) clearInterval(cooldownTimer);
  cooldownTimer = setInterval(() => {
    cooldown.value -= 1;
    if (cooldown.value <= 0) {
      clearInterval(cooldownTimer);
      cooldownTimer = null;
      cooldown.value = 0;
    }
  }, 1000);
}

onBeforeUnmount(() => {
  if (cooldownTimer) clearInterval(cooldownTimer);
});
</script>

<style scoped>
/* vertical center + consistent spacing */
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
