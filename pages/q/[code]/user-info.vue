<!-- /pages/q/[code]/user-info.vue -->
<template>
  <div>
    <BaseAppBar />

    <!-- Header -->
    <section class="step-hero">
      <v-container class="py-8 py-md-12">
        <!-- Loading -->
        <div v-if="uiState === 'loading'">
          <v-skeleton-loader type="heading, text, text" />
          <v-row class="ga-4 mt-4">
            <v-col cols="12" md="8">
              <v-card rounded="xl" variant="outlined" class="pa-6">
                <v-skeleton-loader type="text, text, text, text, actions" />
              </v-card>
            </v-col>
            <v-col cols="12" md="4">
              <v-card rounded="xl" variant="outlined" class="pa-6">
                <v-skeleton-loader type="avatar, text, text, text" />
              </v-card>
            </v-col>
          </v-row>
        </div>

        <!-- Error -->
        <v-alert
          v-else-if="uiState === 'error'"
          type="error"
          variant="tonal"
          rounded="xl"
        >
          Unable to load questionnaire configuration.
        </v-alert>

        <!-- Empty / Not Found -->
        <v-card
          v-else-if="uiState === 'empty'"
          rounded="xl"
          variant="outlined"
          class="pa-8 text-center"
        >
          <v-avatar
            size="56"
            color="primary"
            variant="tonal"
            class="mx-auto mb-3"
          >
            <v-icon icon="lucide:search-x" />
          </v-avatar>
          <div class="text-h6 font-weight-bold">Questionnaire not found</div>
          <div
            class="text-body-2 text-medium-emphasis mt-2 mx-auto max-width-narrow"
          >
            The questionnaire code “{{ code }}” does not exist or is not
            published.
          </div>
          <v-btn
            class="mt-5"
            rounded="xl"
            color="primary"
            :to="localePath('/organizations')"
          >
            Browse organizations
          </v-btn>
        </v-card>

        <!-- Data -->
        <div v-else>
          <v-breadcrumbs
            :items="breadcrumbs"
            class="px-0 mb-3"
            density="compact"
          >
            <template #divider>
              <v-icon icon="mdi-chevron-right" />
            </template>
          </v-breadcrumbs>

          <div class="d-flex flex-wrap align-center justify-space-between ga-4">
            <div class="min-width-0">
              <h1
                class="text-h5 text-md-h4 font-weight-bold mb-1 text-truncate"
              >
                Respondent information
              </h1>
              <div class="text-body-2 text-medium-emphasis">
                {{ q!.title }} • Step 1 of 2
              </div>
            </div>

            <v-chip
              size="small"
              variant="outlined"
              class="text-medium-emphasis"
            >
              <v-icon icon="lucide:lock" size="16" class="me-1" />
              Anonymous session
            </v-chip>
          </div>
        </div>
      </v-container>
    </section>

    <!-- Form -->
    <section v-if="uiState === 'data'">
      <v-container class="py-6 py-md-10">
        <v-row class="ga-6">
          <!-- Left: Dynamic form -->
          <v-col cols="12" md="8">
            <v-card rounded="xl" variant="outlined" class="pa-6">
              <div class="d-flex align-center ga-3 mb-4">
                <v-avatar size="40" color="primary" variant="tonal">
                  <v-icon icon="lucide:id-card" />
                </v-avatar>
                <div>
                  <div class="text-subtitle-1 font-weight-bold">
                    Fill your details
                  </div>
                  <div class="text-body-2 text-medium-emphasis">
                    Fields are configured by the organization. Required fields
                    must be completed to continue.
                  </div>
                </div>
              </div>

              <v-divider class="mb-6" />

              <v-form ref="formRef" v-model="formValid" validate-on="input">
                <v-row class="ga-4">
                  <v-col
                    v-for="field in orderedFields"
                    :key="field.configId"
                    cols="12"
                    :md="fieldSpan(field)"
                  >
                    <!-- Text / Email / Phone -->
                    <v-text-field
                      v-if="isTextField(field.type)"
                      v-model="formValues[field.key]"
                      :label="field.label"
                      :placeholder="field.placeholder"
                      :hint="field.hint"
                      :persistent-hint="!!field.hint"
                      :type="
                        field.type === 'email'
                          ? 'email'
                          : field.type === 'phone'
                            ? 'tel'
                            : 'text'
                      "
                      :rules="field.rules"
                      variant="outlined"
                      rounded="xl"
                      hide-details="auto"
                      autocomplete="off"
                    >
                      <template #prepend-inner>
                        <v-icon
                          :icon="fieldIcon(field.type, field.key)"
                          size="18"
                          class="text-medium-emphasis"
                        />
                      </template>
                    </v-text-field>

                    <!-- Number -->
                    <v-text-field
                      v-else-if="field.type === 'number'"
                      v-model="formValues[field.key]"
                      :label="field.label"
                      :placeholder="field.placeholder"
                      :hint="field.hint"
                      :persistent-hint="!!field.hint"
                      type="number"
                      inputmode="numeric"
                      :rules="field.rules"
                      variant="outlined"
                      rounded="xl"
                      hide-details="auto"
                    >
                      <template #prepend-inner>
                        <v-icon
                          icon="lucide:hash"
                          size="18"
                          class="text-medium-emphasis"
                        />
                      </template>
                    </v-text-field>

                    <!-- Textarea -->
                    <v-textarea
                      v-else-if="field.type === 'textarea'"
                      v-model="formValues[field.key]"
                      :label="field.label"
                      :placeholder="field.placeholder"
                      :hint="field.hint"
                      :persistent-hint="!!field.hint"
                      :rules="field.rules"
                      variant="outlined"
                      rounded="xl"
                      hide-details="auto"
                      rows="4"
                      auto-grow
                    >
                      <template #prepend-inner>
                        <v-icon
                          icon="lucide:align-left"
                          size="18"
                          class="text-medium-emphasis"
                        />
                      </template>
                    </v-textarea>

                    <!-- Select -->
                    <v-select
                      v-else-if="field.type === 'select'"
                      v-model="formValues[field.key]"
                      :items="field.options"
                      :label="field.label"
                      :hint="field.hint"
                      :persistent-hint="!!field.hint"
                      :rules="field.rules"
                      variant="outlined"
                      rounded="xl"
                      hide-details="auto"
                    >
                      <template #prepend-inner>
                        <v-icon
                          icon="lucide:list"
                          size="18"
                          class="text-medium-emphasis"
                        />
                      </template>
                    </v-select>

                    <!-- Organization (recommended required): searchable -->
                    <v-autocomplete
                      v-else-if="field.type === 'organization'"
                      v-model="formValues[field.key]"
                      :items="orgOptions"
                      item-title="name"
                      item-value="id"
                      :label="field.label"
                      :hint="field.hint"
                      :persistent-hint="!!field.hint"
                      :rules="field.rules"
                      variant="outlined"
                      rounded="xl"
                      hide-details="auto"
                      clearable
                    >
                      <template #prepend-inner>
                        <v-icon
                          icon="lucide:building-2"
                          size="18"
                          class="text-medium-emphasis"
                        />
                      </template>

                      <template #item="{ props, item }">
                        <v-list-item
                          v-bind="props"
                          :title="item.raw.name"
                          :subtitle="item.raw.subtitle"
                        />
                      </template>
                    </v-autocomplete>

                    <!-- Date (menu) -->
                    <div v-else-if="field.type === 'date'">
                      <v-menu
                        v-model="dateMenus[field.key]"
                        :close-on-content-click="false"
                        offset="8"
                      >
                        <template #activator="{ props }">
                          <v-text-field
                            v-bind="props"
                            :model-value="formatDate(formValues[field.key])"
                            :label="field.label"
                            :placeholder="field.placeholder || 'YYYY-MM-DD'"
                            :hint="field.hint"
                            :persistent-hint="!!field.hint"
                            :rules="field.rules"
                            variant="outlined"
                            rounded="xl"
                            hide-details="auto"
                            readonly
                          >
                            <template #prepend-inner>
                              <v-icon
                                icon="lucide:calendar"
                                size="18"
                                class="text-medium-emphasis"
                              />
                            </template>
                          </v-text-field>
                        </template>

                        <v-card rounded="xl">
                          <v-date-picker
                            v-model="formValues[field.key]"
                            color="primary"
                            hide-header
                          />
                          <v-divider />
                          <div class="d-flex justify-end ga-2 pa-3">
                            <v-btn
                              variant="text"
                              rounded="xl"
                              @click="dateMenus[field.key] = false"
                            >
                              Close
                            </v-btn>
                          </div>
                        </v-card>
                      </v-menu>
                    </div>

                    <!-- Fallback -->
                    <v-alert v-else type="warning" variant="tonal" rounded="xl">
                      Unsupported field type: <strong>{{ field.type }}</strong>
                    </v-alert>
                  </v-col>
                </v-row>
              </v-form>

              <!-- Desktop actions -->
              <div
                class="d-none d-md-flex align-center justify-space-between mt-8"
              >
                <v-btn
                  rounded="xl"
                  variant="text"
                  :to="localePath(`/q/${code}`)"
                >
                  <v-icon icon="lucide:arrow-left" size="18" class="me-2" />
                  Back
                </v-btn>

                <div class="d-flex ga-3">
                  <v-btn rounded="xl" variant="outlined" @click="resetForm">
                    Reset
                  </v-btn>
                  <v-btn
                    rounded="xl"
                    color="primary"
                    :disabled="!formValid"
                    @click="continueNext"
                  >
                    Continue
                    <v-icon icon="lucide:arrow-right" size="18" class="ms-2" />
                  </v-btn>
                </div>
              </div>
            </v-card>
          </v-col>

          <!-- Right: Summary / progress -->
          <v-col cols="12" md="4">
            <v-card rounded="xl" variant="outlined" class="pa-6 mb-6">
              <div class="d-flex align-center ga-3">
                <v-avatar size="40" color="primary" variant="tonal">
                  <v-icon icon="lucide:clipboard-list" />
                </v-avatar>
                <div>
                  <div class="text-subtitle-1 font-weight-bold">
                    Questionnaire
                  </div>
                  <div class="text-body-2 text-medium-emphasis">
                    Start page → User info → Questions
                  </div>
                </div>
              </div>

              <v-divider class="my-4" />

              <div class="text-body-2 text-medium-emphasis">
                <div class="d-flex align-center justify-space-between mb-2">
                  <span>Title</span>
                  <span class="font-weight-medium text-truncate ms-4">{{
                    q!.title
                  }}</span>
                </div>
                <div class="d-flex align-center justify-space-between mb-2">
                  <span>Language</span>
                  <span class="font-weight-medium">{{
                    String(q!.language).toUpperCase()
                  }}</span>
                </div>
                <div class="d-flex align-center justify-space-between mb-2">
                  <span>Questions</span>
                  <span class="font-weight-medium">{{ questionCount }}</span>
                </div>
                <div class="d-flex align-center justify-space-between">
                  <span>Estimated time</span>
                  <span class="font-weight-medium"
                    >~{{ estimatedMinutes }} min</span
                  >
                </div>
              </div>

              <v-divider class="my-4" />

              <div class="text-caption text-medium-emphasis mb-2">
                Step progress
              </div>
              <v-progress-linear
                :model-value="50"
                height="8"
                rounded
                color="primary"
              />
              <div class="text-caption text-medium-emphasis mt-2">
                You are on step <strong>1</strong> of <strong>2</strong>.
              </div>
            </v-card>

            <v-card rounded="xl" variant="outlined" class="pa-6">
              <div class="d-flex align-center ga-3">
                <v-avatar size="40" color="primary" variant="tonal">
                  <v-icon icon="lucide:shield" />
                </v-avatar>
                <div>
                  <div class="text-subtitle-1 font-weight-bold">
                    Privacy note
                  </div>
                  <div class="text-body-2 text-medium-emphasis">
                    Your responses are handled by the organization.
                  </div>
                </div>
              </div>

              <v-divider class="my-4" />

              <div class="text-body-2 text-medium-emphasis">
                This is an anonymous session. Please ensure the information you
                provide is accurate for reporting purposes.
              </div>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </section>

    <!-- Mobile sticky actions -->
    <v-card
      v-if="uiState === 'data'"
      class="d-md-none mobile-actions"
      rounded="xl"
      variant="outlined"
    >
      <div class="d-flex align-center justify-space-between ga-3 pa-3">
        <v-btn rounded="xl" variant="text" :to="localePath(`/q/${code}`)">
          <v-icon icon="lucide:arrow-left" size="18" class="me-2" />
          Back
        </v-btn>

        <v-btn
          rounded="xl"
          color="primary"
          :disabled="!formValid"
          @click="continueNext"
        >
          Continue
          <v-icon icon="lucide:arrow-right" size="18" class="ms-2" />
        </v-btn>
      </div>
    </v-card>

    <v-snackbar v-model="snack.show" :timeout="2200">
      {{ snack.text }}
      <template #actions>
        <v-btn variant="text" @click="snack.show = false">Close</v-btn>
      </template>
    </v-snackbar>

    <BaseFooter />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from "vue";
