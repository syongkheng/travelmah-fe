<script lang="ts" setup>
import { computed, h, onBeforeUnmount, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import AgendaCardForm from '@/components/AgendaCardForm.vue'
import { hierarchicalLocations } from '@/interfaces/HierarchicalLocation'
import { useItineraryStore } from '@/stores/itinerary'
import { storeToRefs } from 'pinia'
import type { AgendaItem } from '@/interfaces/AgendaItem'
import { DocumentAdd, Plus, Refresh } from '@element-plus/icons-vue'
import AgendaCard from '@/components/AgendaCard.vue'
import { ElButton, ElMessage, ElNotification } from 'element-plus'
import { GeneratorUtils } from '@/utilities/GeneratorUtils'
import { useLayoutStateStore } from '@/stores/layoutState'
import { useAuthenticationStore } from '@/stores/authentication'
import { useBreakpointManager } from '@/composables/useBreakpointManager'
import { Breakpoint } from '@/constants/Breakpoint'
import { useItineraryActions } from '@/composables/useItineraryActions'

const { isScreensizeBelow } = useBreakpointManager()
const isMobile = computed(() => isScreensizeBelow(Breakpoint.M))
const route = useRoute()
const sessionId = route.query.session?.toString()
const toggleEditingTitle = ref(false)
const isAddAgendaDialogVisible = ref(false)
const isCreateAgendaButtonDisabled = ref(false)

const itineraryStore = useItineraryStore()
const authStore = useAuthenticationStore()
const { itinerary } = storeToRefs(itineraryStore)
const layoutStore = useLayoutStateStore()
const dayOfTriggeredTag = ref(1)
const agendaItemToBeEdited = ref<AgendaItem>()

// Use the composable
const {
  saveItinerary: saveItineraryComposable,
  showSuccessNotification
} = useItineraryActions()

const openNotification = () => {
  if (authStore.isAuthenticated) {
    layoutStore.collabDialog.setTrue()
    return
  }
  ElMessage.warning("You must be logged in!")
  authStore.setRedirectAfterLogin(false)
  layoutStore.loginDialog.setTrue()
}

const handleAddAnActivity = (day: number) => {
  dayOfTriggeredTag.value = day
  isAddAgendaDialogVisible.value = true
}

const handleAddAgendaDialogOnClose = () => {
  dayOfTriggeredTag.value = 1
  agendaItemToBeEdited.value = undefined
  isAddAgendaDialogVisible.value = false
}

const handleUnknownDateToggle = () => {
  itineraryStore.onUnknownDateToggle()
}

const handleTagClose = (item: AgendaItem) => {
  itineraryStore.removeAgendaItem(item)
}

const handleOnTagSelection = (item: AgendaItem) => {
  agendaItemToBeEdited.value = item
  isAddAgendaDialogVisible.value = true
}

const handleBrowserUnload = (e: BeforeUnloadEvent) => {
  e.preventDefault()
}

const retrySubmittingItinerary = () => {
  const newSessionId = GeneratorUtils.generateSessionID()
  itinerary.value.sessionId = newSessionId
  const url = new URL(window.location.href)
  url.searchParams.set('session', newSessionId)
  window.history.replaceState(null, '', url.toString())
  isCreateAgendaButtonDisabled.value = false
}

// Updated saveItinerary function using the composable
const saveItinerary = async () => {
  isCreateAgendaButtonDisabled.value = true
  const { success, shortCode, error } = await saveItineraryComposable()

  if (!success && error) {
    const failureNotification = ElNotification({
      title: "Submission Failed",
      type: "error",
      duration: 0,
      message: () => h('div', { class: 'notification-content' }, [
        h('p', { class: 'notification-error-description' }, 'Something went wrong, please try again.'),
        h(ElButton, {
          type: "primary",
          class: "retry-button",
          icon: Refresh,
          loading: false,
          onClick: () => {
            failureNotification.close()
            retrySubmittingItinerary()
          }
        }, ' Retry Submission')
      ])
    })
    return
  }

  if (success && shortCode) {
    showSuccessNotification(shortCode)
  }
}

onMounted(() => {
  itineraryStore.resetItinerary()
  itineraryStore.setSessionId(sessionId as string)
  window.addEventListener('beforeunload', handleBrowserUnload)
})

onBeforeUnmount(() => {
  window.removeEventListener('beforeunload', handleBrowserUnload)
})

const cascaderProps = {
  checkStrictly: true,
}
</script>


<template>
  <div class="page-container">
    <header class="session-header">
      <div class="title-container">
        <div class="itinerary-details-header-container">
          <div class="title-and-actions">
            <span v-if="toggleEditingTitle">
              <el-input v-model="itinerary.sessionTitle" class="session-title-input" :validate-event="false"
                @blur="toggleEditingTitle = false" :size="isMobile ? 'large' : 'default'" />
            </span>
            <span class="session-title-container" v-else @click="toggleEditingTitle = true">
              <el-tooltip class="box-item" effect="dark" content="Edit itinerary name" placement="top">
                <span class="title-text">
                  {{ itinerary.sessionTitle }}
                </span>
              </el-tooltip>
            </span>
            <el-tooltip class="box-item" effect="dark" content="Save Itinerary" placement="top">
              <el-button :icon="DocumentAdd" circle type="primary" @click="saveItinerary"
                :disabled="isCreateAgendaButtonDisabled" class="save-button" :size="isMobile ? 'large' : 'default'" />
            </el-tooltip>
          </div>
        </div>
        <div class="tag-wrapper">
          <el-tag class="clickable privacy-tag" type="danger" @click="openNotification"
            :size="isMobile ? 'large' : 'default'">
            {{ 'Collaborator list' }}
          </el-tag>
        </div>
      </div>
      <div class="itinerary-overview-container">
        <div class="itinerary-config-field">
          <el-cascader :placeholder="isMobile ? 'Destination' : 'Where are you going?'"
            v-model="itinerary.destinationRaw" :options="hierarchicalLocations" style="width: 100%"
            :size="isMobile ? 'large' : 'default'" :props="cascaderProps" />
        </div>
        <div class="date-config-container">
          <span class="itinerary-config-field" v-if="!itinerary.unknownDate">
            <el-date-picker v-model="itinerary.itineraryDateRaw" type="daterange" range-separator="to"
              style="width: 100%;" :start-placeholder="isMobile ? 'From' : 'Depature date'"
              :end-placeholder="isMobile ? 'To' : 'Return date'" :disabled="itinerary.unknownDate"
              @change="itineraryStore.onItineraryDateSelection" :size="isMobile ? 'large' : 'default'" />
          </span>
          <span class="itinerary-config-field" v-if="itinerary.unknownDate">
            <el-input-number v-model="itinerary.durationInDays" :min="1" :controls="!isMobile" style="width: 100%;"
              :size="isMobile ? 'large' : 'default'">
              <template #suffix>
                <span class="input-suffix">{{ "day(s)" }}</span>
              </template>
            </el-input-number>
          </span>
          <span class="unknown-date-toggle">
            <el-checkbox v-model="itinerary.unknownDate" @change="handleUnknownDateToggle"
              :size="isMobile ? 'large' : 'default'">
              {{ isMobile ? "No dates" : "No exact dates yet" }}
            </el-checkbox>
          </span>
        </div>
        <div class="itinerary-config-field">
          <el-input-number v-model="itinerary.numberOfPax" :min="1" style="width: 100%;" :controls="!isMobile"
            :size="isMobile ? 'large' : 'default'">
            <template #suffix>
              <span class="input-suffix">{{ isMobile ? "person(s)" : "traveller(s)" }}</span>
            </template>
          </el-input-number>
        </div>
      </div>
    </header>
    <el-divider />
    <div class="itinerary-wrapper">
      <div v-for="day in itinerary.durationInDays" :key="day" class="day-container">
        <div class="day-wrapper">
          {{ "Day #" + day }}
        </div>
        <div class="agenda-items-container">
          <div v-for="agendaItem in itinerary.agendaItems.filter(i => i.day === day)" :key="agendaItem._localIndex"
            class="agenda-item-wrapper">
            <AgendaCard :agendaItem="agendaItem" :onClick="() => handleOnTagSelection(agendaItem)"
              :onDelete="handleTagClose" :closeable="true" />
          </div>
          <el-tag type="primary" class="add-activity-tag" @click="handleAddAnActivity(day)"
            :size="isMobile ? 'large' : 'default'">
            <div class="add-activity-content">
              <el-icon class="add-icon">
                <Plus />
              </el-icon>
              <span class="add-text">Add Activity</span>
            </div>
          </el-tag>

        </div>
      </div>
    </div>

    <AgendaCardForm :isOpen="isAddAgendaDialogVisible" :onClose="handleAddAgendaDialogOnClose"
      :selectedDay="dayOfTriggeredTag" :selectedAgenda="agendaItemToBeEdited" />
  </div>
</template>

<style scoped>
/* ============ CSS Variables ============ */
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

/* ============ Base Layout ============ */
.page-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  padding: 1.5rem;
  background: var(--bg-color);
}

