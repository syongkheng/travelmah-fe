<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import type { AgendaItem } from '@/interfaces/AgendaItem'
import { useRoute, useRouter } from 'vue-router'
import { useNav } from '@/hooks/useNav'
import { Edit, Refresh } from '@element-plus/icons-vue'
import AgendaDialog from '@/components/AgendaDialog.vue'
import { DateUtils } from '@/utilities/DateUtils'
import AgendaCard from '@/components/AgendaCard.vue'
import AgendaPanel from '@/components/AgendaPanel.vue'
import { useItineraryStore } from '@/stores/itinerary'
import { ifHaveEditItineraryPermission } from '@/composables/ifHaveEditItineraryPermission'
import { ElMessage } from 'element-plus'

const route = useRoute()
const router = useRouter()
const sessionId = route.params.id.toString()
const itineraryStore = useItineraryStore()

const { refreshPage, redirectToEditSessionId } = useNav()

const itineraryData = ref<{
  id: string,
  collaborationKey?: string,
  unknownDate: boolean,
  durationInDays?: number | undefined,
  itineraryDateRaw?: string,
  startDate?: string,
  endDate?: string,
  destinationRaw?: string,
  destination?: string,
  numberOfPax: string,
  sessionTitle?: string
  sessionId?: string
  shortCode?: string
  agendaItems?: AgendaItem[]

}>()
const loading = ref(false)
const error = ref<string | null>(null)
const agendaItemToShow = ref<AgendaItem>({
  title: "",
  unknownTime: false,
  files: [],
  _fileIdsToDelete: [],
  _fileIdsToInsert: [],
  _agendaToFileMapping: [],
})
const isAgendaItemToShowDialogOpen = ref(false)
const retrySessionIdToSearch = ref("")
const selectedAgenda = ref<AgendaItem | null>(null)

onMounted(async () => {
  try {
    loading.value = true
    const response = await itineraryStore.retrieveItinerary(sessionId)
    if (response === null) {
      error.value = 'Failed to load itinerary'
      return
    }
    itineraryData.value = {
      ...response,
    }
  } catch (err) {
    error.value = 'Failed to load itinerary'
    console.error(err)
  } finally {
    loading.value = false
  }
})

const getItineraryDurationDateLabels = () => {
  if (itineraryData.value?.unknownDate) {
    return `${itineraryData.value.durationInDays} day(s)`
  }
  if (itineraryData.value?.startDate && itineraryData.value?.endDate) {
    const start = DateUtils.extractReadableDateFromTimestamp(itineraryData.value.startDate)
    const end = DateUtils.extractReadableDateFromTimestamp(itineraryData.value.endDate)
    return `${start} - ${end} (${itineraryData.value.durationInDays} day(s))`;
  }
  return 'Unknown Duration';
}

const handleOnDialogClose = () => {
  isAgendaItemToShowDialogOpen.value = false
}

const retryItinerarySearch = async (id: string) => {
  const pathSegments = route.path.split('/').filter(Boolean)
  if (pathSegments.length > 0) {
    pathSegments[pathSegments.length - 1] = id
  } else {
    pathSegments.push(id)
  }
  const newPath = '/' + pathSegments.join('/')
  await router.push(newPath)
  window.location.reload()
}

const handleOnAgendaCardClick = (agendaItem: AgendaItem) => {
  selectedAgenda.value = agendaItem
}

const handleOnEditItineraryClick = async () => {
  const ifHavePermission = await ifHaveEditItineraryPermission(sessionId)
  if (!ifHavePermission) {
    ElMessage.error("You do not have permission to edit this itinerary!")
    return
  }
  redirectToEditSessionId(sessionId)
  return
}

</script>

