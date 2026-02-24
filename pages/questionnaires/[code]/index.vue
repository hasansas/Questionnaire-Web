<template>
  <div>
    <!-- HERO -->
    <section class="q-hero">
      <v-container class="main-container">
        <!-- Loading -->
        <v-row v-if="uiState === 'loading'" align="center">
          <v-col cols="12" md="8">
            <v-skeleton-loader type="heading, text, text" />
          </v-col>
          <v-col cols="12" md="4">
            <v-card rounded="xl" variant="outlined" class="pa-6">
              <v-skeleton-loader type="avatar, text, text, actions" />
            </v-card>
          </v-col>
        </v-row>

        <!-- Error -->
        <v-alert
          v-else-if="uiState === 'error'"
          type="error"
          variant="tonal"
          rounded="xl"
        >
          Unable to load questionnaire.
        </v-alert>

        <!-- Empty / Not found -->
        <v-card
          v-else-if="uiState === 'empty'"
          rounded="xl"
          class="pa-16 my-16 text-center sb-card"
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
            published. Please ask the organization for a valid link.
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

          <v-row align="center">
            <v-col cols="12" md="8">
              <div class="d-flex align-center ga-3 mb-4">
                <v-avatar size="56" color="primary" variant="tonal">
                  <v-icon icon="lucide:clipboard-list" />
                </v-avatar>

                <div class="min-width-0">
                  <h1
                    class="text-h4 text-md-h3 font-weight-bold mb-1 text-truncate"
                  >
                    {{ q!.title }}
                  </h1>
                  <div class="text-body-1 text-medium-emphasis">
                    {{ qMetaLine }}
                  </div>
                </div>
              </div>

              <p class="text-body-1 text-medium-emphasis mb-0 q-hero-subtitle">
                {{ q!.description }}
              </p>

              <div class="d-flex flex-wrap ga-2 mt-5">
                <v-chip
                  size="small"
                  variant="outlined"
                  class="text-medium-emphasis"
                >
                  <v-icon icon="lucide:languages" size="16" class="me-1" />
                  {{ String(q!.language).toUpperCase() }}
                </v-chip>

                <v-chip
                  size="small"
                  variant="outlined"
                  class="text-medium-emphasis"
                >
                  <v-icon icon="lucide:target" size="16" class="me-1" />
                  {{
                    q!.scoring_type === "multi_dimension"
                      ? "Multi-dimension scoring"
                      : "Total score"
                  }}
                </v-chip>

                <v-chip
                  size="small"
                  :color="q!.show_result_to_user ? 'primary' : undefined"
                  :variant="q!.show_result_to_user ? 'tonal' : 'outlined'"
                  class="text-medium-emphasis"
                >
                  <v-icon
                    :icon="
                      q!.show_result_to_user ? 'lucide:eye' : 'lucide:eye-off'
                    "
                    size="16"
                    class="me-1"
                  />
                  {{
                    q!.show_result_to_user
                      ? "Result shown after submit"
                      : "Thank you page only"
                  }}
                </v-chip>

                <v-chip
                  size="small"
                  variant="outlined"
                  class="text-medium-emphasis"
                >
                  <v-icon icon="lucide:clock" size="16" class="me-1" />
                  ~{{ estimatedMinutes }} min
                </v-chip>
              </div>
            </v-col>

            <v-col cols="12" md="4">
              <v-card rounded="xl" variant="outlined" class="pa-6 q-summary">
                <div class="d-flex align-center ga-3">
                  <v-avatar size="40" color="primary" variant="tonal">
                    <v-icon icon="lucide:list-checks" />
                  </v-avatar>
                  <div>
                    <div class="text-subtitle-1 font-weight-bold">
                      Before you begin
                    </div>
                    <div class="text-body-2 text-medium-emphasis">
                      You’ll provide respondent info, then answer questions.
                    </div>
                  </div>
                </div>

                <v-divider class="my-4" />

                <div class="d-flex justify-space-between align-center mb-2">
                  <div class="text-caption text-medium-emphasis">Questions</div>
                  <div class="text-h6 font-weight-bold">
                    {{ questionCount }}
                  </div>
                </div>

                <div class="d-flex justify-space-between align-center mb-4">
                  <div class="text-caption text-medium-emphasis">
                    Estimated time
                  </div>
                  <div class="text-body-2 font-weight-medium">
                    ~{{ estimatedMinutes }} min
                  </div>
                </div>

                <v-btn color="primary" rounded="xl" block @click="begin">
                  Begin
                </v-btn>

                <v-btn
                  class="mt-3"
                  variant="outlined"
                  rounded="xl"
                  block
                  @click="openShare"
                >
                  <v-icon icon="lucide:share-2" size="18" class="me-2" />
                  Share link
                </v-btn>

                <v-btn
                  v-if="orgPortalLink"
                  class="mt-3"
                  variant="text"
                  rounded="xl"
                  block
                  :to="orgPortalLink"
                >
                  <v-icon icon="lucide:building-2" size="18" class="me-2" />
                  View organization
                </v-btn>
              </v-card>
            </v-col>
          </v-row>
        </div>
      </v-container>
    </section>

    <!-- DETAILS -->
    <section v-if="uiState === 'data'">
      <v-container class="main-container">
        <v-row>
          <!-- Left: What to expect -->
          <v-col cols="12" md="8">
            <h2 class="text-h5 text-md-h4 font-weight-bold mb-3">
              What to expect
            </h2>

            <v-row>
              <v-col cols="12" sm="6">
                <v-card rounded="xl" variant="outlined" class="pa-6 h-100">
                  <div class="d-flex align-center ga-3 mb-3">
                    <v-avatar size="40" color="primary" variant="tonal">
                      <v-icon icon="lucide:id-card" />
                    </v-avatar>
                    <div class="text-subtitle-1 font-weight-bold">
                      Respondent info
                    </div>
                  </div>
                  <div class="text-body-2 text-medium-emphasis">
                    You’ll fill a short form first. Fields are configured by the
                    organization to match their program needs.
                  </div>
                </v-card>
              </v-col>

              <v-col cols="12" sm="6">
                <v-card rounded="xl" variant="outlined" class="pa-6 h-100">
                  <div class="d-flex align-center ga-3 mb-3">
                    <v-avatar size="40" color="primary" variant="tonal">
                      <v-icon icon="lucide:check-square" />
                    </v-avatar>
                    <div class="text-subtitle-1 font-weight-bold">
                      Single-choice questions
                    </div>
                  </div>
                  <div class="text-body-2 text-medium-emphasis">
                    Answer one question at a time with clear navigation.
                    Required questions must be answered before continuing.
                  </div>
                </v-card>
              </v-col>

              <v-col cols="12" sm="6">
                <v-card rounded="xl" variant="outlined" class="pa-6 h-100">
                  <div class="d-flex align-center ga-3 mb-3">
                    <v-avatar size="40" color="primary" variant="tonal">
                      <v-icon icon="lucide:bar-chart-3" />
                    </v-avatar>
                    <div class="text-subtitle-1 font-weight-bold">
                      Automatic scoring
                    </div>
                  </div>
                  <div class="text-body-2 text-medium-emphasis">
                    Your responses are scored automatically. Outcomes and
                    interpretations are generated based on scoring rules.
                  </div>
                </v-card>
              </v-col>

              <v-col cols="12" sm="6">
                <v-card rounded="xl" variant="outlined" class="pa-6 h-100">
                  <div class="d-flex align-center ga-3 mb-3">
                    <v-avatar size="40" color="primary" variant="tonal">
                      <v-icon
                        :icon="
                          q!.show_result_to_user ? 'lucide:eye' : 'lucide:send'
                        "
                      />
                    </v-avatar>
                    <div class="text-subtitle-1 font-weight-bold">
                      {{
                        q!.show_result_to_user
                          ? "Result page"
                          : "Submission confirmation"
                      }}
                    </div>
                  </div>
                  <div class="text-body-2 text-medium-emphasis">
                    {{
                      q!.show_result_to_user
                        ? "You will see your result immediately after submitting."
                        : "You will see a thank you message after submitting. Results are handled by the organization."
                    }}
                  </div>
                </v-card>
              </v-col>
            </v-row>
          </v-col>

          <!-- Right: Tips -->
          <v-col cols="12" md="4">
            <v-card rounded="xl" variant="outlined" class="pa-6">
              <div class="d-flex align-center ga-3">
                <v-avatar size="40" color="primary" variant="tonal">
                  <v-icon icon="lucide:lightbulb" />
                </v-avatar>
                <div>
                  <div class="text-subtitle-1 font-weight-bold">Tips</div>
                  <div class="text-body-2 text-medium-emphasis">
                    For best results
                  </div>
                </div>
              </div>

              <v-divider class="my-4" />

              <v-list class="bg-transparent" lines="one">
                <v-list-item>
                  <template #prepend>
                    <v-icon icon="lucide:check" class="text-medium-emphasis" />
                  </template>
                  <v-list-item-title class="text-body-2">
                    Answer honestly based on your current situation.
                  </v-list-item-title>
                </v-list-item>

                <v-list-item>
                  <template #prepend>
                    <v-icon icon="lucide:check" class="text-medium-emphasis" />
                  </template>
                  <v-list-item-title class="text-body-2">
                    Avoid refreshing the page mid-way through the questionnaire.
                  </v-list-item-title>
                </v-list-item>

                <v-list-item>
                  <template #prepend>
                    <v-icon icon="lucide:check" class="text-medium-emphasis" />
                  </template>
                  <v-list-item-title class="text-body-2">
                    If you’re unsure, choose the option that fits best.
                  </v-list-item-title>
                </v-list-item>
              </v-list>

              <v-btn
                class="mt-2"
                color="primary"
                rounded="xl"
                block
                @click="begin"
              >
                Begin questionnaire
              </v-btn>

              <v-btn
                class="mt-3"
                variant="outlined"
                rounded="xl"
                block
                @click="copyLink"
              >
                <v-icon icon="lucide:link" size="18" class="me-2" />
                Copy link
              </v-btn>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </section>

    <!-- Share dialog -->
    <v-dialog v-model="shareDialog" max-width="640">
      <v-card rounded="xl">
        <v-card-title class="px-6 pt-6">
          <div class="d-flex align-center justify-space-between ga-3">
            <div>
              <div class="text-h6 font-weight-bold">Share questionnaire</div>
              <div class="text-body-2 text-medium-emphasis mt-1">
                Copy this link and share it with respondents.
              </div>
            </div>
            <v-btn icon variant="text" @click="shareDialog = false">
              <v-icon icon="lucide:x" />
            </v-btn>
          </div>
        </v-card-title>

        <v-card-text class="px-6">
          <v-text-field
            :model-value="shareUrl"
            label="Share link"
            variant="outlined"
            rounded="xl"
            readonly
            hide-details
          >
            <template #append-inner>
              <v-btn
                variant="text"
                @click="copyText(shareUrl)"
                aria-label="Copy share link"
              >
                <v-icon icon="lucide:copy" />
              </v-btn>
            </template>
          </v-text-field>

          <v-alert class="mt-4" type="info" variant="tonal" rounded="xl">
            Respondents will fill respondent info first, then answer questions.
            Results are shown only if enabled by the organization.
          </v-alert>
        </v-card-text>

        <v-card-actions class="px-6 pb-6">
          <v-btn variant="text" rounded="xl" @click="shareDialog = false"
            >Close</v-btn
          >
          <v-spacer />
          <v-btn color="primary" rounded="xl" @click="copyText(shareUrl)">
            Copy link
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Snack -->
    <v-snackbar v-model="snack.show" :timeout="2200">
      {{ snack.text }}
      <template #actions>
        <v-btn variant="text" @click="snack.show = false">Close</v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import * as mock from "~/utils/mockPublicData";

