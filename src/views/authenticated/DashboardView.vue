<script lang="ts" setup>
import { useDashboardManager } from '@/composables/useDashboardManager';
import type { SearchItineraryLogJoinItinerary } from '@/interfaces/SearchItineraryLog';
import { DateUtils } from '@/utilities/DateUtils';
import { onMounted, ref } from 'vue';
import { Avatar, Right } from '@element-plus/icons-vue';
import { useNav } from '@/hooks/useNav';

const { getLastLoggedInDt, getRecentSearches } = useDashboardManager();

const lastLoggedIn = ref<string>('');
const recentSearches = ref<SearchItineraryLogJoinItinerary[]>([]);
const navigate = useNav();

const onRecentSearchClick = (itineraryId: string) => {
  navigate.redirectToViewSessionId(itineraryId)
}

onMounted(async () => {
  try {
    lastLoggedIn.value = DateUtils.extractReadableDateFromTimestamp(await getLastLoggedInDt());
    recentSearches.value = await getRecentSearches();
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
  }
});
</script>

<template>
  <div class="dashboard-main">
    <!-- Main Content Area -->
    <main class="dashboard-content">
      <!-- Welcome Banner -->
      <section class="welcome-banner">
        <div class="welcome-text">
          <h1>{{ "Welcome back," }}</h1>
          <p>{{ "Last logged in: " }}{{ lastLoggedIn }}</p>
        </div>
      </section>

      <!-- Upcoming Trips Section -->
      <section class="dashboard-section">
        <div class="section-header">
          <h2>{{ "Recent Itineraries" }}</h2>
          <a href="#" class="view-all">
            {{ "View All" }}
            <el-icon>
              <Right />
            </el-icon>
          </a>
        </div>
        <div class="trip-cards clickable">
          <div v-for="recentSearch in recentSearches" :key="recentSearch.itineraryId" class="trip-card"
            @click="() => onRecentSearchClick(recentSearch.itineraryId)">
            <div class="trip-image-placeholder">Trip Image</div>
            <div class="trip-details">
              <h3>{{ recentSearch.itineraryId }}</h3>
              <p>
                {{ DateUtils.extractReadableDateFromTimestamp(recentSearch.startDate) }}
                {{ "-" }}
                {{ DateUtils.extractReadableDateFromTimestamp(recentSearch.endDate) }}
              </p>
              <el-tag>
                {{ recentSearch.destination ?? "Unknown destination" }}
              </el-tag>
              <el-tag>
                <div class="hc">
                  {{ recentSearch.numberOfPax }}
                  <el-icon>
                    <Avatar />
                  </el-icon>
                </div>
              </el-tag>
            </div>
          </div>
        </div>
      </section>

      <!-- Recent Searches Section -->
      <!-- <section class="dashboard-section">
        <div class="section-header">
          <h2>Upcoming Itineraries</h2>
          <a href="#" class="view-all">View All →</a>
        </div>
        <div class="trip-cards">
          <div class="trip-card">
            <div class="trip-image-placeholder">Trip Image</div>
            <div class="trip-details">
              <h3>Paris Summer Getaway</h3>
              <p>June 15 - June 22, 2023</p>
              <div class="trip-status">Upcoming</div>
            </div>
          </div>
          <div class="trip-card">
            <div class="trip-image-placeholder">Trip Image</div>
            <div class="trip-details">
              <h3>Tokyo Adventure</h3>
              <p>July 5 - July 20, 2023</p>
              <div class="trip-status">Planning</div>
            </div>
          </div>
          <div class="trip-card">
            <div class="trip-image-placeholder">Trip Image</div>
            <div class="trip-details">
              <h3>Bali Relaxation Trip</h3>
              <p>August 10 - August 25, 2023</p>
              <div class="trip-status">Confirmed</div>
            </div>
          </div>
        </div>
      </section> -->

      <!-- Popular Destinations Section -->
      <!-- <section class="dashboard-section">
        <div class="section-header">
          <h2>Popular Destinations</h2>
          <a href="#" class="view-all">See More</a>
        </div>
        <div class="destination-cards">
          <div class="destination-card">
            <div class="destination-image-placeholder">Destination Image</div>
            <div class="destination-info">
              <h3>Bali, Indonesia</h3>
              <div class="rating">★★★★☆ (4.2)</div>
            </div>
          </div>
          <div class="destination-card">
            <div class="destination-image-placeholder">Destination Image</div>
            <div class="destination-info">
              <h3>Santorini, Greece</h3>
              <div class="rating">★★★★★ (4.8)</div>
            </div>
          </div>
          <div class="destination-card">
            <div class="destination-image-placeholder">Destination Image</div>
            <div class="destination-info">
              <h3>Kyoto, Japan</h3>
              <div class="rating">★★★★☆ (4.5)</div>
            </div>
          </div>
        </div>
      </section> -->
    </main>
  </div>
</template>

<style scoped>
.dashboard-main {
  display: flex;
  flex: 1;
  overflow: hidden;
}

.dashboard-content {
  flex: 1;
  padding: 2rem;
  overflow-y: auto;
}

.welcome-banner {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(135deg, #42b883, #3b8070);
  color: white;
  padding: 1.5rem 1rem;
  border-radius: 8px;
  margin-bottom: 2rem;
}

.welcome-text h1 {
  margin: 0;
  font-size: 1.75rem;
}

.welcome-text p {
  margin: 0.5rem 0 0;
  opacity: 0.9;
}

.dashboard-section {
  background-color: white;
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.03);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.section-header h2 {
  margin: 0;
  font-size: 1.25rem;
  color: #333;
}

.view-all {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 0.5rem;
  color: #42b883;
  text-decoration: none;
  font-weight: 500;
  font-size: 0.9rem;
}

/* Responsive Trip Cards Grid */
.trip-cards {
  display: grid;
  gap: 1.5rem;
}

/* Mobile (1 column) */
@media (max-width: 640px) {
  .trip-cards {
    grid-template-columns: 1fr;
  }
}

/* Tablet (2 columns) */
@media (min-width: 641px) and (max-width: 1024px) {
  .trip-cards {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* Desktop (3+ columns) */
@media (min-width: 1025px) {
  .trip-cards {
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  }
}

.trip-card {
  border: 1px solid #eaeaea;
  border-radius: 8px;
  overflow: hidden;
  transition: transform 0.2s, box-shadow 0.2s;
}

.trip-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
}

.trip-image-placeholder {
  height: 150px;
  background-color: #f0f2f5;
  border: 1px dashed #ccc;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #888;
  font-size: 0.9rem;
}

.trip-details {
  padding: 1rem;
}

.trip-details h3 {
  margin: 0 0 0.5rem;
  font-size: 1.1rem;
}

.trip-details p {
  margin: 0.25rem 0;
  color: #666;
  font-size: 0.9rem;
}
</style>
