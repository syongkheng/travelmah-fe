// src/directives/clickOutside.ts
import type { Directive } from 'vue'

const clickOutside: Directive = {
  beforeMount(el, binding) {
    el._clickOutsideHandler = (event: MouseEvent) => {
      if (!el.contains(event.target)) {
        binding.value(event)
      }
    }
    document.addEventListener('click', el._clickOutsideHandler)
  },
  unmounted(el) {
    document.removeEventListener('click', el._clickOutsideHandler)
  },
}

export default clickOutside
