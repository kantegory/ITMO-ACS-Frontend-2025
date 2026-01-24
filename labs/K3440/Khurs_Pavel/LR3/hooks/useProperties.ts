'use client';

import { useState, useEffect } from 'react';
import { Property, PropertyFilters } from '@/types/property';

export function useProperties(filters?: PropertyFilters) {
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchProperties = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams();
        if (filters?.type) params.append('type', filters.type);
        if (filters?.minPrice) params.append('minPrice', String(filters.minPrice));
        if (filters?.maxPrice) params.append('maxPrice', String(filters.maxPrice));
        if (filters?.location) params.append('location', filters.location);
        if (filters?.rooms) params.append('rooms', String(filters.rooms));

        const response = await fetch(`/api/properties?${params}`);

        if (!response.ok) {
          throw new Error('Failed to fetch properties');
        }

        const data = await response.json();
        setProperties(data.properties || []);
      } catch (err) {
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProperties();
  }, [filters?.type, filters?.minPrice, filters?.maxPrice, filters?.location, filters?.rooms]);

  return { properties, isLoading, error };
}