import * as mock from "~/utils/mockPublicData";

type UiState = "loading" | "error" | "data" | "empty";
type AnyQuestionnaire = Record<string, any>;
type AnyField = Record<string, any>;

const route = useRoute();
const localePath = useLocalePath();

const code = computed(() => String(route.params.code || ""));

useHead(() => ({
  title: `Respondent Info — ${code.value} | SB Questionnaire`,
  meta: [
    {
      name: "description",
      content:
        "Fill respondent information before answering the questionnaire.",
    },
  ],
}));

/** Mock access (defensive) */
const questionnairesRaw = computed<AnyQuestionnaire[]>(() => {
  const qs = (mock as any).questionnaires;
  return Array.isArray(qs) ? qs : [];
});

const questionsRaw = computed<any[]>(() => {
  const qq = (mock as any).questionnaire_questions;
  return Array.isArray(qq) ? qq : [];
});

const organizationsRaw = computed<any[]>(() => {
  const orgs = (mock as any).organizations;
  return Array.isArray(orgs) ? orgs : [];
});

const userFieldsLibrary = computed<AnyField[]>(() => {
  const lib = (mock as any).questionnaire_user_fields;
  return Array.isArray(lib) ? lib : [];
});

const userFieldConfigs = computed<any[]>(() => {
  const cfg = (mock as any).questionnaire_user_field_configs;
  return Array.isArray(cfg) ? cfg : [];
});

