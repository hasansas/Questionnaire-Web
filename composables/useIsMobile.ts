// /composables/useIsMobile.ts
export function useIsMobile() {
  const ua =
    import.meta.server
      ? (useRequestHeaders(['user-agent'])['user-agent'] || '')
      : navigator.userAgent

  const uaIsMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua)

  const width = ref<number>(import.meta.client ? window.innerWidth : 1024)

  if (import.meta.client) {
    const onResize = () => (width.value = window.innerWidth)
    window.addEventListener('resize', onResize)
    onUnmounted(() => window.removeEventListener('resize', onResize))
  }

  const isMobile = computed(() => uaIsMobile || width.value < 768)
  return { isMobile }
}
