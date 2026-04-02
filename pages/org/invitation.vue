<template>
  <v-app>
    <div class="org-invite-bg">
      <v-main class="org-invite-main">
        <v-container class="main-container">
          <v-card
            v-if="!pageLoading"
            rounded="xl"
            class="org-invite-card mx-auto"
            elevation="0"
            width="600"
          >
            <v-card-text class="pa-8 pa-sm-10">
              <!-- Page Error -->
              <div v-if="pageError">
                <div class="d-flex flex-column align-center text-center">
                  <v-avatar
                    rounded="xl"
                    size="64"
                    class="org-invite-avatar mb-5"
                    color="error"
                    variant="tonal"
                  >
                    <v-icon icon="lucide:triangle-alert" size="30" />
                  </v-avatar>

                  <v-chip
                    size="small"
                    rounded="lg"
                    variant="tonal"
                    color="error"
                    class="org-invite-chip mb-3"
                  >
                    Invitation Error
                  </v-chip>

                  <h1 class="text-h5 text-sm-h4 font-weight-black mb-2">
                    Invitation unavailable
                  </h1>

                  <p
                    class="text-body-2 text-sm-body-1 text-medium-emphasis mb-0"
                  >
                    {{ pageError }}
                  </p>
                </div>
              </div>

              <!-- Success -->
              <div v-else-if="acceptSuccess">
                <div class="d-flex flex-column align-center text-center">
                  <v-avatar
                    rounded="xl"
                    size="64"
                    class="org-invite-avatar mb-5"
                    color="success"
                    variant="tonal"
                  >
                    <v-icon icon="lucide:badge-check" size="30" />
                  </v-avatar>

                  <v-chip
                    size="small"
                    rounded="lg"
                    variant="tonal"
                    color="success"
                    class="org-invite-chip mb-3"
                  >
                    Invitation Accepted
                  </v-chip>

                  <h1 class="text-h5 text-sm-h4 font-weight-black mb-2">
                    Welcome to {{ invitationDetail?.organization?.name }}
                  </h1>

                  <p
                    class="text-body-2 text-sm-body-1 text-medium-emphasis mb-0"
                  >
                    Your invitation has been accepted successfully. You can now
                    sign in and access your organization account.
                  </p>
                </div>

                <v-divider class="my-7" />

                <div class="d-flex flex-wrap justify-center ga-3">
                  <v-btn rounded color="primary" size="large" :to="loginRoute">
                    <v-icon icon="lucide:log-in" class="mr-2" />
                    Go to Login
                  </v-btn>

                  <v-btn
                    rounded
                    variant="outlined"
                    size="large"
                    @click="resetForm"
                  >
                    <v-icon icon="lucide:rotate-ccw" class="mr-2" />
                    Reset Form
                  </v-btn>
                </div>
              </div>

              <!-- Data -->
              <div v-else-if="invitationDetail">
                <!-- Header -->
                <div class="d-flex flex-column align-center text-center">
                  <v-avatar
                    rounded="xl"
                    size="64"
                    class="org-invite-avatar mb-5"
                    color="primary"
                    variant="tonal"
                  >
                    <template v-if="organizationImage">
                      <v-img :src="organizationImage" cover />
                    </template>
                    <template v-else>
                      <v-icon icon="lucide:building-2" size="30" />
                    </template>
                  </v-avatar>

                  <v-chip
                    size="small"
                    rounded="lg"
                    variant="tonal"
                    class="org-invite-chip mb-3"
                  >
                    Organization Invitation
                  </v-chip>

                  <h1 class="text-h5 text-sm-h4 font-weight-black mb-2">
                    Join {{ invitationDetail.organization.name }}
                  </h1>

                  <p
                    class="text-body-2 text-sm-body-1 text-medium-emphasis mb-0"
                  >
                    You were invited to join this organization. Create your
                    password below to activate your account.
                  </p>
                </div>

                <v-divider class="my-7" />

                <!-- Summary -->
                <div class="org-invite-meta mb-6">
                  <div class="text-caption text-medium-emphasis mb-3">
                    Invitation Details
                  </div>

                  <div class="d-flex flex-column ga-2 text-body-2">
                    <div class="d-flex flex-wrap ga-2">
                      <span class="text-medium-emphasis">Organization:</span>
                      <span class="font-weight-medium">
                        {{ invitationDetail.organization.name }}
                      </span>
                    </div>

                    <div class="d-flex flex-wrap ga-2">
                      <span class="text-medium-emphasis">Code:</span>
                      <span class="font-weight-medium">
                        {{ invitationDetail.organization.code || "-" }}
                      </span>
                    </div>

                    <div class="d-flex flex-wrap ga-2">
                      <span class="text-medium-emphasis">Invited user:</span>
                      <span class="font-weight-medium">
                        {{ invitationDetail.invitedUser.name || "-" }}
                      </span>
                    </div>

                    <div class="d-flex flex-wrap ga-2">
                      <span class="text-medium-emphasis">Email:</span>
                      <span class="font-weight-medium">
                        {{ invitationDetail.invitedUser.email || "-" }}
                      </span>
                    </div>

                    <div class="d-flex flex-wrap ga-2">
                      <span class="text-medium-emphasis">Category:</span>
                      <span class="font-weight-medium">
                        {{ formatText(invitationDetail.organization.category) }}
                      </span>
                    </div>

                    <div class="d-flex flex-wrap ga-2">
                      <span class="text-medium-emphasis">Expires at:</span>
                      <span class="font-weight-medium">
                        {{ formattedExpiresAt }}
                      </span>
                    </div>
                  </div>
                </div>

                <!-- Submit Error -->
                <v-alert
                  v-if="submitError"
                  type="error"
                  variant="tonal"
                  rounded="lg"
                  class="mb-4"
                >
                  {{ submitError }}
                </v-alert>

                <!-- Form -->
                <v-form
                  ref="formRef"
                  v-model="isFormValid"
                  @submit.prevent="handleSubmit"
                >
                  <v-text-field
                    v-model="password"
                    label="Password"
                    placeholder="Enter your password"
                    :type="showPassword ? 'text' : 'password'"
                    :append-inner-icon="
                      showPassword ? 'mdi-eye-off' : 'mdi-eye'
                    "
                    variant="outlined"
                    rounded="lg"
                    density="comfortable"
                    :rules="passwordRules"
                    autocomplete="new-password"
                    class="mb-3"
                    @click:append-inner="showPassword = !showPassword"
                  />

                  <v-text-field
                    v-model="confirmPassword"
                    label="Confirm Password"
                    placeholder="Re-enter your password"
                    :type="showConfirmPassword ? 'text' : 'password'"
                    :append-inner-icon="
                      showConfirmPassword ? 'mdi-eye-off' : 'mdi-eye'
                    "
                    variant="outlined"
                    rounded="lg"
                    density="comfortable"
                    :rules="confirmPasswordRules"
                    autocomplete="new-password"
                    class="mb-1"
                    @click:append-inner="
                      showConfirmPassword = !showConfirmPassword
                    "
                  />

                  <div class="text-caption text-medium-emphasis mb-6">
                    Use at least 8 characters and include uppercase, lowercase,
                    number, and symbol for stronger security.
                  </div>

                  <div class="d-flex flex-wrap justify-center ga-3">
                    <v-btn
                      type="submit"
                      rounded
                      color="primary"
                      size="large"
                      :loading="submitLoading"
                      :disabled="!canSubmit"
                    >
                      <v-icon icon="lucide:user-check" class="mr-2" />
                      Accept Invitation
                    </v-btn>

                    <v-btn
                      rounded
                      variant="outlined"
                      size="large"
                      :disabled="submitLoading"
                      @click="resetForm"
                    >
                      <v-icon icon="lucide:rotate-ccw" class="mr-2" />
                      Reset
                    </v-btn>
                  </div>
                </v-form>
              </div>

              <!-- Empty -->
              <div v-else>
                <div class="d-flex flex-column align-center text-center">
                  <v-avatar
                    rounded="xl"
                    size="64"
                    class="org-invite-avatar mb-5"
                    color="warning"
                    variant="tonal"
                  >
                    <v-icon icon="lucide:mail-warning" size="30" />
                  </v-avatar>

                  <v-chip
                    size="small"
                    rounded="lg"
                    variant="tonal"
                    color="warning"
                    class="org-invite-chip mb-3"
                  >
                    No Invitation Data
                  </v-chip>

                  <h1 class="text-h5 text-sm-h4 font-weight-black mb-2">
                    Invitation not found
                  </h1>

                  <p
                    class="text-body-2 text-sm-body-1 text-medium-emphasis mb-0"
                  >
                    Invitation data is not available.
                  </p>
                </div>
              </div>
            </v-card-text>
          </v-card>
        </v-container>
      </v-main>
    </div>
  </v-app>
