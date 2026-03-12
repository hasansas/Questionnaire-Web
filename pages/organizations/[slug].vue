<template>
  <div>
    <!-- HERO / HEADER -->
    <section class="org-hero">
      <v-container class="py-10 py-md-16">
        <!-- Loading -->
        <v-row v-if="uiState === 'loading'" class="ga-6" align="center">
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
          Unable to load organization.
        </v-alert>

        <!-- Empty / Not found -->
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
          <div class="text-h6 font-weight-bold">Organization not found</div>
          <div
            class="text-body-2 text-medium-emphasis mt-2 mx-auto max-width-narrow"
          >
            The organization slug “{{ slug }}” does not exist in the directory.
            Try going back to the organizations list.
          </div>
          <v-btn
            class="mt-5"
            rounded="xl"
            color="primary"
            :to="localePath('/organizations')"
          >
            Back to organizations
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

          <v-row class="ga-6" align="center">
            <v-col cols="12" md="8">
              <div class="d-flex align-center ga-3 mb-4">
                <v-avatar size="56" color="primary" variant="tonal">
                  <span class="text-h6 font-weight-bold">
                    {{ initials(orgName(org!)) }}
                  </span>
                </v-avatar>

                <div class="min-width-0">
                  <h1
                    class="text-h4 text-md-h3 font-weight-bold mb-1 text-truncate"
                  >
                    {{ orgName(org!) }}
                  </h1>
                  <div class="text-body-1 text-medium-emphasis">
                    {{ orgSubtitle(org!) }}
                  </div>
                </div>

                <v-chip
                  v-if="isVerified(org!)"
                  color="primary"
                  variant="tonal"
                  class="ms-auto"
                >
                  <v-icon icon="lucide:badge-check" size="18" class="me-1" />
                  Verified partner
                </v-chip>
              </div>

              <p
                v-if="orgDescription(org!)"
                class="text-body-1 text-medium-emphasis mb-0 org-hero-subtitle"
              >
                {{ orgDescription(org!) }}
              </p>

              <div class="d-flex flex-wrap ga-2 mt-5">
                <v-chip
                  v-if="orgLocation(org!) !== '—'"
                  size="small"
                  variant="outlined"
                  class="text-medium-emphasis"
                >
                  <v-icon icon="lucide:map-pin" size="16" class="me-1" />
                  {{ orgLocation(org!) }}
                </v-chip>

                <v-chip
                  v-for="(tag, i) in orgTags(org!).slice(0, 6)"
                  :key="i"
                  size="small"
                  variant="outlined"
                  class="text-medium-emphasis"
                >
                  {{ tag }}
                </v-chip>

                <v-chip
                  v-if="orgTags(org!).length > 6"
                  size="small"
                  variant="outlined"
                  class="text-medium-emphasis"
                >
                  +{{ orgTags(org!).length - 6 }}
                </v-chip>
              </div>
            </v-col>

            <v-col cols="12" md="4">
              <v-card rounded="xl" variant="outlined" class="pa-6 org-summary">
                <div class="d-flex align-center ga-3">
                  <v-avatar size="40" color="primary" variant="tonal">
                    <v-icon icon="lucide:layout-grid" />
                  </v-avatar>
                  <div>
                    <div class="text-subtitle-1 font-weight-bold">
                      Public questionnaires
                    </div>
                    <div class="text-body-2 text-medium-emphasis">
                      Start directly from this organization portal.
                    </div>
                  </div>
                </div>

                <v-divider class="my-4" />

                <div class="d-flex justify-space-between align-center mb-2">
                  <div class="text-caption text-medium-emphasis">Available</div>
                  <div class="text-h6 font-weight-bold">
                    {{ publicQuestionnaires.length }}
                  </div>
                </div>

                <div class="d-flex justify-space-between align-center mb-4">
                  <div class="text-caption text-medium-emphasis">
                    Estimated time
                  </div>
                  <div class="text-body-2 font-weight-medium">
                    {{ totalEstimatedMinutes }}–{{ totalEstimatedMinutes + 5 }}
                    min
                  </div>
                </div>

                <v-btn
                  color="primary"
                  rounded="xl"
                  block
                  :disabled="publicQuestionnaires.length === 0"
                  @click="scrollTo('#public-questionnaires')"
                >
                  Browse questionnaires
                </v-btn>

                <v-btn
                  class="mt-3"
                  variant="outlined"
                  rounded="xl"
                  block
                  @click="copyOrgLink"
                >
                  <v-icon icon="lucide:link" size="18" class="me-2" />
                  Copy organization link
                </v-btn>
              </v-card>
            </v-col>
          </v-row>
        </div>
      </v-container>
    </section>

    <!-- MAIN CONTENT -->
    <section v-if="uiState === 'data'">
      <v-container class="py-10 py-md-14">
        <v-row class="ga-8">
          <!-- Left: Public questionnaires -->
          <v-col cols="12" md="8">
            <div id="public-questionnaires" class="anchor-offset" />

            <div
              class="d-flex flex-wrap align-end justify-space-between ga-3 mb-6"
            >
              <div>
                <h2 class="text-h5 text-md-h4 font-weight-bold mb-1">
                  Public questionnaires
                </h2>
                <p class="text-body-1 text-medium-emphasis mb-0">
                  Choose a questionnaire to start. You will be asked for
                  respondent info before answering.
                </p>
              </div>

              <div class="d-flex flex-wrap ga-2">
                <v-text-field
                  v-model="qSearch"
                  label="Search questionnaires"
                  placeholder="Search by title or description"
                  variant="outlined"
                  rounded="xl"
                  hide-details="auto"
                  density="comfortable"
                  clearable
                  class="min-w-240"
                >
                  <template #prepend-inner>
                    <v-icon
                      icon="lucide:search"
                      size="18"
                      class="text-medium-emphasis"
                    />
                  </template>
                </v-text-field>

                <v-select
                  v-model="langFilter"
                  label="Language"
                  :items="langOptions"
                  variant="outlined"
                  rounded="xl"
                  hide-details="auto"
                  density="comfortable"
                  clearable
                  class="min-w-180"
                >
                  <template #prepend-inner>
                    <v-icon
                      icon="lucide:languages"
                      size="18"
                      class="text-medium-emphasis"
                    />
                  </template>
                </v-select>
              </div>
            </div>

            <!-- Empty state -->
            <v-card
              v-if="filteredPublicQuestionnaires.length === 0"
              rounded="xl"
              variant="outlined"
              class="pa-8 text-center"
            >
              <v-avatar
                size="52"
                color="primary"
                variant="tonal"
                class="mx-auto mb-3"
              >
                <v-icon icon="lucide:inbox" />
              </v-avatar>
              <div class="text-h6 font-weight-bold">
                No public questionnaires
              </div>
              <div
                class="text-body-2 text-medium-emphasis mt-2 mx-auto max-width-narrow"
              >
                This organization does not have any published public
                questionnaires available at the moment.
              </div>
            </v-card>

            <!-- List -->
            <v-row v-else class="ga-4">
              <v-col
                v-for="q in filteredPublicQuestionnaires"
                :key="q.id"
                cols="12"
                sm="6"
              >
                <v-card
                  rounded="xl"
                  variant="outlined"
                  class="h-100 d-flex flex-column q-card"
                >
                  <div class="pa-6 pb-4">
                    <div class="d-flex flex-wrap ga-2 mb-3">
                      <v-chip
                        size="small"
                        variant="outlined"
                        class="text-medium-emphasis"
                      >
                        {{ String(q.language || "").toUpperCase() }}
                      </v-chip>
                      <v-chip
                        size="small"
                        variant="outlined"
                        class="text-medium-emphasis"
                      >
                        {{
                          q.scoring_type === "multi_dimension"
                            ? "Multi-dimension"
                            : "Total score"
                        }}
                      </v-chip>
                      <v-chip
                        size="small"
                        :color="q.show_result_to_user ? 'primary' : undefined"
                        :variant="q.show_result_to_user ? 'tonal' : 'outlined'"
                        class="text-medium-emphasis"
                      >
                        {{
                          q.show_result_to_user
                            ? "Result visible"
                            : "Thank you only"
                        }}
                      </v-chip>
                    </div>

                    <div class="text-subtitle-1 font-weight-bold mb-1">
                      {{ q.title }}
                    </div>
                    <div class="text-body-2 text-medium-emphasis">
                      {{ q.description }}
                    </div>

                    <v-divider class="my-4" />

                    <div class="d-flex justify-space-between align-center">
                      <div
                        class="text-caption text-medium-emphasis d-flex align-center ga-2"
                      >
                        <v-icon icon="lucide:list-checks" size="16" />
                        <span>{{ questionCount(q.id) }} questions</span>
                      </div>
                      <div
                        class="text-caption text-medium-emphasis d-flex align-center ga-2"
                      >
                        <v-icon icon="lucide:clock" size="16" />
                        <span>~{{ estimatedMinutes(q.id) }} min</span>
                      </div>
                    </div>
                  </div>

                  <div class="pa-6 pt-0 mt-auto">
                    <v-btn
                      color="primary"
                      rounded="xl"
                      block
                      :to="localePath(`/q/${q.code}`)"
                    >
                      Start
                    </v-btn>
                    <v-btn
                      class="mt-3"
                      variant="outlined"
                      rounded="xl"
                      block
                      @click="openShare(q.code)"
                    >
                      <v-icon icon="lucide:share-2" size="18" class="me-2" />
                      Share link
                    </v-btn>
                  </div>
                </v-card>
              </v-col>
            </v-row>
          </v-col>

          <!-- Right: About + Contact -->
          <v-col cols="12" md="4">
            <v-card rounded="xl" variant="outlined" class="pa-6 mb-6">
              <div class="d-flex align-center ga-3">
                <v-avatar size="40" color="primary" variant="tonal">
                  <v-icon icon="lucide:info" />
                </v-avatar>
                <div>
                  <div class="text-subtitle-1 font-weight-bold">
                    Organization overview
                  </div>
                  <div class="text-body-2 text-medium-emphasis">
                    Details and quick actions
                  </div>
                </div>
              </div>

              <v-divider class="my-4" />

              <div class="text-body-2 text-medium-emphasis">
                <div class="d-flex align-center ga-2 mb-2">
                  <v-icon icon="lucide:building-2" size="18" />
                  <span class="font-weight-medium">{{
                    orgSubtitle(org!)
                  }}</span>
                </div>

                <div class="d-flex align-center ga-2 mb-2">
                  <v-icon icon="lucide:map-pin" size="18" />
                  <span>{{ orgLocation(org!) }}</span>
                </div>

                <div class="d-flex align-center ga-2 mb-2">
                  <v-icon icon="lucide:file-text" size="18" />
                  <span
                    >{{ publicQuestionnaires.length }} public
                    questionnaire(s)</span
                  >
                </div>

                <div class="d-flex align-center ga-2">
                  <v-icon icon="lucide:shield-check" size="18" />
                  <span>{{
                    isVerified(org!) ? "Verified partner" : "Partner"
                  }}</span>
                </div>
              </div>

              <v-divider class="my-4" />

              <v-btn rounded="xl" variant="outlined" block @click="copyOrgLink">
                <v-icon icon="lucide:link" size="18" class="me-2" />
                Copy portal link
              </v-btn>
            </v-card>

            <v-card rounded="xl" variant="outlined" class="pa-6">
              <div class="d-flex align-center ga-3">
                <v-avatar size="40" color="primary" variant="tonal">
                  <v-icon icon="lucide:mail" />
                </v-avatar>
                <div>
                  <div class="text-subtitle-1 font-weight-bold">Contact</div>
                  <div class="text-body-2 text-medium-emphasis">
                    Need help or want to partner?
                  </div>
                </div>
              </div>

              <v-divider class="my-4" />

              <div class="text-body-2 text-medium-emphasis">
                Email:
                <span class="font-weight-medium">hello[at]superbazi.com</span>
              </div>

              <v-btn
                class="mt-4"
                color="primary"
                rounded="xl"
                block
                @click="requestDemo"
              >
                Request a demo
              </v-btn>

              <div class="text-caption text-medium-emphasis mt-3">
                Admin users can manage questionnaires and reporting via
                organization dashboard.
              </div>
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
                Copy this shareable link to distribute the questionnaire.
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
            Users will fill respondent info first, then answer the
            questionnaire. Results may be shown only if enabled.
          </v-alert>
        </v-card-text>

        <v-card-actions class="px-6 pb-6">
          <v-btn variant="text" rounded="xl" @click="shareDialog = false"
            >Close</v-btn
          >
          <v-spacer />
          <v-btn color="primary" rounded="xl" :to="localePath(sharePath)"
            >Open start page</v-btn
          >
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
import { computed, onMounted, ref, watch } from "vue";

