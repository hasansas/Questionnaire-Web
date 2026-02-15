<template>
  <v-app>
    <v-main
      class="d-flex flex-column align-center justify-center"
      height="100vh"
    >
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
        :width="isMobile ? '100%' : '400'"
        class="pa-8 superbazi-card"
        :rounded="isMobile ? 't-xl b-0' : ''"
      >
        <div class="d-flex flex-column align-center mb-8">
          <NuxtLink v-if="!isMobile" to="/" class="brand-logo mt-4 mb-8">
            <SuperBaziLogo variant="logo-2" height="72" />
          </NuxtLink>

          <v-card-title class="text-h5 font-weight-bold pa-0 mb-2">
            Welcome back
          </v-card-title>
          <v-card-subtitle class="text-center text-medium-emphasis">
            Sign in to continue to your dashboard.
          </v-card-subtitle>
        </div>

        <v-form
          ref="loginForm"
          v-model="formValid"
          @submit.prevent="handleLogin"
        >
          <v-text-field
            rounded
            v-model="email"
            label="Email"
            density="comfortable"
            variant="outlined"
            class="mb-4"
            :rules="[rules.required, rules.email]"
            hide-details="auto"
            required
            :disabled="loading"
          >
            <template v-slot:prepend-inner>
              <v-icon icon="lucide:mail" size="20" class="mx-2" />
            </template>
          </v-text-field>

          <v-text-field
            rounded
            v-model="password"
            label="Password"
            :type="showPassword ? 'text' : 'password'"
            density="comfortable"
            variant="outlined"
            :append-inner-icon="showPassword ? 'lucide:eye' : 'lucide:eye-off'"
            @click:append-inner="showPassword = !showPassword"
            class="mb-2"
            :rules="[rules.required, rules.min(6)]"
            hide-details="auto"
            required
            :disabled="loading"
          >
            <template v-slot:prepend-inner>
              <v-icon icon="lucide:lock" size="20" class="mx-2" />
            </template>
          </v-text-field>

          <div class="d-flex justify-end mb-4">
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
            Login
          </v-btn>
        </v-form>

        <div class="text-center text-caption text-medium-emphasis">
          Don't have an account?
          <NuxtLink
            to="/auth/register"
            class="text-primary text-decoration-none"
          >
            Sign up
          </NuxtLink>
        </div>
      </v-card>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { useAuthStore } from "@/stores/auth";
definePageMeta({
  layout: "empty",
});

defineI18nRoute({
  paths: {
    en: "/auth/login",
    id: "/auth/masuk",
  },
});

const { isMobile } = useIsMobile();

const auth = useAuthStore();
const email = ref("");
const password = ref("");
const loading = ref(false);
const showPassword = ref(false);
const errorMessage = ref<string | null>(null);
const formValid = ref(true);
const loginForm = ref<HTMLFormElement | null>(null);

const rules = {
  required: (v: string) => !!v || "Field is required",
  email: (v: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || "Enter a valid email address",
  min: (len: number) => (v: string) =>
    (v && v.length >= len) || `Minimum ${len} characters required`,
};

async function handleLogin() {
  const form = loginForm.value;
  if (!form) return;

  const { valid } = await form.validate();
  if (!valid) return;

  loading.value = true;
  errorMessage.value = null;

  const fetchLogin: ApiResult = await auth.login({
    identifier: email.value,
    password: password.value,
  });

  if (!fetchLogin.success) {
    loading.value = false;
    errorMessage.value =
      typeof fetchLogin.error === "object"
        ? fetchLogin.error.message || "Login failed."
        : String(fetchLogin.error);
    return;
  }

  await navigateTo("/dashboard");
}
</script>

<style scoped>
.brand-logo-container {
  height: 32px;
}
.brand-logo {
  height: 100%;
  width: auto;
}
</style>
