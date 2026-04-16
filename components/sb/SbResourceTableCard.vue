<!-- /components/sb/SbResourceTableCard.vue -->
<template>
  <div class="sb-resource-page">
    <!-- Page header -->
    <div
      v-if="showHeader"
      class="d-flex align-center justify-space-between ga-3 flex-wrap mb-6"
    >
      <div class="min-w-0">
        <h1 class="text-h5 font-weight-black ma-0">{{ pageTitle }}</h1>
        <p
          v-if="pageSubtitle"
          class="text-body-2 text-medium-emphasis mt-1 mb-0"
        >
          {{ pageSubtitle }}
        </p>
      </div>
      <div class="d-flex align-center ga-2 flex-wrap justify-end">
        <slot name="page-action">
          <v-btn
            v-if="primaryText"
            color="primary"
            rounded="lg"
            :prepend-icon="primaryIcon"
            :disabled="primaryDisabled"
            :loading="primaryLoading"
            @click="$emit('primary')"
          >
            {{ primaryText }}
          </v-btn>
        </slot>
      </div>
    </div>

    <v-card rounded="xl" variant="outlined" class="data-table overflow-hidden">
      <v-card-text class="pa-0">
        <!-- Error -->
        <div v-if="state.error" class="pa-10 text-center">
          <v-avatar
            size="56"
            rounded="xl"
            color="error"
            variant="tonal"
            class="mb-4"
          >
            <v-icon icon="lucide:triangle-alert" size="26" />
          </v-avatar>
          <div class="text-h6 font-weight-black mb-1">{{ errorTitle }}</div>
          <div class="text-body-2 text-medium-emphasis mb-5">
            {{ state.errorMessage || fallbackErrorMessage }}
          </div>
          <v-btn
            color="primary"
            rounded="lg"
            prepend-icon="lucide:refresh-cw"
            :loading="state.loading"
            @click="refresh({ reset: true })"
          >
            Retry
          </v-btn>
        </div>

        <!-- Loading (first load) -->
        <div v-else-if="state.loading && !state.loaded" class="pa-4">
          <SbSkeletonTable />
        </div>

        <!-- Empty -->
        <div v-else-if="isEmpty" class="pa-10 text-center">
          <slot name="empty">
            <v-avatar
              size="56"
              rounded="xl"
              color="primary"
              variant="tonal"
              class="mb-4"
            >
              <v-icon :icon="emptyIcon" size="26" />
            </v-avatar>
            <div class="text-h6 font-weight-black mb-1">{{ emptyTitle }}</div>
            <div class="text-body-2 text-medium-emphasis mb-4">
              {{ emptySubtitle }}
            </div>
            <v-btn
              v-if="emptyPrimaryText"
              color="primary"
              rounded="lg"
              prepend-icon="lucide:plus"
              @click="$emit('empty:primary')"
            >
              {{ emptyPrimaryText }}
            </v-btn>
          </slot>
        </div>

        <!-- Data -->
        <v-card v-else variant="flat" class="rounded-0">
          <!-- Head -->
          <div class="d-flex align-center ga-2 pa-3 flex-wrap">
            <slot name="head-left">
              <div class="min-w-0">
                <div class="text-subtitle-1 font-weight-black">
                  {{ headerTitle ?? `All ${pageTitle}` }}
                </div>
                <div class="text-caption text-medium-emphasis">
                  {{ items.length }} shown · {{ pagination.total }} total
                </div>
              </div>
            </slot>

            <v-spacer />

            <div class="d-flex align-center ga-2 flex-wrap">
              <v-form @submit.prevent="onSearchSubmit">
                <v-text-field
                  v-model="state.search"
                  density="compact"
                  variant="outlined"
                  rounded="lg"
                  hide-details
                  clearable
                  :placeholder="searchPlaceholder"
                  class="sb-search-form"
                  @click:clear="onSearchClear"
                >
                  <template #prepend-inner>
                    <v-icon
                      icon="lucide:search"
                      size="18"
                      class="text-medium-emphasis"
                    />
                  </template>
                </v-text-field>
              </v-form>

              <v-btn
                v-if="showFilter"
                rounded="lg"
                variant="outlined"
                color="primary"
                height="40"
                @click="filterDrawer = true"
              >
                <v-icon
                  icon="lucide:sliders-horizontal"
                  size="18"
                  class="me-2"
                />
                Filters
                <v-chip
                  v-if="activeFilterCount > 0"
                  size="x-small"
                  rounded="lg"
                  color="primary"
                  variant="tonal"
                  class="ms-2 font-weight-bold"
                >
                  {{ activeFilterCount }}
                </v-chip>
              </v-btn>

              <slot name="head-right" />
            </div>
          </div>

          <v-divider />

          <v-data-table
            :headers="columns"
            :items="items"
            :item-key="itemKey as any"
            class="sb-table"
            :loading="state.loading"
            hide-default-footer
            @click:row="onRowClick"
          >
            <template
              v-for="col in columns"
              :key="String(col.key)"
              v-slot:[`item.${String(col.key)}`]="slotProps"
            >
              <slot
                :name="`item.${String(col.key)}`"
                :item="slotProps.item as TItem"
                :value="slotProps.value"
                :column="col"
              >
                <SbCellRenderer
                  :col="col"
                  :item="slotProps.item as TItem"
                  :value="slotProps.value"
                />
              </slot>
            </template>

            <template
              v-if="actionsKey"
              v-slot:[`item.${actionsKey}`]="slotProps"
            >
              <slot
                :name="`item.${String(actionsKey)}`"
                v-bind="{
                  item: slotProps.item as TItem,
                  value: slotProps.value,
                  column: slotProps.column as any,
                }"
              >
                <slot name="actions" :item="slotProps.item as TItem">
                  <div class="d-flex justify-end ga-2">
                    <v-btn
                      icon
                      variant="text"
                      @click.stop="$emit('edit', slotProps.item)"
                    >
                      <v-icon icon="lucide:pencil" size="18" />
                    </v-btn>
                    <v-btn
                      v-if="canDelete"
                      icon
                      variant="text"
                      @click.stop="openDeleteDialog(slotProps.item)"
                    >
                      <v-icon icon="lucide:trash-2" size="18" />
                    </v-btn>
                  </div>
                </slot>
              </slot>
            </template>
          </v-data-table>

          <v-divider />

          <!-- Footer: pagination -->
          <div
            class="d-flex align-center justify-space-between flex-wrap ga-3 pa-4"
          >
            <v-spacer />
            <div class="d-flex align-center ga-3 flex-wrap">
              <div class="d-flex align-center ga-2">
                <div class="text-body-2 text-medium-emphasis">
                  Items per page
                </div>
                <v-select
                  class="sb-perpage"
                  :items="perPageOptions"
                  density="compact"
                  variant="outlined"
                  rounded="lg"
                  hide-details
                  :model-value="pagination.perPage"
                  @update:model-value="onPerPageChanged"
                />
              </div>

              <v-pagination
                v-if="(pagination.lastPage ?? 1) > 1"
                :length="pagination.lastPage ?? 1"
                :total-visible="10"
                :model-value="pagination.currentPage"
                size="40"
                rounded="lg"
                @update:model-value="onPageChanged"
              />
            </div>
          </div>
        </v-card>
      </v-card-text>
    </v-card>

    <!-- Filters drawer -->
    <ClientOnly>
      <v-navigation-drawer
        v-model="filterDrawer"
        location="right"
        width="420"
        temporary
      >
        <div class="pa-4 d-flex align-center justify-space-between ga-3">
          <div class="text-h6 font-weight-black">Filters</div>
          <v-btn icon variant="text" @click="filterDrawer = false">
            <v-icon icon="lucide:x" />
          </v-btn>
        </div>

        <v-divider />

        <div class="pa-4">
          <slot
            name="filters"
            :draft="filtersDraft"
            :applied="filtersApplied"
            :set="setDraft"
          />
        </div>

        <v-divider />

        <div class="pa-4 d-flex justify-end ga-2">
          <v-btn variant="tonal" rounded="lg" @click="resetFilters">
            Reset
          </v-btn>
          <v-btn
            color="primary"
            rounded="lg"
            :loading="state.loading"
            @click="applyFilters"
          >
            Apply
          </v-btn>
        </div>
      </v-navigation-drawer>
    </ClientOnly>

    <!-- Optional right panel -->
    <ClientOnly>
      <v-navigation-drawer
        v-if="enablePanel"
        v-model="panelOpen"
        location="right"
        :width="panelWidth"
        temporary
      >
        <template #prepend>
          <v-toolbar color="transparent">
            <h3 class="text-h6 font-weight-bold ml-4">{{ panelTitle }}</h3>
            <v-spacer />
            <div class="pr-4">
              <div
                v-if="$slots['panel-actions']"
                class="d-flex justify-end ga-2"
              >
                <slot name="panel-actions" :close="closePanel">
                  <v-btn
                    icon
                    variant="outlined"
                    color="primary"
                    size="small"
                    @click="closePanel"
                  >
                    <v-icon size="20" icon="lucide:x" />
                  </v-btn>
                </slot>
              </div>
            </div>
          </v-toolbar>
          <v-divider />
        </template>

        <div class="pa-4">
          <slot name="panel" :close="closePanel" />
        </div>

        <template #append>
          <v-card variant="flat" class="pa-2" />
        </template>
      </v-navigation-drawer>
    </ClientOnly>

    <!-- Delete confirmation dialog -->
    <v-dialog v-model="deleteDialogOpen" persistent max-width="520">
      <v-card rounded="xl">
        <v-card-title class="pa-5 pb-3">
          <div class="d-flex align-center ga-4">
            <v-avatar size="44" rounded="lg" color="error" variant="tonal">
              <v-icon icon="lucide:trash-2" size="18" />
            </v-avatar>
            <div class="min-w-0 flex-1">
              <div class="text-subtitle-1 font-weight-black">
                {{ deleteTitle }}
              </div>
              <div class="text-caption text-medium-emphasis">
                This action can't be undone.
              </div>
            </div>
          </div>
        </v-card-title>

        <v-card-text class="px-5 pt-2 pb-4">
          <div class="text-body-2 text-medium-emphasis mb-2">
            {{ deleteInfo }}
          </div>
          <v-card rounded="lg" variant="tonal" class="pa-3" color="grey">
            <div class="d-flex align-start ga-3 text-medium-emphasis">
              <v-icon icon="lucide:alert-triangle" size="16" class="mt-1" />
              <div class="min-w-0">
                <div
                  class="text-body-2 font-weight-bold text-truncate text-capitalize"
                >
                  {{ deleteItemLabel("label", deleteTarget) }}
                </div>
                <div class="text-caption text-medium-emphasis text-truncate">
                  {{ deleteItemLabel("key", deleteTarget) }}
                </div>
              </div>
            </div>
          </v-card>
        </v-card-text>

        <v-divider />

        <div class="px-5 py-4 d-flex justify-end ga-2">
          <v-btn
            variant="tonal"
            rounded="lg"
            :disabled="deleting"
            @click="deleteDialogOpen = false"
          >
            Cancel
          </v-btn>
          <v-btn
            color="error"
            rounded="lg"
            :loading="deleting"
            @click="confirmDelete"
          >
            <v-icon icon="lucide:trash-2" size="16" class="me-2" />
            {{ deleteText }}
          </v-btn>
        </div>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts" generic="TItem extends Record<string, any>">