import * as mock from "~/utils/mockPublicData";

type AnyOrg = Record<string, any>;
type AnyQuestionnaire = Record<string, any>;

const route = useRoute();
const localePath = useLocalePath();

const slug = computed(() => String(route.params.slug || ""));

useHead(() => ({
  title: `Organization — ${slug.value} | SB Questionnaire`,
  meta: [
    {
      name: "description",
      content:
        "Organization portal for public questionnaires on SB Questionnaire.",
    },
    { property: "og:title", content: `SB Questionnaire — ${slug.value}` },
    {
      property: "og:description",
      content:
        "Browse public questionnaires owned by this organization and start from a shareable link.",
    },
  ],
}));

/** Defensive access to mock exports */
const organizationsRaw = computed<AnyOrg[]>(() => {
  const orgs = (mock as any).organizations;
  return Array.isArray(orgs) ? orgs : [];
});

const questionnairesRaw = computed<AnyQuestionnaire[]>(() => {
  const qs = (mock as any).questionnaires;
  return Array.isArray(qs) ? qs : [];
});

const questionsRaw = computed<any[]>(() => {
  const qq = (mock as any).questionnaire_questions;
  return Array.isArray(qq) ? qq : [];
});

/** UI state (Loading/Error/Data/Empty) */
type UiState = "loading" | "error" | "data" | "empty";
const uiState = ref<UiState>("loading");

