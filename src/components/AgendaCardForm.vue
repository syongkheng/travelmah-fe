<script lang="ts" setup>
import { computed, onBeforeUnmount, ref, watch, type PropType } from 'vue'
import { FolderChecked, Delete } from '@element-plus/icons-vue'
import type { AgendaItem } from '@/interfaces/AgendaItem'
import { useItineraryStore } from '@/stores/itinerary'
import { storeToRefs } from 'pinia'
import { ListUtils } from '@/utilities/ListUtils'
import { FileWithPreview } from '@/interfaces/FileWithPreview'
import { FileUtils } from '@/utilities/FileUtils'
import { useBreakpointManager } from '@/composables/useBreakpointManager'
import { Breakpoint } from '@/constants/Breakpoint'

const { isScreensizeBelow } = useBreakpointManager()
const isMobile = computed(() => isScreensizeBelow(Breakpoint.M))

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true,
  },
  onClose: {
    type: Function,
    required: true,
  },
  selectedDay: {
    type: Number,
    required: false,
  },
  selectedAgenda: {
    type: Object as PropType<AgendaItem>,
    required: false,
  }
})

const itineraryStore = useItineraryStore()
const { itinerary } = storeToRefs(itineraryStore)
const editingMode = ref(false)
const fileInput = ref<HTMLInputElement | null>(null)

const defaultAgendaItem = (): AgendaItem => ({
  title: 'Untiltled Activity',
  desc: '',
  location: '',
  durationInHours: 0,
  files: [],
  budget: 0,
  day: props.selectedDay || 1,
  unknownTime: false,
  _fileIdsToDelete: [],
  _fileIdsToInsert: [],
  _agendaToFileMapping: [],
})

const agendaItemToBeAdded = ref<AgendaItem>(
  props.selectedAgenda ? { ...props.selectedAgenda } : defaultAgendaItem()
)

watch(
  () => props.selectedAgenda,
  (newAgenda) => {
    if (newAgenda) {
      agendaItemToBeAdded.value = {
        ...newAgenda,
        _fileIdsToDelete: newAgenda._fileIdsToDelete || [],
        _fileIdsToInsert: newAgenda._fileIdsToInsert || [],
        _agendaToFileMapping: newAgenda._agendaToFileMapping || [],
      };
      editingMode.value = true
    } else {
      agendaItemToBeAdded.value = defaultAgendaItem()
      editingMode.value = false
    }
  },
  { deep: true, immediate: true }
)

watch(
  () => props.selectedDay,
  (newDay) => {
    if (!props.selectedAgenda && newDay) {
      agendaItemToBeAdded.value.day = newDay
    }
  }
)

const handleSave = async () => {
  const rawData = JSON.parse(JSON.stringify(agendaItemToBeAdded.value));

  const itemCopy: AgendaItem = {
    ...rawData,
    files: agendaItemToBeAdded.value.files.map(file => ({ ...file })),
    _fileIdsToDelete: [...(rawData._fileIdsToDelete || [])]
  };

  if (editingMode.value) {
    itineraryStore.updateAgendaItem(itemCopy);
  } else {
    await itineraryStore.addAgendaItemToItinerary(itemCopy);
  }

  agendaItemToBeAdded.value = defaultAgendaItem();
  props.onClose();
};

const triggerFileInput = () => fileInput.value?.click()

const handleFileUpload = (event: Event) => {
  const input = event.target as HTMLInputElement
  const files = input.files
  if (!files) return

  const remainingSlots = itineraryStore.getLimitForFileUpload() - agendaItemToBeAdded.value.files.length
  const newFiles = Array.from(files).slice(0, remainingSlots)

  newFiles.forEach(async (file) => {
    const fileToBeAdded = new FileWithPreview(file)
    const blobString = await FileUtils.convertFileToBase64(file)

    agendaItemToBeAdded.value.files = [
      ...agendaItemToBeAdded.value.files,
      { ...fileToBeAdded, blob: blobString }
    ]

    agendaItemToBeAdded.value._fileIdsToInsert = [
      ...agendaItemToBeAdded.value._fileIdsToInsert,
      fileToBeAdded.uuid
    ]
  })

  input.value = ''
}

