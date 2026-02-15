<!-- /pages/organizations/index.vue -->
<template>
  <div>
    <!-- Header -->
    <section class="org-hero">
      <v-container class="py-10 py-md-16">
        <v-row align="center" class="ga-6">
          <v-col cols="12" md="8">
            <v-breadcrumbs :items="breadcrumbs" class="px-0" density="compact">
              <template #divider>
                <v-icon icon="mdi-chevron-right" />
              </template>
            </v-breadcrumbs>

            <h1 class="text-h4 text-md-h3 font-weight-bold mb-3">
              Organizations
            </h1>
            <p class="text-body-1 text-medium-emphasis mb-0 org-hero-subtitle">
              Browse registered partners and access their public questionnaires.
              Designed for schools, universities, and partner programs.
            </p>
          </v-col>

          <v-col cols="12" md="4">
            <v-card rounded="xl" variant="outlined" class="pa-5">
              <div class="d-flex align-center ga-3">
                <v-avatar size="40" color="primary" variant="tonal">
                  <v-icon icon="lucide:building-2" />
                </v-avatar>
                <div>
                  <div class="text-subtitle-1 font-weight-bold">
                    Public directory
                  </div>
                  <div class="text-body-2 text-medium-emphasis">
                    Search, filter, and open an organization portal.
                  </div>
                </div>
              </div>

              <v-divider class="my-4" />

              <div class="d-flex flex-wrap ga-2">
                <v-chip
                  size="small"
                  variant="outlined"
                  class="text-medium-emphasis"
                >
                  Verified partners
                </v-chip>
                <v-chip
                  size="small"
                  variant="outlined"
                  class="text-medium-emphasis"
                >
                  Public questionnaires
                </v-chip>
                <v-chip
                  size="small"
                  variant="outlined"
                  class="text-medium-emphasis"
                >
                  Shareable links
                </v-chip>
              </div>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </section>

    <!-- Main -->
    <section>
      <v-container class="py-8 py-md-12">
        <!-- UI states -->
        <v-alert
          v-if="uiState === 'error'"
          type="error"
          variant="tonal"
          rounded="xl"
          class="mb-6"
        >
          Unable to load organizations (mock error state).
        </v-alert>

        <!-- Controls -->
        <v-row class="ga-4 mb-6" align="center">
          <v-col cols="12" md="6">
            <v-text-field
              v-model="search"
              variant="outlined"
              rounded="xl"
              label="Search organizations"
              placeholder="Search by name, tags, or location"
              hide-details="auto"
              clearable
            >
              <template #prepend-inner>
                <v-icon
                  icon="lucide:search"
                  size="18"
                  class="text-medium-emphasis"
                />
              </template>
            </v-text-field>
          </v-col>

          <v-col cols="12" md="3">
            <v-select
              v-model="typeFilter"
              :items="typeOptions"
              item-title="label"
              item-value="value"
              label="Type"
              variant="outlined"
              rounded="xl"
              hide-details="auto"
              clearable
            >
              <template #prepend-inner>
                <v-icon
                  icon="lucide:tag"
                  size="18"
                  class="text-medium-emphasis"
                />
              </template>
            </v-select>
          </v-col>

          <v-col cols="12" md="3">
            <v-select
              v-model="sortKey"
              :items="sortOptions"
              item-title="label"
              item-value="value"
              label="Sort"
              variant="outlined"
              rounded="xl"
              hide-details="auto"
            >
              <template #prepend-inner>
                <v-icon
                  icon="lucide:arrow-up-down"
                  size="18"
                  class="text-medium-emphasis"
                />
              </template>
            </v-select>
          </v-col>
        </v-row>

        <!-- Filter chips -->
        <div class="d-flex flex-wrap align-center ga-2 mb-6">
          <v-chip
            v-for="chip in quickChips"
            :key="chip.value"
            :color="activeChip === chip.value ? 'primary' : undefined"
            :variant="activeChip === chip.value ? 'tonal' : 'outlined'"
            rounded="xl"
            size="small"
            class="cursor-pointer"
            @click="toggleChip(chip.value)"
          >
            <v-icon :icon="chip.icon" size="16" class="me-2" />
            {{ chip.label }}
          </v-chip>

          <v-spacer />

          <div class="text-caption text-medium-emphasis">
            Showing <strong>{{ filteredSorted.length }}</strong> organization(s)
          </div>
        </div>

        <!-- Loading -->
        <div v-if="uiState === 'loading'">
          <v-row class="ga-4">
            <v-col v-for="n in 9" :key="n" cols="12" sm="6" md="4">
              <v-card rounded="xl" variant="outlined" class="pa-6">
                <v-skeleton-loader type="avatar, heading, text, text" />
              </v-card>
            </v-col>
          </v-row>
        </div>

        <!-- Empty -->
        <v-card
          v-else-if="uiState === 'empty'"
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
          <div class="text-h6 font-weight-bold">No organizations found</div>
          <div
            class="text-body-2 text-medium-emphasis mt-2 mx-auto max-width-narrow"
          >
            Try a different keyword or clear filters to see more results.
          </div>
          <v-btn
            class="mt-5"
            rounded="xl"
            variant="outlined"
            @click="resetFilters"
          >
            Clear filters
          </v-btn>
        </v-card>

        <!-- Data -->
        <div v-else>
          <v-row class="ga-4">
            <v-col
              v-for="org in pagedItems"
              :key="orgKey(org)"
              cols="12"
              sm="6"
              md="4"
            >
              <v-card
                rounded="xl"
                variant="outlined"
                class="h-100 d-flex flex-column org-card"
              >
                <div class="pa-6 pb-4">
                  <div class="d-flex align-center justify-space-between ga-3">
                    <div class="d-flex align-center ga-3">
                      <v-avatar size="44" color="primary" variant="tonal">
                        <span class="font-weight-bold">
                          {{ initials(orgName(org)) }}
                        </span>
                      </v-avatar>
                      <div>
                        <div class="text-subtitle-1 font-weight-bold">
                          {{ orgName(org) }}
                        </div>
                        <div class="text-body-2 text-medium-emphasis">
                          {{ orgSubtitle(org) }}
                        </div>
                      </div>
                    </div>

                    <v-chip
                      v-if="isVerified(org)"
                      color="primary"
                      variant="tonal"
                      size="small"
                    >
                      <v-icon
                        icon="lucide:badge-check"
                        size="16"
                        class="me-1"
                      />
                      Verified
                    </v-chip>
                  </div>

                  <div
                    v-if="orgDescription(org)"
                    class="text-body-2 text-medium-emphasis mt-4"
                  >
                    {{ orgDescription(org) }}
                  </div>

                  <div class="d-flex flex-wrap ga-2 mt-4">
                    <v-chip
                      v-for="(tag, i) in orgTags(org).slice(0, 4)"
                      :key="i"
                      size="x-small"
                      variant="outlined"
                      class="text-medium-emphasis"
                    >
                      {{ tag }}
                    </v-chip>
                    <v-chip
                      v-if="orgTags(org).length > 4"
                      size="x-small"
                      variant="outlined"
                      class="text-medium-emphasis"
                    >
                      +{{ orgTags(org).length - 4 }}
                    </v-chip>
                  </div>
                </div>

                <v-divider />

                <div class="pa-6 pt-4 mt-auto">
                  <div class="d-flex align-center justify-space-between mb-4">
                    <div
                      class="text-caption text-medium-emphasis d-flex align-center ga-2"
                    >
                      <v-icon icon="lucide:file-text" size="16" />
                      <span
                        >{{ publicQuestionnaireCount(org) }} public
                        questionnaire(s)</span
                      >
                    </div>
                    <div
                      class="text-caption text-medium-emphasis d-flex align-center ga-2"
                    >
                      <v-icon icon="lucide:map-pin" size="16" />
                      <span>{{ orgLocation(org) }}</span>
                    </div>
                  </div>

                  <v-btn color="primary" rounded="xl" block :to="orgLink(org)">
                    View organization
                  </v-btn>

                  <v-btn
                    class="mt-3"
                    variant="outlined"
                    rounded="xl"
                    block
                    :disabled="publicQuestionnaireCount(org) === 0"
                    @click="openQuickStart(org)"
                  >
                    Quick start
                  </v-btn>
                </div>
              </v-card>
            </v-col>
          </v-row>

          <!-- Pagination -->
          <div class="d-flex justify-center mt-10">
            <v-pagination
              v-model="page"
              :length="pageCount"
              rounded="xl"
              total-visible="7"
            />
          </div>
        </div>
      </v-container>
    </section>

    <!-- Quick start dialog -->
    <v-dialog v-model="quickStartDialog" max-width="720">
      <v-card rounded="xl">
        <v-card-title class="px-6 pt-6">
          <div class="d-flex align-center justify-space-between ga-3">
            <div>
              <div class="text-h6 font-weight-bold">Quick start</div>
              <div class="text-body-2 text-medium-emphasis mt-1">
                Pick a public questionnaire to start from {{ quickOrgName }}.
              </div>
            </div>
            <v-btn icon variant="text" @click="quickStartDialog = false">
              <v-icon icon="lucide:x" />
            </v-btn>
          </div>
        </v-card-title>

        <v-card-text class="px-6 pb-0">
          <v-alert
            v-if="quickStartItems.length === 0"
            type="info"
            variant="tonal"
            rounded="xl"
          >
            This organization has no public questionnaires available yet.
          </v-alert>

          <v-list v-else class="bg-transparent" lines="two">
            <v-list-item
              v-for="q in quickStartItems"
              :key="q.code"
              :title="q.title"
              :subtitle="q.description"
              @click="goToQuestionnaire(q.code)"
            >
              <template #prepend>
                <v-avatar size="36" color="primary" variant="tonal">
                  <v-icon icon="lucide:clipboard-list" />
                </v-avatar>
              </template>

              <template #append>
                <v-btn
                  variant="outlined"
                  rounded="xl"
                  @click.stop="goToQuestionnaire(q.code)"
                >
                  Start
                </v-btn>
              </template>
            </v-list-item>
          </v-list>
        </v-card-text>

        <v-card-actions class="px-6 pb-6 pt-4">
          <v-btn variant="text" rounded="xl" @click="quickStartDialog = false">
            Close
          </v-btn>
          <v-spacer />
          <v-btn color="primary" rounded="xl" :to="quickOrgLink">
            View organization
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import { useRouter } from "vue-router";

