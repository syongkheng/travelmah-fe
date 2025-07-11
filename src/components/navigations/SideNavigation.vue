<script lang="ts" setup>
import { Location, Operation, Search, Warning } from '@element-plus/icons-vue'
import { useLayoutStateStore } from '@/stores/layoutState'
import { useNav } from '@/hooks/useNav'
import { ElMessage } from 'element-plus';
import { useAuthenticationStore } from '@/stores/authentication';
import { storeToRefs } from 'pinia';
import { onMounted } from 'vue';
import { useBreakpointManager } from '@/composables/useBreakpointManager';
import { Breakpoint } from '@/constants/Breakpoint';

const layoutStore = useLayoutStateStore()
const navigate = useNav();
const authStore = useAuthenticationStore()
const { isAuthenticated } = storeToRefs(authStore) // Preserves reactivity
const { isScreensizeBelow } = useBreakpointManager();

const handleLogout = () => {
  authStore.handleLogout()
  navigate.redirectToLanding()
  ElMessage.success('Logout Successfully')
}

const handleMyItinerary = () => {
  ElMessage.info("Page Coming Soon")
}

const handleSetting = () => {
  ElMessage.info("Page Coming Soon")
}

onMounted(async () => {
  if (isScreensizeBelow(Breakpoint.M)) {
    await layoutStore.sideNav.setFalse()
  }
})
</script>

<template>
  <el-menu class="el-menu-vertical-demo" :collapse="!layoutStore.sideNav.isExpanded">
    <span @click="navigate.redirectToPlanning">
      <el-menu-item index="1">
        <el-icon>
          <Location />
        </el-icon>
        <template #title>{{ 'Create an Itinerary' }}</template>
      </el-menu-item>
    </span>
    <span @click="navigate.redirectToSearch({ newTab: false })">

      <el-menu-item index="2">
        <el-icon>
          <Search />
        </el-icon>
        <template #title>{{ 'Search an Itinerary' }}</template>
      </el-menu-item>
    </span>
    <el-divider />
    <span class="authenticated menu" v-if="isAuthenticated">
      <span @click="handleMyItinerary">
        <el-menu-item index="3">
          <el-icon>
            <Search />
          </el-icon>
          <template #title>{{ 'My Itinerary' }}</template>
        </el-menu-item>
      </span>
      <span @click="handleSetting">
        <el-menu-item index="4">
          <el-icon>
            <Operation />
          </el-icon>
          <template #title>{{ 'Settings' }}</template>
        </el-menu-item>
      </span>
      <span @click="handleLogout">
        <el-menu-item index="5">
          <el-icon>
            <Warning />
          </el-icon>
          <template #title>{{ 'Logout' }}</template>
        </el-menu-item>
      </span>
    </span>
  </el-menu>
</template>

<style>
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  min-height: 100vh;
}

.el-menu-vertical-demo .el-divider--horizontal {
  margin: 0;
}
</style>
