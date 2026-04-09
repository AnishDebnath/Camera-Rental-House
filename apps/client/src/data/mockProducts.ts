export const mockProducts = [
  {
    id: '1',
    name: 'Canon EOS 6D 20.1 MP CMOS Digital SLR Camera',
    category: 'Cameras',
    price_per_day: 4200,
    available_quantity: 2,
    description: 'Compact full-frame cinema camera with strong low-light performance and handheld-friendly body design.',
    images: [
      { id: '1a', image_url: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1000&q=80', display_order: 0 },
      { id: '1b', image_url: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1000&q=80', display_order: 1 },
    ],
  },
  {
    id: '2',
    name: 'Canon RF 24-70mm f/2.8L',
    category: 'Lenses',
    price_per_day: 1800,
    available_quantity: 3,
    description: 'Reliable event and commercial zoom with fast aperture and broad coverage.',
    images: [
      { id: '2a', image_url: 'https://images.unsplash.com/photo-1617005082133-548c4dd27f35?auto=format&fit=crop&w=1000&q=80', display_order: 0 },
    ],
  },
  {
    id: '3',
    name: 'Aputure 600D Pro Light Kit',
    category: 'Lights',
    price_per_day: 2600,
    available_quantity: 2,
    description: 'High-output daylight fixture with ballast and pro set flexibility.',
    images: [
      { id: '3a', image_url: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1000&q=80', display_order: 0 },
    ],
  },
  {
    id: '4',
    name: 'DJI Mic 2 Creator Combo',
    category: 'Audio',
    price_per_day: 950,
    available_quantity: 5,
    description: 'Portable dual-channel wireless audio kit for interviews and quick run-and-gun production.',
    images: [
      { id: '4a', image_url: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=1000&q=80', display_order: 0 },
    ],
  },
  {
    id: '5',
    name: 'Flowtech Tripod System',
    category: 'Tripods',
    price_per_day: 1100,
    available_quantity: 1,
    description: 'Quick-deploy tripod system with stable support for cinema rigs.',
    images: [
      { id: '5a', image_url: 'https://images.unsplash.com/photo-1516724562728-afc824a36e84?auto=format&fit=crop&w=1000&q=80', display_order: 0 },
    ],
  },
  {
    id: '6',
    name: 'DJI Inspire 3 Production Drone',
    category: 'Drones',
    price_per_day: 7200,
    available_quantity: 0,
    description: 'Flagship aerial cinema platform for high-end production days.',
    images: [
      { id: '6a', image_url: 'https://images.unsplash.com/photo-1473968512647-3e447244af8f?auto=format&fit=crop&w=1000&q=80', display_order: 0 },
    ],
  },
];

export const mockRentals = [
  {
    id: 'RN-2041',
    pickup_date: '2026-04-05',
    event_date: '2026-04-06',
    rental_items: [
      { id: 'ri1', status: 'pending_pickup', products: mockProducts[0] },
      { id: 'ri2', status: 'released', products: mockProducts[2] },
    ],
  },
  {
    id: 'RN-1985',
    pickup_date: '2026-03-09',
    event_date: '2026-03-10',
    rental_items: [{ id: 'ri3', status: 'returned', products: mockProducts[1] }],
  },
];
