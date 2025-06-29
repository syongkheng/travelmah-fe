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
        <el-tag>{{ isAuthenticated }}</el-tag>
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
  background-color: #f8f9fa;
  padding: 1em;
  border-bottom: 1px solid #e9ecef;
  position: sticky;
  top: 0;
  z-index: 999;
}

.nav-container {
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 1em 0 0.5em;
}

.logo-env {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 0.5rem;
}

.logo-env a {
  font-size: 1.5em;
  font-weight: bold;
  color: #2c3e50;
  text-decoration: none;
}

.nav-links {
  display: flex;
  gap: 2em;
  list-style: none;
  margin: 0;
  padding: 0;
}

.nav-links a {
  text-decoration: none;
  color: #2c3e50;
  font-weight: 500;
  transition: color 0.3s ease;
}

.nav-links a:hover {
  color: #42b983;
}

.nav-links a.active {
  color: #42b983;
  border-bottom: 2px solid #42b983;
}

.clickable {
  cursor: pointer;
}

.engagement-container {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 1rem;
}

.engagement-search-container {
  display: flex;
  width: 100%;
  height: 100%;
  background-color: var(--el-color-success);
  color: var(--el-color-white);
  border-radius: 0 0.25rem 0.25rem 0;
  justify-content: center;
  align-items: center;
  padding-right: 1rem;
  padding-left: 0.25rem;
}

::v-deep .el-input__wrapper {
  padding-right: 0;
}

.toggle-menu-expansion {
  display: flex;
  color: #aaaaaa;
}
</style>
