<script lang="ts" setup>
import { useDashboardManager } from '@/composables/useDashboardManager'
import { onMounted, ref } from 'vue'
import { User, Upload } from '@element-plus/icons-vue'
import { FileWithPreview } from '@/interfaces/FileWithPreview';
import { usePfpManager, type ReplacePfpRes } from '@/composables/usePfpManager';
import type { PfpRequest } from '@/interfaces/PfpRequest';
import { FileUtils } from '@/utilities/FileUtils';
import { ElMessage } from 'element-plus';

const { getSelfProfile } = useDashboardManager();
const { retrievePfp, replacePfp, removePfp } = usePfpManager();
const editMode = ref(false)

const handleEditProfile = () => {
  editMode.value = true
}

const retrievedUser = ref({
  username: '',
  email: '',
  dob: 0,
  bio: '',
  joinedDate: 0,
  pfp: '',
})

const tempUser = ref({ ...retrievedUser.value })
const passwordForm = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const saveProfile = () => {
  Object.assign(retrievedUser.value, tempUser.value)
  editMode.value = false
  // Here you would typically make an API call to save changes
}

const cancelEdit = () => {
  tempUser.value = { ...retrievedUser.value }
  editMode.value = false
}

const changePassword = () => {
  if (passwordForm.value.newPassword !== passwordForm.value.confirmPassword) {
    alert('New passwords do not match!')
    return
  }
  // Password change logic would go here
  console.log('Password change requested')
  passwordForm.value = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  }
}

const handleAvatarUpload = async (event: Event) => {
  const input = event.target as HTMLInputElement
  if (!input.files || input.files.length === 0) return
  const file = input.files[0] as File

  // Create preview immediately
  const pfpToUpload = new FileWithPreview(file)
  retrievedUser.value.pfp = pfpToUpload.previewUrl // Show preview immediately

  try {
    const blobString = await FileUtils.convertFileToBase64(file)
    const pfpPayload: PfpRequest = {
      previewUrl: pfpToUpload.previewUrl,
      blob: blobString,
      mimeType: pfpToUpload.mimeType,
      sizeInBytes: pfpToUpload.sizeInBytes!,
      name: pfpToUpload.uuid,
    }

    const uploadedPfpResponse = await replacePfp(pfpPayload) as ReplacePfpRes

    if (uploadedPfpResponse.res === 'ok') {
      ElMessage.success("Photo changed successfully.")
      retrievedUser.value.pfp = uploadedPfpResponse.blob || pfpToUpload.previewUrl
      return
    }
    ElMessage.error("Something went wrong changing your photo.")
    // Update with server response (in case it processed the image differently)
  } catch (err) {
    console.error("Upload failed:", err)
    // Optional: revert the preview if upload fails
    // retrievedUser.value.pfp = ''
  } finally {
    // Reset the input to allow selecting the same file again
    input.value = ''
  }
}

const handleRemovePfp = async () => {
  try {
    const removePfpResponse = await removePfp();
    if (removePfpResponse !== 'ok') {
      ElMessage.error("Something went wrong removing your photo.")
      return
    }
    ElMessage.success("Photo removed successfully.")
    retrievedUser.value.pfp = ''; // Clear on successful removal
  } catch (err) {
    console.error("Failed to remove profile picture:", err);
  }
}
onMounted(async () => {
  try {
    const userPfp = await retrievePfp()
    const profileResponse = await getSelfProfile()
    retrievedUser.value.username = profileResponse.username
    retrievedUser.value.email = profileResponse.email
    retrievedUser.value.dob = profileResponse.dob
    retrievedUser.value.bio = profileResponse.bio
    retrievedUser.value.joinedDate = profileResponse.createdDt
    retrievedUser.value.pfp = userPfp

  } catch (error) {
    console.error("Failed to fetch profile: ", error)
  }
})
</script>

