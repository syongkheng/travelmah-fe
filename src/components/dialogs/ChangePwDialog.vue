<script lang="ts" setup>
import { ref, computed, watch } from 'vue'
import { View, Hide } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { useUserSecurityManager } from '@/composables/useUserSecurityManager'

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true,
    default: true,
  },
  onClose: {
    type: Function,
    required: true,
  }
})

// Group related state together
const passwordState = ref({
  current: '',
  new: '',
  confirm: '',
  showCurrent: false,
  showNew: false,
  showConfirm: false
})

const { validPw, changePw } = useUserSecurityManager()
const isChallengePwSuccess = ref(false)

// Computed properties for derived state
const passwordsMatch = computed(() =>
  passwordState.value.new === passwordState.value.confirm &&
  passwordState.value.new.length > 0
)

const isNewPasswordValid = computed(() =>
  passwordState.value.new.length >= 8
)

const validateCurrentPassword = async () => {
  const isValid = await validPw(passwordState.value.current)

  if (!isValid) {
    ElMessage.error("Current password is incorrect")
    return
  }

  passwordState.value.showCurrent = false
  isChallengePwSuccess.value = true
}

const handleSubmit = async () => {
  if (!isChallengePwSuccess.value) {
    ElMessage.error('Please validate your current password first')
    return
  }

  if (!passwordsMatch.value) {
    ElMessage.error('New passwords do not match')
    return
  }

  if (!isNewPasswordValid.value) {
    ElMessage.error('Password must be at least 8 characters')
    return
  }

  const success = await changePw(
    passwordState.value.current,
    passwordState.value.new,
    passwordState.value.confirm
  )

  if (!success) {
    ElMessage.error('Something went wrong, your password was not changed.')
    return
  }

  ElMessage.success('Password changed successfully!')
  closeDialog()
}

const closeDialog = () => {
  // Reset all state
  passwordState.value = {
    current: '',
    new: '',
    confirm: '',
    showCurrent: false,
    showNew: false,
    showConfirm: false
  }
  isChallengePwSuccess.value = false
  props.onClose()
}

// Reset form when dialog closes
watch(() => props.isOpen, (newVal) => {
  if (!newVal) closeDialog()
})
</script>

<template>
  <el-dialog :model-value="isOpen" title="Change Password" width="400px" align-center @close="closeDialog">
    <div class="form-wrapper">
      <el-form label-position="top">
        <!-- Current Password -->
        <el-form-item label="Current Password" required>
          <el-input v-model="passwordState.current" :type="passwordState.showCurrent ? 'text' : 'password'"
            placeholder="Enter current password" :disabled="isChallengePwSuccess">
            <template #append>
              <el-button :icon="passwordState.showCurrent ? Hide : View"
                @click="passwordState.showCurrent = !passwordState.showCurrent" :disabled="isChallengePwSuccess" />
            </template>
          </el-input>
          <el-button v-if="!isChallengePwSuccess" type="primary" class="validate-btn" @click="validateCurrentPassword">
            Validate
          </el-button>
          <el-tag v-else type="success" class="valid-tag">
            Validated
          </el-tag>
        </el-form-item>

        <!-- New Password -->
        <el-form-item label="New Password" required>
          <el-input v-model="passwordState.new" :type="passwordState.showNew ? 'text' : 'password'"
            placeholder="Enter new password" :disabled="!isChallengePwSuccess">
            <template #append>
              <el-button :icon="passwordState.showNew ? Hide : View"
                @click="passwordState.showNew = !passwordState.showNew" />
            </template>
          </el-input>
        </el-form-item>

        <!-- Confirm Password -->
        <el-form-item label="Confirm New Password" required>
          <el-input v-model="passwordState.confirm" :type="passwordState.showConfirm ? 'text' : 'password'"
            placeholder="Confirm new password" :disabled="!isChallengePwSuccess">
            <template #append>
              <el-button :icon="passwordState.showConfirm ? Hide : View"
                @click="passwordState.showConfirm = !passwordState.showConfirm" />
            </template>
          </el-input>
          <div v-if="passwordState.new && passwordState.confirm" class="match-indicator">
            <el-tag :type="passwordsMatch ? 'success' : 'danger'">
              {{ passwordsMatch ? 'Passwords match' : 'Passwords do not match' }}
            </el-tag>
          </div>
        </el-form-item>
      </el-form>
    </div>

    <template #footer>
      <el-button @click="closeDialog">Cancel</el-button>
      <el-button type="primary" :disabled="!isChallengePwSuccess || !passwordsMatch || !isNewPasswordValid"
        @click="handleSubmit">
        Change Password
      </el-button>
    </template>
  </el-dialog>
</template>

<style scoped>
.form-wrapper {
  padding: 10px;
}

.validate-btn {
  margin-top: 8px;
  width: 100%;
}

.valid-tag {
  margin-top: 8px;
  width: 100%;
  justify-content: center;
}

.match-indicator {
  margin-top: 8px;
  text-align: center;
}

.el-input {
  margin-bottom: 5px;
}

.el-form-item {
  margin-bottom: 20px;
}
</style>
