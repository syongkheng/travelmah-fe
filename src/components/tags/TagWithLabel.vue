<script lang="ts" setup>
defineProps({
  label: {
    type: String,
    required: false,
    default: "Unknown Label",
  },
  content: {
    type: String,
    required: false,
    default: "Unknown",
  },
  type: {
    type: String,
    required: false,
    default: "info",
  }
})
</script>

<template>
  <div class="tag-wrapper">
    <span class="tag-label">{{ label }}</span>
    <el-tag :type="type">
      <span>{{ content }}</span>
    </el-tag>
  </div>
</template>

<style lang="css" scoped>
.tag-wrapper {
  display: flex;
  flex-direction: row;
}

.tag-label {
  display: flex;
  width: 75px;
}
</style>