/**
 * Mock data source (uploaded file)
 * - Keep imports flexible: if named exports differ, adjust here only.
 */
import * as mock from "~/utils/mockPublicData";

type AnyOrg = Record<string, any>;

const router = useRouter();
const localePath = useLocalePath();

useHead(() => ({
  title: "Organizations — SB Questionnaire",
  meta: [
    {
      name: "description",
      content:
        "Browse registered organizations and access public questionnaires from schools, universities, and partner programs.",
    },
    { property: "og:title", content: "Organizations — SB Questionnaire" },
    {
      property: "og:description",
      content:
        "Browse registered organizations and access public questionnaires from schools, universities, and partner programs.",
    },
  ],
}));

/** Data (defensive read from mock file) */
const organizationsRaw = computed<AnyOrg[]>(() => {
  const orgs = (mock as any).organizations;
  return Array.isArray(orgs) ? orgs : [];
});

const questionnairesRaw = computed<any[]>(() => {
  const qs = (mock as any).questionnaires;
  return Array.isArray(qs) ? qs : [];
});

/**
 * UI State simulation (Loading/Error/Data/Empty)
 * - In real implementation: derived from API status
 */
type UiState = "loading" | "error" | "data" | "empty";
const uiState = ref<UiState>("loading");

onMounted(() => {
  // simulate load
  window.setTimeout(() => {
    // set to 'data' if have items, else 'empty'
    uiState.value = organizationsRaw.value.length > 0 ? "data" : "empty";
  }, 450);
});

