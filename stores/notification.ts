// stores/notification.store.ts
import { defineStore } from 'pinia'

/* ─────────────────────────────────────────────────────────────────────────────
 * Types
 * ──────────────────────────────────────────────────────────────────────────── */
export type NotificationPageKey = 'pricing' | 'report' | (string & {})

export interface ReportStreamMeta {
  type?: string
  profileId?: string
  featureCode: string
  language?: string
  source?: string
  // add any extra fields your backend may send
  [k: string]: unknown
}

export interface ReportStreamEvent {
  event: string                      // e.g., 'gen_report_cached', 'ai_stream_update'
  isFinal?: boolean                   // present for final events
  timestamp?: string                  // ISO string
  meta: ReportStreamMeta
  // optional payload chunks or text
  text?: string
  fullText?: string
  chunkIndex?: number
  [k: string]: unknown
}

export interface ReportEntry {
  latest: ReportStreamEvent | null    // the most recent event for this feature
  isFinal: boolean                    // reflects finality of the latest event
  updatedAt: string | null            // ISO of the last update
  history: ReportStreamEvent[]        // all events in order received
}

export interface PaymentBucket {
  latest: any
  activePages: Record<NotificationPageKey, boolean>
}

export interface NotificationState {
  payment: PaymentBucket
  // reports[profileId][featureCode] = ReportEntry
  reports: Record<string, Record<string, ReportEntry>>
}


/* ─────────────────────────────────────────────────────────────────────────────
 * Store
 * ──────────────────────────────────────────────────────────────────────────── */
export const useNotificationStore = defineStore('notification', {
  state: (): NotificationState => ({
    payment: {
      latest: null,
      activePages: {
        pricing: false,
        report: false
      }
    },
    reports: {}
  }),

  getters: {
    getReport:
      (state) =>
        (profileId: string, featureCode: string): ReportEntry | undefined =>
          state.reports[profileId]?.[featureCode],

    paymentPageActive:
      (state) =>
        (page: NotificationPageKey): boolean =>
          !!state.payment.activePages[page]
  },


  actions: {
    /* ───────── Payment helpers ───────── */
    upsertPayment(payload: any) {
      this.payment.latest = payload
    },

    activatePaymentPages(pages: NotificationPageKey[]) {
      pages.forEach((p) => {
        this.payment.activePages[p] = true
      })
    },

    revokePaymentPages(pages: NotificationPageKey[]) {
      pages.forEach((p) => {
        if (p in this.payment.activePages) {
          this.payment.activePages[p] = false
        }
      })
    },

    /* ───────── Reports (keyed by meta.featureCode) ───────── */
    upsertReportEvent(evt: ReportStreamEvent) {
      const feature = evt?.meta?.featureCode
      const profileId = evt?.meta?.profileId

      // butuh profileId + featureCode
      if (!feature || !profileId) return

      const ts = evt.timestamp ?? new Date().toISOString()

      // ensure bucket per profile
      if (!this.reports[profileId]) {
        this.reports[profileId] = {}
      }

      // ensure entry per feature
      if (!this.reports[profileId][feature]) {
        this.reports[profileId][feature] = {
          latest: null,
          isFinal: false,
          updatedAt: null,
          history: []
        }
      }

      const report = this.reports[profileId][feature]

      // kalau sudah final, skip update berikutnya
      if (report.isFinal) {
        console.warn(
          `[notification] skip upsert: profile=${profileId}, feature=${feature} already final`
        )
        return
      }

      // simple de-dup: kalau event terakhir sama persis, jangan di-push lagi
      const last = report.history[report.history.length - 1]
      if (
        last &&
        last.event === evt.event &&
        last.chunkIndex === evt.chunkIndex &&
        last.text === evt.text &&
        last.fullText === evt.fullText
      ) {
        return
      }

      // push ke history
      report.history.push(evt)
      // update latest event
      report.latest = evt
      report.updatedAt = ts

      // kalau event ini final, tandai final
      if (evt.isFinal) {
        report.isFinal = true
      }
    },

    resetReport(profileId: string, featureCode?: string) {
      const profileBucket = this.reports[profileId]
      if (!profileBucket) return

      if (!featureCode) {
        // hapus semua report untuk profile ini
        delete this.reports[profileId]
        return
      }

      delete profileBucket[featureCode]

      // kalau setelah dihapus kosong, hapus profile bucket-nya juga
      if (Object.keys(profileBucket).length === 0) {
        delete this.reports[profileId]
      }
    },

    resetAllReports() {
      this.reports = {}
    },

    /**
    * Ensure a report exists for given profileId + featureCode.
    * - If already in state → just return it.
    * - If not in state → call backend to trigger generation/cache,
    *   but do NOT write to the store (Socket.io will do that).
    */
    async getOrFetchReport(
      profileId: string,
      featureCode: string
    ): Promise<ReportEntry | undefined> {
      // Check current state first
      const existing = this.getReport(profileId, featureCode)
      if (existing) {
        return existing
      }

      const api = useApiService()

      // Call backend to trigger generation or fetch cache
      // We intentionally ignore the return value, because:
      // - type is ApiResult<any> (no .data needed),
      // - the actual report will arrive via Socket.io and upsertReportEvent.
      const payload = { profileId, featureCode }
      const result = await api.post("/v1/bazi/interpretation/report/generate", payload)

      if (!result.success) {
        const msg =
          result?.error?.message ||
          `Failed to request report generation (${featureCode})`
        throw new Error(msg)
      }

      // Return whatever is in state now (most likely still undefined immediately).
      // The UI should react to changes via Pinia reactivity when Socket.io events arrive.
      return this.getReport(profileId, featureCode)
    }
  }
})
