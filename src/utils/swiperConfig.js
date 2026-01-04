/**
 * Swiper Configuration Utility
 * 
 * This file ensures Swiper modules are properly configured in the Client folder.
 * Swiper is installed in Client/node_modules/swiper
 * 
 * Import swiper modules from 'swiper/modules'
 * Import Swiper components from 'swiper/react'
 * Import CSS from 'swiper/css'
 */

// Export commonly used Swiper modules
export {
  Autoplay,
  Navigation,
  Pagination,
  Scrollbar,
  EffectFade,
  EffectCube,
  EffectCoverflow,
  EffectFlip,
  EffectCards,
  Keyboard,
  Mousewheel,
  Controller,
  A11y,
  History,
  HashNavigation,
  Thumbs,
  Virtual,
  Zoom,
  FreeMode,
  Grid,
  Manipulation,
  Parallax
} from 'swiper/modules';

// Swiper default configuration
export const defaultSwiperConfig = {
  modules: ['Navigation', 'Pagination', 'Autoplay'],
  spaceBetween: 30,
  slidesPerView: 1,
  navigation: true,
  pagination: { clickable: true },
  autoplay: {
    delay: 3500,
    disableOnInteraction: false,
  },
  loop: true,
  grabCursor: true,
};

// Dark mode compatible swiper styles (can be customized)
export const swiperDarkModeStyles = {
  navigation: {
    color: '#10b981', // emerald-500
    '--swiper-navigation-color': '#10b981',
  },
  pagination: {
    '--swiper-pagination-color': '#10b981',
    '--swiper-pagination-bullet-inactive-color': '#6b7280', // slate-500
    '--swiper-pagination-bullet-inactive-opacity': '0.5',
  },
};


