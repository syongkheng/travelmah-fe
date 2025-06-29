// useAutoScrollToBottom.ts
import { nextTick } from 'vue'
import type { Ref } from 'vue'

export function useAutoScrollToBottom(containerRef: Ref<HTMLElement | null>) {
  const isScrolledToBottom = () => {
    if (!containerRef.value) return true
    const { scrollTop, scrollHeight, clientHeight } = containerRef.value
    return scrollHeight - (scrollTop + clientHeight) < 50
  }

  const scrollToBottom = () => {
    if (!containerRef.value) return
    // Use requestAnimationFrame for better timing
    requestAnimationFrame(() => {
      containerRef.value?.scrollTo({
        top: containerRef.value.scrollHeight,
        behavior: 'smooth',
      })
    })
  }

  const handleScrollAfterUpdate = async () => {
    const wasAtBottom = isScrolledToBottom()
    await nextTick()

    if (wasAtBottom) {
      scrollToBottom()
    }
  }

  return {
    handleScrollAfterUpdate,
    isScrolledToBottom,
    scrollToBottom,
  }
}
