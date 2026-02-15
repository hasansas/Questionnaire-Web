<template>
  <v-app>
    <v-app-bar v-if="isMobile" app color="white" height="72" flat>
      <v-btn icon variant="text" to="/auth/login">
        <v-icon icon="lucide:arrow-left" size="24"></v-icon>
      </v-btn>
      <v-toolbar-title class="font-weight-bold"> Register </v-toolbar-title>
    </v-app-bar>
    <v-main
      :class="[
        'd-flex align-center justify-center',
        isMobile ? 'bg-white' : '',
      ]"
    >
      <v-card
        flat
        :width="isMobile ? '100%' : '400'"
        :class="['pa-8', !isMobile ? 'superbazi-card' : '']"
      >
        <div class="d-flex flex-column align-center mb-8">
          <NuxtLink v-if="!isMobile" to="/" class="brand-logo mt-4 mb-8">
            <SuperBaziLogo variant="logo-2" height="72" />
          </NuxtLink>

          <v-card-title class="text-h5 font-weight-bold pa-0 mb-2">
            {{
              step === "register"
                ? "Create your account"
                : "Verify your account"
            }}
          </v-card-title>

          <div class="text-center text-caption text-medium-emphasis">
            <span v-if="step === 'register'">
              Sign up to start exploring SuperBazi.
            </span>

            <span v-else>
              Please confirm your registration with the verification code sent
              to
              {{ registeredEmail }}.
            </span>

            <v-alert
              v-if="step === 'otp'"
              type="info"
              variant="tonal"
              density="compact"
              rounded="lg"
              icon="lucide:info"
              class="mt-3 otp-hint"
            >
              Didn’t receive it? Check your Spam/Junk folder (and Promotions),
              then try again.
            </v-alert>
          </div>
        </div>

        <!-- Step 1: Registration Form -->
        <v-form
          v-if="step === 'register'"
          ref="registerForm"
          v-model="formValid"
          @submit.prevent="handleRegister"
        >
          <!-- Full Name -->
          <v-text-field
            rounded
            v-model="name"
            label="Full Name"
            placeholder="Enter your full name"
            density="comfortable"
            variant="outlined"
            class="mb-4"
            :rules="[rules.required, rules.min(3)]"
            hide-details="auto"
            required
            :disabled="loading"
          >
            <template v-slot:prepend-inner>
              <v-icon icon="lucide:user" size="20" class="mx-2" />
            </template>
          </v-text-field>

          <!-- Email -->
          <v-text-field
            rounded
            v-model="email"
            label="Email"
            placeholder="Enter your email address"
            density="comfortable"
            variant="outlined"
            class="mb-4"
            :rules="[rules.required, rules.email]"
            hide-details="auto"
            required
            :disabled="loading"
          >
            <template v-slot:prepend-inner>
              <v-icon icon="lucide:at-sign" size="20" class="mx-2" />
            </template>
          </v-text-field>

          <!-- Password -->
          <v-text-field
            rounded
            v-model="password"
            label="Password"
            placeholder="Create a password"
            :type="showPassword ? 'text' : 'password'"
            density="comfortable"
            variant="outlined"
            :append-inner-icon="showPassword ? 'lucide:eye' : 'lucide:eye-off'"
            @click:append-inner="showPassword = !showPassword"
            class="mb-4"
            :rules="[rules.required, rules.min(6)]"
            hide-details="auto"
            required
            :disabled="loading"
          >
            <template v-slot:prepend-inner>
              <v-icon icon="lucide:lock" size="20" class="mx-2" />
            </template>
          </v-text-field>

          <!-- Retype Password -->
          <v-text-field
            rounded
            v-model="retypePassword"
            label="Retype Password"
            placeholder="Confirm your password"
            :type="showRetypePassword ? 'text' : 'password'"
            density="comfortable"
            variant="outlined"
            :append-inner-icon="
              showRetypePassword ? 'lucide:eye' : 'lucide:eye-off'
            "
            @click:append-inner="showRetypePassword = !showRetypePassword"
            class="mb-4"
            :rules="[rules.required, rules.passwordMatch]"
            hide-details="auto"
            required
            :disabled="loading"
          >
            <template v-slot:prepend-inner>
              <v-icon icon="lucide:lock" size="20" class="mx-2" />
            </template>
          </v-text-field>

          <!-- Location -->
          <LocationInputDialog
            v-model="location"
            label="Your Location"
            placeholder="Select your location"
            @change="(loc) => onLocationChange(loc)"
            class="mb-4"
          />

          <!-- Agreement -->
          <v-checkbox
            v-model="agree"
            density="comfortable"
            hide-details="auto"
            class="mb-4"
            :disabled="loading"
            :rules="[rules.agree]"
          >
            <template #label>
              <span class="text-body-2 text-medium-emphasis ml-4">
                I agree to the
                <NuxtLink
                  to="/terms"
                  class="text-primary text-decoration-none font-weight-medium"
                  target="_blank"
                >
                  Terms of Service
                </NuxtLink>
                and
                <NuxtLink
                  to="/policy"
                  class="text-primary text-decoration-none font-weight-medium"
                  target="_blank"
                >
                  Privacy Policy
                </NuxtLink>
                .
              </span>
            </template>
          </v-checkbox>

          <!-- Error Message -->
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

          <!-- Submit Button -->
          <v-btn
            rounded
            color="primary"
            variant="flat"
            block
            size="large"
            type="submit"
            :disabled="loading || !agree"
            :loading="loading"
            class="mb-4"
          >
            Register
          </v-btn>

          <!-- Footer -->
          <div class="text-center text-caption text-medium-emphasis">
            Already have an account?
            <NuxtLink
              to="/auth/login"
              class="text-primary text-decoration-none"
            >
              Sign in
            </NuxtLink>
          </div>
        </v-form>

        <!-- Step 2: OTP Confirmation -->
        <v-form v-else @submit.prevent="confirmRegistration">
          <div class="text-center">
            <p class="text-medium-emphasis">
              Please enter the 6-digit code below to verify your account.
            </p>
          </div>

          <v-otp-input
            v-model="otpCode"
            length="6"
            type="number"
            class="justify-center"
            :disabled="loading"
          />
          <v-alert
            v-if="otpError"
            variant="tonal"
            border="start"
            icon="ri-alert-line"
            color="red"
            class="mb-4"
          >
            {{ otpError }}
          </v-alert>

          <v-btn
            rounded
            variant="flat"
            block
            size="large"
            type="submit"
            color="primary"
            class="mt-4"
            :loading="loading"
            :disabled="otpCode.length < 6"
          >
            Verify
          </v-btn>

          <!-- <div class="text-center mt-4 text-caption text-medium-emphasis">
          Didn’t receive the code?
          <v-btn variant="text" size="small" color="primary" @click="resendOtp">
            Resend
          </v-btn>
        </div> -->
        </v-form>
      </v-card>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { useAuthStore } from "~/stores/auth";
