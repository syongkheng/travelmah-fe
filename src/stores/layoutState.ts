import { reactive, ref } from 'vue'
import { defineStore } from 'pinia'

export const useLayoutStateStore = defineStore('layoutStateStore', () => {
  const sideNav = {
    isExpanded: ref(false),
    toggle: () => (sideNav.isExpanded.value = !sideNav.isExpanded.value),
  }

  const loginDialog = reactive({
    isVisible: false,
    setTrue: () => (loginDialog.isVisible = true),
    setFalse: () => (loginDialog.isVisible = false),
    toggle: () => (loginDialog.isVisible = !loginDialog.isVisible),
  })

  const collabDialog = reactive({
    isVisible: false,
    setTrue: () => (collabDialog.isVisible = true),
    setFalse: () => (collabDialog.isVisible = false),
    toggle: () => (collabDialog.isVisible = !collabDialog.isVisible),
  })

  return { collabDialog, loginDialog, sideNav }
})
