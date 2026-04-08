// Easy to edit UI Configuration for the Home Page
// You can replace these image strings with actual imports if you move images into src/assets:
// e.g. import cameraImg from '../assets/camera.png'; -> image: cameraImg

export const homeHeroBanner = [
  {
    id: 'slide-1',
    title: 'Cinema-ready gear for fast shoots',
    copy: 'Mobile-first rental flow for camera bodies, lenses, lights, audio, and support.',
    cta: 'Explore Category',
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1400&q=80',
  },
  {
    id: 'slide-2',
    title: 'App-like rental checkout on the web',
    copy: 'Clean cards, quick favourites, date selection, and checkout previews for teams on the move.',
    cta: 'See Inventory',
    image: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=1400&q=80',
  },
  {
    id: 'slide-3',
    title: 'Counter-ready handoff experience',
    copy: 'Designed for professional rental houses that need clarity, speed, and confidence.',
    cta: 'Start Renting',
    image: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=1400&q=80',
  },
];

export const homeCategoriesList = [
  {
    category: 'Cameras',
    image: 'src/assets/categories/camera.png', // The custom image you just added!
    path: '/category?category=Cameras',
  },
  {
    category: 'Lenses',
    image: 'src/assets/categories/lense.png',
    path: '/category?category=Lenses',
  },
  {
    category: 'Lights',
    image: 'src/assets/categories/light.png',
    path: '/category?category=Lights',
  },
  {
    category: 'Audio',
    image: 'src/assets/categories/mic.png',
    path: '/category?category=Audio',
  },
  {
    category: 'Tripods',
    image: 'src/assets/categories/tripod.png',
    path: '/category?category=Tripods',
  },
];
