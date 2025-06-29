<script lang="ts" setup>
import { ref } from 'vue'
import { Search } from '@element-plus/icons-vue'
import { useNav } from '@/hooks/useNav'

const uItineraryId = ref('')

const formFieldsWidth = '240px'

const { redirectTo } = useNav()
</script>

<template>
  <div class="search-container">
    <h1>Search Existing Itinerary!</h1>
    <el-input
      v-model="uItineraryId"
      :style="{
        width: formFieldsWidth,
      }"
      placeholder="Itinerary ID"
      :prefix-icon="Search"
    />
    <el-button
      :style="{
        width: formFieldsWidth,
        marginTop: '2em',
        marginBottom: '1em',
      }"
      @click="
        redirectTo(`/itinerary/${uItineraryId}`, {
          newTab: true,
        })
      "
    >
      {{ 'Search' }}
    </el-button>
  </div>
</template>

<style lang="css" scoped>
h1 {
  margin: 0 0 1em 0;
  padding: 0;
}

.search-container {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
</style>
