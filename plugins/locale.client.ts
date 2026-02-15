// ~/plugins/locale.client.ts
export default defineNuxtPlugin(() => {
  const { init } = useLocale()
  init()
})