/** UI state */
const uiState = ref<UiState>("loading");
const q = ref<AnyQuestionnaire | null>(null);

onMounted(() => {
  window.setTimeout(() => {
    const found = questionnairesRaw.value.find(
      (it) => String(it.code) === code.value,
    );
    const published =
      found && String(found.status || "").toLowerCase() === "published";
    q.value = published ? found : null;
    uiState.value = q.value ? "data" : "empty";
    if (uiState.value === "data") initForm();
  }, 320);
});

/** Breadcrumbs */
const breadcrumbs = computed(() => [
  { title: "Home", to: localePath("/") },
  { title: "Questionnaire", to: localePath(`/q/${code.value}`) },
  { title: "Respondent info", disabled: true },
]);

/** Questionnaire stats */
const questionCount = computed(() => {
  if (!q.value) return 0;
  const id = String(q.value.id);
  return questionsRaw.value.filter(
    (qq: any) => String(qq.questionnaire_id) === id,
  ).length;
});

const estimatedMinutes = computed(() => {
  const minutes = Math.ceil(questionCount.value / 4);
  return Math.max(1, minutes);
});

/**
 * Build dynamic fields:
 * - questionnaire_user_field_configs is per questionnaire ordering + overrides
 * - questionnaire_user_fields is the library
 *
 * We support required types:
 * text, number, select, date, email, phone, textarea
 * plus special "organization" (recommended)
 */
