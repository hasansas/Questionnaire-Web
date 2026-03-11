<template>
  <div>
    <section class="page-header">
      <v-container class="main-container">
        <!-- Loading -->
        <v-row v-if="uiState === 'loading'" align="center">
          <v-col cols="12" md="8">
            <v-skeleton-loader type="heading, text, text" />
          </v-col>
          <v-col cols="12" md="4">
            <v-card rounded="lg" variant="outlined" class="pa-6">
              <v-skeleton-loader type="text, text, text, actions" />
            </v-card>
          </v-col>
        </v-row>

        <!-- Error -->
        <v-card
          v-else-if="uiState === 'error'"
          rounded="lg"
          class="pa-16 my-16 text-center sb-card"
        >
          <v-avatar
            size="56"
            color="error"
            variant="tonal"
            class="mx-auto mb-3"
          >
            <v-icon icon="lucide:alert-circle" />
          </v-avatar>

          <div class="text-h6 font-weight-bold">
            Unable to load respondent form
          </div>

          <div
            class="text-body-2 text-medium-emphasis mt-2 mx-auto max-width-narrow"
          >
            {{
              combinedError ||
              "Something went wrong while loading the respondent information form. Please try again."
            }}
          </div>

          <div class="d-flex justify-center ga-3 flex-wrap mt-5">
            <v-btn color="primary" rounded="lg" @click="loadData">
              Try again
            </v-btn>

            <v-btn
              variant="outlined"
              rounded="lg"
              :to="localePath(`/q/${code}`)"
            >
              Back
            </v-btn>
          </div>
        </v-card>

        <!-- Empty -->
        <v-card
          v-else-if="uiState === 'empty'"
          rounded="lg"
          class="pa-16 my-16 text-center sb-card"
        >
          <v-avatar
            size="56"
            color="primary"
            variant="tonal"
            class="mx-auto mb-3"
          >
            <v-icon icon="lucide:file-search" />
          </v-avatar>

          <div class="text-h6 font-weight-bold">
            Respondent form is not available
          </div>

          <div
            class="text-body-2 text-medium-emphasis mt-2 mx-auto max-width-narrow"
          >
            This questionnaire does not have an active respondent information
            form yet. Please contact {{ orgName }} for assistance.
          </div>

          <div class="d-flex justify-center ga-3 flex-wrap mt-5">
            <v-btn color="primary" rounded="lg" :to="localePath(`/q/${code}`)">
              Back to questionnaire
            </v-btn>
          </div>
        </v-card>

        <!-- Data -->
        <div v-else>
          <v-row align="start">
            <v-col cols="12" md="8">
              <div class="d-flex align-center ga-3 mb-4">
                <v-avatar size="56" variant="tonal" rounded="lg">
                  <v-icon icon="lucide:user-round" />
                </v-avatar>

                <div class="min-width-0">
                  <div class="text-body-2 text-medium-emphasis mb-1">
                    {{ orgName }}
                  </div>
                  <h1 class="text-h4 text-md-h3 font-weight-bold mb-1">
                    Respondent Information
                  </h1>
                  <div class="text-body-1 text-medium-emphasis">
                    Complete your details before starting
                    {{ q.title }}.
                  </div>
                </div>
              </div>

              <p class="text-body-1 text-medium-emphasis mb-0 q-hero-subtitle">
                Please fill in your information accurately. This helps
                {{ orgName }} identify your submission and manage questionnaire
                results properly.
              </p>

              <v-card rounded="lg" variant="outlined" class="pa-6 mt-6">
                <div class="text-subtitle-1 font-weight-bold mb-1">
                  Your details
                </div>
                <div class="text-body-2 text-medium-emphasis mb-6">
                  Fields marked with <span class="text-error">*</span> are
                  required.
                </div>

                <v-form ref="formRef" @submit.prevent="submit">
                  <v-row>
                    <v-col
                      v-for="field in activeFields"
                      :key="field.id || field.key"
                      cols="12"
                      :md="field.fieldType === 'textarea' ? 12 : 6"
                    >
                      <!-- text / email / number -->
                      <v-text-field
                        v-if="isTextLikeField(field.fieldType)"
                        v-model="form[field.key]"
                        :label="field.label"
                        :type="mapInputType(field.fieldType)"
                        :placeholder="getPlaceholder(field)"
                        :rules="getRules(field)"
                        :required="isRequired(field)"
                        variant="outlined"
                        rounded="lg"
                        hide-details="auto"
                      >
                        <template #label>
                          <span>
                            {{ field.label }}
                            <span v-if="isRequired(field)" class="text-error">
                              *
                            </span>
                          </span>
                        </template>
                      </v-text-field>

                      <!-- textarea -->
                      <v-textarea
                        v-else-if="field.fieldType === 'textarea'"
                        v-model="form[field.key]"
                        :label="field.label"
                        :placeholder="getPlaceholder(field)"
                        :rules="getRules(field)"
                        :required="isRequired(field)"
                        variant="outlined"
                        rounded="lg"
                        rows="4"
                        auto-grow
                        hide-details="auto"
                      >
                        <template #label>
                          <span>
                            {{ field.label }}
                            <span v-if="isRequired(field)" class="text-error">
                              *
                            </span>
                          </span>
                        </template>
                      </v-textarea>

                      <!-- select -->
                      <v-select
                        v-else-if="field.fieldType === 'select'"
                        v-model="form[field.key]"
                        :label="field.label"
                        :items="mapFieldOptions(field)"
                        item-title="label"
                        item-value="value"
                        :rules="getRules(field)"
                        :required="isRequired(field)"
                        variant="outlined"
                        rounded="lg"
                        hide-details="auto"
                      >
                        <template #label>
                          <span>
                            {{ field.label }}
                            <span v-if="isRequired(field)" class="text-error">
                              *
                            </span>
                          </span>
                        </template>
                      </v-select>

                      <!-- radio -->
                      <v-card
                        v-else-if="field.fieldType === 'radio'"
                        rounded="lg"
                        variant="outlined"
                        class="pa-4"
                      >
                        <div class="text-body-2 font-weight-medium mb-3">
                          {{ field.label }}
                          <span v-if="isRequired(field)" class="text-error">
                            *
                          </span>
                        </div>

                        <v-radio-group
                          v-model="form[field.key]"
                          :rules="getRules(field)"
                          hide-details="auto"
                        >
                          <v-radio
                            v-for="opt in mapFieldOptions(field)"
                            :key="opt.value"
                            :label="opt.label"
                            :value="opt.value"
                          />
                        </v-radio-group>
                      </v-card>

                      <!-- date -->
                      <v-text-field
                        v-else-if="field.fieldType === 'date'"
                        v-model="form[field.key]"
                        :label="field.label"
                        type="date"
                        :rules="getRules(field)"
                        :required="isRequired(field)"
                        variant="outlined"
                        rounded="lg"
                        hide-details="auto"
                      >
                        <template #label>
                          <span>
                            {{ field.label }}
                            <span v-if="isRequired(field)" class="text-error">
                              *
                            </span>
                          </span>
                        </template>
                      </v-text-field>

                      <!-- fallback -->
                      <v-text-field
                        v-else
                        v-model="form[field.key]"
                        :label="field.label"
                        :rules="getRules(field)"
                        :required="isRequired(field)"
                        variant="outlined"
                        rounded="lg"
                        hide-details="auto"
                      >
                        <template #label>
                          <span>
                            {{ field.label }}
                            <span v-if="isRequired(field)" class="text-error">
                              *
                            </span>
                          </span>
                        </template>
                      </v-text-field>
                    </v-col>
                  </v-row>

                  <div class="d-flex ga-3 flex-wrap mt-6">
                    <v-btn
                      variant="outlined"
                      rounded="lg"
                      :to="localePath(`/q/${code}`)"
                    >
                      Back
                    </v-btn>

                    <v-btn color="primary" rounded="lg" type="submit">
                      Continue
                    </v-btn>
                  </div>
                </v-form>
              </v-card>
            </v-col>

            <v-col cols="12" md="4">
              <v-card rounded="lg" variant="outlined" class="pa-6 q-summary">
                <div class="d-flex align-start ga-3">
                  <v-avatar
                    size="40"
                    color="primary"
                    variant="tonal"
                    rounded="lg"
                    class="mt-2"
                  >
                    <v-icon icon="lucide:shield-check" />
                  </v-avatar>
                  <div>
                    <div class="text-subtitle-1 font-weight-bold">
                      Before continuing
                    </div>
                    <div class="text-body-2 text-medium-emphasis">
                      Make sure your information is correct before moving to the
                      questionnaire.
                    </div>
                  </div>
                </div>

                <v-divider class="my-4" />

                <div class="d-flex justify-space-between align-center mb-2">
                  <div class="text-caption text-medium-emphasis">
                    Organization
                  </div>
                  <div class="text-body-2 font-weight-medium text-right">
                    {{ orgName }}
                  </div>
                </div>

                <div class="d-flex justify-space-between align-center mb-2">
                  <div class="text-caption text-medium-emphasis">
                    Questionnaire
                  </div>
                  <div class="text-body-2 font-weight-medium text-right">
                    {{ q.title }}
                  </div>
                </div>

                <div class="d-flex justify-space-between align-center mb-4">
                  <div class="text-caption text-medium-emphasis">
                    Required fields
                  </div>
                  <div class="text-body-2 font-weight-medium">
                    {{ requiredFieldCount }}
                  </div>
                </div>

                <v-alert type="info" variant="tonal" rounded="lg">
                  Your information is collected by {{ orgName }} to support
                  questionnaire administration and result handling.
                </v-alert>
              </v-card>
            </v-col>
          </v-row>
        </div>
      </v-container>
    </section>

    <v-snackbar v-model="snack.show" :timeout="2400">
      {{ snack.text }}
      <template #actions>
        <v-btn variant="text" @click="snack.show = false">Close</v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch, onMounted } from "vue";