const org = ref<AnyOrg | null>(null);

onMounted(() => {
  // simulate load
  window.setTimeout(() => {
    const found = organizationsRaw.value.find(
      (o) => String(o.slug ?? o.code ?? "") === slug.value,
    );
    org.value = found || null;
    uiState.value = org.value ? "data" : "empty";
  }, 350);
});

/** Breadcrumbs */
const breadcrumbs = computed(() => [
  { title: "Home", to: localePath("/") },
  { title: "Organizations", to: localePath("/organizations") },
  { title: org.value ? orgName(org.value) : slug.value, disabled: true },
]);

/** Public questionnaires owned by this org (best-effort mapping) */
const publicQuestionnaires = computed(() => {
  if (!org.value) return [];
  const orgId = String(org.value.id ?? org.value.organization_id ?? "");
  const orgSlug = String(org.value.slug ?? "");

  const owned = questionnairesRaw.value.filter((q) => {
    const qOrgId = String(
      q.organization_id ?? q.org_id ?? q.organizationId ?? "",
    );
    const qOrgSlug = String(q.organization_slug ?? q.org_slug ?? "");
    const matchesOrg =
      (orgId && qOrgId === orgId) || (orgSlug && qOrgSlug === orgSlug);
    return matchesOrg;
  });

  return owned
    .filter((q) => String(q.status || "").toLowerCase() === "published")
    .filter((q) => (q.is_public ?? q.public ?? true) === true);
});

