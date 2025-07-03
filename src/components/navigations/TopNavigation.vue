<script lang="ts" setup>
import { Avatar, Star } from '@element-plus/icons-vue'
import { useNav } from '@/hooks/useNav'
import { Position, Search, Grid } from '@element-plus/icons-vue'
import { ref } from 'vue'
import { useLayoutStateStore } from '@/stores/layoutState'
import { useAuthenticationStore } from '@/stores/authentication'
import { storeToRefs } from 'pinia'


const { redirectToPlanning, redirectToLanding, redirectToDashboard } = useNav()
const searchInput = ref<string>('')
const layoutStore = useLayoutStateStore()
const navigate = useNav();
const authStore = useAuthenticationStore()
const { isAuthenticated } = storeToRefs(authStore) // Preserves reactivity

const handleSearchItinerary = () => {
  navigate.redirectToViewSessionId(searchInput.value)
}
</script>

<template>
  <header class="header">
    <nav class="nav-container">
      <div class="engagement-container">
        <div class="clickable toggle-menu-expansion" @click="layoutStore.sideNav.toggle">
          <el-icon :size="25">
            <Grid />
          </el-icon>
        </div>
        <div class="logo-env clickable" @click="isAuthenticated ? redirectToDashboard() : redirectToLanding()">
          <div>
            <img src="../../../public/icon-dark.svg" width="50px" />
          </div>
          <div>
            <RouterLink to="/">{{ 'TravelMah' }}</RouterLink>
          </div>
        </div>
        <div>
          <el-input v-model="searchInput" style="width: 225px" placeholder="Search itineraries" :prefix-icon="Search">
            <template #suffix>
              <div class="engagement-search-container" @click="handleSearchItinerary">
                <el-icon class="el-input__icon">
                  <Position />
                </el-icon>
              </div>
            </template>
          </el-input>
        </div>
      </div>

      <ul class="nav-links">
        <span>
          <el-button @click="redirectToPlanning" type="success" :icon="Star">
            {{ 'Plan Now!' }}
          </el-button>
        </span>
        <span v-if="isAuthenticated">
          <el-button @click="() => console.log('hi')" type="primary" :icon="Avatar">
            <span> {{ 'Profile' }}</span>
          </el-button>

        </span>
        <span>
          <el-button v-if="!isAuthenticated" @click="layoutStore.loginDialog.toggle" type="primary" :icon="Star">
            {{ 'Login' }}
          </el-button>
        </span>
      </ul>
    </nav>
  </header>
</template>

<style scoped>
.header {
  --header-bg: #f8f9fa;
  --border-color: #e9ecef;
  --text-color: #2c3e50;
  --active-color: #42b983;
  --success-color: var(--el-color-success);
  --white: var(--el-color-white);
  --icon-color: #aaaaaa;

  position: sticky;
  top: 0;
  z-index: 999;
  padding: 1em;
  background-color: var(--header-bg);
  border-bottom: 1px solid var(--border-color);
}

.nav-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0 auto;
  padding: 0 1em 0 0.5em;
}

/* Logo & Menu Toggle */
.logo-env {
  display: flex;
  align-items: center;
  gap: 0.5rem;

  a {
    font: bold 1.5em sans-serif;
    color: var(--text-color);
    text-decoration: none;
  }
}

/* Navigation Links */
.nav-links {
  display: flex;
  gap: 2em;
  margin: 0;
  padding: 0;
  list-style: none;

  a {
    color: var(--text-color);
    font-weight: 500;
    text-decoration: none;
    transition: color 0.3s ease;

    &:hover,
    &.active {
      color: var(--active-color);
    }

    &.active {
      border-bottom: 2px solid var(--active-color);
    }
  }
}

/* Utility Classes */
.clickable {
  cursor: pointer;
}

.toggle-menu-expansion {
  display: flex;
  color: var(--icon-color);
}

/* Search & Engagement */
.engagement-container {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.engagement-search-container {
  display: flex;
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: center;
  padding: 0 1rem 0 0.25rem;
  color: var(--white);
  background-color: var(--success-color);
  border-radius: 0 0.25rem 0.25rem 0;
}

/* Element Plus Overrides */
:deep(.el-input__wrapper) {
  padding-right: 0;
}

/* Responsive Behavior */
@media (max-width: 800px) {

  .engagement-container>*:not(.toggle-menu-expansion):not(.logo-env),
  .nav-links>*:not(:has(.el-button--success)) {
    display: none;
  }

  .el-button--success {
    display: inline-flex;
  }
}
</style>