<template>
  <div class="page-container">
    <div v-if="error" class="error-container">
      <el-empty :description="(error)">
        <div class="retry-container">
          <span>{{ "Search for another session:" }}</span>
          <el-input v-model="retrySessionIdToSearch" placeholder="At least 6 characters" />
        </div>
      </el-empty>
      <el-button class="retry-button" :disabled="retrySessionIdToSearch.length < 6" type="primary"
        @click="retryItinerarySearch(retrySessionIdToSearch)" :icon="Refresh"> Try Again</el-button>
    </div>
    <!-- Content -->
    <div v-else-if="itineraryData" class="itinerary-content">
      <!-- Header Section -->
      <header class="session-header">
        <div class="session-header-nav">
          <div class="session-infographic-wrapper">
            <span class="session-title-container">
              {{ itineraryData.sessionTitle || 'Untitled Itinerary' }}
            </span>
            <el-tag>
              {{ (itineraryData.numberOfPax ?? "Unknown") + " traveller(s)" }}
            </el-tag>
            <el-tag>
              {{ getItineraryDurationDateLabels() }}
            </el-tag>
          </div>
          <div>
            <el-button type="primary" :icon="Edit" @click="handleOnEditItineraryClick">
              {{ 'Edit' }}
            </el-button>
          </div>
        </div>
        <div>
          <el-tag>{{ itineraryData.destination ?? "Unknown destination" }}</el-tag>
        </div>
      </header>
      <el-divider />
      <div class="itinerary-wrapper">
        <div v-for="days in itineraryData.durationInDays" :key="days" class="day-container">
          <div class="day-wrapper">
            {{ "Day #" + days }}
          </div>
          <!-- Check if day has items first -->
          <template v-if="itineraryData.agendaItems?.filter(item => item.day === days).length">
            <div v-for="agendaItem in itineraryData.agendaItems.filter(item => item.day === days)" :key="agendaItem.id"
              class="agenda-item-wrapper">
              <AgendaCard :agendaItem="agendaItem"
                @click="(agendaItem: AgendaItem) => handleOnAgendaCardClick(agendaItem)" />
            </div>
          </template>
          <!-- Show empty state outside the items loop -->
          <div v-else class="empty-day">
            <el-tag class="purple">
              {{ "Empty day" }}
            </el-tag>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="empty-state">
      <el-empty description="No itinerary found">
        <el-button type="primary" @click="refreshPage"> Try Again </el-button>
      </el-empty>
    </div>
    <AgendaPanel :agendaItem="selectedAgenda" :onClose="() => selectedAgenda = null" />
  </div>
  <AgendaDialog :isOpen="isAgendaItemToShowDialogOpen" :handleOnDialogClose="handleOnDialogClose"
    :agendaItem="(agendaItemToShow as AgendaItem)" />
  <el-tooltip content="Back to top" placement="top">
    <el-backtop :right="100" :bottom="100" />
  </el-tooltip>
</template>

<style scoped>
/* Add this to existing styles */
.itinerary-wrapper {
  width: calc(100% - 50% - 2rem);
  /* Adjust for panel width */
  transition: margin-right 0.3s ease;
}

.details-panel-visible .itinerary-wrapper {
  margin-right: 50%;
}

/* Base Container */
.page-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  padding: 1.5rem;
  background: #f8fafc;
}


/* Error States */
.error-container,
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: 2rem;
  text-align: center;
}

.retry-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-width: 400px;
  margin: 1rem 0;
}

.retry-button {
  width: 200px;
  margin-top: 1rem;
}

/* Header Section */
.session-header {
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.session-header-nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.session-title-container {
  font-size: 1.75rem;
  font-weight: 600;
  color: #1a1a1a;
  margin-right: 2rem;
}

.session-infographic-wrapper {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.el-tag.purple {
  background: #f3f4ff;
  color: #4f46e5;
  border-color: #e0e7ff;
  font-weight: 500;
}

/* Itinerary Content */
.itinerary-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.itinerary-wrapper {
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

/* Timeline Structure */
.day-container {
  position: relative;
  padding-left: 1.5rem;
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
  position: relative;
}

/* Agenda Items */
.agenda-item-wrapper {
  margin-bottom: 1.5rem;
  transition: transform 0.2s ease;
}

.agenda-item-wrapper:hover {
  transform: translateX(5px);
}

/* Empty States */
.empty-day {
  padding: 0.75rem 1.25rem;
  background: #f8fafc;
  border-radius: 8px;
  text-align: center;
  width: fit-content;
}

/* Scrollbar Styling */
.itinerary-wrapper::-webkit-scrollbar {
  width: 8px;
}

.itinerary-wrapper::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.itinerary-wrapper::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 4px;
}

.itinerary-wrapper::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/* Responsive Design */
@media (max-width: 768px) {
  .page-container {
    padding: 1rem;
  }

  .session-header-nav {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .session-title-container {
    font-size: 1.5rem;
    margin-right: 0;
  }

  .day-container {
    padding-left: 1rem;
  }

  .itinerary-wrapper {
    display: flex;
    flex-direction: column;
    width: 100%;
    padding: 1rem;
    background: white;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  }
}
</style>
