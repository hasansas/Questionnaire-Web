export default defineNuxtRouteMiddleware((to) => {
  const auth = useAuthStore()

  const publicPaths = ['/org/invitation']
  // if (publicPaths.includes(to.path)) {
  //   return false
  // }

  if (to.path.startsWith('/org') && !auth.isLoggedIn && !publicPaths.includes(to.path)) {
    return navigateTo('/auth/login')
  }
})