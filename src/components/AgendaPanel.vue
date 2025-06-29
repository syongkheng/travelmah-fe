<script lang="ts" setup>
import type { AgendaItem } from '@/interfaces/AgendaItem'
import { DateUtils } from '@/utilities/DateUtils';
import { Close } from '@element-plus/icons-vue'

const props = defineProps<{
  agendaItem: AgendaItem | null
  onClose: () => void
}>()

const handleOutsideClick = () => {
  if (props.agendaItem) {
    props.onClose()
  }
}
</script>

<template>
  <transition name="slide-fade">
    <div v-if="agendaItem" class="details-panel" v-click-outside="handleOutsideClick">

      <div class="panel-header">
        <h2>{{ agendaItem.title }}</h2>
        <el-button circle @click="onClose">
          <el-icon>
            <Close />
          </el-icon>
        </el-button>
      </div>

      <div class="panel-content">
        <!-- Add your detail content here -->
        <div class="detail-section">
          <h3>Time</h3>
          <div class="time-pill">
            {{ DateUtils.extractReadableTimeFromTimestampWithFormat(agendaItem.startTime, "12h") }}
            <span class="time-separator">→</span>
            {{ DateUtils.extractReadableTimeFromTimestampWithFormat(agendaItem.endTime, "12h") }}
          </div>
        </div>

        <div class="detail-section" v-if="agendaItem.location">
          <h3>Location</h3>
          <p>{{ agendaItem.location }}</p>
        </div>

        <div class="detail-section" v-if="agendaItem.desc">
          <h3>Description</h3>
          <p>{{ agendaItem.desc }}</p>
        </div>

        <div class="detail-section" v-if="agendaItem.files.length">
          <h3>Attachments</h3>
          <div class="file-grid">
            <div v-for="file in agendaItem.files" :key="file.uuid" class="file-item">
              <img :src="file.blob" class="file-thumbnail" :alt="file.name">
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<style scoped>
.details-panel {
  position: fixed;
  right: 0;
  bottom: 0;
  height: 85vh;
  width: 40%;
  border-radius: 1.25rem 1.25rem 0 1.25rem;
  background: white;
  box-shadow: -2px 0 8px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #e4e7ed;
}

.panel-content {
  flex: 1;
  overflow-y: auto;
  padding: 1.5rem;
}

.detail-section {
  margin-bottom: 2rem;
}

.detail-section h3 {
  color: #4f46e5;
  margin-bottom: 0.5rem;
}

.file-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 1rem;
}

.file-thumbnail {
  width: 100%;
  height: 100px;
  object-fit: cover;
  border-radius: 8px;
}

.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: transform 0.3s ease;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(100%);
}
</style>
