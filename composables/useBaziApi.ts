// /composables/useBaziApi.ts

/**
 * Composable for BaZi API endpoints.
 * All methods return standardized {success, code, data|error} from useApiService.
 */
export function useBazi() {
  const api = useApiService();

  return {
    // POST: Get BaZi four pillar raw data
    getFourPillarsRaw: (payload: any) => api.post("/v1/bazi/core/four-pillars", payload),

    // POST: Get BaZi Day Master
    getDayMaster: (payload: any) => api.post("/v1/bazi/core/daymaster", payload),

    // POST: Get BaZi Basic Chart
    getChart: (payload: any) => api.post("/v1/bazi/core/chart", payload),

    // POST: Get BaZi Five Structures
    getFiveStructures: (payload: any) => api.post("/v1/bazi/core/structures", payload),

    // POST: Get BaZi Ten Profiles
    getTenProfiles: (payload: any) => api.post("/v1/bazi/core/profiles", payload),

    // POST: Get BaZi lunar date conversion
    getLunarBirth: (payload: any) => api.post("/v1/bazi/convert", payload),

    // POST: Get BaZi Luck Pillars
    getLuckPillars: (payload: any) => api.post("/v1/bazi/core/time-pillars/luck", payload),

    // POST: Get BaZi Annual Pillars
    getAnnualPillars: (payload: any) => api.post("/v1/bazi/core/time-pillars/annual", payload),

    // POST: Get BaZi Monthly Pillars
    getMonthlyPillars: (payload: any) => api.post("/v1/bazi/core/time-pillars/monthly", payload),

    // POST: Get BaZi Daily Pillars
    getDailyPillars: (payload: any) => api.post("/v1/bazi/core/time-pillars/daily", payload),

    // POST: Get BaZi Hourly Pillars
    getHourlyPillars: (payload: any) => api.post("/v1/bazi/core/time-pillars/hourly", payload),

    // POST: Get Raw Interactions
    getInteractions: (payload: any) => api.post("/v1/bazi/core/interactions", payload),

    // POST: Get Day Maser Strength Analysis
    getDayMaserStrength: (payload: any) => api.post("/v1/bazi/analyze/day-master-strength", payload),

    // POST: Get BaZi Kong Wang (Void/Death of Emptiness)
    getKongWang: (payload: any) => api.post("/v1/bazi/kong-wang", payload),

    // POST: Get BaZi Symbolic Stars
    getSymbolicStars: (payload: any) =>
      api.post("/v1/bazi/symbolic-stars", payload),

    // POST: Get BaZi General Stars
    getGeneralStars: (payload: any) =>
      api.post("/v1/bazi/general-stars", payload),

    // POST: Get BaZi Twelve Life Stages
    getLifeStages: (
      lunarBirthDate: BaZiLunarDate,
      mode: string = "holistic",
      locale: string = "en"
    ) =>
      api.post("/v1/bazi/life-stages", {
        ...lunarBirthDate,
        ...{ mode, locale },
      }),
  };
}
