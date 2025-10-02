<script setup lang="ts">
import { type CalendarItem } from '@/interfaces/CalendarItem'

defineProps({
  items: {
    type: Array as () => CalendarItem[],
    required: true
  },
  dateRange: {
    type: Object as () => { start: Date; end: Date },
    required: true
  }
})

// utility: get all days between start & end
const getDaysInRange = (start: Date, end: Date): Date[] => {
  const days: Date[] = []
  const current = new Date(start)

  while (current <= end) {
    days.push(new Date(current))
    current.setDate(current.getDate() + 1)
  }

  console.log(">>> getDaysInRange", days);

  return days
}
</script>

<template>
  <div class="calendar-grid">
    <div v-for="day in getDaysInRange(dateRange.start, dateRange.end)" :key="day.toISOString()" class="calendar-cell">
      <div class="weekday-label">
        {{ day.toLocaleDateString('en-US', { weekday: 'long' }) }}
      </div>
      <div class="date">
        {{ day.getDate() }}
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.calendar-grid {
  display: flex;
  flex-direction: column;
}

.calendar-cell {
  padding: 0.5rem;
  border: 1px solid #eee;

  .weekday-label {
    font-weight: bold;
    margin-bottom: 0.25rem;
  }

  .date {
    font-size: 14px;
  }
}
</style>