const disabledSeconds = (hour: number, minute: number) => {
  if (hour && minute) return ListUtils.makeRange(1, 59)
}

const onAgendaTimingSelection = (timing: string[]) => {
  if (timing.length !== 2) return

  const start = new Date(timing[0])
  const end = new Date(timing[1])

  const durationMs = end.getTime() - start.getTime()

  agendaItemToBeAdded.value.durationInHours = Number(
    (durationMs / (1000 * 60 * 60)).toFixed(1)
  )
  agendaItemToBeAdded.value.durationTimingRaw = timing
  agendaItemToBeAdded.value.startTime = new Date(timing[0]).getTime()
  agendaItemToBeAdded.value.endTime = new Date(timing[1]).getTime()
}

const onUnknownTimeToggle = () => {
  if (agendaItemToBeAdded.value.unknownTime) {
    agendaItemToBeAdded.value.durationTimingRaw = []
    agendaItemToBeAdded.value.startTime = undefined
    agendaItemToBeAdded.value.endTime = undefined
  }
}

const handleFileDeletion = (index: number) => {
  const idToDelete = agendaItemToBeAdded.value.files[index].uuid;
  if (idToDelete) {
    agendaItemToBeAdded.value._fileIdsToDelete = [
      ...(agendaItemToBeAdded.value._fileIdsToDelete || []),
      idToDelete
    ];
  }
  agendaItemToBeAdded.value.files = agendaItemToBeAdded.value.files.filter(
    (_, i) => i !== index
  );
};

onBeforeUnmount(() => {
  agendaItemToBeAdded.value.files.forEach(file => {
    URL.revokeObjectURL(file.previewUrl)
  })
})
</script>

<template>
  <el-dialog :model-value="isOpen" @close="onClose" :fullscreen="isMobile" :class="{ 'mobile-dialog': isMobile }"
    :align-center="!isMobile">
    <div class="form-wrapper">
      <div class="overview-container">
        <div class="top-down-container title-container">
          <span class="field-label">{{ "Title" }}</span>
          <el-input v-model="agendaItemToBeAdded.title" class="title-wrapper" :validate-event="false"
            placeholder="Title" :size="isMobile ? 'large' : 'default'" />
        </div>
        <div class="top-down-container day-container">
          <span class="field-label">Day #</span>
          <el-select v-model="agendaItemToBeAdded.day" class="day-selector" placeholder="Select day"
            :disabled="itinerary.durationInDays === 1" :size="isMobile ? 'large' : 'default'">
            <el-option v-for="day in itinerary.durationInDays" :key="day" :label="`Day ${day}`" :value="day" />
          </el-select>
        </div>
      </div>

      <el-divider content-position="left">Optional</el-divider>
      <div class="optional-field-container">
        <div class="top-down-container">
          <span class="field-label">{{ "Location" }}</span>
          <el-input v-model="agendaItemToBeAdded.location" class="inline-edit-desc" placeholder="Location"
            :validate-event="false" :size="isMobile ? 'large' : 'default'" />
        </div>
        <div class="top-down-container">
          <span class="field-label">{{ "Description" }}</span>
          <el-input v-model="agendaItemToBeAdded.desc" type="textarea" class="inline-edit-desc"
            :autosize="{ minRows: 2 }" placeholder="Reminders" :validate-event="false"
            :size="isMobile ? 'large' : 'default'" />
        </div>
        <div class="time-container">
          <div class="top-down-container" v-if="!agendaItemToBeAdded.unknownTime">
            <span class="field-label">Duration:</span>
            <el-time-picker v-model="agendaItemToBeAdded.durationTimingRaw" is-range range-separator="To"
              start-placeholder="Start time" end-placeholder="End time" :disabled-seconds="disabledSeconds"
              @change="onAgendaTimingSelection" :size="isMobile ? 'large' : 'default'" />
          </div>
          <div class="top-down-container" v-if="agendaItemToBeAdded.unknownTime">
            <span class="field-label">Duration (hours):</span>
            <el-input-number v-model="agendaItemToBeAdded.durationInHours" :precision="1" :step="0.1" :max="1000"
              :controls="!isMobile" :size="isMobile ? 'large' : 'default'" />
          </div>
          <el-checkbox v-model="agendaItemToBeAdded.unknownTime" @change="onUnknownTimeToggle"
            :size="isMobile ? 'large' : 'default'">
            No exact time yet
          </el-checkbox>
        </div>
      </div>

      <el-divider content-position="left">Optional - Image(s)</el-divider>
      <div class="preview-container">
        <div v-for="(file, index) in agendaItemToBeAdded.files" :key="file.uuid" class="preview-item">
          <img :src="file.blob" class="preview-image" :alt="file.name" />
          <div class="preview-overlay">
            <el-button type="danger" :icon="Delete" circle @click="handleFileDeletion(index)"
              :size="isMobile ? 'large' : 'default'" />
          </div>
        </div>

        <div v-if="agendaItemToBeAdded.files.length < itineraryStore.getLimitForFileUpload()" class="upload-trigger"
          @click="triggerFileInput">
          <div class="plus-icon">+</div>
          <div class="upload-text">Upload</div>
        </div>

        <input ref="fileInput" type="file" multiple accept="image/*" @change="handleFileUpload"
          style="display: none;" />
      </div>

      <div class="button-wrapper">
        <el-button type="primary" :icon="FolderChecked" @click="handleSave" :size="isMobile ? 'large' : 'default'">
          Save
        </el-button>
      </div>
    </div>
  </el-dialog>