/* ============ Header Styles ============ */
.session-header {
  background: var(--card-bg);
  padding: 1.5rem;
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-sm);
}

.title-container {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.itinerary-details-header-container {
  display: flex;
  gap: 1.25rem;
  align-items: center;
}

.title-and-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  gap: 1rem;
}

.session-title-container {
  font-size: 1.75rem;
  font-weight: 600;
  color: var(--text-color);
  cursor: pointer;
  flex-grow: 1;

  &:hover {
    text-decoration: underline;
  }
}

.title-text {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.session-title-input {
  font-size: 1.75rem !important;
  font-weight: 600;
}

.tag-wrapper {
  margin-top: 0.25rem;
  gap: 0.5rem;
  display: flex;
  align-items: center;
}

.privacy-tag {
  width: fit-content;
}

/* ============ Itinerary Content ============ */
.itinerary-wrapper {
  background: var(--card-bg);
  padding: 2rem;
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-sm);
}

/* ============ Timeline Styles ============ */
.day-container {
  position: relative;
  padding-left: 2rem;
  margin-bottom: 2rem;
  border-left: 2px solid var(--border-color);

  &:last-child {
    margin-bottom: 0;
  }

  &::before {
    content: '';
    position: absolute;
    left: -7px;
    top: 0;
    width: 12px;
    height: 12px;
    background: var(--primary-color);
    border-radius: 50%;
    border: 2px solid white;
    box-shadow: 0 2px 4px rgba(79, 70, 229, 0.2);
  }
}

