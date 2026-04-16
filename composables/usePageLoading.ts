export function usePageLoading() {
  const pageLoading = useState<boolean>('sb_page_loading', () => false)
  return { pageLoading }
}
