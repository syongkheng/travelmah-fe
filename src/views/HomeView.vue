<script setup lang="ts">
import OnboardingStep from '@/components/OnboardingStep.vue'
import SearchItinerary from '@/components/SearchItinerary.vue'
</script>

<template>
  <main>
    <div class="onboarding-wrapper">
      <OnboardingStep />
    </div>
    <div class="search-itinerary-wrapper">
      <SearchItinerary />
    </div>
    <div class="showcase-wrapper"></div>
  </main>
</template>

<style>
.onboarding-wrapper {
  display: flex;
  justify-content: center;
}

.search-itinerary-wrapper {
  width: 100%;
  border-radius: 0.75em;
  padding: 1em 2em;
  background-color: #f8f9fa;
}

.showcase-wrapper {
  height: 6em;
}
</style>