type UiFieldType =
  | "text"
  | "number"
  | "select"
  | "date"
  | "email"
  | "phone"
  | "textarea"
  | "organization";

type UiField = {
  configId: string;
  key: string;
  type: UiFieldType;
  label: string;
  placeholder?: string;
  hint?: string;
  required: boolean;
  sort: number;
  options: string[];
  rules: Array<(v: any) => true | string>;
  span: 12 | 6;
};

const orderedFields = computed<UiField[]>(() => {
  if (!q.value) return [];

  const qId = String(q.value.id);

  // configs for this questionnaire
  const cfgs = userFieldConfigs.value
    .filter(
      (c: any) => String(c.questionnaire_id ?? c.questionnaireId ?? "") === qId,
    )
    .map((c: any) => ({
      ...c,
      sort_order: Number(c.sort_order ?? c.sort ?? 999),
      required: Boolean(c.required ?? c.is_required ?? false),
    }))
    .sort((a: any, b: any) => Number(a.sort_order) - Number(b.sort_order));

  // join with library
  const fields: UiField[] = cfgs
    .map((cfg: any) => {
      const libId = String(
        cfg.questionnaire_user_field_id ??
          cfg.user_field_id ??
          cfg.field_id ??
          cfg.userFieldId ??
          "",
      );
      const lib =
        userFieldsLibrary.value.find((f: any) => String(f.id) === libId) || {};

      // resolve final label / key / type
      const key = String(
        cfg.key ?? lib.key ?? lib.code ?? lib.name ?? "",
      ).trim();
      if (!key) return null;

      const rawType = String(
        cfg.field_type ?? cfg.type ?? lib.field_type ?? lib.type ?? "text",
      ).trim();
      const type = normalizeType(rawType, key);

      const label = String(
        cfg.label ?? lib.label ?? lib.title ?? keyToLabel(key),
      ).trim();
      const placeholder =
        String(cfg.placeholder ?? lib.placeholder ?? "").trim() || undefined;
      const hint =
        String(cfg.helper_text ?? cfg.hint ?? lib.hint ?? "").trim() ||
        undefined;

      const required = Boolean(cfg.required ?? lib.required ?? false);

      // options (for select)
      const options = Array.isArray(cfg.options)
        ? cfg.options
        : Array.isArray(lib.options)
          ? lib.options
          : Array.isArray(cfg.options_json?.options)
            ? cfg.options_json.options
            : Array.isArray(lib.options_json?.options)
              ? lib.options_json.options
              : typeof cfg.options_json?.options === "string"
                ? String(cfg.options_json.options).split(",")
                : typeof lib.options_json?.options === "string"
                  ? String(lib.options_json.options).split(",")
                  : [];

      const sort = Number(cfg.sort_order ?? 999);

      const span: 12 | 6 = isWideField(type) ? 12 : 6;

      const rules = buildRules({
        label,
        key,
        type,
        required,
        validationJson: cfg.validation_json ?? lib.validation_json,
      });

      return {
        configId: String(cfg.id ?? `${qId}-${key}`),
        key,
        type,
        label,
        placeholder,
        hint,
        required,
        sort,
        options: options.map((x: any) => String(x).trim()).filter(Boolean),
        rules,
        span,
      } as UiField;
    })
    .filter(Boolean) as UiField[];

  // If organization field is not present, we can optionally inject it (recommended)
  const hasOrg = fields.some(
    (f) =>
      f.type === "organization" ||
      f.key === "organizationId" ||
      f.key === "organization",
  );
  if (!hasOrg) {
    fields.unshift({
      configId: `${qId}-organization`,
      key: "organizationId",
      type: "organization",
      label: "Organization",
      hint: "Select your organization",
      required: true,
      sort: -1,
      options: [],
      rules: [(v) => !!v || "Organization is required"],
      span: 12,
    });
  }

  return fields.sort((a, b) => a.sort - b.sort);
});

