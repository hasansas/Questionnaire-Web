// middleware/auth.ts
import { useAuthStore } from '~/stores/auth'

export default defineNuxtRouteMiddleware((to) => {
  const auth = useAuthStore()

  // Public routes that don't require authentication
  const publicPaths = ['/auth/login', '/register', '/forgot-password']
  if (publicPaths.includes(to.path)) return

  // If not logged in, redirect to login
  if (!auth.isLoggedIn) {
    return navigateTo('/auth/login')
  }
})