type AnyQuestionnaire = Record<string, any>;

const route = useRoute();
const localePath = useLocalePath();

const code = computed(() => String(route.params.code || ""));

useHead(() => ({
  title: `Questionnaire — ${code.value} | SB Questionnaire`,
  meta: [
    {
      name: "description",
      content:
        "Start a questionnaire via a shareable link. Provide respondent info, answer single-choice questions, and submit to generate outcomes.",
    },
    { property: "og:title", content: `SB Questionnaire — ${code.value}` },
    {
      property: "og:description",
      content:
        "Start a questionnaire via a shareable link. Provide respondent info, answer single-choice questions, and submit to generate outcomes.",
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

/** UI state */
type UiState = "loading" | "error" | "data" | "empty";
const uiState = ref<UiState>("loading");

const q = ref<AnyQuestionnaire | null>(null);

onMounted(() => {
  // simulate load
  window.setTimeout(() => {
    const found = questionnairesRaw.value.find(
      (it) => String(it.code) === code.value,
    );
    const published =
      found && String(found.status || "").toLowerCase() === "published";
    q.value = published ? found : null;
    uiState.value = q.value ? "data" : "empty";
  }, 320);
});

/** Derived */
const questionCount = computed(() => {
  if (!q.value) return 0;
  const id = String(q.value.id);
  return questionsRaw.value.filter(
    (qq: any) => String(qq.questionnaire_id) === id,
  ).length;
});

const estimatedMinutes = computed(() => {
  // ~15s per question => 4 questions/min
  const minutes = Math.ceil(questionCount.value / 4);
  return Math.max(1, minutes);
});

const qMetaLine = computed(() => {
  if (!q.value) return "";
  const scoring =
    q.value.scoring_type === "multi_dimension"
      ? "Multi-dimension scoring"
      : "Total score";
  return `${scoring} • ${questionCount.value} questions`;
});

/** Organization portal link (best effort mapping) */
const orgPortalLink = computed(() => {
  if (!q.value) return null;
  const orgSlug = String(
    q.value.organization_slug ?? q.value.org_slug ?? "",
  ).trim();
  if (orgSlug) return localePath(`/organizations/${orgSlug}`);
  const orgId = String(
    q.value.organization_id ?? q.value.org_id ?? q.value.organizationId ?? "",
  ).trim();
  if (!orgId) return null;
  const found = organizationsRaw.value.find(
    (o: any) => String(o.id ?? o.organization_id ?? "") === orgId,
  );
  const slug = String(found?.slug ?? "");
  return slug ? localePath(`/organizations/${slug}`) : null;
});

/** Breadcrumbs */
const breadcrumbs = computed(() => {
  const items: any[] = [{ title: "Home", to: localePath("/") }];
  if (orgPortalLink.value)
    items.push({ title: "Organization", to: orgPortalLink.value });
  items.push({ title: "Questionnaire", disabled: true });
  return items;
});

/** Actions */
function begin() {
  if (!q.value) return;
  // Always go to user-info first
  navigateTo(localePath(`/q/${q.value.code}/user-info`));
}

/** Share */
const shareDialog = ref(false);
const shareUrl = computed(() => {
  const path = localePath(`/q/${code.value}`);
  if (process.client) return `${window.location.origin}${path}`;
  return path;
});

function openShare() {
  shareDialog.value = true;
}

const snack = ref({ show: false, text: "" });
function notify(text: string) {
  snack.value = { show: true, text };
}

async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    notify("Copied to clipboard");
  } catch {
    notify("Copy failed");
  }
}

function copyLink() {
  copyText(shareUrl.value);
}

/** Utility */
function copyLinkFromDialog() {
  copyText(shareUrl.value);
}
</script>

<style lang="scss" scoped>
.q-hero {
  position: relative;
  overflow: hidden;
  border-bottom: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));

  &::before {
    content: "";
    position: absolute;
    inset: -2px;
    background:
      radial-gradient(
        980px 560px at 14% 20%,
        rgba(var(--v-theme-primary), 0.18),
        transparent 56%
      ),
      radial-gradient(
        760px 520px at 84% 18%,
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

.q-summary {
  backdrop-filter: blur(10px);
  background-color: rgba(var(--v-theme-surface), 0.8);
}

.q-hero-subtitle {
  max-width: 78ch;
}

.q-card {
  transition:
    transform 160ms ease,
    box-shadow 160ms ease,
    border-color 160ms ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 26px rgba(0, 0, 0, 0.08);
    border-color: rgba(var(--v-theme-primary), 0.35);
  }
}

.max-width-narrow {
  max-width: 720px;
}

.min-width-0 {
  min-width: 0;
}

.min-w-240 {
  min-width: 240px;
}
</style>
