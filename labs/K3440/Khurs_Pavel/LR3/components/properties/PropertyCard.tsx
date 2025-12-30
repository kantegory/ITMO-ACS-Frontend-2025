'use client';

import Link from 'next/link';
import { Property } from '@/types/property';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';
import { useFavorites } from '@/contexts/FavoritesContext';
import { PROPERTY_TYPES } from '@/lib/constants';

interface PropertyCardProps {
  property: Property;
  compact?: boolean;
}

export function PropertyCard({ property, compact = false }: PropertyCardProps) {
  const { isFavorite, addToFavorites, removeFromFavorites } = useFavorites();
  const favorite = isFavorite(property.id);

  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    if (favorite) {
      removeFromFavorites(property.id);
    } else {
      addToFavorites(property.id);
    }
  };

  return (
    <Link href={`/properties/${property.id}`}>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow">
        <div className="relative aspect-video bg-muted">
          {property.images[0] ? (
            <img
              src={property.images[0]}
              alt={property.title}
              className="object-cover w-full h-full"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              Нет фото
            </div>
          )}
          <Button
            variant="secondary"
            size="icon"
            className="absolute top-2 right-2"
            onClick={toggleFavorite}
          >
            <Heart
              className={`h-4 w-4 ${favorite ? 'fill-red-500 text-red-500' : ''}`}
            />
          </Button>
        </div>

        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="font-semibold line-clamp-1">{property.title}</h3>
            <Badge variant="secondary">{PROPERTY_TYPES[property.type]}</Badge>
          </div>

          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
            {property.location.city}, {property.location.district}
          </p>

          {!compact && (
            <div className="flex gap-4 text-sm text-muted-foreground mb-3">
              <span>{property.characteristics.area} м²</span>
              <span>{property.characteristics.rooms} комн.</span>
              <span>
                {property.characteristics.floor}/{property.characteristics.totalFloors} эт.
              </span>
            </div>
          )}
        </CardContent>

        <CardFooter className="p-4 pt-0">
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold">{property.price.toLocaleString('ru-RU')}</span>
            <span className="text-muted-foreground">₽ / мес</span>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
