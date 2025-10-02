<script lang="ts" setup>
import { useBreakpointManager } from '@/composables/useBreakpointManager';
import { Breakpoint } from '@/constants/Breakpoint';
import { computed } from 'vue';
import CollapsedCalendar from '@/components/calendar/CollapsedCalendar.vue';

const { isScreensizeBelow } = useBreakpointManager()

const collapseCalendarView = computed(() =>
  isScreensizeBelow(Breakpoint.CALENDAR)
)

const getDateRange = () => {
  const today = new Date();

  // first and last day of this month
  // const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  // const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

  // adjust start to Sunday of that week
  const startOfWeek = new Date(today);
  startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());

  // adjust end to Saturday of that week
  const endOfWeek = new Date(today);
  endOfWeek.setDate(endOfWeek.getDate() + (6 - endOfWeek.getDay()));

  return { start: startOfWeek, end: endOfWeek };
};

</script>

<template>
  <div>
    <h1>My Calendar</h1>
    <div class="calendar-wrapper">
      <div v-if="collapseCalendarView">
        <CollapsedCalendar :items="[]" :date-range="getDateRange()" />
      </div>
      <div v-else>
        <div>Expanded Calendar</div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.calendar-wrapper {
  border: 1px solid #ccc;
  border-radius: 1rem;
}
</style>