const { isMobile } = useIsMobile();

definePageMeta({
  layout: "empty",
});

const auth = useAuthStore();
const api = useApiService();

const step = ref<"register" | "otp">("register");
const name = ref("");
const email = ref("");
const password = ref("");
const retypePassword = ref("");
const showPassword = ref(false);
const showRetypePassword = ref(false);
const countryId = ref<number | null>(null);
const stateId = ref<number | null>(null);
const cityId = ref<number | null>(null);
const location = ref("");
const agree = ref(false);
const loading = ref(false);
const successMessage = ref<string | null>(null);
const errorMessage = ref<string | null>(null);

const formValid = ref(true);
const registerForm = ref<HTMLFormElement | null>(null);

const rules = {
  required: (v: string) => !!v || "Field is required",
  email: (v: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || "Enter a valid email address",
  min: (len: number) => (v: string) =>
    (v && v.length >= len) || `Minimum ${len} characters required`,
  passwordMatch: (v: string) =>
    v === password.value || "Passwords do not match",
  agree: (v: boolean) => v || "Please accept the Terms and Privacy Policy",
};

// OTP step
const otpCode = ref("");
const otpError = ref("");
const registeredEmail = ref("");

// location handler
function onLocationChange(loc: any) {
  countryId.value = loc.country?.id;
  stateId.value = loc.state?.id;
  cityId.value = loc.city?.id;
}

/** Step 1: Handle Registration */
async function handleRegister() {
  const form = registerForm.value;
  if (!form) return;

  const { valid } = await form.validate();
  if (!valid) return;

  if (!agree.value) {
    errorMessage.value =
      "Please accept the Terms and Privacy Policy to continue.";
    return;
  }

  loading.value = true;
  errorMessage.value = null;
  successMessage.value = null;

  const res: ApiResult = await auth.register({
    name: name.value,
    email: email.value,
    password: password.value,
    countryId: countryId.value,
    stateId: stateId.value,
    cityId: cityId.value,
  });

  loading.value = false;

  if (!res.success) {
    errorMessage.value =
      typeof res.error === "object"
        ? res.error.message || "Registration failed."
        : String(res.error);
    return;
  }

  // Move to OTP step
  registeredEmail.value =
    (res.data as any)?.verification?.sendTo || email.value;
  step.value = "otp";
  successMessage.value = "Verification code sent successfully.";
}

/** Step 2: Confirm OTP and auto-login using same credentials */
async function confirmRegistration() {
  loading.value = true;
  otpError.value = "";

  try {
    // Confirm OTP with backend
    const res: ApiResult = await api.post("/v1/auth/register/confirm", {
      identifier: registeredEmail.value,
      code: otpCode.value,
    });

    if (!res.success) {
      loading.value = false;
      otpError.value =
        typeof res.error === "object"
          ? res.error.message || "Invalid code."
          : String(res.error);
      return;
    }

    // OTP verified — now log user in with email/password
    successMessage.value = "Account verified! Logging you in...";

    const loginRes = await auth.login({
      identifier: registeredEmail.value,
      password: password.value, // use same password entered during registration
    });

    if (!loginRes.success) {
      loading.value = false;
      successMessage.value = null;
      otpError.value =
        "Verification succeeded, but auto-login failed. Please sign in manually.";
      setTimeout(() => navigateTo("auth//login"), 2000);
      return;
    }

    // Fully logged in — redirect to dashboard
    navigateTo("/dashboard");
  } catch (err: any) {
    loading.value = false;
    otpError.value = err.message || "Verification failed.";
  }
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