import {
  computed,
  defineComponent,
  h,
  reactive,
  ref,
  resolveComponent,
  watch,
} from "vue";

type AnyObj = Record<string, any>;
type Accessor<T> = string | ((item: T) => string);

type ResourceStore<T> = {
  data: {
    rows: T[][];
    pagination: {
      total: number;
      perPage: number;
      currentPage: number;
      lastPage?: number | null;
      nextPage?: number | null;
      prevPage?: number | null;
    };
  };
  fetchAll: (args: {
    page?: number;
    query?: string | null;
    reset?: boolean;
  }) => Promise<{ success: boolean; error?: string }>;
};

type DataTableSlotProps = {
  item: TItem;
  value: any;
  column: SbTableColumn<TItem>;
};

defineSlots<{
  "page-action"?: () => any;
  [key: `item.${string}`]: (p: DataTableSlotProps) => any;
  actions?: (p: { item: TItem }) => any;
  filters?: (p: {
    draft: AnyObj;
    applied: AnyObj;
    set: (k: string, v: any) => void;
  }) => any;
  panel?: (p: { close: () => void }) => any;
  "panel-actions"?: (p: { close: () => void }) => any;
  empty?: () => any;
  "head-left"?: () => any;
  "head-right"?: () => any;
}>();

const props = withDefaults(
  defineProps<{
    showHeader?: boolean;
    pageTitle: string;
    pageSubtitle?: string;
    headerTitle?: string;
    primaryText?: string;
    primaryIcon?: string;
    primaryDisabled?: boolean;
    primaryLoading?: boolean;

    store: ResourceStore<TItem>;
    columns: SbTableColumn<TItem>[];
    buildQuery?: (ctx: { search: string; filters: AnyObj }) => string | null;
    initialFilters?: AnyObj;

    autoFetch?: boolean;
    searchDebounceMs?: number;

    itemKey?: keyof TItem | string;
    actionsKey?: string | null;
    perPageOptions?: number[];
    showFilter?: boolean;
    searchPlaceholder?: string;

    emptyIcon?: string;
    emptyTitle?: string;
    emptySubtitle?: string;
    emptyPrimaryText?: string;

    errorTitle?: string;

    deleteAction?: (item: TItem) => Promise<any>;
    deleteTitle?: string;
    deleteInfo?: string;
    deleteLabel?: Accessor<TItem>;
    deleteLabelKey?: Accessor<TItem>;
    deleteText?: string;

    enablePanel?: boolean;
    panelTitle?: string;
    panelWidth?: number | string;
  }>(),
  {
    showHeader: true,
    pageSubtitle: "",
    primaryText: "",
    primaryIcon: "lucide:plus",
    primaryDisabled: false,
    primaryLoading: false,

    autoFetch: true,
    searchDebounceMs: 350,

    itemKey: "id",
    actionsKey: "actions",
    perPageOptions: () => [10, 20, 25, 50, 100],
    showFilter: true,
    searchPlaceholder: "Search",

    emptyIcon: "lucide:inbox",
    emptyTitle: "No data found",
    emptySubtitle: "Try adjusting your search or filters.",
    emptyPrimaryText: "",

    errorTitle: "Couldn't load data",

    deleteTitle: "Delete item?",
    deleteInfo: "You're about to delete:",
    deleteLabel: "title",
    deleteLabelKey: "id",
    deleteText: "Delete",

    enablePanel: false,
    panelTitle: "",
    panelWidth: 460,
  },
);

