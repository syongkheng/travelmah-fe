<script lang="ts" setup>
import { ref, computed } from 'vue'
import { User, Plus, Close } from '@element-plus/icons-vue'
import { useLayoutStateStore } from '@/stores/layoutState'
import HttpClient from '@/interceptors/HttpClient'
import { ApiRoute } from '@/constants/route'
import { useItineraryStore } from '@/stores/itinerary'
import { ElMessage, ElButton } from 'element-plus'

const layoutStore = useLayoutStateStore()
const localCollabList = ref<string[]>([])
const newCollabInput = ref('')
const isLoading = ref(false)
const itineraryStore = useItineraryStore()


const isItinerarySaved = computed(() => {
  return !!itineraryStore.itinerary?.shortCode
})

const validateEmail = (email: string) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(email)
}

const isEmailValid = computed(() => {
  return newCollabInput.value.trim() === '' || validateEmail(newCollabInput.value.trim())
})

const addCollaborator = () => {
  if (!isItinerarySaved.value) return

  const input = newCollabInput.value.trim()
  if (!input) return

  if (!validateEmail(input)) {
    ElMessage.warning('Please enter a valid email address')
    return
  }

  if (!localCollabList.value.includes(input)) {
    localCollabList.value.push(input)
    newCollabInput.value = ''
  }
}

const removeCollaborator = (index: number) => {
  if (!isItinerarySaved.value) return
  localCollabList.value.splice(index, 1)
}

const submitCollaborationList = async () => {
  if (!isItinerarySaved.value) {
    ElMessage.error("Please save the itinerary first!")
    return
  }

  isLoading.value = true
  try {
    await HttpClient.post(ApiRoute.ITINERARY.ADD_COLLABORATOR, {
      username: localCollabList.value,
      itineraryId: itineraryStore.itinerary.id
    })
    layoutStore.collabDialog.toggle()
    localCollabList.value = []
    ElMessage.success('Collaborators added successfully!')
  } catch (err) {
    console.error("Error adding collaborators:", err)
    ElMessage.error('Failed to add collaborators')
  } finally {
    isLoading.value = false
  }
}

const handleOnClose = () => {
  layoutStore.collabDialog.toggle()
  localCollabList.value = []
  newCollabInput.value = ''
}
</script>

<template>
  <el-dialog v-model="layoutStore.collabDialog.isVisible" class="collab-dialog" :show-close="false"
    style="width: fit-content; border-radius: 0.75rem;" :before-close="handleOnClose">
    <div class="collab-dialog-content-container">
      <!-- Header -->
      <div class="collab-title-container">
        <h3>Add Collaborators</h3>
      </div>

      <!-- Warning message if itinerary isn't saved -->
      <el-alert v-if="!isItinerarySaved" type="error" show-icon :closable="false" class="save-itinerary-first-warning">
        Please save the itinerary before adding collaborators.
      </el-alert>

      <!-- Main Content -->
      <div class="collab-form">
        <!-- Input for new collaborator -->
        <div class="collab-input-container">
          <el-input v-model="newCollabInput" placeholder="Enter username or email" :prefix-icon="User" clearable
            @keyup.enter="addCollaborator" :disabled="!isItinerarySaved"
            :class="{ 'is-error': newCollabInput.trim() && !isEmailValid }" />
          <el-tooltip content="Enter at least 1 collaborator to save" placement="top">
            <el-button type="primary" :icon="Plus" @click="addCollaborator"
              :disabled="!newCollabInput.trim() || !isItinerarySaved || !isEmailValid" />
          </el-tooltip>
        </div>
        <div v-if="newCollabInput.trim() && !isEmailValid" class="error-message">
          Please enter a valid email address
        </div>

        <!-- Collaborator list -->
        <div class="collab-list" v-if="localCollabList.length > 0">
          <div v-for="(collab, index) in localCollabList" :key="index" class="collab-item">
            <span class="avatar-username-wrapper">
              <el-icon>
                <User />
              </el-icon>
              <span>{{ collab }}</span>
            </span>
            <el-button type="danger" :icon="Close" circle size="small" @click="removeCollaborator(index)"
              :disabled="!isItinerarySaved" />
          </div>
        </div>
        <div v-else class="empty-state">
          No collaborators added yet
        </div>

        <!-- Submit Button -->
        <el-button type="primary" class="submit-button" :loading="isLoading" size="default"
          @click="submitCollaborationList" :disabled="localCollabList.length === 0 || !isItinerarySaved">
          {{ isLoading ? 'Saving...' : 'Save Collaborators' }}
        </el-button>

        <el-divider />
        <div class="disclaimer">
          Add people by their email address. They'll be able to collaborate if they are logged in.
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<style lang="css" scoped>
.save-itinerary-first-warning {
  margin-top: 1rem;
  margin-bottom: 1rem;
}

.save-itinerary-button {
  width: 100%;
  margin-bottom: 1rem;
}

.collab-dialog :deep(.el-dialog__body) {
  display: flex;
  justify-content: center;
  align-items: center;
}

.collab-dialog-content-container {
  width: 100%;
  max-width: 400px;
  margin: 0rem 1rem 1rem 1rem;
}

.collab-title-container {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.collab-title-container h3 {
  text-align: center;
  color: #2c3e50;
}

.collab-input-container {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.collab-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  max-height: 200px;
  overflow-y: auto;
}

.collab-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem;
  background-color: #f5f7fa;
  border-radius: 4px;
}

.empty-state {
  text-align: center;
  color: #999;
  margin: 1rem 0;
  font-style: italic;
}

.disclaimer {
  text-align: center;
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 1rem;
  line-height: 1.4;
}

.submit-button {
  margin-top: 1rem;
  width: 100%;
}

.avatar-username-wrapper {
  display: flex;
  flex-direction: row;
  align-items: center;
  font-size: 1.05em;
  gap: 1rem;
}

:deep(.el-input.is-error .el-input__wrapper) {
  box-shadow: 0 0 0 1px var(--el-color-danger) inset;
}

.error-message {
  color: var(--el-color-danger);
  font-size: 12px;
  margin-top: 4px;
}
</style>
