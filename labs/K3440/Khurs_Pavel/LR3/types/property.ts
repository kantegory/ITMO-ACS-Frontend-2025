export type PropertyType = 'apartment' | 'house' | 'room' | 'studio';

export interface Property {
  id: string;
  type: PropertyType;
  title: string;
  description: string;
  price: number;
  currency: string;
  period: 'month' | 'day';
  location: {
    city: string;
    district: string;
    address: string;
    coordinates: {
      lat: number;
      lng: number;
    };
  };
  characteristics: {
    area: number;
    rooms: number;
    floor: number;
    totalFloors: number;
    hasParking: boolean;
    hasFurniture: boolean;
    petsAllowed: boolean;
  };
  images: string[];
  owner: {
    id: string;
    name: string;
    phone: string;
    avatar: string;
  };
  conditions: {
    deposit: number;
    minTerm: string;
    utilitiesIncluded: boolean;
  };
  createdAt: string;
  available: boolean;
}

export interface PropertyFilters {
  type?: PropertyType;
  minPrice?: number;
  maxPrice?: number;
  location?: string;
  rooms?: number;
  minArea?: number;
  maxArea?: number;
}