import { storeToRefs } from "pinia";
import { useOrganizationUserFieldStore } from "~/stores/organization-user-field";
import type { OrganizationUserFieldModel } from "~/models/organization-user-field.model";

definePageMeta({
  layout: "empty",
});

const route = useRoute();
const localePath = useLocalePath();

const questionnaireStore = useOrganizationQuestionnaireStore();
const userFieldStore = useOrganizationUserFieldStore();

const {
  item: questionnaireItem,
  loading: questionnaireLoading,
  loaded: questionnaireLoaded,
} = storeToRefs(questionnaireStore);

const {
  item: userFieldItem,
  loading: userFieldLoading,
  loaded: userFieldLoaded,
} = storeToRefs(userFieldStore);

const code = computed(() => String(route.params.code || "").trim());

const org = computed(() => questionnaireItem.value.organization);
const q = computed(() => questionnaireItem.value.questionnaire);
const orgName = computed(() => org.value?.name || "Organization");

const activeFields = computed(() =>
  (userFieldItem.value.fields || []).filter((field) => field.isActive),
);

const requiredFieldCount = computed(
  () => activeFields.value.filter((field) => isRequired(field)).length,
);

type UiState = "loading" | "error" | "data" | "empty";
const uiState = computed<UiState>(() => {
  if (questionnaireLoading.value || userFieldLoading.value) return "loading";
  if (combinedError.value) return "error";

  if (!questionnaireLoaded.value || !q.value?.id || !org.value?.id) {
    return "empty";
  }

  if (
    !userFieldLoaded.value ||
    !userFieldItem.value.organizationId ||
    !userFieldItem.value.isActive ||
    activeFields.value.length === 0
  ) {
    return "empty";
  }

  return "data";
});