<template>
  <div class="profile-container">
    <div class="profile-header">
      <h1>Profile Settings</h1>
      <p class="last-updated">
        <el-tag type="primary">
          Member since {{ new Date(retrievedUser.joinedDate).toLocaleDateString() }}
        </el-tag>
      </p>
    </div>

    <div class="profile-content">
      <div class="profile-section">
        <div class="section-header">
          <h2>Basic Information</h2>
          <button v-if="!editMode" @click="handleEditProfile" class="edit-button">Edit Profile</button>
          <div v-else class="edit-actions">
            <button @click="saveProfile" class="save-button">Save Changes</button>
            <button @click="cancelEdit" class="cancel-button">Cancel</button>
          </div>
        </div>

        <div class="profile-details">
          <div class="avatar-container">
            <div class="avatar-upload" :class="{ 'has-avatar': retrievedUser.pfp }">
              <label for="avatar-upload">
                <el-avatar :size="120" :src="retrievedUser.pfp || ''" class="avatar">
                  <el-icon :size="60">
                    <User />
                  </el-icon>
                </el-avatar>
                <div class="upload-overlay">
                  <el-icon :size="24">
                    <Upload />
                  </el-icon>
                  <span>Change Photo</span>
                </div>
              </label>
              <input id="avatar-upload" type="file" accept="image/*" @change="handleAvatarUpload"
                style="display: none;">

            </div>
            <div><el-button type="danger" v-if="retrievedUser.pfp" @click="handleRemovePfp">{{ "Remove" }}</el-button>
            </div>
          </div>

          <div class="info-fields">
            <div class="field">
              <label>Username</label>
              <input v-if="editMode" v-model="tempUser.username" type="text">
              <span class="detail" v-else>{{ retrievedUser.username }}</span>
            </div>

            <div class="field">
              <label>Email</label>
              <input v-if="editMode" v-model="tempUser.email" type="email">
              <span class="detail" v-else>{{ retrievedUser.email }}</span>
            </div>

            <div class="field">
              <label>Birthday</label>
              <input v-if="editMode" v-model="tempUser.dob" type="date">
              <span class="detail" v-else>{{ new Date(retrievedUser.dob).toLocaleDateString() }}</span>
            </div>

            <div class="field">
              <label>Bio</label>
              <textarea v-if="editMode" v-model="tempUser.bio"></textarea>
              <p v-else class="detail bio">{{ retrievedUser.bio ?? "- " }}</p>
            </div>
          </div>
        </div>
      </div>

      <div class="profile-section">
        <h2>Change Password</h2>
        <div class="password-form">
          <div class="field">
            <label>Current Password</label>
            <input v-model="passwordForm.currentPassword" type="password">
          </div>
          <div class="field">
            <label>New Password</label>
            <input v-model="passwordForm.newPassword" type="password">
          </div>
          <div class="field">
            <label>Confirm New Password</label>
            <input v-model="passwordForm.confirmPassword" type="password">
          </div>
          <button @click="changePassword" class="save-button">Update Password</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.profile-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.profile-header {
  margin-bottom: 2rem;
}

.profile-header h1 {
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

.last-updated {
  color: #666;
  font-size: 0.9rem;
}

.profile-section {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  margin-bottom: 1.5rem;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.profile-details {
  display: flex;
  gap: 2rem;
}

.avatar-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.avatar-upload {
  position: relative;
  cursor: pointer;
  border-radius: 50%;
}

.avatar-upload .avatar {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #f0f0f0;
  transition: opacity 0.3s ease;
}

.avatar-upload .upload-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  color: white;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 8px;
  border-radius: 50%;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.avatar-upload:hover .upload-overlay {
  opacity: 1;
}

.avatar-upload:hover .avatar {
  opacity: 0.8;
}

.info-fields {
  flex: 1;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.field {
  margin-bottom: 1rem;
}

.field label {
  display: block;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #333;
}

.field input,
.field select,
.field textarea {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

.field textarea {
  min-height: 100px;
  resize: vertical;
}

.bio {
  white-space: pre-line;
  line-height: 1.5;
}

.password-form {
  display: grid;
  gap: 1rem;
}

button {
  padding: 0.5rem 1rem;
  border-radius: 4px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.edit-button {
  background: #3498db;
  color: white;
  border: none;
}

.edit-button:hover {
  background: #2980b9;
}

.save-button {
  background: #2ecc71;
  color: white;
  border: none;
  margin-right: 0.5rem;
}

.save-button:hover {
  background: #27ae60;
}

.cancel-button {
  background: #e74c3c;
  color: white;
  border: none;
}

.cancel-button:hover {
  background: #c0392b;
}

.edit-actions {
  display: flex;
}

.detail {
  color: var(--text-color);
  display: block;
  padding: 0.5rem 0;
}

@media (max-width: 768px) {
  .profile-details {
    flex-direction: column;
  }

  .info-fields {
    grid-template-columns: 1fr;
  }
}
</style>
