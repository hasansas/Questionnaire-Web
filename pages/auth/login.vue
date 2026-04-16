<template>
  <v-app>
    <v-main class="auth-main">
      <div class="auth-layout">
        <!-- Left: brand panel (desktop only) -->
        <div class="auth-brand">
          <div class="auth-brand__inner">
            <NuxtLink to="/" class="brand-link mb-10">
              <AppLogo variant="logo-2" :height="36" dark />
            </NuxtLink>

            <h2 class="text-h4 font-weight-black text-white mb-3 auth-headline">
              Manage your questionnaires with confidence.
            </h2>
            <p class="text-body-1 auth-subline mb-10">
              One platform for building, publishing, and analyzing questionnaire results across your team.
            </p>

            <div class="auth-features">
              <div
                v-for="item in features"
                :key="item.text"
                class="auth-feature-item"
              >
                <v-avatar
                  size="32"
                  class="feature-icon"
                >
                  <v-icon :icon="item.icon" size="16" color="white" />
                </v-avatar>
                <span class="text-body-2 text-white">{{ item.text }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Right: form panel -->
        <div class="auth-form-panel">
          <!-- Mobile logo -->
          <div class="auth-mobile-logo mb-6">
            <AppLogo variant="logo-2" :height="32" />
          </div>

          <div class="auth-form-wrap">
            <div class="mb-8">
              <h1 class="text-h5 font-weight-black mb-1">Welcome back</h1>
              <p class="text-body-2 text-medium-emphasis ma-0">
                Sign in to continue to your org console.
              </p>
            </div>

            <v-form ref="loginForm" v-model="formValid" @submit.prevent="handleLogin">
              <v-text-field
                v-model="email"
                label="Email"
                density="comfortable"
                variant="outlined"
                rounded="lg"
                class="mb-4"
                :rules="[rules.required, rules.email]"
                hide-details="auto"
                :disabled="loading"
                autocomplete="email"
              >
                <template #prepend-inner>
                  <v-icon icon="lucide:mail" size="18" class="me-1 text-medium-emphasis" />
                </template>
              </v-text-field>

              <v-text-field
                v-model="password"
                label="Password"
                :type="showPassword ? 'text' : 'password'"
                density="comfortable"
                variant="outlined"
                rounded="lg"
                :append-inner-icon="showPassword ? 'lucide:eye' : 'lucide:eye-off'"
                @click:append-inner="showPassword = !showPassword"
                class="mb-2"
                :rules="[rules.required, rules.min(6)]"
                hide-details="auto"
                :disabled="loading"
                autocomplete="current-password"
              >
                <template #prepend-inner>
                  <v-icon icon="lucide:lock" size="18" class="me-1 text-medium-emphasis" />
                </template>
              </v-text-field>

              <div class="d-flex justify-end mb-6">
                <NuxtLink
                  to="/auth/forgot-password"
                  class="text-caption text-primary text-decoration-none"
                >
                  Forgot password?
                </NuxtLink>
              </div>

              <v-alert
                v-if="errorMessage"
                variant="tonal"
                type="error"
                rounded="lg"
                class="mb-5"
                density="comfortable"
              >
                {{ errorMessage }}
              </v-alert>

              <v-btn
                color="primary"
                variant="flat"
                block
                size="large"
                rounded="lg"
                type="submit"
                :loading="loading"
              >
                Sign in
              </v-btn>
            </v-form>
          </div>
        </div>
      </div>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useAuthStore } from "@/stores/auth";

definePageMeta({ layout: "empty" });

defineI18nRoute({
  paths: {
    en: "/auth/login",
    id: "/auth/masuk",
  },
});

const auth = useAuthStore();

const email = ref("");
const password = ref("");
const loading = ref(false);
const showPassword = ref(false);
const errorMessage = ref<string | null>(null);
const formValid = ref(true);
const loginForm = ref<HTMLFormElement | null>(null);

const features = [
  { icon: "lucide:clipboard-list", text: "Publish and manage questionnaires" },
  { icon: "lucide:file-text", text: "Review submissions and reports" },
  { icon: "lucide:users", text: "Manage your team and members" },
];

const rules = {
  required: (v: string) => !!v || "Field is required",
  email: (v: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || "Enter a valid email address",
  min: (len: number) => (v: string) =>
    (v && v.length >= len) || `Minimum ${len} characters required`,
};

async function handleLogin(): Promise<void> {
  const form = loginForm.value as any;
  if (!form) return;

  const { valid } = await form.validate();
  if (!valid) return;

  loading.value = true;
  errorMessage.value = null;

  const result: ApiResult = await auth.login({
    identifier: email.value,
    password: password.value,
  });

  if (!result.success) {
    loading.value = false;
    errorMessage.value =
      typeof result.error === "object"
        ? result.error?.message || "Login failed."
        : String(result.error);
    return;
  }

  await navigateTo("/org");
}
</script>

<style lang="scss" scoped>
.auth-main {
  min-height: 100vh;
}

.auth-layout {
  display: flex;
  min-height: 100vh;
}

.auth-brand {
  display: none;

  @media (min-width: 960px) {
    display: flex;
    width: 44%;
    min-width: 380px;
    flex-shrink: 0;
    align-items: center;
    justify-content: center;
    padding: 56px 48px;
    background: linear-gradient(
      150deg,
      var(--color-primary) 0%,
      var(--color-primary-dark-2, #3730a3) 100%
    );
    position: relative;
    overflow: hidden;

    &::before,
    &::after {
      content: '';
      position: absolute;
      border-radius: 50%;
      pointer-events: none;
    }

    &::before {
      width: 480px;
      height: 480px;
      background: rgba(255, 255, 255, 0.045);
      top: -120px;
      right: -100px;
    }

    &::after {
      width: 320px;
      height: 320px;
      background: rgba(255, 255, 255, 0.055);
      bottom: -80px;
      left: -60px;
    }
  }
}

.auth-brand__inner {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 400px;
}

.brand-link {
  display: inline-flex;
  text-decoration: none !important;
}

.auth-headline {
  line-height: 1.2 !important;
}

.auth-subline {
  color: rgba(255, 255, 255, 0.7) !important;
}

.auth-features {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.auth-feature-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.feature-icon {
  flex-shrink: 0;
  background: rgba(255, 255, 255, 0.14) !important;
  border: 1px solid rgba(255, 255, 255, 0.2) !important;
}

.auth-form-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 24px;
  background: #fff;
}

.auth-mobile-logo {
  display: flex;

  @media (min-width: 960px) {
    display: none;
  }
}

.auth-form-wrap {
  width: 100%;
  max-width: 400px;
}
</style>
