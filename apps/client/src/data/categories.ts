import CameraImg from '../assets/categories/camera.png';
import LenseImg from '../assets/categories/lense.png';
import LightImg from '../assets/categories/light.png';
import AudioImg from '../assets/categories/mic.png';
import TripodImg from '../assets/categories/tripod.png';

// Core application categories for UI chips and navigation filters
export const Categories = [
  'All',
  'Cameras',
  'Lenses',
  'Lights',
  'Audio',
  'Tripods',
  'Drones',
  'Accessories'
];

// Visual mapped categories for the Home Page and marketing sections
export const CategoriesList = [
  {
    category: 'Cameras',
    image: CameraImg,
    path: '/category?category=Cameras',
  },
  {
    category: 'Lenses',
    image: LenseImg,
    path: '/category?category=Lenses',
  },
  {
    category: 'Lights',
    image: LightImg,
    path: '/category?category=Lights',
  },
  {
    category: 'Audio',
    image: AudioImg,
    path: '/category?category=Audio',
  },
  {
    category: 'Tripods',
    image: TripodImg,
    path: '/category?category=Tripods',
  },
];
