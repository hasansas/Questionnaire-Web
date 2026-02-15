// /middleware/layout.global.ts
import type { LayoutKey } from '#build/types/layouts'

export default defineNuxtRouteMiddleware((to) => {
  const { isMobile } = useIsMobile()
  const auth = useAuthStore()

  const isLoggedIn = computed(() => auth.isLoggedIn)

  const layout = computed<LayoutKey | false>(() => {
    if (to.path.startsWith('/auth')) {
      return false
    }

    // Logged-in dashboard
    if (isLoggedIn.value && to.path.startsWith('/dashboard')) {
      return isMobile.value ? 'mobile-loggedin' as LayoutKey : 'loggedin'
    }

    // Public pages
    return isMobile.value ? 'mobile-default' as LayoutKey : 'default'
  })

  setPageLayout(layout)
})