function fieldSpan(field: UiField): 12 | 6 {
  return field.span;
}

function isTextField(type: UiFieldType) {
  return type === "text" || type === "email" || type === "phone";
}

function fieldIcon(type: UiFieldType, key: string) {
  if (type === "email") return "lucide:mail";
  if (type === "phone") return "lucide:phone";
  if (key.toLowerCase().includes("name")) return "lucide:user";
  return "lucide:pen-line";
}

function isWideField(type: UiFieldType) {
  return type === "textarea" || type === "organization";
}

/** Org options for autocomplete */
const orgOptions = computed(() => {
  return organizationsRaw.value.map((o: any) => {
    const name = String(o.name ?? o.title ?? "Organization");
    const subtitleParts = [
      String(o.type ?? o.category ?? o.kind ?? "").trim(),
      [o.city, o.state, o.country]
        .map((x: any) => String(x || "").trim())
        .filter(Boolean)
        .join(", "),
    ].filter(Boolean);

    return {
      id: String(o.id ?? o.organization_id ?? o.slug ?? name),
      name,
      subtitle: subtitleParts.join(" • "),
    };
  });
});

/** Form state */
const formRef = ref<any>(null);
const formValid = ref(false);
const formValues = reactive<Record<string, any>>({});
const dateMenus = reactive<Record<string, boolean>>({});
const snack = ref({ show: false, text: "" });