.day-wrapper {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-color);
  margin-bottom: 1.5rem;
  padding-left: 0.5rem;
}

.agenda-items-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.agenda-item-wrapper {
  transition: transform var(--transition);

  &:hover {
    transform: translateY(-2px);
  }
}

/* ============ Add Activity Tag ============ */
.add-activity-tag {
  --add-tag-bg: rgba(64, 158, 255, 0.08);
  --add-tag-hover-bg: rgba(64, 158, 255, 0.15);

  cursor: pointer;
  transition: all var(--transition);
  background: var(--add-tag-bg);
  color: var(--el-color-primary);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem 1.25rem;
  border-radius: var(--radius-sm);
  width: 100%;
  max-width: 200px;
  margin-top: 0.5rem;

  &:hover {
    background: var(--add-tag-hover-bg);
    transform: translateY(-1px);
    box-shadow: var(--shadow-sm);
  }

  .add-activity-content {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-weight: 500;
  }

  .add-icon {
    font-size: 1rem;
    transition: transform var(--transition);
    color: var(--el-color-primary);
    margin-right: 0.25rem;
  }

  &:hover .add-icon {
    transform: scale(1.1);
  }
}

/* ============ Form Fields ============ */
.itinerary-overview-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-top: 1.5rem;
}

.date-config-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.itinerary-config-field {
  width: 100%;
}

.unknown-date-toggle {
  margin-top: -0.5rem;
}

.input-suffix {
  font-size: 0.9rem;
  color: var(--el-text-color-secondary);
}

/* ============ Responsive Styles ============ */
@media (max-width: 768px) {
  .page-container {
    padding: 0.75rem;
  }

  .session-header {
    padding: 1rem;
  }

  .title-and-actions {
    gap: 0.75rem;
    flex-direction: column;
    align-items: flex-start;
  }

  .title-text {
    font-size: 1.4rem;
    line-height: 1.3;
  }

  .session-title-input {
    font-size: 1.4rem !important;
  }

  .privacy-tag {
    width: 100%;
    justify-content: center;
  }

  .itinerary-overview-container {
    grid-template-columns: 1fr;
    gap: 1rem;
    margin-top: 1rem;
  }

  .day-container {
    padding-left: 1.25rem;
    margin-bottom: 1.5rem;
  }

  .day-wrapper {
    font-size: 1.1rem;
    margin-bottom: 1rem;
  }

  .agenda-items-container {
    gap: 0.75rem;
  }

  .add-activity-tag {
    max-width: 100%;
    padding: 1rem;
    margin-top: 0.75rem;

    .add-activity-content {
      font-size: 1rem;
    }
  }
}

:deep(.el-divider--horizontal) {
  margin: 0;
}

@media (max-width: 400px) {
  .title-text {
    font-size: 1.25rem;
  }

  .session-header {
    padding: 0.75rem;
  }

  .day-container {
    padding-left: 1rem;
  }
}
</style>
