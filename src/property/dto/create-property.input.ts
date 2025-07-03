// src/property/dto/create-property.input.ts

export class CreatePropertyInput {
  propertyName: string;
  propertyType: 'APARTMENT' | 'HOUSE' | 'ROOM' | 'VILLA' | 'OFFICE' | 'STUDIO' | 'DUPLEX' | 'LAND';
  description?: string;
  price: number;
  isForRent: boolean;
  isForSale: boolean;
  bedrooms: number;
  bathrooms: number;
  kitchen: number;
  floor: number;
  furnishing?: string;
  area?: number;
  city: string;
  state: string;
  country: string;
  address: string;
  landmark?: string;
  latitude?: number;
  longitude?: number;
  status?: 'AVAILABLE' | 'SOLD' | 'RENTED' | 'PENDING';
  isActive?: boolean;
  isFeatured?: boolean;
  agentId: number;
}