</template>

<script setup lang="ts">
import type { VForm } from "vuetify/components";
import {
  useOrganizationInvitationStore,
  type OrganizationInvitationDetail,
} from "~/stores/organization-invitation";

definePageMeta({
  layout: false,
});

const route = useRoute();
const invitationStore = useOrganizationInvitationStore();

const formRef = ref<VForm | null>(null);

const pageLoading = ref(true);
const pageError = ref("");
const submitLoading = ref(false);
const submitError = ref("");
const acceptSuccess = ref(false);

const isFormValid = ref(false);

const password = ref("");
const confirmPassword = ref("");

const showPassword = ref(false);
const showConfirmPassword = ref(false);

const invitationDetail = ref<OrganizationInvitationDetail | null>(null);

const currentYear = new Date().getFullYear();

/**
 * Normalize query param into string
 */
function normalizeQueryParam(value: unknown): string {
  if (Array.isArray(value)) {
    return String(value[0] || "").trim();
  }

  return String(value || "").trim();
}

const orgId = computed<string>(() => normalizeQueryParam(route.query.orgId));
const token = computed<string>(() => normalizeQueryParam(route.query.token));

const hasRequiredQuery = computed<boolean>(() => {
  return !!orgId.value && !!token.value;
});

const loginRoute = computed<string>(() => "/auth/login");

