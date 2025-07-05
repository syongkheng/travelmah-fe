<!-- Stepper.vue -->
<template>
  <div class="stepper-container">
    <!-- Vertical connecting line -->
    <div class="connector-line"></div>

    <!-- Steps -->
    <div v-for="(step, index) in steps" :key="index" class="step-container">
      <!-- Icon circle -->
      <div class="step-icon">
        <slot name="icon" :step="step">
          <!-- Default icon slot -->
          <span class="default-icon">
            <el-icon :size="45">
              <component :is="step.icon" />
            </el-icon>
          </span>
        </slot>
      </div>

      <!-- Content -->
      <div class="step-content">
        <h3 class="step-heading">{{ step.heading }}</h3>
        <div class="step-infographic">
          <div class="step-description">{{ step.description }}</div>
          <el-button :key="step.cta.label" v-if="step.cta" @click="step.cta.handler" :icon="step.cta.icon ?? Pointer"
            :type="step.cta.variant">
            {{ step.cta.label }}
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { SetUp, Bowl, Camera, Star, Pointer } from '@element-plus/icons-vue'
import type { StepCTA } from '@/interfaces/CallToAction'
import { useNav } from '@/hooks/useNav'

interface Step {
  icon: object
  heading: string
  description: string
  cta?: StepCTA
}

const { redirectToPlanning } = useNav()

const steps: Step[] = [
  // {
  //   icon: User,
  //   heading: 'Create a profile (Optional)',
  //   description: 'Ensure that your preferences and plans does not go missing!',
  //   cta: {
  //     label: 'Register Now!',
  //     handler: () => redirectRegister(),
  //     icon: User,
  //     variant: 'primary',
  //   },
  // },
  {
    icon: SetUp,
    heading: 'Plan your trip!',
    description: 'Images? Documents? Bookmarks?',
    cta: {
      label: 'Plan Now!',
      handler: () => redirectToPlanning(),
      icon: Star,
      variant: 'success',
    },
  },
  {
    icon: Bowl,
    heading: 'Enjoy your plan!',
    description: "Get reminded for what you're doing next!",
  },
  {
    icon: Camera,
    heading: 'Share your moments',
    description: 'How much fun did you have?',
  },
]
</script>

<style scoped lang="css">
.stepper-container {
  position: relative;
  padding: 20px 0;
}

.connector-line {
  position: absolute;
  left: 30px;
  /* Adjust based on icon size */
  top: 40px;
  /* Start below first icon */
  bottom: 0;
  width: 2px;
  background: #e0e0e0;
  z-index: 0;
}

.step-container {
  position: relative;
  display: flex;
  margin-bottom: 32px;
  z-index: 1;
}

.step-icon {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: #fff;
  border: 1px solid #eee;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 20px;
  flex-shrink: 0;
}

.step-content {
  padding-top: 8px;
}

.step-heading {
  margin: 0 0 8px 0;
  color: #212121;
  font-weight: 800;
}

.step-description {
  color: #333333;
  font-weight: 500;
  line-height: 1.5;
}

.step-infographic {
  margin: 0;
  padding: 1em;
  border-radius: 0.75em;
  border: 1px solid #f3f4f5;
  background-color: #f8f9fa;

  button {
    margin-top: 1em;
  }
}

.default-icon {
  color: var(--homepage-svg-icon);
}

/* Optional: Last step shouldn't have bottom margin */
.step-container:last-child {
  margin-bottom: 0;
}
</style>