/** Breadcrumbs */
const breadcrumbs = computed(() => [
  { title: "Home", to: localePath("/") },
  { title: "Organizations", disabled: true },
]);

/** Filters */
const search = ref("");
const typeFilter = ref<string | null>(null);
const activeChip = ref<"verified" | "has_public" | null>(null);

const typeOptions = computed(() => {
  // infer types from mock data (flexible)
  const types = new Set<string>();
  for (const o of organizationsRaw.value) {
    const t = String(o.type || o.category || o.kind || "").trim();
    if (t) types.add(t);
  }
  return Array.from(types)
    .sort()
    .map((t) => ({ label: startCase(t), value: t }));
});

const sortKey = ref<"name_asc" | "name_desc" | "most_public">("name_asc");
const sortOptions = [
  { label: "Name (A–Z)", value: "name_asc" },
  { label: "Name (Z–A)", value: "name_desc" },
  { label: "Most public questionnaires", value: "most_public" },
] as const;

const quickChips = [
  { label: "Verified", value: "verified", icon: "lucide:badge-check" },
  {
    label: "Has public questionnaires",
    value: "has_public",
    icon: "lucide:file-text",
  },
] as const;

function toggleChip(v: "verified" | "has_public") {
  activeChip.value = activeChip.value === v ? null : v;
}

