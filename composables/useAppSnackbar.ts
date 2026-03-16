// composables/useAppSnackbar.ts
type SnackbarColor = "error" | "success" | "info" | "warning"

export function useAppSnackbar() {
  const show = useState<boolean>("appSnackbar:show", () => false)
  const text = useState<string>("appSnackbar:text", () => "")
  const color = useState<SnackbarColor>("appSnackbar:color", () => "info")
  const timeout = useState<number>("appSnackbar:timeout", () => 3500)

  function open(message: string, options?: { color?: SnackbarColor; timeout?: number }) {
    text.value = message
    color.value = options?.color ?? "info"
    timeout.value = options?.timeout ?? 3500
    show.value = true
  }

  function close() {
    show.value = false
  }

  return { show, text, color, timeout, open, close }
}
