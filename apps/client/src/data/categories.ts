import logo from '@camera-rental-house/ui/assets/logo.png';

// Category Images
import CameraImg from '@camera-rental-house/ui/assets/categories/camera.png';
import LenseImg from '@camera-rental-house/ui/assets/categories/lense.png';
import LightImg from '@camera-rental-house/ui/assets/categories/light.png';
import AudioImg from '@camera-rental-house/ui/assets/categories/mic.png';
import TripodImg from '@camera-rental-house/ui/assets/categories/tripod.png';

// Brand Images
import CanonImg from '@camera-rental-house/ui/assets/brands/canon.png';
import SonyImg from '@camera-rental-house/ui/assets/brands/sony.png';
import LeicaImg from '@camera-rental-house/ui/assets/brands/leica.png';
import NikonImg from '@camera-rental-house/ui/assets/brands/nikon.png';
import ZeissImg from '@camera-rental-house/ui/assets/brands/zeiss.png';

export { logo };

// 1. Simple category lists for navigation
export const Categories = [
  'All',
  'Cameras',
  'Lenses',
  'Lights',
  'Audio',
  'Tripods',
];

export const CategoriesList = [
  { category: 'Cameras', image: CameraImg, path: '/category?category=Cameras' },
  { category: 'Lenses', image: LenseImg, path: '/category?category=Lenses' },
  { category: 'Lights', image: LightImg, path: '/category?category=Lights' },
  { category: 'Audio', image: AudioImg, path: '/category?category=Audio' },
  { category: 'Tripods', image: TripodImg, path: '/category?category=Tripods' },
];

// 2. Simple brand lists
export const Brands = [
  'All',
  'Canon',
  'Sony',
  'Leica',
  'Nikon',
  'Zeiss'
];

export const BrandsList = [
  { category: 'Canon', image: CanonImg, path: '/category?category=Canon' },
  { category: 'Sony', image: SonyImg, path: '/category?category=Sony' },
  { category: 'Leica', image: LeicaImg, path: '/category?category=Leica' },
  { category: 'Nikon', image: NikonImg, path: '/category?category=Nikon' },
  { category: 'Zeiss', image: ZeissImg, path: '/category?category=Zeiss' },
];

// 3. Icons mapping for product details
export const CATEGORY_ICONS: Record<string, string> = {
  Cameras: CameraImg,
  Lenses: LenseImg,
  Lights: LightImg,
  Audio: AudioImg,
  Tripods: TripodImg,
};

export const BRAND_ICONS: Record<string, string> = {
  Canon: CanonImg,
  Sony: SonyImg,
  Leica: LeicaImg,
  Nikon: NikonImg,
  Zeiss: ZeissImg,
};