const emit = defineEmits<{
  (e: "primary"): void;
  (e: "edit", item: TItem): void;
  (e: "loaded"): void;
  (e: "deleted", item: TItem): void;
  (e: "empty:primary"): void;
}>();

const fallbackErrorMessage =
  "Something went wrong while fetching data. Please try again.";

const state = reactive({
  loading: false,
  loaded: false,
  error: false,
  errorMessage: "",
  search: "",
});

const filterDrawer = ref(false);

const panelOpen = ref(false);
function openPanel() {
  panelOpen.value = true;
}
function closePanel() {
  panelOpen.value = false;
}
defineExpose({ refresh, openPanel, closePanel, openDeleteDialog });

const baseFilters = computed<AnyObj>(() => props.initialFilters ?? {});
const filtersDraft = reactive<AnyObj>({ ...baseFilters.value });
const filtersApplied = reactive<AnyObj>({ ...baseFilters.value });

const pagination = computed(
  () =>
    props.store?.data?.pagination ?? {
      total: 0,
      perPage: 10,
      currentPage: 1,
      lastPage: 1,
    },
);

const items = computed<TItem[]>(() => {
  const rowsPages = props.store?.data?.rows;
  const pageIdx = (pagination.value.currentPage ?? 1) - 1;
  return (rowsPages?.[pageIdx] ?? []) as TItem[];
});

