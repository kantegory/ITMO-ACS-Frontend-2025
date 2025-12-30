export interface Rental {
  id: string;
  propertyId: string;
  tenantId: string;
  ownerId: string;
  startDate: string;
  endDate: string;
  monthlyPrice: number;
  status: 'pending' | 'active' | 'completed' | 'cancelled';
  createdAt: string;
}

export interface CreateRentalData {
  propertyId: string;
  startDate: string;
  endDate: string;
}
