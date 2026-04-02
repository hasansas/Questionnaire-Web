// /middleware/layout.global.ts
import type { LayoutKey } from '#build/types/layouts'

export default defineNuxtRouteMiddleware((to) => {
  const { isMobile } = useIsMobile()
  const auth = useAuthStore()

  const isLoggedIn = computed(() => auth.isLoggedIn)

  const layout = computed<LayoutKey | false>(() => {
    if (to.path.startsWith('/auth')) {
      return 'empty'
    }

    const publicPaths = ['/org/invitation']
    if (publicPaths.includes(to.path)) {
      return false
    }

    // Logged-in organization
    if (isLoggedIn.value && to.path.startsWith('/org')) {
      return isMobile.value ? 'mobile-loggedin' as LayoutKey : 'loggedin'
    }
    // if (to.path.startsWith('/org')) {
    //   return isMobile.value ? 'mobile-loggedin' as LayoutKey : 'loggedin'
    // }

    // Public pages
    return isMobile.value ? 'mobile-default' as LayoutKey : 'default'
  })

  setPageLayout(layout)
})
