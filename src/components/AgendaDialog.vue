<script lang="ts" setup>
import type { AgendaItem } from '@/interfaces/AgendaItem';
import type { PropType } from 'vue';
import TagWithLabel from './tags/TagWithLabel.vue';

defineProps({
  agendaItem: {
    type: Object as PropType<AgendaItem>,
    required: true,
  },
  isOpen: {
    type: Boolean,
    required: true,
  },
  handleOnDialogClose: {
    type: Function,
    required: false,
    default: () => console.warn("A function is needed")
  }
})

</script>

<template>
  <el-dialog :model-value="isOpen" @close="handleOnDialogClose">
    <template #title>
      <div class="title-container">
        <span class="title-wrapper">{{ agendaItem.title }}</span>
        <el-tag>{{ "Day #" + agendaItem.day }}</el-tag>
      </div>
    </template>
    <span class="tag-col">
      <TagWithLabel label="Start time: "
        :content="(agendaItem.startTime ? new Date(agendaItem.startTime).toString() : 'Unknown')" type="primary" />
      <TagWithLabel label="End time: "
        :content="(agendaItem.endTime ? new Date(agendaItem.endTime).toString() : 'Unknown')" type="primary" />
    </span>
    <el-divider content-position="left">{{ "Description" }}</el-divider>
    <el-text>{{ agendaItem.desc }}</el-text>
    <el-divider content-position="left">{{ "Attached Images" }}</el-divider>
    <div class="image-wrapper">
      <div v-for="(file) in agendaItem.files" :key="file.uuid" class="preview-item">
        <img :src="file.blob" class="preview-image" :alt="file.name" />
      </div>
    </div>
  </el-dialog>
</template>

<style lang="css" scoped>
.image-wrapper {
  display: flex;
  flex-direction: row;
  gap: 1rem;
}

.title-container {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 1rem;
}

.title-wrapper {
  font-size: 1.25em;
}

.tag-col {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.preview-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.preview-item {
  width: 100px;
  height: 100px;
  border: 2px dashed #e2e8f0;
  border-radius: 12px;
  transition: all 0.2s ease;
  position: relative;
  overflow: hidden;
}

.preview-item:hover {
  opacity: 1;
}
</style>