const activeFilterCount = computed(() => {
  const f = filtersApplied;
  let c = 0;
  for (const k of Object.keys(f)) {
    const v = f[k];
    if (Array.isArray(v) && v.length > 0) c++;
    else if (typeof v === "string" && v.trim() !== "") c++;
    else if (typeof v === "number" && !Number.isNaN(v)) c++;
    else if (typeof v === "boolean" && v === true) c++;
    else if (v && typeof v === "object" && Object.keys(v).length > 0) c++;
  }
  return c;
});

const isEmpty = computed(() => {
  const total = Number(pagination.value.total ?? 0);
  const hasSearch = state.search.trim().length > 0;
  const hasFilters = activeFilterCount.value > 0;
  return (
    total === 0 &&
    !state.error &&
    state.loaded &&
    !state.loading &&
    !hasSearch &&
    !hasFilters
  );
});

function setDraft(key: string, value: any) {
  filtersDraft[key] = value;
}

function buildQueryString() {
  const fn = props.buildQuery;
  if (fn)
    return fn({
      search: state.search ? state.search.trim() : "",
      filters: { ...filtersApplied },
    });
  return null;
}

async function fetchPage({
  page = 1,
  reset = false,
}: { page?: number; reset?: boolean } = {}) {
  try {
    state.loading = true;
    state.error = false;
    state.errorMessage = "";

    const query = buildQueryString();
    const res = await props.store.fetchAll({ page, query, reset });

    if (!res.success) throw new Error(res.error || "Failed to fetch data");

    state.loaded = true;
    emit("loaded");
  } catch (e: any) {
    state.error = true;
    state.errorMessage = e?.message || "Failed to fetch data";
  } finally {
    state.loading = false;
  }
}