/** Search & filter */
const qSearch = ref("");
const langFilter = ref<string | null>(null);

const langOptions = computed(() => {
  const set = new Set<string>();
  for (const q of publicQuestionnaires.value) {
    const l = String(q.language || "").trim();
    if (l) set.add(l);
  }
  return Array.from(set)
    .sort()
    .map((l) => String(l).toUpperCase());
});

const filteredPublicQuestionnaires = computed(() => {
  const q = qSearch.value.trim().toLowerCase();
  const lang = langFilter.value ? langFilter.value.toLowerCase() : null;

  return publicQuestionnaires.value.filter((item) => {
    if (lang) {
      const l = String(item.language || "").toLowerCase();
      if (l !== lang) return false;
    }

    if (!q) return true;

    const hay = [String(item.title || ""), String(item.description || "")]
      .join(" ")
      .toLowerCase();
    return hay.includes(q);
  });
});

/** Estimated time summary */
const totalEstimatedMinutes = computed(() => {
  const counts = filteredPublicQuestionnaires.value.map((q) =>
    estimatedMinutes(String(q.id)),
  );
  const sum = counts.reduce((a, b) => a + b, 0);
  return Math.max(1, Math.min(40, sum)); // cap for UI niceness
});

/** Share dialog */
const shareDialog = ref(false);
const sharePath = ref<string>("");
const shareUrl = computed(() => {
  if (!sharePath.value) return "";
  if (import.meta.client)
    return `${window.location.origin}${localePath(sharePath.value)}`;
  return localePath(sharePath.value);
});

