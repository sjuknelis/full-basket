import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import ListingView from '../views/ListingView.vue';
import DonateView from '../views/DonateView.vue';
import ThankYouView from '../views/ThankYouView.vue';
import DashboardView from '../views/DashboardView.vue';
import EditView from '../views/EditView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/listing/:id',
      name: 'listing',
      component: ListingView
    },
    {
      path: '/donate/:id',
      name: 'donate',
      component: DonateView
    },
    {
      path: '/thankyou/:id',
      name: 'thankyou',
      component: ThankYouView
    },
    {
      path: '/dashboard/:id',
      name: 'dashboard',
      component: DashboardView
    },
    {
      path: '/edit/:id',
      name: 'edit',
      component: EditView
    }
  ]
})

export default router