const combinedError = computed(
  () => questionnaireStore.error || userFieldStore.error || null,
);

const formRef = ref();
const snack = ref({ show: false, text: "" });

const form = reactive<Record<string, any>>({});

function notify(text: string) {
  snack.value = { show: true, text };
}

function buildInitialForm() {
  const next: Record<string, any> = {};

  for (const field of activeFields.value) {
    next[field.key] = "";
  }

  Object.keys(form).forEach((key) => {
    delete form[key];
  });

  Object.assign(form, next);
}

watch(activeFields, buildInitialForm, { immediate: true });

function isRequired(field: OrganizationUserFieldModel) {
  return Boolean(field.validationJson?.required);
}

function isTextLikeField(fieldType: string) {
  return ["text", "email", "number"].includes(fieldType);
}

function mapInputType(fieldType: string) {
  if (fieldType === "email") return "email";
  if (fieldType === "number") return "number";
  return "text";
}

function mapFieldOptions(field: OrganizationUserFieldModel) {
  if (!Array.isArray(field.optionsJson)) return [];
  return field.optionsJson.map((opt) => ({
    label: opt.label,
    value: opt.value,
  }));
}

function getPlaceholder(field: OrganizationUserFieldModel) {
  switch (field.key) {
    case "name":
      return "Enter your full name";
    case "email":
      return "Enter your email address";
    case "phone":
      return "Enter your phone number";
    case "address":
      return "Enter your address";
    default:
      return `Enter ${String(field.label || field.key).toLowerCase()}`;
  }
}

function getRules(field: OrganizationUserFieldModel) {
  const rules: Array<(value: any) => true | string> = [];

  if (isRequired(field)) {
    rules.push((value: any) => {
      const ok = String(value ?? "").trim().length > 0;
      return ok || `${field.label} is required`;
    });
  }

  if (field.fieldType === "email") {
    rules.push((value: any) => {
      if (!String(value ?? "").trim()) return true;
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(String(value)) || "Email is invalid";
    });
  }

  return rules;
}

async function loadData() {
  if (!code.value) return;

  const questionnaireResult = await questionnaireStore.fetchByCode(code.value);

  const organizationId = questionnaireResult?.organization?.id;
  if (!organizationId) return;

  await userFieldStore.fetchByOrganizationId(organizationId);
}

onMounted(loadData);
watch(code, loadData);

async function submit() {
  const result = await formRef.value?.validate?.();
  if (!result?.valid) {
    notify("Please complete the required fields.");
    return;
  }

  const payload = activeFields.value.map((field) => ({
    fieldId: field.id,
    key: field.key,
    label: field.label,
    value: form[field.key] ?? "",
  }));

  if (process.client) {
    sessionStorage.setItem(
      `q-user-info:${code.value}`,
      JSON.stringify(payload),
    );
  }

  navigateTo(localePath(`/q/${code.value}/questions`));
}
</script>

<style scoped lang="scss">
.q-summary {
  backdrop-filter: blur(10px);
  background-color: rgba(var(--v-theme-surface), 0.8);
}

.q-hero-subtitle {
  max-width: 78ch;
}

.max-width-narrow {
  max-width: 720px;
}

.min-width-0 {
  min-width: 0;
}
</style>