function refresh({ reset = false }: { reset?: boolean } = {}) {
  fetchPage({ page: 1, reset });
}

function onPageChanged(p: number) {
  fetchPage({ page: p, reset: false });
}

function onPerPageChanged(v: any) {
  const next = Number(v) || 10;
  if (props.store?.data?.pagination)
    (props.store.data.pagination.perPage as any) = next;
  refresh({ reset: true });
}

function onRowClick(_: any, row: { item: any }) {
  emit("edit", row.item as TItem);
}

let searchTimer: any = null;

function onSearchSubmit() {
  refresh({ reset: true });
}
function onSearchClear() {
  refresh({ reset: true });
}

watch(
  () => state.search,
  () => {
    if (!props.searchDebounceMs) return;
    clearTimeout(searchTimer);
    searchTimer = setTimeout(
      () => refresh({ reset: true }),
      props.searchDebounceMs,
    );
  },
);

function applyFilters() {
  Object.assign(filtersApplied, { ...filtersDraft });
  filterDrawer.value = false;
  refresh({ reset: true });
}

function resetFilters() {
  Object.assign(filtersDraft, { ...baseFilters.value });
  Object.assign(filtersApplied, { ...baseFilters.value });
  refresh({ reset: true });
}

if (props.autoFetch) fetchPage({ page: 1, reset: true });

// Delete
const canDelete = computed(() => typeof props.deleteAction === "function");
const deleteDialogOpen = ref(false);
const deleteTarget = ref<any>(null);
const deleting = ref(false);

function getByPath(obj: any, path: string) {
  if (!obj || !path) return undefined;
  const parts = path
    .replace(/\[(\d+)\]/g, ".$1")
    .replace(/\["([^"]+)"\]/g, ".$1")
    .replace(/\['([^']+)'\]/g, ".$1")
    .split(".")
    .filter(Boolean);
  let cur = obj;
  for (const p of parts) {
    if (cur == null) return undefined;
    cur = cur[p];
  }
  return cur;
}