function openShare(code: string) {
  if (!code) return;
  sharePath.value = `/q/${code}`;
  shareDialog.value = true;
}

/** Snack */
const snack = ref({ show: false, text: "" });
function notify(text: string) {
  snack.value = { show: true, text };
}

/** Actions */
function scrollTo(selector: string) {
  if (!import.meta.client) return;
  const el = document.querySelector(selector);
  el?.scrollIntoView({ behavior: "smooth", block: "start" });
}

async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    notify("Copied to clipboard");
  } catch {
    notify("Copy failed");
  }
}

function copyOrgLink() {
  if (!import.meta.client) return;
  copyText(window.location.href);
}

function requestDemo() {
  if (!import.meta.client) return;
  window.dispatchEvent(new CustomEvent("sbq:request-demo"));
  notify("Demo request opened");
}

/** Helpers */
function orgName(o: AnyOrg) {
  return String(o.name ?? o.title ?? o.organization_name ?? "Organization");
}

function orgSubtitle(o: AnyOrg) {
  const type = String(o.type ?? o.category ?? o.kind ?? "").trim();
  const typeLabel = type ? startCase(type) : "Organization";
  const extra = String(o.short_description ?? o.tagline ?? "").trim();
  return extra ? `${typeLabel} • ${extra}` : typeLabel;
}

function orgDescription(o: AnyOrg) {
  return String(o.description ?? o.about ?? "").trim();
}

function orgTags(o: AnyOrg): string[] {
  const tags = o.tags ?? o.tag_list ?? o.labels;
  if (Array.isArray(tags)) return tags.map((t) => String(t)).filter(Boolean);
  if (typeof tags === "string")
    return tags
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
  return [];
}

function orgLocation(o: AnyOrg) {
  const city = String(o.city ?? "").trim();
  const country = String(o.country ?? "").trim();
  const state = String(o.state ?? "").trim();
  const parts = [city, state, country].filter(Boolean);
  return parts.length ? parts.join(", ") : "—";
}

function isVerified(o: AnyOrg) {
  return Boolean(o.is_verified ?? o.verified ?? o.isVerified ?? false);
}

function initials(name: string): string {
  const parts = (name || "").trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "?";
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? (parts[parts.length - 1]?.[0] ?? "") : "";
  return (first + last).toUpperCase();
}

/** Question helpers */
function questionCount(questionnaireId: string): number {
  return questionsRaw.value.filter(
    (qq: any) => String(qq.questionnaire_id) === String(questionnaireId),
  ).length;
}

function estimatedMinutes(questionnaireId: string): number {
  const count = questionCount(questionnaireId);
  // ~15s per question => 4 questions/min
  const minutes = Math.ceil(count / 4);
  return Math.max(1, minutes);
}

/** Text helper */
function startCase(input: string): string {
  return (input || "")
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(
      /\w\S*/g,
      (w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase(),
    );
}

/** Ensure UI state remains correct if slug changes client-side */
watch(slug, () => {
  uiState.value = "loading";
  org.value = null;
  window.setTimeout(() => {
    const found = organizationsRaw.value.find(
      (o) => String(o.slug ?? o.code ?? "") === slug.value,
    );
    org.value = found || null;
    uiState.value = org.value ? "data" : "empty";
  }, 250);
});
</script>

<style lang="scss" scoped>
.org-hero {
  position: relative;
  overflow: hidden;
  border-bottom: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));

  &::before {
    content: "";
    position: absolute;
    inset: -2px;
    background:
      radial-gradient(
        920px 520px at 14% 18%,
        rgba(var(--v-theme-primary), 0.18),
        transparent 55%
      ),
      radial-gradient(
        760px 480px at 86% 20%,
        rgba(var(--v-theme-primary), 0.1),
        transparent 60%
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

.org-summary {
  backdrop-filter: blur(10px);
  background-color: rgba(var(--v-theme-surface), 0.8);
}

.org-hero-subtitle {
  max-width: 74ch;
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

.min-w-180 {
  min-width: 180px;
}

.anchor-offset {
  position: relative;
  top: -92px; /* account for app bar */
  height: 0;
}
</style>
