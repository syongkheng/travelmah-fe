<script lang="ts" setup>
import { ref } from 'vue'
import { User, Plus, Close } from '@element-plus/icons-vue'
import { useLayoutStateStore } from '@/stores/layoutState'

const layoutStore = useLayoutStateStore()

// State for the collaboration list
const collabList = ref<string[]>([])
const newCollabInput = ref('')
const isLoading = ref(false)

// Add a new collaborator
const addCollaborator = () => {
  if (newCollabInput.value.trim() && !collabList.value.includes(newCollabInput.value.trim())) {
    collabList.value.push(newCollabInput.value.trim())
    newCollabInput.value = ''
  }
}

// Remove a collaborator
const removeCollaborator = (index: number) => {
  collabList.value.splice(index, 1)
}

// Submit the collaboration list
const submitCollaborationList = () => {
  isLoading.value = true
  // Here you would typically make an API call to save the collaboration list
  console.log('Submitting collaboration list:', collabList.value)

  // Simulate API call
  setTimeout(() => {
    isLoading.value = false
    layoutStore.collabDialog.toggle()
  }, 1000)
}

// Handle dialog close
const handleOnClose = () => {
  layoutStore.collabDialog.toggle()
  collabList.value = []
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

      <!-- Main Content -->
      <div class="collab-form">
        <!-- Input for new collaborator -->
        <div class="collab-input-container">
          <el-input v-model="newCollabInput" placeholder="Enter username or email" :prefix-icon="User" clearable
            @keyup.enter="addCollaborator" />
          <el-button type="primary" :icon="Plus" @click="addCollaborator" :disabled="!newCollabInput.trim()" />
        </div>

        <!-- Collaborator list -->
        <div class="collab-list" v-if="collabList.length > 0">
          <div v-for="(collab, index) in collabList" :key="index" class="collab-item">
            <span class="avatar-username-wrapper">
              <el-icon>
                <User />
              </el-icon>
              <span>{{ collab }}</span>
            </span>
            <el-button type="danger" :icon="Close" circle size="small" @click="removeCollaborator(index)" />
          </div>
        </div>
        <div v-else class="empty-state">
          No collaborators added yet
        </div>

        <!-- Submit Button -->
        <el-button type="primary" class="submit-button" :loading="isLoading" size="default"
          @click="submitCollaborationList" :disabled="collabList.length === 0">
          {{ isLoading ? 'Saving...' : 'Save Collaborators' }}
        </el-button>

        <el-divider />
        <div class="disclaimer">
          Add people by their username or email address. They'll receive an invitation to collaborate.
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<style lang="css" scoped>
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
</style>