function deleteItemLabel(key: "label" | "key", item: TItem | null | undefined) {
  if (!item) return "";
  const d = key === "label" ? props.deleteLabel : props.deleteLabelKey;
  if (typeof d === "function") return d(item);
  const path = (d || "id") as string;
  const val = getByPath(item, path);
  return val ?? (item as any)?.id ?? "item";
}

function openDeleteDialog(item: any) {
  if (!canDelete.value) return;
  deleteTarget.value = item as TItem;
  deleteDialogOpen.value = true;
}

async function confirmDelete() {
  if (!deleteTarget.value || !props.deleteAction) return;
  deleting.value = true;
  try {
    await props.deleteAction(deleteTarget.value as TItem);
    emit("deleted", deleteTarget.value as TItem);
    deleteDialogOpen.value = false;
    deleteTarget.value = null;
    refresh({ reset: true });
  } finally {
    deleting.value = false;
  }
}

/** Built-in cell renderer */
const SbCellRenderer = defineComponent({
  name: "SbCellRenderer",
  props: {
    col: { type: Object as any, required: true },
    item: { type: Object as any, required: true },
    value: {},
  },
  setup(p) {
    const asText = computed(
      () => (p.value ?? (p.item as any)?.[(p.col as any).key] ?? "") as any,
    );

    const formatDate = (
      d: any,
      mode: "date" | "datetime",
      locale = "en-US",
    ) => {
      if (!d) return "—";
      const dt = new Date(d);
      if (Number.isNaN(dt.getTime())) return "—";
      const opts: Intl.DateTimeFormatOptions =
        mode === "datetime"
          ? {
              year: "numeric",
              month: "short",
              day: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
            }
          : { year: "numeric", month: "short", day: "2-digit" };
      return new Intl.DateTimeFormat(locale, opts).format(dt);
    };

    return () => {
      const col = p.col as SbTableColumn<TItem>;

      if (col.cellType === "chip") {
        const label = col.chip?.label
          ? col.chip.label(p.item as TItem)
          : String(asText.value ?? "");
        const color =
          typeof col.chip?.color === "function"
            ? col.chip.color(p.item as TItem)
            : (col.chip?.color ?? "primary");
        return h(
          resolveComponent("VChip"),
          {
            size: col.chip?.size ?? "small",
            rounded: "lg",
            variant: col.chip?.variant ?? "tonal",
            color,
            class: "font-weight-bold",
          },
          () => label,
        );
      }

      if (col.cellType === "date") {
        const mode = col.date?.format ?? "date";
        const locale = col.date?.locale ?? "en-US";
        return h(
          "span",
          { class: "text-body-2" },
          formatDate(asText.value, mode, locale),
        );
      }

      if (col.cellType === "avatar") {
        const image = col.avatar?.image?.(p.item as TItem) ?? null;
        const text = col.avatar?.text?.(p.item as TItem) ?? "";
        const color =
          typeof col.avatar?.color === "function"
            ? col.avatar.color(p.item as TItem)
            : (col.avatar?.color ?? "primary");
        return h("div", { class: "d-flex align-center ga-2" }, [
          h(
            resolveComponent("VAvatar"),
            {
              size: 30,
              rounded: "lg",
              color,
              variant: "tonal",
              image: image || undefined,
            },
            () =>
              image
                ? null
                : col.avatar?.icon
                  ? h(resolveComponent("VIcon"), { icon: col.avatar.icon })
                  : null,
          ),
          h(
            "span",
            { class: "text-body-2" },
            text || String(asText.value ?? "—"),
          ),
        ]);
      }

      return h("span", { class: "text-body-2" }, String(asText.value ?? "—"));
    };
  },
});
</script>

<style scoped lang="scss">
.sb-perpage {
  max-width: 140px;
}

.sb-search-form {
  min-width: 220px;
}
</style>
