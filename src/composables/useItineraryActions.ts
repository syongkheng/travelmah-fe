// src/composables/useItineraryActions.ts
import { useItineraryStore } from '@/stores/itinerary'
import { useAuthenticationStore } from '@/stores/authentication'
import { useLayoutStateStore } from '@/stores/layoutState'
import { ElButton, ElMessage, ElNotification } from 'element-plus'
import { h } from 'vue'
import { useNav } from '@/hooks/useNav'
import { Refresh, Share, View } from '@element-plus/icons-vue'

export const useItineraryActions = () => {
  const itineraryStore = useItineraryStore()
  const authStore = useAuthenticationStore()
  const layoutStore = useLayoutStateStore()
  const navigate = useNav()

  const saveItinerary = async () => {
    const { isSuccess, error, shortCode } = await itineraryStore.createItinerary()

    if (!isSuccess && error === 'auth') {
      ElNotification({
        title: 'Session Expired',
        type: 'error',
        duration: 3000,
        message: 'Please login again.',
      })
      authStore.setRedirectAfterLogin(false)
      layoutStore.loginDialog.setTrue()
      return { success: false }
    }

    if ((!isSuccess && error !== undefined) || shortCode === undefined) {
      return { success: false, error }
    }

    return { success: true, shortCode }
  }

  const showSuccessNotification = (shortCode: string) => {
    ElNotification({
      title: 'Submitted Successfully',
      type: 'success',
      duration: 0,
      message: () =>
        h(
          'div',
          {
            style: 'display: flex; flex-direction: column; gap: 12px; padding: 5px 0;',
          },
          [
            h(
              'p',
              {
                style: 'margin: 0; color: #606266; font-size: 14px; line-height: 1.5;',
              },
              'Your itinerary has been created, view it, share it, or edit it!',
            ),
            h(
              ElButton,
              {
                type: 'primary',
                icon: View,
                style: 'width: 100%; background-color: #409eff;',
                onClick: () => {
                  handleViewItinerary(shortCode)
                },
              },
              ' View Itinerary',
            ),
            h(
              'div',
              {
                style: 'display: flex; gap: 10px; width: 100%;',
              },
              [
                h(
                  ElButton,
                  {
                    type: 'success',
                    icon: Share,
                    style: 'flex: 1; background-color: #67c23a; min-width: 0;',
                    onClick: () => {
                      handleShareItinerary(shortCode)
                    },
                  },
                  ' Share',
                ),
                h(
                  ElButton,
                  {
                    type: 'info',
                    icon: Refresh,
                    style: 'flex: 1; background-color: #909399; min-width: 0;',
                    onClick: () => {
                      handleEditItinerary(shortCode)
                    },
                  },
                  ' Edit',
                ),
              ],
            ),
          ],
        ),
    })
  }

  const handleViewItinerary = (shortCode: string) => {
    navigate.redirectToViewSessionId(shortCode)
  }

  const handleEditItinerary = (shortCode: string) => {
    navigate.redirectToEditSessionId(shortCode)
  }

  const handleShareItinerary = async (shortCode: string) => {
    try {
      const shareUrl = `${import.meta.env.VITE_WEB_BASE_URL}/itinerary/${shortCode}`
      await navigator.clipboard.writeText(shareUrl)
      ElMessage.success('Link copied to clipboard!')
    } catch (error) {
      ElMessage.error('Failed to copy link')
      console.error('Copy failed:', error)
    }
  }

  return {
    saveItinerary,
    showSuccessNotification,
    handleViewItinerary,
    handleEditItinerary,
    handleShareItinerary,
  }
}
