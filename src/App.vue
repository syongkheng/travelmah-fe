<script setup lang="ts">
import FooterNavigation from './components/navigations/FooterNavigation.vue'
import TopNavigation from './components/navigations/TopNavigation.vue'
import SideNavigation from './components/navigations/SideNavigation.vue'
import LoginView from './views/LoginView.vue'
import { useRoute } from 'vue-router'
import { watch } from 'vue'
import { useLayoutStateStore } from './stores/layoutState'
import AppInitializer from './AppInitializer.vue'
import CollabDialog from './components/dialogs/CollabDialog.vue'

const route = useRoute()
const layoutStore = useLayoutStateStore()

watch(() => route.query.showLogin, (newVal) => {
  if (newVal === 'true') {
    layoutStore.loginDialog.setTrue()
    window.history.replaceState({}, document.title, window.location.pathname)
  }
})
</script>

<template>
  <AppInitializer>
    <TopNavigation />
    <div style="display: flex">
      <SideNavigation />
      <main>
        <div class="wrapper">
          <RouterView />
        </div>
        <footer>
          <FooterNavigation />
        </footer>
      </main>
    </div>
    <LoginView />
    <CollabDialog />
  </AppInitializer>
</template>

<style scoped>
.wrapper {
  padding: 1em;
}

main {
  display: flex;
  flex-direction: column;
  flex: 1;
}
</style>
