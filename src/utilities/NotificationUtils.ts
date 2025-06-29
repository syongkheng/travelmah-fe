import { ElMessage, ElNotification } from 'element-plus'
import { h } from 'vue'

export const Notification = {
  NewFeature: {
    editItinerary: () => {
      ElNotification({
        title: 'Upcoming feature!',
        message: h('i', 'Itineraries will be available for collab in the near future!'),
        duration: 6000,
        type: 'info',
      })
    },
    // Add more reusable notifications here as needed
  },
  Collab: {
    NoPermission: () => {
      ElMessage.error('You are not allowed to edit the itinerary. Please contact the owner.')
    },
  },
  Update: {
    Success: () => {
      ElMessage.success('Itinerary successfully updated!')
    },
    Failure: () => {
      ElMessage.error('Something went wrong updating the itinerary.')
    },
  },
  Authentication: {
    SessionExpired: () => {
      ElMessage.error('Your session has expired. Please login again.')
    },
  },
}
