<script lang="ts" setup>
import { computed, h, onBeforeUnmount, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import AgendaCardForm from '@/components/AgendaCardForm.vue'
import { hierarchicalLocations } from '@/interfaces/HierarchicalLocation'
import { useItineraryStore } from '@/stores/itinerary'
import { storeToRefs } from 'pinia'
import type { AgendaItem } from '@/interfaces/AgendaItem'
import { DocumentAdd, Plus, Refresh, Share, View } from '@element-plus/icons-vue'
import AgendaCard from '@/components/AgendaCard.vue'
import { ElButton, ElMessage, ElNotification } from 'element-plus'
import { GeneratorUtils } from '@/utilities/GeneratorUtils'
import { useNav } from '@/hooks/useNav'
import { useLayoutStateStore } from '@/stores/layoutState'
import { useAuthenticationStore } from '@/stores/authentication'
import { useBreakpointManager } from '@/composables/useBreakpointManager';
import { Breakpoint } from '@/constants/Breakpoint';

const { isScreensizeBelow } = useBreakpointManager();
const isMobile = computed(() => isScreensizeBelow(Breakpoint.M));
const route = useRoute()
const navigate = useNav()
const sessionId = route.query.session?.toString()
const toggleEditingTitle = ref(false);
const isAddAgendaDialogVisible = ref(false);
const isCreateAgendaButtonDisabled = ref(false);

const itineraryStore = useItineraryStore();
const authStore = useAuthenticationStore();
const { itinerary } = storeToRefs(itineraryStore)
const layoutStore = useLayoutStateStore();
const dayOfTriggeredTag = ref(1)
const agendaItemToBeEdited = ref<AgendaItem>()

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

const retrySubmittingItinerary = () => {
  const newSessionId = GeneratorUtils.generateSessionID();
  itinerary.value.sessionId = newSessionId;
  const url = new URL(window.location.href);
  url.searchParams.set('session', newSessionId);
  window.history.replaceState(null, '', url.toString());
  isCreateAgendaButtonDisabled.value = false
  return;
}

const handleViewItinerary = (shortCode: string) => {
  navigate.redirectToViewSessionId(shortCode)
};

const handleEditItinerary = (shortCode: string) => {
  navigate.redirectToEditSessionId(shortCode)
}

const handleShareItinerary = async (shortCode: string) => {
  try {
    const shareUrl = `${import.meta.env.VITE_WEB_BASE_URL}/itinerary/${shortCode}`;
    await navigator.clipboard.writeText(shareUrl);

    ElMessage.success('Link copied to clipboard!');
  } catch (error) {
    // Show error feedback
    ElMessage.error('Failed to copy link');
    console.error('Copy failed:', error);
  }
};

const saveItinerary = async () => {
  isCreateAgendaButtonDisabled.value = true;
  const { isSuccess, error, shortCode } = await itineraryStore.createItinerary()
  if (!isSuccess && error === 'auth') {
    ElNotification({
      title: "Session Expired",
      type: "error",
      duration: 3000,
      message: "Please login again."
    })
    authStore.setRedirectAfterLogin(false)
    layoutStore.loginDialog.setTrue()
    return;
  }
  if ((!isSuccess && error !== undefined) || shortCode === undefined) {
    const failureNotification = ElNotification({
      title: "Submission Failed",
      type: "error",
      duration: 0,
      message: () => h('div', { class: 'notification-content' }, [
        h('p', { class: 'notification-error-description', }, 'Something went wrong, please try again.'),
        h(ElButton, {
          type: "primary",
          class: "retry-button",
          icon: Refresh,
          loading: false,
          onclick: () => {
            failureNotification.close();
            retrySubmittingItinerary();
          }
        }, ' Retry Submission')
      ])
    });
    return;
  }
  const successNotification = ElNotification({
    title: "Submitted Successfully",
    type: "success",
    duration: 0,
    message: () => h('div', {
      style: "display: flex; flex-direction: column; gap: 12px; padding: 5px 0;"
    }, [
      h('p', {
        style: "margin: 0; color: #606266; font-size: 14px; line-height: 1.5;"
      }, 'Your itinerary has been created, view it, share it, or edit it!'),

      // View Button (Top Row)
      h(ElButton, {
        type: "primary",
        icon: View,
        style: "width: 100%; background-color: #409eff;",
        onclick: () => {
          successNotification.close();
          handleViewItinerary(shortCode);
          isCreateAgendaButtonDisabled.value = false;
        }
      }, ' View Itinerary'),

      h('div', {
        style: "display: flex; gap: 10px; width: 100%;"
      }, [
        h(ElButton, {
          type: "success",
          icon: Share,
          style: "flex: 1; background-color: #67c23a; min-width: 0;",
          onclick: () => {
            successNotification.close();
            handleShareItinerary(shortCode);
            isCreateAgendaButtonDisabled.value = false;
          }
        }, ' Share'),

        h(ElButton, {
          type: "info",
          icon: Refresh,
          style: "flex: 1; background-color: #909399; min-width: 0;",
          onclick: () => {
            successNotification.close();
            handleEditItinerary(shortCode);
            isCreateAgendaButtonDisabled.value = false;
          }
        }, ' Edit')
      ])
    ])
  });

}


onMounted(() => {
  itineraryStore.setSessionId(sessionId as string)
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
        <div class="itinerary-details-header-container" :class="{ 'mobile-layout': isMobile }">
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
              <el-button :icon="DocumentAdd" circle type="primary" @click="saveItinerary"
                :disabled="isCreateAgendaButtonDisabled" />
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
          <div v-for="agendaItem in itinerary.agendaItems.filter(i => i.day === day)" :key="agendaItem._localIndex"
            class="agenda-item-wrapper">
            <AgendaCard :agendaItem="agendaItem" :onClick="() => handleOnTagSelection(agendaItem)"
              :onDelete="handleTagClose" :closeable="true" />
          </div>
          <el-tag type="primary" class="clickable" @click="handleAddAnActivity(day)">
            <div class="tag-wrapper">
              <el-icon>
                <Plus />
              </el-icon>
              <span style="margin-left: 0.5rem">{{ "Add Activity" }}</span>
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
/* ============ Base Styles ============ */
.page-container {
  --primary-color: #4f46e5;
  --text-color: #1a1a1a;
  --bg-color: #f8fafc;
  --card-bg: white;
  --border-color: #e4e7ed;
  --shadow-sm: 0 2px 8px rgba(0, 0, 0, 0.05);
  --radius-md: 12px;
  --radius-sm: 8px;
  --transition: 0.2s ease;

  display: flex;
  flex-direction: column;
  min-height: 100vh;
  padding: 1.5rem;
  background: var(--bg-color);
}

/* ============ Header Section ============ */
.session-header {
  background: var(--card-bg);
  padding: 1.5rem;
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-sm);
}

.title-container {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
}

.itinerary-details-header-container {
  display: flex;
  gap: 1.25rem;
  align-items: center;

  &.mobile-layout {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;

    >div:last-child {
      align-self: flex-end;
    }
  }
}

.session-title-container {
  font-size: 1.75rem;
  font-weight: 600;
  color: var(--text-color);
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
}

.session-title-input {
  font-size: 1.75rem !important;
  font-weight: 600;
}

.tag-wrapper {
  margin-top: 0.5rem;
}

/* ============ Itinerary Content ============ */
.itinerary-wrapper {
  background: var(--card-bg);
  padding: 2rem;
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-sm);
  margin-top: 1.5rem;
}

/* ============ Timeline Structure ============ */
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

/* ============ Custom Tag Styles ============ */
.el-tag {
  &.clickable {
    cursor: pointer;
    transition: all var(--transition);

    &:hover {
      opacity: 0.9;
    }
  }

  &.purple {
    background: #f3f4ff;
    color: var(--primary-color);
    border-color: #e0e7ff;
    padding: 12px 20px;
    border-radius: var(--radius-sm);

    &.clickable:hover {
      background: var(--primary-color);
      color: white;
    }
  }
}

/* ============ Responsive Design ============ */
@media (max-width: 800px) {
  .page-container {
    padding: 1rem;
  }

  .session-header {
    padding: 1.25rem;
  }

  .itinerary-wrapper {
    padding: 1.25rem;
  }

  .day-container {
    padding-left: 1.5rem;
  }

  .itinerary-overview-container {
    grid-template-columns: 1fr;
  }

  .session-title-container,
  .session-title-input {
    font-size: 1.5rem !important;
  }
}

@media (max-width: 480px) {
  .title-container {
    flex-direction: column;
    gap: 1rem;
  }

  .tag-wrapper {
    align-self: flex-start;
  }
}
</style>
