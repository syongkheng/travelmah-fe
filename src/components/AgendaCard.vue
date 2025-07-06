<script setup lang="ts">
import type { AgendaItem } from '@/interfaces/AgendaItem';
import type { PropType } from 'vue';
import { DateUtils } from '@/utilities/DateUtils';
import { Delete } from '@element-plus/icons-vue'

defineProps({
  agendaItem: {
    type: Object as PropType<AgendaItem>,
    required: true,
  },
  closeable: {
    type: Boolean,
    required: false,
    default: false,
  },
  onClick: {
    type: Function,
    required: false,
    default: () => console.warn("Function not defined.")
  },
  onDelete: {
    type: Function,
    required: false,
    default: () => console.warn("Function not defined.")
  },
})
</script>

<template>
  <div class="agenda-card" @click.stop="$emit('click', agendaItem)">
    <div class="time-info">

      <div class="time-pill" v-if="!agendaItem.unknownTime">
        {{ DateUtils.extractReadableTimeFromTimestampWithFormat(agendaItem.startTime, "12h") }}
        <span class="time-separator">→</span>
        {{ DateUtils.extractReadableTimeFromTimestampWithFormat(agendaItem.endTime, "12h") }}
      </div>
      <div class="time-pill" v-else> {{ agendaItem.durationInHours ?? 0.0 }} {{ "h" }}</div>
    </div>
    <div class="title-wrapper">
      <h3 class="title">{{ agendaItem.title }}</h3>
      <div v-if="closeable" @click.stop="onDelete(agendaItem)">
        <el-icon :size="25">
          <Delete />
        </el-icon>
      </div>
    </div>
    <div class="location">
      <svg class="location-icon" viewBox="0 0 24 24" width="16" height="16">
        <path
          d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
      </svg>
      {{ agendaItem.location ? agendaItem.location : "Unknown" }}
    </div>
  </div>
</template>

<style scoped>
.time-info {
  display: flex;
  flex-direction: column;
}

.title-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin-bottom: 8px;
}

.el-icon {
  color: #ff4444;
  padding: 4px;
  border-radius: 4px;
  transition: all 0.2s ease;
}

.el-icon:hover {
  background: #ffeeee;
  cursor: pointer;
}

.agenda-card {
  padding: 1.25rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  position: relative;
  overflow: hidden;
  margin: 0.5rem 0;
  width: fit-content;
}

.agenda-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
  cursor: pointer;
}

.time-pill {
  background: #f3f4ff;
  color: #4f46e5;
  padding: 4px 10px;
  border-radius: 4px;
  font-size: 0.85rem;
  font-weight: 500;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 12px;
}

.time-separator {
  color: #818cf8;
  font-weight: 700;
  margin: 0 4px;
}

.title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 8px 0;
  line-height: 1.4;
}

.location {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.9rem;
  color: #6b7280;
  line-height: 1.4;
}

.location-icon {
  fill: #6b7280;
  flex-shrink: 0;
}
</style>