function resetFilters() {
  search.value = "";
  typeFilter.value = null;
  activeChip.value = null;
  sortKey.value = "name_asc";
  page.value = 1;
}

/** Derivation */
const filtered = computed(() => {
  const q = search.value.trim().toLowerCase();

  return organizationsRaw.value.filter((org) => {
    // type filter
    if (typeFilter.value) {
      const t = String(org.type || org.category || org.kind || "").trim();
      if (t !== typeFilter.value) return false;
    }

    // quick chips
    if (activeChip.value === "verified" && !isVerified(org)) return false;
    if (
      activeChip.value === "has_public" &&
      publicQuestionnaireCount(org) === 0
    )
      return false;

    // search
    if (!q) return true;
    const hay = [
      orgName(org),
      orgSubtitle(org),
      orgDescription(org),
      orgLocation(org),
      ...(orgTags(org) || []),
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    return hay.includes(q);
  });
});

const filteredSorted = computed(() => {
  const items = [...filtered.value];

  if (sortKey.value === "most_public") {
    items.sort(
      (a, b) => publicQuestionnaireCount(b) - publicQuestionnaireCount(a),
    );
    return items;
  }

  items.sort((a, b) => {
    const an = orgName(a).toLowerCase();
    const bn = orgName(b).toLowerCase();
    return sortKey.value === "name_desc"
      ? bn.localeCompare(an)
      : an.localeCompare(bn);
  });

  return items;
});

/** Empty-state sync */
watch(
  () => [uiState.value, filteredSorted.value.length],
  () => {
    if (uiState.value === "data") {
      uiState.value = filteredSorted.value.length > 0 ? "data" : "empty";
    }
  },
);

/** Pagination */
const page = ref(1);
const pageSize = 9;

const pageCount = computed(() =>
  Math.max(1, Math.ceil(filteredSorted.value.length / pageSize)),
);

const pagedItems = computed(() => {
  const start = (page.value - 1) * pageSize;
  return filteredSorted.value.slice(start, start + pageSize);
});

watch(pageCount, () => {
  if (page.value > pageCount.value) page.value = pageCount.value;
});

/** Quick start dialog */
const quickStartDialog = ref(false);
const quickOrg = ref<AnyOrg | null>(null);

const quickOrgName = computed(() =>
  quickOrg.value ? orgName(quickOrg.value) : "this organization",
);
const quickOrgLink = computed(() =>
  quickOrg.value ? orgLink(quickOrg.value) : localePath("/organizations"),
);

const quickStartItems = computed(() => {
  if (!quickOrg.value) return [];
  const orgId = String(
    quickOrg.value.id ?? quickOrg.value.organization_id ?? "",
  );
  const orgSlug = String(quickOrg.value.slug ?? "");

  // Find questionnaires that belong to org (best-effort matching)
  const owned = questionnairesRaw.value.filter((q: any) => {
    const qOrgId = String(
      q.organization_id ?? q.org_id ?? q.organizationId ?? "",
    );
    const qOrgSlug = String(q.organization_slug ?? q.org_slug ?? "");
    return (orgId && qOrgId === orgId) || (orgSlug && qOrgSlug === orgSlug);
  });

  // If no explicit mapping exists, fallback: none
  return owned
    .filter((q: any) => String(q.status || "").toLowerCase() === "published")
    .filter((q: any) => (q.is_public ?? q.public ?? true) === true)
    .slice(0, 8)
    .map((q: any) => ({
      code: String(q.code || ""),
      title: String(q.title || "Untitled questionnaire"),
      description: String(q.description || ""),
    }));
});

function openQuickStart(org: AnyOrg) {
  quickOrg.value = org;
  quickStartDialog.value = true;
}

function goToQuestionnaire(code: string) {
  if (!code) return;
  quickStartDialog.value = false;
  router.push(localePath(`/q/${code}`));
}

/** Helpers: organization field access (schema-flexible) */
function orgKey(org: AnyOrg) {
  return String(org.id ?? org.slug ?? org.code ?? org.name ?? Math.random());
}

function orgName(org: AnyOrg) {
  return String(
    org.name ?? org.title ?? org.organization_name ?? "Organization",
  );
}

function orgSubtitle(org: AnyOrg) {
  const type = String(org.type ?? org.category ?? org.kind ?? "").trim();
  const typeLabel = type ? startCase(type) : "Organization";
  const extra = String(org.short_description ?? org.tagline ?? "").trim();
  return extra ? `${typeLabel} • ${extra}` : typeLabel;
}

function orgDescription(org: AnyOrg) {
  return String(org.description ?? org.about ?? "").trim();
}

function orgTags(org: AnyOrg): string[] {
  const tags = org.tags ?? org.tag_list ?? org.labels;
  if (Array.isArray(tags)) return tags.map((t) => String(t)).filter(Boolean);
  if (typeof tags === "string")
    return tags
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
  return [];
}

function orgLocation(org: AnyOrg) {
  const city = String(org.city ?? "").trim();
  const country = String(org.country ?? "").trim();
  const state = String(org.state ?? "").trim();
  const parts = [city, state, country].filter(Boolean);
  return parts.length ? parts.join(", ") : "—";
}

function isVerified(org: AnyOrg) {
  return Boolean(org.is_verified ?? org.verified ?? org.isVerified ?? false);
}

function orgLink(org: AnyOrg) {
  const slug = String(org.slug ?? org.code ?? "").trim();
  return slug
    ? localePath(`/organizations/${slug}`)
    : localePath("/organizations");
}

function publicQuestionnaireCount(org: AnyOrg) {
  const orgId = String(org.id ?? org.organization_id ?? "");
  const orgSlug = String(org.slug ?? "");

  const owned = questionnairesRaw.value.filter((q: any) => {
    const qOrgId = String(
      q.organization_id ?? q.org_id ?? q.organizationId ?? "",
    );
    const qOrgSlug = String(q.organization_slug ?? q.org_slug ?? "");
    const matchesOrg =
      (orgId && qOrgId === orgId) || (orgSlug && qOrgSlug === orgSlug);
    return matchesOrg;
  });

  return owned.filter((q: any) => {
    const published = String(q.status || "").toLowerCase() === "published";
    const isPublic = (q.is_public ?? q.public ?? true) === true;
    return published && isPublic;
  }).length;
}

/** Text helpers */
function initials(name: string): string {
  const parts = (name || "").trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "?";
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? (parts[parts.length - 1]?.[0] ?? "") : "";
  return (first + last).toUpperCase();
}

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
        900px 520px at 12% 18%,
        rgba(var(--v-theme-primary), 0.16),
        transparent 55%
      ),
      radial-gradient(
        720px 460px at 86% 14%,
        rgba(var(--v-theme-primary), 0.1),
        transparent 60%
      ),
      linear-gradient(
        180deg,
        rgba(var(--v-theme-surface), 0.7),
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

.org-hero-subtitle {
  max-width: 68ch;
}

.org-card {
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
  max-width: 640px;
}
</style>