function notify(text: string) {
  snack.value = { show: true, text };
}

function initForm() {
  // initialize values & date menus to avoid undefined reactivity gaps
  for (const f of orderedFields.value) {
    if (!(f.key in formValues)) formValues[f.key] = "";
    if (f.type === "date" && !(f.key in dateMenus)) dateMenus[f.key] = false;
  }

  // load saved snapshot for this code (if any)
  if (process.client) {
    try {
      const raw = sessionStorage.getItem(storageKeyUserInfo(code.value));
      if (raw) {
        const parsed = JSON.parse(raw);
        Object.keys(parsed || {}).forEach((k) => (formValues[k] = parsed[k]));
      }
    } catch {
      // ignore
    }
  }
}

function resetForm() {
  for (const f of orderedFields.value) {
    formValues[f.key] = "";
  }
  notify("Form reset");
}

async function continueNext() {
  const ok = await validateForm();
  if (!ok) {
    notify("Please complete required fields");
    return;
  }

  // Save snapshot (session)
  if (process.client) {
    const snapshot: Record<string, any> = {};
    for (const f of orderedFields.value) snapshot[f.key] = formValues[f.key];
    sessionStorage.setItem(
      storageKeyUserInfo(code.value),
      JSON.stringify(snapshot),
    );
  }

  notify("Saved");
  navigateTo(localePath(`/q/${code.value}/take`));
}

async function validateForm(): Promise<boolean> {
  if (!formRef.value) return false;
  const res = await formRef.value.validate();
  return Boolean(res?.valid);
}

