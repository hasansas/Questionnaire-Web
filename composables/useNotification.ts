// composables/useNotification.ts
import { ref, onMounted, onUnmounted } from 'vue'
import { useSocket } from './useSocket'
import type { ReportStreamEvent, ReportStreamMeta } from '@/stores/notification'

type StreamEvent = {
  event?: string
  isFinal?: boolean
  timestamp?: string
  step?: number,
  delta?: string,
  text?: string,
  fullText?: string,
  meta?: unknown
  [k: string]: unknown
}

export function useNotification(userId?: string) {
  const { connect, isConnected } = useSocket()
  const notification = useNotificationStore()

  let socket: any

  const REPORT_EVENTS = ['gen_report_cached', 'gen_report_update', 'gen_report_complete'] as const
  const PAYMENT_EVENTS = ['payment_succeeded'] as const
  const ALL_EVENTS = [...PAYMENT_EVENTS, ...REPORT_EVENTS]

  onMounted(() => {
    const sock = connect(userId)
    socket = sock

    // Payment
    socket.off('payment_succeeded')
    socket.on('payment_succeeded', (payload: any) => {
      notification.upsertPayment(payload)
      notification.activatePaymentPages(['pricing', 'report'])
    })

    // Reports
    for (const ev of REPORT_EVENTS) {
      socket.off(ev)
      socket.on(ev, (stream: StreamEvent) => {
        const metaRaw = stream.meta as Record<string, unknown> | undefined

        // 1) Hard guard for featureCode presence & string coercion
        const featureCode = metaRaw?.featureCode
        if (featureCode == null || featureCode === '') {
          console.warn(`[notification] "${ev}" missing meta.featureCode`, stream)
          return
        }

        // 2) Destructure first, then rebuild meta so featureCode is guaranteed string
        const { featureCode: _, ...rest } = metaRaw!
        const meta: ReportStreamMeta = {
          featureCode: String(featureCode),
          ...rest
        } as ReportStreamMeta

        // 3) Build a fully-typed ReportStreamEvent
        const normalized: ReportStreamEvent = {
          event: ev,
          isFinal: !!stream.isFinal,
          timestamp: stream.timestamp ?? new Date().toISOString(),
          text: ev === 'gen_report_update' ? stream.delta : stream.text ?? '',
          fullText: stream.fullText ?? stream.text ?? '',
          chunkIndex: stream.step ?? 0,
          meta,
          // passthrough extras if you like:
          // text: (stream as any).text,
          // chunkIndex: (stream as any).chunkIndex,
        }

        notification.upsertReportEvent(normalized)
      })
    }
  })

  return {
    isConnected,
    getReport: notification.getReport,
    getOrFetchReport: notification.getOrFetchReport,
    paymentPageActive: notification.paymentPageActive,
    paymentLatest: () => notification.payment.latest
  }
}