</template>

<style scoped>
/* ============ Base Variables ============ */
:root {
  --primary-color: #4f46e5;
  --text-color: #1a1a1a;
  --bg-color: #f8fafc;
  --card-bg: white;
  --border-color: #e4e7ed;
  --shadow-sm: 0 2px 8px rgba(0, 0, 0, 0.05);
  --radius-md: 12px;
  --radius-sm: 8px;
  --transition: 0.2s ease;
}

:deep(.el-divider--horizontal) {
  margin: 0;
}

/* ============ Base Layout ============ */
.form-wrapper {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.overview-container {
  display: flex;
  gap: 1.25rem;
  width: 100%;
}

.top-down-container {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  flex-grow: 1;
}

.field-label {
  font-size: 0.875rem;
  color: var(--el-text-color-secondary);
  font-weight: 500;
}

.title-wrapper {
  width: 100%;
}

.day-selector {
  width: 100%;
}

/* ============ Optional Fields ============ */
.optional-field-container {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.time-container {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

/* ============ Image Upload ============ */
.preview-container {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.preview-item,
.upload-trigger {
  width: 100px;
  height: 100px;
  border: 2px dashed var(--border-color);
  border-radius: var(--radius-sm);
  transition: all var(--transition);
  position: relative;
  overflow: hidden;
}

.upload-trigger {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: var(--bg-color);
  cursor: pointer;
}

.upload-trigger:hover {
  border-color: var(--primary-color);
  background: rgba(79, 70, 229, 0.05);
}

.plus-icon {
  font-size: 1.5rem;
  font-weight: 300;
  color: var(--primary-color);
}

.upload-text {
  font-size: 0.75rem;
  color: var(--el-text-color-secondary);
  margin-top: 4px;
}

.preview-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.preview-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity var(--transition);
}

.preview-item:hover .preview-overlay {
  opacity: 1;
}

/* ============ Buttons ============ */
.button-wrapper {
  display: flex;
  justify-content: flex-end;
  margin-top: 1rem;
}

.el-button {
  min-width: 120px;
}

/* ============ Mobile Styles ============ */
@media (max-width: 768px) {
  .mobile-dialog {
    .el-dialog__body {
      padding: 20px;
    }
  }

  .overview-container {
    flex-direction: column;
    gap: 1rem;
  }

  .title-wrapper,
  .day-selector {
    width: 100%;
  }

  .preview-item,
  .upload-trigger {
    width: 80px;
    height: 80px;
  }

  .button-wrapper {
    margin-top: 1.5rem;
  }

  .el-button {
    width: 100%;
  }
}

@media (max-width: 480px) {

  .preview-item,
  .upload-trigger {
    width: 70px;
    height: 70px;
  }

  .optional-field-container {
    gap: 1.5rem;
  }
}
</style>
