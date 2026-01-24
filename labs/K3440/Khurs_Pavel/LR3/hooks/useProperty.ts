'use client';

import { useState, useEffect } from 'react';
import { Property } from '@/types/property';

export function useProperty(id: string) {
  const [property, setProperty] = useState<Property | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!id) {
      setIsLoading(false);
      return;
    }

    const fetchProperty = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/properties/${id}`);

        if (!response.ok) {
          throw new Error('Failed to fetch property');
        }

        const data = await response.json();
        setProperty(data.property);
      } catch (err) {
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProperty();
  }, [id]);

  return { property, isLoading, error };
}
