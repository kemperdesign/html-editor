export interface Reservation {
  id: string;
  guestName: string;
  checkIn: string;
  checkOut: string;
  propertyId: string;
  propertyName: string;
  status: 'confirmed' | 'arriving' | 'staying' | 'departing';
  guests: number;
}

export interface Property {
  id: string;
  name: string;
  address: string;
  description: string;
  pricePerNight: number;
  imageUrl: string;
  amenities: string[];
  rules: string[];
  bedInformation: string;
  locationInfo: string;
  historicalData: {
    month: string;
    revenue: number;
    occupancy: number;
    lastYearRevenue: number;
  }[];
}

export const mockReservations: Reservation[] = [
  { id: '1', guestName: 'Sarah Jenkins', checkIn: '2026-05-10', checkOut: '2026-05-15', propertyId: 'almost-heaven', propertyName: 'Almost Heaven Beach House', status: 'arriving', guests: 4 },
  { id: '2', guestName: 'Mike Ross', checkIn: '2026-05-12', checkOut: '2026-05-14', propertyId: 'ocean-breeze', propertyName: 'Ocean Breeze Retreat', status: 'arriving', guests: 2 },
  { id: '3', guestName: 'Amanda White', checkIn: '2026-05-08', checkOut: '2026-05-12', propertyId: 'almost-heaven', propertyName: 'Almost Heaven Beach House', status: 'staying', guests: 6 },
  { id: '4', guestName: 'David Miller', checkIn: '2026-05-15', checkOut: '2026-05-20', propertyId: 'ocean-breeze', propertyName: 'Ocean Breeze Retreat', status: 'confirmed', guests: 3 },
];

export const mockProperties: Property[] = [
  {
    id: "almost-heaven",
    name: "Almost Heaven Beach House",
    address: "Ponte Vedra Beach, FL",
    description: "Experience luxury living in this stunning beach house. Steps from the Atlantic Ocean, featuring modern amenities and spacious living areas perfect for families.",
    pricePerNight: 450,
    imageUrl: "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&q=80&w=1200",
    amenities: ["Beach access", "Private patio", "High-speed WiFi", "Gourmet kitchen", "AC", "Washer/Dryer"],
    rules: ["No smoking", "No parties", "Quiet hours after 10 PM"],
    bedInformation: "4 Bedrooms: 1 King, 2 Queens, 2 Twin beds.",
    locationInfo: "Located in the quiet residential area of Ponte Vedra Beach.",
    historicalData: [
      { month: 'Jan', revenue: 12400, occupancy: 65, lastYearRevenue: 11000 },
      { month: 'Feb', revenue: 14200, occupancy: 72, lastYearRevenue: 13500 },
      { month: 'Mar', revenue: 18500, occupancy: 85, lastYearRevenue: 17000 },
      { month: 'Apr', revenue: 16800, occupancy: 78, lastYearRevenue: 16500 },
      { month: 'May', revenue: 21000, occupancy: 92, lastYearRevenue: 19800 },
      { month: 'Jun', revenue: 24500, occupancy: 98, lastYearRevenue: 22000 },
    ]
  },
  {
    id: "ocean-breeze",
    name: "Ocean Breeze Retreat",
    address: "St. Augustine, FL",
    description: "A cozy bungalow with a tropical vibe. Perfect for romantic getaways.",
    pricePerNight: 280,
    imageUrl: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&q=80&w=1200",
    amenities: ["Bicycles", "Outdoor shower", "Pet friendly", "Fire pit"],
    rules: ["Pets allowed with fee", "No smoking inside"],
    bedInformation: "2 Bedrooms: 1 Queen, 1 Full.",
    locationInfo: "Walking distance to Magnolia Ave and downtown historic sites.",
    historicalData: [
      { month: 'Jan', revenue: 8400, occupancy: 45, lastYearRevenue: 9000 },
      { month: 'Feb', revenue: 9200, occupancy: 52, lastYearRevenue: 8800 },
      { month: 'Mar', revenue: 11500, occupancy: 68, lastYearRevenue: 10500 },
      { month: 'Apr', revenue: 10200, occupancy: 62, lastYearRevenue: 11000 },
      { month: 'May', revenue: 13000, occupancy: 75, lastYearRevenue: 12500 },
      { month: 'Jun', revenue: 15500, occupancy: 88, lastYearRevenue: 14000 },
    ]
  }
];

export const generalGuidance = `
- Check-on policy: Always confirm if the guest has received their digital code 24 hours before arrival.
- Maintenance: Any leaks or appliance failures should be reported to the on-call manager immediately.
- Escalation: If a guest requests a refund or is being hostile, transfer to manager.
- Local Tips: Recommend 'Vernon's First Coast Kitchen' for seafood.
`;
