<template>
  <div>
    <template v-if="showHeader">
      <div v-if="headerVariant === 'page'" class="py-4 pb-3">
        <div class="d-flex align-center justify-space-between">
          <div class="d-flex align-center ga-3 min-w-0">
            <v-skeleton-loader type="avatar" />
            <div class="min-w-0">
              <v-skeleton-loader type="text" width="220" class="mb-1" />
              <v-skeleton-loader type="text" width="320" />
            </div>
          </div>

          <div class="d-flex align-center ga-2 flex-wrap">
            <v-skeleton-loader type="chip" width="92" />
          </div>
        </div>
      </div>

      <!-- Optional header card -->
      <v-card
        v-else-if="headerVariant === 'stats'"
        rounded="xl"
        variant="outlined"
        class="sb-card pa-5 mb-6"
      >
        <div class="py-4 pb-3">
          <div class="d-flex align-center justify-space-between">
            <div class="d-flex align-center ga-3 min-w-0">
              <v-skeleton-loader type="avatar" />
              <div class="min-w-0">
                <v-skeleton-loader type="text" width="220" class="mb-1" />
                <v-skeleton-loader type="text" width="320" />
              </div>
            </div>

            <div class="d-flex align-center ga-2 flex-wrap">
              <v-skeleton-loader type="chip" width="92" />
            </div>
          </div>
        </div>

        <v-row>
          <v-col v-for="i in headerStatsCount" :key="i" cols="12" md="3">
            <v-card rounded="lg" variant="flat">
              <v-skeleton-loader type="image" height="64" />
            </v-card>
          </v-col>
        </v-row>
      </v-card>
    </template>

    <!-- Optional table skeleton -->
    <v-card v-if="showTable" rounded="xl" class="sb-card" variant="outlined">
      <template v-if="showTableHeader">
        <div class="pa-4 pb-2">
          <div class="d-flex align-center justify-space-between ga-3">
            <div class="min-w-0 flex-1">
              <v-skeleton-loader type="heading" width="220" class="mb-2" />
              <v-skeleton-loader type="text" width="320" />
            </div>

            <div class="d-flex align-center ga-2">
              <v-skeleton-loader type="chip" width="96" />
              <v-skeleton-loader type="chip" width="96" />
            </div>
          </div>
        </div>
      </template>

      <v-divider />

      <div class="pa-4">
        <!-- header row -->
        <div class="py-2">
          <v-row dense class="mb-3" no-gutters>
            <v-col
              v-for="(col, idx) in headerCols"
              :key="idx"
              :cols="col.cols"
              :class="col.class"
            >
              <v-skeleton-loader type="text" :width="col.width" />
            </v-col>
          </v-row>
        </div>

        <v-divider class="mb-3" />

        <!-- body rows -->
        <div class="d-flex flex-column ga-3">
          <div v-for="i in rows" :key="i">
            <v-row dense align="center" no-gutters>
              <v-col
                v-for="(col, idx) in bodyCols"
                :key="idx"
                :cols="col.cols"
                :class="col.class"
              >
                <template v-if="col.type === 'actions'">
                  <div class="d-flex justify-end">
                    <v-avatar size="32">
                      <v-skeleton-loader type="avatar" />
                    </v-avatar>
                  </div>
                </template>

                <template v-else>
                  <v-skeleton-loader type="text" :width="col.width" />
                </template>
              </v-col>
            </v-row>

            <v-divider class="mt-3" />
          </div>
        </div>

        <!-- footer / pagination -->
        <div class="d-flex align-center justify-space-between mt-4">
          <v-spacer />
          <div class="d-flex align-center ga-2">
            <v-skeleton-loader type="chip" width="72" />
          </div>
        </div>
      </div>
    </v-card>
  </div>
</template>

<script setup lang="ts">
type SkeletonCol = {
  cols: number;
  width: string | number;
  class?: string;
  type?: "text" | "actions";
};

const props = withDefaults(
  defineProps<{
    showHeader?: boolean;
    headerVariant?: "stats" | "page";
    showTable?: boolean;
    showTableHeader?: boolean;

    // header
    headerStatsCount?: number;

    // table
    rows?: number;
    headerCols?: SkeletonCol[];
    bodyCols?: SkeletonCol[];
  }>(),
  {
    showHeader: false,
    headerVariant: "stats",
    showTable: true,
    showTableHeader: true,
    headerStatsCount: 4,
    rows: 6,
    headerCols: () => [
      { cols: 3, width: "64", class: "pe-2" },
      { cols: 3, width: "84", class: "px-2" },
      { cols: 2, width: "84", class: "px-2" },
      { cols: 2, width: "72", class: "px-2" },
    ],
    bodyCols: () => [
      { cols: 3, width: "85%", class: "pe-2" },
      { cols: 2, width: "70%", class: "px-2" },
      { cols: 3, width: "70%", class: "px-2" },
      { cols: 2, width: "65%", class: "px-2" },
      { cols: 2, width: "32", class: "ps-2", type: "actions" },
    ],
  },
);
</script>

<style scoped lang="scss">
/* keep minimal; relies on your sb-card styling */
</style>
