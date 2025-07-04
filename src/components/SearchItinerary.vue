<script lang="ts" setup>
import { ref } from 'vue'
import { Search } from '@element-plus/icons-vue'
import { useNav } from '@/hooks/useNav'

const itineraryId = ref<string>('')

const { redirectToViewSessionId } = useNav()

const handleSearch = () => {
  redirectToViewSessionId(itineraryId.value, false)
}
</script>

<template>
  <div class="search-container">
    <div class="header">
      <h1>Find Your Itinerary</h1>
      <p class="subtitle">Enter your unique itinerary code below</p>
    </div>

    <form @submit.prevent class="search-form">
      <div class="input-container">
        <el-input v-model="itineraryId" placeholder="Unique 6 character code" size="large" :prefix-icon="Search"
          class="modern-input" />
      </div>
      <el-button type="primary" size="large" class="action-button" @click="handleSearch">
        Search
        <span class="button-arrow">→</span>
      </el-button>
    </form>
  </div>
</template>

<style scoped>
.search-container {
  max-width: 800px;
  margin: 4rem auto;
  padding: 3rem 2rem;
  background: linear-gradient(145deg, #ffffff 0%, #f8f9ff 100%);
  border-radius: 24px;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.08);
  transform: translateY(0);
  animation: slideUp 0.6s cubic-bezier(0.23, 1, 0.32, 1);
}

.header {
  text-align: center;
  margin-bottom: 2.5rem;
}

h1 {
  font-size: 2.5rem;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 0.5rem;
  letter-spacing: -0.5px;
}

.subtitle {
  color: #6b7280;
  font-size: 1.1rem;
  font-weight: 400;
}

.search-form {
  max-width: 600px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
}

.input-container {
  width: 100%;
  display: flex;
  gap: 1rem;
  align-items: center;
}

.modern-input {
  flex: 1;

  :deep(.el-input__wrapper) {
    padding: 0 1.5rem;
    height: 56px;
    border-radius: 12px;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
    transition: all 0.3s ease;

    &:hover {
      box-shadow: 0 4px 12px -1px rgba(99, 102, 241, 0.15);
    }

    &.is-focus {
      box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.2);
    }
  }
}

.action-button {
  width: 150px;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 6px 12px -1px rgba(99, 102, 241, 0.25);
  }
}

.button-arrow {
  margin-left: 0.75rem;
  opacity: 0.8;
  transition: transform 0.2s ease;
}

.action-button:hover .button-arrow {
  transform: translateX(2px);
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 640px) {
  .search-container {
    margin: 2rem 1rem;
    padding: 2rem 1rem;
  }

  .input-container {
    flex-direction: column;
  }

  .action-button {
    width: 100%;
  }
}
</style>
