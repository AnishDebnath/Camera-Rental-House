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


import CanonImg from '../assets/brands/canon.png';
import SonyImg from '../assets/brands/sony.png';
import LeicaImg from '../assets/brands/leica.png';
import NikonImg from '../assets/brands/nikon.png';
import ZeissImg from '../assets/brands/zeiss.png';

// Core application categories for UI chips and navigation filters
export const Brands = [
  'All',
  'Canon',
  'Sony',
  'Leica',
  'Nikon',
  'Zeiss'
];

// Visual mapped categories for the Home Page and marketing sections
export const BrandsList = [
  {
    category: 'Canon',
    image: CanonImg,
    path: '/category?category=Canon',
  },
  {
    category: 'Sony',
    image: SonyImg,
    path: '/category?category=Sony',
  },
  {
    category: 'Leica',
    image: LeicaImg,
    path: '/category?category=Leica',
  },
  {
    category: 'Nikon',
    image: NikonImg,
    path: '/category?category=Nikon',
  },
  {
    category: 'Zeiss',
    image: ZeissImg,
    path: '/category?category=Zeiss',
  },
];