/** Rules builder */
function buildRules(params: {
  label: string;
  key: string;
  type: UiFieldType;
  required: boolean;
  validationJson: any;
}): Array<(v: any) => true | string> {
  const rules: Array<(v: any) => true | string> = [];

  if (params.required) {
    rules.push((v) => {
      const ok = v !== null && v !== undefined && String(v).trim() !== "";
      return ok || `${params.label} is required`;
    });
  }

  // Basic type validations
  if (params.type === "email") {
    rules.push((v) => {
      if (!v) return true;
      const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v));
      return ok || "Enter a valid email";
    });
  }

  if (params.type === "phone") {
    rules.push((v) => {
      if (!v) return true;
      const s = String(v).replace(/\s+/g, "");
      const ok = /^[0-9+()-]{7,20}$/.test(s);
      return ok || "Enter a valid phone number";
    });
  }

  if (params.type === "number") {
    rules.push((v) => {
      if (v === "" || v === null || v === undefined) return true;
      const ok = !Number.isNaN(Number(v));
      return ok || "Enter a valid number";
    });
  }

  // validation_json support (min/max length, regex, min/max)
  const vj = params.validationJson || {};
  const minLen = Number(vj.min_length ?? vj.minLength ?? NaN);
  const maxLen = Number(vj.max_length ?? vj.maxLength ?? NaN);
  const regex = String(vj.regex ?? vj.pattern ?? "").trim();
  const min = Number(vj.min ?? NaN);
  const max = Number(vj.max ?? NaN);

  if (!Number.isNaN(minLen)) {
    rules.push((v) => {
      if (!v) return true;
      return (
        String(v).length >= minLen ||
        `${params.label} must be at least ${minLen} characters`
      );
    });
  }

  if (!Number.isNaN(maxLen)) {
    rules.push((v) => {
      if (!v) return true;
      return (
        String(v).length <= maxLen ||
        `${params.label} must be at most ${maxLen} characters`
      );
    });
  }

  if (regex) {
    try {
      const re = new RegExp(regex);
      rules.push((v) => {
        if (!v) return true;
        return re.test(String(v)) || `${params.label} format is invalid`;
      });
    } catch {
      // ignore invalid regex in mock
    }
  }

  if (!Number.isNaN(min)) {
    rules.push((v) => {
      if (v === "" || v === null || v === undefined) return true;
      return Number(v) >= min || `${params.label} must be ≥ ${min}`;
    });
  }

  if (!Number.isNaN(max)) {
    rules.push((v) => {
      if (v === "" || v === null || v === undefined) return true;
      return Number(v) <= max || `${params.label} must be ≤ ${max}`;
    });
  }

  return rules;
}

/** Type normalization */
function normalizeType(raw: string, key: string): UiFieldType {
  const t = raw.toLowerCase();
  if (t === "text") return "text";
  if (t === "number") return "number";
  if (t === "select") return "select";
  if (t === "date") return "date";
  if (t === "email") return "email";
  if (t === "phone") return "phone";
  if (t === "textarea") return "textarea";

  // special
  if (t === "organization") return "organization";
  if (key.toLowerCase().includes("organization")) return "organization";

  return "text";
}

/** Formatting */
function formatDate(v: any) {
  if (!v) return "";
  // v-date-picker may return Date or string depending on Vuetify version/config
  if (v instanceof Date) return v.toISOString().slice(0, 10);
  const s = String(v);
  // accept YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;
  return s.slice(0, 10);
}

function keyToLabel(key: string): string {
  return key
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(
      /\w\S*/g,
      (w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase(),
    );
}

function storageKeyUserInfo(codeStr: string) {
  return `sbq:user_info:${codeStr}`;
}
</script>

<style lang="scss" scoped>
.step-hero {
  position: relative;
  overflow: hidden;
  border-bottom: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));

  &::before {
    content: "";
    position: absolute;
    inset: -2px;
    background:
      radial-gradient(
        900px 520px at 14% 18%,
        rgba(var(--v-theme-primary), 0.16),
        transparent 56%
      ),
      radial-gradient(
        720px 520px at 86% 20%,
        rgba(var(--v-theme-primary), 0.1),
        transparent 62%
      ),
      linear-gradient(
        180deg,
        rgba(var(--v-theme-surface), 0.72),
        rgba(var(--v-theme-surface), 1)
      );
    pointer-events: none;
  }

  &::after {
    content: "";
    position: absolute;
    inset: 0;
    background-image: radial-gradient(rgba(0, 0, 0, 0.08) 1px, transparent 1px);
    background-size: 18px 18px;
    opacity: 0.1;
    pointer-events: none;
    mix-blend-mode: overlay;
  }

  > .v-container {
    position: relative;
    z-index: 1;
  }
}

.max-width-narrow {
  max-width: 720px;
}

.min-width-0 {
  min-width: 0;
}

.mobile-actions {
  position: sticky;
  bottom: 12px;
  margin: 0 12px 12px;
  z-index: 10;
  backdrop-filter: blur(10px);
  background-color: rgba(var(--v-theme-surface), 0.9);
}
</style>