const organizationImage = computed<string>(() => {
  return invitationDetail.value?.organization?.image || "";
});

const formattedExpiresAt = computed<string>(() => {
  const value = invitationDetail.value?.invitation?.expiresAt;
  if (!value) return "-";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("en-ID", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
});

const passwordRules = [
  (value: string) => !!value || "Password is required.",
  (value: string) =>
    value.length >= 8 || "Password must be at least 8 characters.",
  (value: string) =>
    /[A-Z]/.test(value) || "Password must contain at least 1 uppercase letter.",
  (value: string) =>
    /[a-z]/.test(value) || "Password must contain at least 1 lowercase letter.",
  (value: string) =>
    /[0-9]/.test(value) || "Password must contain at least 1 number.",
  (value: string) =>
    /[^A-Za-z0-9]/.test(value) || "Password must contain at least 1 symbol.",
];

const confirmPasswordRules = [
  (value: string) => !!value || "Confirm password is required.",
  (value: string) =>
    value === password.value || "Confirm password does not match.",
];

const canSubmit = computed<boolean>(() => {
  return (
    !!password.value &&
    !!confirmPassword.value &&
    password.value === confirmPassword.value &&
    password.value.length >= 8
  );
});

/**
 * Format simple text
 */
function formatText(value?: string | null): string {
  if (!value) return "-";

  return value
    .replace(/[_-]/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

/**
 * Extract friendly error message
 */
function getErrorMessage(source: any, fallback: string): string {
  return (
    source?.error?.message ||
    source?.message ||
    source?.data?.message ||
    source?.data?.error?.message ||
    fallback
  );
}

/**
 * Reset form state
 */
function resetForm(): void {
  password.value = "";
  confirmPassword.value = "";
  submitError.value = "";
  formRef.value?.resetValidation();
}

/**
 * Load invitation detail first
 */
async function initPage(): Promise<void> {
  try {
    pageLoading.value = true;
    pageError.value = "";
    submitError.value = "";
    acceptSuccess.value = false;
    invitationDetail.value = null;

    if (!hasRequiredQuery.value) {
      pageError.value =
        "Invitation link is incomplete. Missing organization ID or invitation token.";
      return;
    }

    const res = await invitationStore.getInvitationDetail(
      orgId.value,
      token.value,
    );

    if (!res.success || !res.data) {
      pageError.value = getErrorMessage(res, "Failed to verify invitation.");
      return;
    }

    invitationDetail.value = res.data;
  } catch (error: any) {
    pageError.value = getErrorMessage(
      error,
      "Failed to load invitation detail.",
    );
  } finally {
    pageLoading.value = false;
  }
}

/**
 * Handle accept invitation submit
 */
async function handleSubmit(): Promise<void> {
  try {
    submitError.value = "";

    const validation = await formRef.value?.validate();
    if (!validation?.valid) return;

    if (!hasRequiredQuery.value) {
      submitError.value =
        "Invitation link is incomplete. Please reopen the invitation link.";
      return;
    }

    submitLoading.value = true;

    const res = await invitationStore.acceptInvitation({
      orgId: orgId.value,
      token: token.value,
      password: password.value,
    });

    if (!res.success) {
      submitError.value = getErrorMessage(res, "Failed to accept invitation.");
      return;
    }

    acceptSuccess.value = true;
    submitError.value = "";
  } catch (error: any) {
    submitError.value = getErrorMessage(
      error,
      "Something went wrong while accepting the invitation.",
    );
  } finally {
    submitLoading.value = false;
  }
}

onMounted(() => {
  initPage();
});
</script>

<style scoped>
.org-invite-bg {
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

.org-invite-main {
  min-height: 100vh;
  display: flex;
  align-items: center;
}

.org-invite-shell {
  width: 100%;
  max-width: 960px;
}

.org-invite-card {
  border: 1px solid rgba(17, 24, 39, 0.08);
  box-shadow:
    0 10px 30px rgba(17, 24, 39, 0.06),
    0 1px 0 rgba(17, 24, 39, 0.02);
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(8px);
}

.org-invite-avatar {
  border: 1px solid rgba(17, 24, 39, 0.06);
}

.org-invite-chip {
  font-weight: 700;
  letter-spacing: 0.2px;
}

.org-invite-meta {
  padding: 16px 18px;
  border-radius: 14px;
  border: 1px dashed rgba(17, 24, 39, 0.14);
  background: rgba(249, 250, 251, 0.7);
}
</style>
