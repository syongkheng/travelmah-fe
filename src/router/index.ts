import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import FooView from '@/views/FooView.vue'
import PlanView from '@/views/PlanView.vue'
import ItineraryView from '@/views/ItineraryView.vue'
import SearchView from '@/views/SearchView.vue'
import DashboardView from '@/views/authenticated/DashboardView.vue'
import { useRouteGuards } from '@/composables/useRouteGuards'
import EditView from '@/views/authenticated/EditView.vue'
import UnauthorizedView from '@/views/UnauthorizedView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue'),
    },
    {
      path: '/foo',
      name: 'foo',
      component: FooView,
    },
    {
      path: '/plan',
      name: 'plan',
      component: PlanView,
    },
    {
      path: '/itinerary/:id',
      name: 'itinerary',
      component: ItineraryView,
    },
    {
      path: '/search',
      name: 'search',
      component: SearchView,
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: DashboardView,
      beforeEnter: async (to, from, next) => useRouteGuards().authGuard({ next }),
    },
    {
      path: '/itinerary/edit/:id',
      name: 'edit',
      component: EditView,
      beforeEnter: async (to, from, next) => useRouteGuards().authGuard({ next }),
    },
    {
      path: '/unauthorized',
      name: 'unauthorized',
      component: UnauthorizedView,
    },
  ],
})

export default router
