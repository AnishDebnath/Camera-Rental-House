export const adminStats = [
  { label: 'Total Products', value: '124', change: '+12.5%', icon: 'box', note: 'This month' },
  { label: 'Active Rentals', value: '18', change: '+8.2%', icon: 'calendar', note: 'Today' },
  { label: 'Total Customers', value: '342', change: '+9.0%', icon: 'users', note: 'All time' },
  { label: 'Revenue', value: 'Rs 2.4L', change: '+14.0%', icon: 'indian-rupee', note: 'This month' },
];

export const adminProducts = [
  {
    id: '1',
    name: 'Sony FX3 Cinema Camera',
    brand: 'Sony',
    category: 'Cameras',
    description: 'Compact full-frame cinema camera with cage, top handle, and dual media kit.',
    price_per_day: 4200,
    created_at: '2026-03-28',
    unique_code: 'CAM-8D2L',
    qr_base64: 'https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=CAM-8D2L',
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=500&q=80',
  },
  {
    id: '2',
    name: 'Canon RF 24-70mm f/2.8L',
    brand: 'Canon',
    category: 'Lenses',
    description: 'Fast RF zoom lens for events, interviews, and production coverage.',
    price_per_day: 1800,
    created_at: '2026-03-30',
    unique_code: 'LNS-7YQ1',
    qr_base64: 'https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=LNS-7YQ1',
    image: 'https://images.unsplash.com/photo-1617005082133-548c4dd27f35?auto=format&fit=crop&w=500&q=80',
  },
];

export const adminUsers = [
  {
    id: 'u1',
    full_name: 'Alex Director',
    phone: '9876543210',
    email: 'alex@example.com',
    created_at: '2026-02-18',
    totalRentals: 8,
    totalSpent: 58400,
    is_blocked: false,
    aadhaar_signed_url: 'https://images.unsplash.com/photo-1545239351-1141bd82e8a6?auto=format&fit=crop&w=800&q=80',
    voter_signed_url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'u2',
    full_name: 'Maya Films',
    phone: '9012345678',
    email: 'maya@example.com',
    created_at: '2026-01-09',
    totalRentals: 4,
    totalSpent: 22800,
    is_blocked: true,
    aadhaar_signed_url: 'https://images.unsplash.com/photo-1545239351-1141bd82e8a6?auto=format&fit=crop&w=800&q=80',
    voter_signed_url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80',
  },
];

export const adminRentals = {
  upcoming: [
    {
      id: 'RN-2041',
      name: 'Alex Director',
      user_image: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&q=80',
      phone: '9876543210',
      pickup: '2026-05-01',
      return_date: '2026-05-03',
      total_price: 12400,
      status: 'upcoming',
      products: [
        { id: 'p1', name: 'Sony FX3', price: 4200, qty: 1, image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=100' },
        { id: 'p2', name: 'Aputure 600D', price: 4000, qty: 2, image: 'https://images.unsplash.com/photo-1616423642331-7e87363695ad?w=100' },
        { id: 'p1', name: 'Sony FX3', price: 4200, qty: 1, image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=100' },
        { id: 'p2', name: 'Aputure 600D', price: 4000, qty: 2, image: 'https://images.unsplash.com/photo-1616423642331-7e87363695ad?w=100' },
        { id: 'p1', name: 'Sony FX3', price: 4200, qty: 1, image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=100' },
        { id: 'p2', name: 'Aputure 600D', price: 4000, qty: 2, image: 'https://images.unsplash.com/photo-1616423642331-7e87363695ad?w=100' }
      ]
    },
  ],
  active: [
    {
      id: 'RN-2007',
      name: 'Maya Films',
      user_image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80',
      phone: '9012345678',
      pickup: '2026-04-28',
      return_date: '2026-05-02',
      total_price: 8600,
      status: 'active',
      products: [
        { id: 'p3', name: 'Canon 24-70', price: 1800, qty: 1, image: 'https://images.unsplash.com/photo-1617005082133-548c4dd27f35?w=100' },
        { id: 'p4', name: 'DJI Mic 2', price: 1500, qty: 2, image: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=100' }
      ]
    },
  ],
  returning: [
    {
      id: 'RN-1985',
      name: 'Studio South',
      user_image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80',
      phone: '9988776655',
      pickup: '2026-04-29',
      return_date: '2026-05-01',
      total_price: 3200,
      status: 'returning',
      products: [
        { id: 'p5', name: 'Flowtech Tripod', price: 1600, qty: 1, image: 'https://images.unsplash.com/photo-1533035353720-f1c6a75cd8ab?w=100' }
      ]
    },
  ],
};
