export const adminStats = [
  { label: 'Total Products', value: '124', change: '+12%', icon: 'box' },
  { label: 'Active Rentals Today', value: '18', change: '+6%', icon: 'calendar' },
  { label: 'Total Users', value: '342', change: '+9%', icon: 'users' },
  { label: 'Revenue This Month', value: '₹2.4L', change: '+14%', icon: 'indian-rupee' },
];

export const adminProducts = [
  {
    id: '1',
    name: 'Sony FX3 Cinema Camera',
    category: 'Cameras',
    price_per_day: 4200,
    quantity: 3,
    created_at: '2026-03-28',
    unique_code: 'CAM-8D2L',
    qr_base64: 'https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=CAM-8D2L',
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=500&q=80',
  },
  {
    id: '2',
    name: 'Canon RF 24-70mm f/2.8L',
    category: 'Lenses',
    price_per_day: 1800,
    quantity: 4,
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
      phone: '9876543210',
      items: 'Sony FX3, Aputure 600D',
      pickup: '2026-04-05',
      event: '2026-04-06',
      status: 'confirmed',
    },
  ],
  active: [
    {
      id: 'RN-2007',
      name: 'Maya Films',
      phone: '9012345678',
      items: 'Canon 24-70, DJI Mic 2',
      pickup: '2026-04-01',
      event: '2026-04-03',
      status: 'released',
    },
  ],
  past: [
    {
      id: 'RN-1985',
      name: 'Studio South',
      phone: '9988776655',
      items: 'Flowtech Tripod',
      pickup: '2026-03-09',
      event: '2026-03-10',
      status: 'returned',
    },
  ],
};
