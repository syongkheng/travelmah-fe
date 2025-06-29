<script lang="ts" setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import AgendaCardForm from '@/components/AgendaCardForm.vue'
import { hierarchicalLocations } from '@/interfaces/HierarchicalLocation'
import { useItineraryStore } from '@/stores/itinerary'
import { storeToRefs } from 'pinia'
import type { AgendaItem } from '@/interfaces/AgendaItem'
import { DocumentAdd, Plus } from '@element-plus/icons-vue'
import AgendaCard from '@/components/AgendaCard.vue'
import { useLayoutStateStore } from '@/stores/layoutState'
import { ifHaveEditItineraryPermission } from '@/composables/ifHaveEditItineraryPermission'
import { Notification } from '@/utilities/NotificationUtils'
import { useNav } from '@/hooks/useNav'
import { useAuthenticationStore } from '@/stores/authentication'

const route = useRoute()
const sessionId = route.params.id?.toString()
const toggleEditingTitle = ref(false);
const isAddAgendaDialogVisible = ref(false);

const itineraryStore = useItineraryStore();
const { itinerary } = storeToRefs(itineraryStore)
const layoutStore = useLayoutStateStore();
const authStore = useAuthenticationStore();
const dayOfTriggeredTag = ref(1)
const agendaItemToBeEdited = ref<AgendaItem>()

const navigate = useNav()

const configureItineraryWithLocalIndex = () => {
  itinerary.value.agendaItems = itinerary.value.agendaItems.map((item, index) => ({
    ...item,
    _localIndex: item._localIndex || `${Date.now()}_${index}`
  }))
}

const openNotification = () => {
  layoutStore.collabDialog.setTrue();
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

const updateItinerary = async () => {
  const { isSuccess, error } = await itineraryStore.updateItinerary()
  if (!isSuccess && error === 'auth') {
    Notification.Authentication.SessionExpired()
    authStore.setRedirectAfterLogin(false)
    layoutStore.loginDialog.setTrue()
    return
  }
  if (!isSuccess) {
    Notification.Update.Failure()
    return
  }
  Notification.Update.Success()
}

onMounted(async () => {
  const validity = await ifHaveEditItineraryPermission(sessionId)
  if (!validity) {
    Notification.Collab.NoPermission()
    navigate.redirectToUnauthorized()
    return
  }
  itineraryStore.setSessionId(sessionId as string)
  itineraryStore.retrieveItineraryForUpdate(sessionId).then(() => {
    configureItineraryWithLocalIndex()
  })

  window.addEventListener('beforeunload', handleBrowserUnload)
})

onBeforeUnmount(() => {
  window.removeEventListener('beforeunload', handleBrowserUnload)
})
</script>

<template>
  <div class="page-container">
    <header class="session-header">
      <div class="title-container">
        <div class="itinerary-details-header-container">
          <div>
            <span v-if="toggleEditingTitle">
              <el-input v-model="itinerary.sessionTitle" class="session-title-input" :validate-event="false"
                @blur="toggleEditingTitle = false" />
            </span>
            <span class="session-title-container" v-else @click="toggleEditingTitle = true">
              <el-tooltip class="box-item" effect="dark" content="Edit itinerary name" placement="top">
                <span>
                  {{ itinerary.sessionTitle }}
                </span>
              </el-tooltip>
            </span>
          </div>
          <div>
            <el-tooltip class="box-item" effect="dark" content="Save Itinerary" placement="top">
              <el-button :icon="DocumentAdd" circle type="primary" @click="updateItinerary" />
            </el-tooltip>
          </div>
        </div>
        <div class="tag-wrapper">
          <el-tag class="clickable" type="danger" @click="openNotification">
            {{ 'Itinerary uneditable by others' }}
          </el-tag>
        </div>
      </div>
      <div class="itinerary-overview-container">
        <div class="itinerary-config-field">
          <el-cascader placeholder="Where are you going?" v-model="itinerary.destinationRaw"
            :options="hierarchicalLocations" style="width: 100%" />
        </div>
        <div class="date-config-container">
          <span class="itinerary-config-field">
            <el-date-picker v-model="itinerary.itineraryDateRaw" type="daterange" range-separator="to"
              style="width: 100%;" start-placeholder="Depature date" end-placeholder="Return date"
              :disabled="itinerary.unknownDate" @change="itineraryStore.onItineraryDateSelection"
              v-if="!itinerary.unknownDate" />
          </span>
          <span class="itinerary-config-field">
            <el-input-number v-model="itinerary.durationInDays" :min="1" :disabled="!itinerary.unknownDate"
              v-if="itinerary.unknownDate" style="width: 100%;">
              <template #suffix>
                <span>{{ "day(s)" }}</span>
              </template>
            </el-input-number>
          </span>
          <span>
            <el-checkbox v-model="itinerary.unknownDate" @change="handleUnknownDateToggle">
              {{ "No exact dates yet" }}
            </el-checkbox>
          </span>
        </div>
        <div class="itinerary-config-field">
          <el-input-number v-model="itinerary.numberOfPax" :min="1" style="width: 100%;">
            <template #suffix>
              <span>{{ "travellers(s)" }}</span>
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
          <div v-for="agendaItem in itinerary.agendaItems.filter(i => i.day === day)"
            :key="(agendaItem.title + agendaItem._localIndex)" class="agenda-item-wrapper">
            <AgendaCard :agendaItem="agendaItem" :onClick="() => handleOnTagSelection(agendaItem)"
              :onDelete="handleTagClose" :closeable="true" />
          </div>
          <el-tag type="primary" class="clickable" @click="handleAddAnActivity(day)">
            <div class="tag-wrapper">
              <el-icon>
                <Plus />
              </el-icon>
              <span style="margin-left: 0.5rem">Add Activity</span>
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
/* Base Container */
.page-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  padding: 1.5rem;
  background: #f8fafc;
}

