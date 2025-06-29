<script lang="ts" setup>
import type { AgendaItem } from '@/interfaces/AgendaItem';
import type { PropType } from 'vue';

defineProps({
  handleOnTagSelection: {
    type: Function,
    required: true,
  },
  handleTagClose: {
    type: Function,
    required: false,
    default: () => console.warn("A callback function is required.")
  },
  agendaItem: {
    type: Object as PropType<AgendaItem>,
    required: true,
  },
  closable: {
    type: Boolean,
    required: false,
    default: true,
  }
})
</script>

<template>
  <el-tag class="clickable" @click="handleOnTagSelection(agendaItem)" :closable="closable" :disable-transitions="false"
    @close="handleTagClose(agendaItem)" type="info">
    <div class="tag-wrapper">
      <span>
        {{ agendaItem.title }}
      </span>
      <el-divider direction="vertical" />
      <span>
        {{ agendaItem.durationInHours + " hour(s)" }}
      </span>
    </div>
  </el-tag>
</template>

<style lang="css" scoped>
.clickable {
  cursor: pointer;
}
</style>