/* Header Section */
.session-header {
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.itinerary-details-header-container {
  display: flex;
  flex-direction: row;
  gap: 1.25rem;
  align-items: center;
}

.title-container {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.session-title-container {
  font-size: 1.75rem;
  font-weight: 600;
  color: #1a1a1a;
}

/* Itinerary Content */
.itinerary-wrapper {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

/* Timeline Structure */
.day-container {
  position: relative;
  padding-left: 2rem;
  margin-bottom: 2rem;
  border-left: 2px solid #e4e7ed;
}

.day-container:last-child {
  margin-bottom: 0;
}

.day-container::before {
  content: '';
  position: absolute;
  left: -7px;
  top: 0;
  width: 12px;
  height: 12px;
  background: #4f46e5;
  border-radius: 50%;
  border: 2px solid white;
  box-shadow: 0 2px 4px rgba(79, 70, 229, 0.2);
}

.day-wrapper {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 1.5rem;
  padding-left: 0.5rem;
}

.agenda-items-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.agenda-item-wrapper {
  transition: transform 0.2s ease;
}

.agenda-item-wrapper:hover {
  transform: translateY(-2px);
}

/* Custom Tag Styles */
.el-tag.purple {
  background: #f3f4ff;
  color: #4f46e5;
  border-color: #e0e7ff;
  padding: 12px 20px;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.el-tag.purple.clickable:hover {
  background: #4f46e5;
  color: white;
  cursor: pointer;
}

/* Form Fields */
.itinerary-overview-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-top: 0.25rem;
}

.date-config-container {
  display: flex;
  flex-direction: column;
}

/* Responsive Design */
@media (max-width: 768px) {
  .page-container {
    padding: 1rem;
  }

  .session-header {
    padding: 1.5rem;
  }

  .itinerary-wrapper {
    padding: 1rem;
  }

  .day-container {
    padding-left: 1rem;
  }

  .itinerary-overview-container {
    grid-template-columns: 1fr;
  }
}
</style>
